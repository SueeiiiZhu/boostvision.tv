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
  const [expandedH2Id, setExpandedH2Id] = useState<string | null>(null);
  const handleTocClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;

    const mobileToc = e.currentTarget.closest("details.mobile-blog-toc") as HTMLDetailsElement | null;
    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    const baseTop = target.getBoundingClientRect().top + window.scrollY;
    const summary = mobileToc?.querySelector("summary") as HTMLElement | null;
    const extraOffset = isMobile && summary
      ? Math.ceil(summary.getBoundingClientRect().bottom) + 16
      : 0;
    const top = Math.max(baseTop - extraOffset, 0);

    window.scrollTo({ top, behavior: "smooth" });
    window.history.replaceState(null, "", `#${id}`);
    if (mobileToc) {
      mobileToc.open = false;
    }
  };

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
          const isExpanded = expandedH2Id === h2.id;
          const hasChildren = h3.length > 0;
          return (
            <li key={h2.id}>
              <div className="flex items-start gap-2">
                <a
                  href={`#${h2.id}`}
                  onClick={(e) => handleTocClick(e, h2.id)}
                  className="block flex-1 pt-[3px] transition-colors leading-snug text-[16px] font-bold text-muted hover:text-primary"
                >
                  {h2.title}
                </a>
                {hasChildren ? (
                  <button
                    type="button"
                    aria-label={isExpanded ? `Collapse ${h2.title}` : `Expand ${h2.title}`}
                    onClick={() => setExpandedH2Id((prev) => (prev === h2.id ? null : h2.id))}
                    className="self-center h-7 w-7 shrink-0 rounded-full border border-gray-200 bg-white text-muted/70 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all"
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
                  <span className="self-center h-7 w-7 shrink-0" />
                )}
              </div>

              {hasChildren && isExpanded && (
                <ul className="mt-3 ml-0 space-y-3 border-l border-gray-200/80 pl-4">
                  {h3.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => handleTocClick(e, item.id)}
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
