"use client";

import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface RichTextProps {
  content: BlocksContent;
  className?: string;
}

export function RichText({ content, className }: RichTextProps) {
  if (!content) return null;

  return (
    <div className={cn("prose prose-lg max-w-none rich-text", className)}>
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
          link: ({ children, url }) => {
            const isInternal = url.startsWith("/") || url.startsWith("https://www.boostvision.tv");
            if (isInternal) {
              return (
                <Link href={url} className="text-primary hover:underline">
                  {children}
                </Link>
              );
            }
            return (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
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
              return <ol className="list-decimal pl-6 my-6 space-y-2">{children}</ol>;
            }
            return <ul className="list-disc pl-6 my-6 space-y-2">{children}</ul>;
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
      />
    </div>
  );
}
