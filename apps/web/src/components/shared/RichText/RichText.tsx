"use client";

import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface RichTextProps {
  content: BlocksContent | string;
  className?: string;
  variant?: 'default' | 'blue-circle' | 'gray-square';
}

export function RichText({ content, className, variant = 'default' }: RichTextProps) {
  if (!content) return null;

  // 兼容处理：如果是字符串，则尝试作为 HTML 渲染
  if (typeof content === 'string') {
    return (
      <div
        className={cn(
          "prose prose-lg max-w-none rich-text prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
          variant === 'blue-circle' && "rich-text-blue-circle",
          variant === 'gray-square' && "rich-text-gray-square",
          className
        )}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // 确保 content 是数组格式（Blocks 格式）
  if (!Array.isArray(content)) {
    console.error('RichText: content is not an array:', content);
    return null;
  }

  // 确保数组不为空
  if (content.length === 0) {
    return null;
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
              <Image
                src={image.url}
                alt={image.alternativeText || ""}
                width={image.width}
                height={image.height}
                className="rounded-2xl shadow-lg"
              />
            </div>
          ),
          link: (props: any) => {
            const { children, url, href } = props;
            const targetUrl = url || href || "";
            const isInternal = targetUrl.startsWith("/") || targetUrl.startsWith("https://www.boostvision.tv");

            if (isInternal) {
              return (
                <Link href={targetUrl} className="text-primary hover:underline font-bold">
                  {children}
                </Link>
              );
            }
            return (
              <a
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-bold"
              >
                {children}
              </a>
            );
          },
          heading: ({ children, level }) => {
            switch (level) {
              case 1:
                return <h1 className="text-[40px] font-black text-heading mb-8">{children}</h1>;
              case 2:
                return <h2 className="text-[32px] font-bold text-heading mt-12 mb-6">{children}</h2>;
              case 3:
                return <h3 className="text-[24px] font-bold text-heading mt-10 mb-4">{children}</h3>;
              case 4:
                return <h4 className="text-[20px] font-bold text-heading mt-8 mb-4">{children}</h4>;
              default:
                return <h5 className="font-bold text-heading mt-6 mb-2">{children}</h5>;
            }
          },
          list: ({ children, format }) => {
            if (format === "ordered") {
              return <ol className="list-decimal pl-6 my-6 space-y-4">{children}</ol>;
            }

            return (
              <ul className={cn(
                "pl-6 my-6 space-y-4 text-[17px] text-muted leading-[1.8]",
                variant === 'blue-circle' ? "list-disc marker:text-primary" : "list-[square] marker:text-muted/60"
              )}>
                {children}
              </ul>
            );
          },
          paragraph: ({ children }) => (
            <p className="text-[17px] text-muted leading-[1.8] mb-6">{children}</p>
          ),
          quote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-6 py-2 my-8 bg-section-bg rounded-r-2xl italic text-[18px]">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="bg-gray-100 rounded px-2 py-1 text-[14px] font-mono text-heading">
              {children}
            </code>
          ),
        }}
        modifiers={{
          bold: ({ children }) => <strong className="font-bold text-heading">{children}</strong>,
          italic: ({ children }) => <em className="italic">{children}</em>,
          underline: ({ children }) => <u className="underline">{children}</u>,
          strikethrough: ({ children }) => <del className="line-through">{children}</del>,
          code: ({ children }) => (
            <code className="bg-gray-100 rounded px-1.5 py-0.5 text-[14px] font-mono text-heading">
              {children}
            </code>
          ),
        }}
      />
    </div>
  );
}
