"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function isExternalHref(href: string): boolean {
  if (!href) return false;
  if (href.startsWith("#") || href.startsWith("/") || href.startsWith("mailto:") || href.startsWith("tel:")) return false;
  try {
    const url = new URL(href, window.location.origin);
    return url.origin !== window.location.origin;
  } catch {
    return false;
  }
}

function mergeRel(existingRel: string | null, relToAdd: string): string {
  const set = new Set((existingRel || "").split(/\s+/).filter(Boolean));
  set.add(relToAdd);
  return Array.from(set).join(" ");
}

export function LinkPolicyEnforcer() {
  const pathname = usePathname();

  useEffect(() => {
    const isBlogPage = /(^|\/)blog(\/|$)/.test(pathname || "");

    const applyPolicies = () => {
      const anchors = Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]"));

      for (const a of anchors) {
        const href = a.getAttribute("href") || "";

        if (isExternalHref(href)) {
          a.setAttribute("rel", mergeRel(a.getAttribute("rel"), "nofollow"));
        }

        // On blog pages, only force a new tab for external links.
        // Keep internal navigation (e.g. pagination/category links) in the same tab.
        if (isBlogPage && href && !href.startsWith("#") && isExternalHref(href)) {
          a.setAttribute("target", "_blank");
          a.setAttribute("rel", mergeRel(a.getAttribute("rel"), "noopener"));
          a.setAttribute("rel", mergeRel(a.getAttribute("rel"), "noreferrer"));
        }
      }
    };

    applyPolicies();

    const observer = new MutationObserver(() => applyPolicies());
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["href"] });

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
