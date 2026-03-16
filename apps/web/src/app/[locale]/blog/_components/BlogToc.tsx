"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TocGroup {
  h2: TocItem;
  h3: TocItem[];
}

interface BlogTocProps {
  toc: TocItem[];
}

export function BlogToc({ toc }: BlogTocProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const groups = useMemo<TocGroup[]>(() => {
    const result: TocGroup[] = [];
    let currentGroup: TocGroup | null = null;

    for (const item of toc) {
      if (item.level === 2) {
        currentGroup = { h2: item, h3: [] };
        result.push(currentGroup);
        continue;
      }

      if (item.level === 3 && currentGroup) {
        currentGroup.h3.push(item);
      }
    }

    return result;
  }, [toc]);

  if (groups.length === 0) return null;

  return (
    <nav>
      <ul className="space-y-4">
        {groups.map(({ h2, h3 }) => {
          const isExpanded = !!expanded[h2.id];
          const hasChildren = h3.length > 0;
          return (
            <li key={h2.id}>
              <div className="flex items-start gap-2">
                {hasChildren ? (
                  <button
                    type="button"
                    aria-label={isExpanded ? `Collapse ${h2.title}` : `Expand ${h2.title}`}
                    onClick={() => setExpanded((prev) => ({ ...prev, [h2.id]: !prev[h2.id] }))}
                    className="mt-[2px] h-7 w-7 shrink-0 rounded-full border border-gray-200 bg-white text-muted/70 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      className={cn("mx-auto h-3.5 w-3.5 transition-transform", isExpanded && "rotate-180")}
                      aria-hidden="true"
                    >
                      <path
                        d="M5 8l5 5 5-5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                ) : (
                  <span className="mt-[2px] h-7 w-7 shrink-0" />
                )}
                <a
                  href={`#${h2.id}`}
                  className="flex-1 block pt-[3px] transition-colors leading-snug text-[16px] font-bold text-muted hover:text-primary"
                >
                  {h2.title}
                </a>
              </div>

              {hasChildren && isExpanded && (
                <ul className="mt-3 ml-9 space-y-3">
                  {h3.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="block transition-colors leading-snug text-[14px] font-medium text-muted/80 hover:text-primary"
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
