"use client";

import { useEffect, useRef, useState } from "react";

import { GoogleAdSenseSlot } from "@/components/analytics";
import { type AdSensePlacement, getAdSenseSlot } from "@/config/adsense";
import { cn } from "@/lib/utils";

interface PageAdSlotProps {
  placement: AdSensePlacement;
  className?: string;
  containerClassName?: string;
  label?: string;
  minHeight?: number;
  format?: string;
  responsive?: boolean;
  loadWhenVisible?: boolean;
  rootMargin?: string;
  unstyled?: boolean;
  constrainWidth?: boolean;
}

export function PageAdSlot({
  placement,
  className,
  containerClassName,
  label = "Ad",
  minHeight = 280,
  format = "auto",
  responsive = true,
  loadWhenVisible = true,
  rootMargin = "300px 0px",
  unstyled = false,
  constrainWidth = true,
}: PageAdSlotProps) {
  const slot = getAdSenseSlot(placement);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(!loadWhenVisible);

  useEffect(() => {
    if (!slot || shouldLoad || !loadWhenVisible) {
      return;
    }

    const node = containerRef.current;
    if (!node) {
      return;
    }

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries.some((entry) => entry.isIntersecting);
        if (isVisible) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [loadWhenVisible, rootMargin, shouldLoad, slot]);

  if (!slot) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      aria-label="Advertisement"
      className={cn(
        "max-w-full overflow-hidden",
        !unstyled && "rounded-[24px] border border-gray-100/60 bg-white/70 px-5 py-4 sm:px-6",
        className
      )}
    >
      {label ? (
        <p className="mb-3 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-muted/45">
          {label}
        </p>
      ) : null}

      <div
        className={cn(
          "max-w-full overflow-hidden",
          constrainWidth ? "mx-auto w-full max-w-[728px]" : "w-full",
          containerClassName
        )}
        style={{ minHeight }}
      >
        {shouldLoad ? (
          <GoogleAdSenseSlot
            adSlot={slot}
            className="mx-auto block w-full max-w-full overflow-hidden"
            format={format}
            responsive={responsive}
            minHeight={minHeight}
          />
        ) : null}
      </div>
    </div>
  );
}
