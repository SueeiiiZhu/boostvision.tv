"use client";

import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

function slugifyHeading(title: string) {
  return title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}

function parseMarkdownTableRow(row: string) {
  const normalized = row.trim().replace(/^\|/, "").replace(/\|$/, "");
  return normalized.split("|").map((cell) => cell.trim().replace(/\\\|/g, "|"));
}

function isPipeTableDataRow(row: string) {
  if (!row || !row.includes("|")) return false;
  if (row.trim().startsWith("XHTMLBLOCKX")) return false;
  return /^\s*\|?[^|\n]+?\|[^|\n]+(?:\|[^|\n]+)*\|?\s*$/.test(row);
}

function convertMarkdownTables(source: string, rawBlocks: string[]) {
  const lines = source.split("\n");
  const processedLines: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const current = lines[i];
    const next = lines[i + 1];
    const hasPipe = current.includes("|");
    const isSeparator = !!next && /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(next);

    if (!hasPipe) {
      processedLines.push(current);
      i += 1;
      continue;
    }

    if (isSeparator) {
      const tableLines = [current, next];
      i += 2;
      while (i < lines.length && lines[i].includes("|") && lines[i].trim() !== "") {
        tableLines.push(lines[i]);
        i += 1;
      }

      const headerCells = parseMarkdownTableRow(tableLines[0]);
      const bodyRows = tableLines.slice(2).map(parseMarkdownTableRow).filter((row) => row.length > 0);

      if (headerCells.length < 2) {
        processedLines.push(...tableLines);
        continue;
      }

      const thead = `<thead><tr>${headerCells.map((cell) => `<th>${cell}</th>`).join("")}</tr></thead>`;
      const tbody = bodyRows.length
        ? `<tbody>${bodyRows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody>`
        : "";

      rawBlocks.push(`<div class="rich-text-table-wrap my-8 overflow-x-auto"><table>${thead}${tbody}</table></div>`);
      processedLines.push(`XHTMLBLOCKX${rawBlocks.length - 1}X`);
      continue;
    }

    if (!isPipeTableDataRow(current)) {
      processedLines.push(current);
      i += 1;
      continue;
    }

    const simpleRows: string[] = [];
    while (i < lines.length && isPipeTableDataRow(lines[i])) {
      // Skip markdown separator-like rows if present inside block
      if (/^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(lines[i])) {
        break;
      }
      simpleRows.push(lines[i]);
      i += 1;
    }

    if (simpleRows.length < 2) {
      processedLines.push(current);
      if (simpleRows.length === 0) {
        i += 1;
      }
      continue;
    }

    const bodyRows = simpleRows
      .map(parseMarkdownTableRow)
      .filter((row) => row.length >= 2);
    if (bodyRows.length < 2) {
      processedLines.push(...simpleRows);
      continue;
    }
    const tbody = `<tbody>${bodyRows
      .map((row) => `<tr>${row.map((cell, colIndex) => (colIndex === 0 ? `<th scope="row">${cell}</th>` : `<td>${cell}</td>`)).join("")}</tr>`)
      .join("")}</tbody>`;

    rawBlocks.push(`<div class="rich-text-table-wrap my-8 overflow-x-auto"><table>${tbody}</table></div>`);
    processedLines.push(`XHTMLBLOCKX${rawBlocks.length - 1}X`);
  }

  return processedLines.join("\n");
}


// 简单的 Markdown 转换函数，处理基本标签
function parseMarkdown(markdown: string) {
  if (!markdown) return "";

  // 1. 提取被 <raw-html> 包裹的内容及后续需要保护的标签
  // 使用纯字母占位符 XHTMLBLOCKXnX，绝对避开 Markdown 的 _ 或 * 语法
  const rawBlocks: string[] = [];
  
  // 保护 raw-html
  let html = markdown.replace(/<raw-html>([\s\S]*?)<\/raw-html>/gim, (match, content) => {
    rawBlocks.push(content.trim());
    return `XHTMLBLOCKX${rawBlocks.length - 1}X`;
  });

  // 2. 优先处理 GFM 表格，转换为受保护 HTML 块
  html = convertMarkdownTables(html, rawBlocks);

  // 3. 执行 Markdown 解析，并将生成的 HTML 标签立即存入保护区
  html = html
    // 处理标题，并存入保护区
    .replace(/^### (.*$)/gim, (match, title) => {
      const displayTitle = title.replace(/\\/g, '').replace(/\*\*|\__/g, '');
      const id = slugifyHeading(displayTitle);
      const tag = `<h3 id="${id}" class="text-[24px] font-bold text-heading mt-10 mb-4">${displayTitle}</h3>`;
      rawBlocks.push(tag);
      return `XHTMLBLOCKX${rawBlocks.length - 1}X`;
    })
    .replace(/^## (.*$)/gim, (match, title) => {
      const displayTitle = title.replace(/\\/g, '').replace(/\*\*|\__/g, '');
      const id = slugifyHeading(displayTitle);
      const tag = `<h2 id="${id}" class="text-[32px] font-bold text-heading mt-12 mb-6">${displayTitle}</h2>`;
      rawBlocks.push(tag);
      return `XHTMLBLOCKX${rawBlocks.length - 1}X`;
    })
    .replace(/^# (.*$)/gim, (match, title) => {
      const displayTitle = title.replace(/\\/g, '').replace(/\*\*|\__/g, '');
      const id = slugifyHeading(displayTitle);
      const tag = `<h1 id="${id}" class="text-[40px] font-black text-heading mb-8">${displayTitle}</h1>`;
      rawBlocks.push(tag);
      return `XHTMLBLOCKX${rawBlocks.length - 1}X`;
    })
    // 图片渲染 - 存入保护区，防止 src 中的下划线被误当做斜体解析
    .replace(/!\[(.*?)\]\((.*?)\)/gim, (match, alt, url) => {
      const cleanAlt = alt.replace(/\\/g, '');
      const tag = `<div class="my-8 flex justify-center"><img src="${url}" alt="${cleanAlt}" class="rounded-2xl shadow-lg max-w-full h-auto" /></div>`;
      rawBlocks.push(tag);
      return `XHTMLBLOCKX${rawBlocks.length - 1}X`;
    })
    // 链接渲染 - 存入保护区
    .replace(/\[(.*?)\]\((.*?)\)/gim, (match, text, url) => {
      const unescapedText = text.replace(/\\/g, '');
      const tag = `<a href='${url}' class='text-primary hover:underline font-bold'>${unescapedText}</a>`;
      rawBlocks.push(tag);
      return `XHTMLBLOCKX${rawBlocks.length - 1}X`;
    })
    // 剩下的普通文本处理 加粗/斜体/列表
    .replace(/\*\*(.*?)\*\*/gim, (match, content) => `<strong class="font-black text-heading">${content.replace(/\\/g, '')}</strong>`)
    .replace(/__(.*?)__/gim, (match, content) => `<strong class="font-black text-heading">${content.replace(/\\/g, '')}</strong>`)
    .replace(/(^|[\s(])\*(\S(?:.*?\S)?)\*(?=$|[\s).,!?:;])/gim, '$1<em class="italic">$2</em>')
    .replace(/(^|[\s(])_(\S(?:.*?\S)?)_(?=$|[\s).,!?:;])/gim, '$1<em class="italic">$2</em>')
    .replace(/^\* (.*$)/gim, '<li class="ml-6 list-disc">$1</li>')
    .replace(/^\- (.*$)/gim, '<li class="ml-6 list-disc">$1</li>');

  // 4. 处理段落包裹
  const lines = html.split('\n');
  const wrappedLines = lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '';
    // 跳过已经受保护的块级内容
    if (trimmed.startsWith('XHTMLBLOCKX')) return trimmed;
    // 跳过列表项（已经在前面转换过了）
    if (trimmed.startsWith('<li')) return trimmed;
    return `<p class="text-[17px] text-muted leading-[1.8] mb-6">${trimmed}</p>`;
  });

  html = wrappedLines.join('\n');

  // 5. 最后精准还原所有受保护的内容
  rawBlocks.forEach((content, index) => {
    const placeholder = `XHTMLBLOCKX${index}X`;
    html = html.split(placeholder).join(content);
  });

  return html;
}

interface CtaButtonLink {
  url: string;
  platform?: string | null;
  badgeUrl?: string | null;
}

interface RichTextProps {
  content: BlocksContent | string;
  className?: string;
  variant?: 'default' | 'blue-circle' | 'gray-square';
  ctaBanners?: Record<string, { title: string; iconUrl?: string | null; buttons: CtaButtonLink[] }>;
}

interface LinkBlockProps {
  children?: React.ReactNode;
  url?: string;
  href?: string;
}

export function RichText({ content, className, variant = 'default', ctaBanners }: RichTextProps) {
  if (!content) return null;

  if (typeof content === 'string') {
    const hasRawHtmlWrapper = /<raw-html>[\s\S]*?<\/raw-html>/i.test(content);
    const hasMarkdownTable = /^\s*\|.+\|\s*$/m.test(content) && /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/m.test(content);
    const hasMarkdownSyntax = hasMarkdownTable ||
      /^#{1,6}\s+/m.test(content) ||
      /(\*\*|__)[^*\n_]+(\*\*|__)/.test(content) ||
      /\[[^\]]+\]\([^)]+\)/.test(content) ||
      /^\s*[-*]\s+/m.test(content) ||
      /^\s*\d+\.\s+/m.test(content) ||
      /^>\s+/m.test(content) ||
      /```[\s\S]*```/.test(content) ||
      hasRawHtmlWrapper;

    // Check if content contains HTML tags or entities
    const hasHtmlTags = /<[a-z][\s\S]*>/i.test(content);
    const hasEncodedHtml = content.includes("&lt;") && content.includes("&gt;");
    const shouldTreatAsHtml = !hasRawHtmlWrapper && (hasHtmlTags || (hasEncodedHtml && !hasMarkdownSyntax));

    let htmlContent: string;

    if (hasMarkdownSyntax || hasRawHtmlWrapper) {
      const withDynamicCta = content.replace(/<!--([\s\S]*?)-->/g, (match, rawInner) => {
        const key = rawInner.trim().toLowerCase().replace(/\s+/g, " ");
        const banner = ctaBanners?.[key];
        if (!banner || !Array.isArray(banner.buttons) || banner.buttons.length === 0) return match;

        const buttonsHtml = banner.buttons
          .filter((b) => typeof b.url === "string" && b.url.trim())
          .map((b) => {
            const safeUrl = b.url.replace(/"/g, "&quot;");
            const safeLabel = (b.platform || "Download").replace(/"/g, "&quot;");
            const badge = b.badgeUrl
              ? `<img src="${b.badgeUrl.replace(/"/g, "&quot;")}" alt="${safeLabel}" class="h-12 sm:h-14 w-auto" />`
              : `<span class="${(b.platform || "").toLowerCase().includes("apple") || (b.platform || "").toLowerCase().includes("app store") ? "app-store-badge" : "google-play-badge"}"></span>`;
            return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer" aria-label="${safeLabel}">${badge}</a>`;
          })
          .join("");

        const title = (banner.title || "Try this app").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const iconHtml = banner.iconUrl
          ? `<img src="${banner.iconUrl.replace(/"/g, "&quot;")}" alt="${title}" class="banner-app-icon" />`
          : "";
        return `<raw-html><div class="blog-download-banner"><div class="banner-layout"><div class="banner-icon-col">${iconHtml}</div><div class="banner-copy"><p class="banner-eyebrow">BoostVision</p><h3 class="banner-title">${title}</h3></div><div class="banner-actions"><div class="banner-buttons">${buttonsHtml}</div></div></div></div></raw-html>`;
      });
      htmlContent = parseMarkdown(withDynamicCta);
    } else if (shouldTreatAsHtml) {
      // Decode HTML entities (decode &amp; last to avoid double-decoding)
      const decoded = content
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/&amp;/g, '&');
      htmlContent = decoded;
    } else {
      htmlContent = content;
    }

    return (
      <div
        className={cn(
          "prose prose-lg max-w-none rich-text prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
          variant === 'blue-circle' && "rich-text-blue-circle",
          variant === 'gray-square' && "rich-text-gray-square",
          className
        )}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  }

  return (
    <div className={cn(
      "prose prose-lg max-w-none rich-text prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
      variant === 'blue-circle' && "rich-text-blue-circle",
      variant === 'gray-square' && "rich-text-gray-square",
      className
    )}>
      <BlocksRenderer
        content={content}
        blocks={{
          image: ({ image }) => (
            <div className="my-8 flex justify-center">
              <Image src={image.url} alt={image.alternativeText || ""} width={image.width} height={image.height} className="rounded-2xl shadow-lg" />
            </div>
          ),
          link: (props: LinkBlockProps) => {
            const { children, url, href } = props;
            const targetUrl = url || href || "";
            const isInternal = targetUrl.startsWith("/") || targetUrl.startsWith("https://www.boostvision.tv");
            if (isInternal) {
              return <Link href={targetUrl} className="text-primary hover:underline font-bold">{children}</Link>;
            }
            return <a href={targetUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">{children}</a>;
          },
          heading: ({ children, level }) => {
            if (level === 1) return <h1 className="text-[40px] font-black text-heading mb-8">{children}</h1>;
            if (level === 2) return <h2 className="text-[32px] font-bold text-heading mt-12 mb-6">{children}</h2>;
            if (level === 3) return <h3 className="text-[24px] font-bold text-heading mt-10 mb-4">{children}</h3>;
            return <h4 className="text-[20px] font-bold text-heading mt-8 mb-4">{children}</h4>;
          },
          list: ({ children, format }) => {
            if (format === "ordered") return <ol className="list-decimal pl-6 my-6 space-y-4">{children}</ol>;
            return (
              <ul className={cn("pl-6 my-6 space-y-4 text-[17px] text-muted Birding-snug", variant === 'blue-circle' ? "list-disc marker:text-primary" : "list-[square] marker:text-muted/60")}>
                {children}
              </ul>
            );
          },
          paragraph: ({ children }) => <p className="text-[17px] text-muted leading-[1.8] mb-6">{children}</p>,
          quote: ({ children }) => <blockquote className="border-l-4 border-primary pl-6 py-2 my-8 bg-section-bg rounded-r-2xl italic text-[18px]">{children}</blockquote>,
          code: ({ children }) => <code className="bg-gray-100 rounded px-2 py-1 text-[14px] font-mono text-heading">{children}</code>,
        }}
        modifiers={{
          bold: ({ children }) => <strong className="font-bold text-heading">{children}</strong>,
          italic: ({ children }) => <em className="italic">{children}</em>,
          underline: ({ children }) => <u className="underline">{children}</u>,
          strikethrough: ({ children }) => <del className="line-through">{children}</del>,
          code: ({ children }) => <code className="bg-gray-100 rounded px-1.5 py-0.5 text-[14px] font-mono text-heading">{children}</code>,
        }}
      />
    </div>
  );
}
