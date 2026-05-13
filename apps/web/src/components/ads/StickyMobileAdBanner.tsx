"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { GoogleAdSenseSlot } from "@/components/analytics";
import { type AdSensePlacement, getAdSenseSlot } from "@/config/adsense";
import { cn } from "@/lib/utils";

interface StickyMobileAdBannerProps {
  placement: AdSensePlacement;
}

const DISMISS_TTL = 24 * 60 * 60 * 1000; // 24 hours
const SCROLL_THRESHOLD = 200; // px
const SHOW_DELAY = 1500; // ms after scroll threshold reached

function getDismissKey(placement: string) {
  return `sticky-ad-dismiss-${placement}`;
}

function isDismissedInStorage(placement: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(getDismissKey(placement));
    if (!raw) return false;
    const expiry = Number(raw);
    if (Date.now() < expiry) return true;
    localStorage.removeItem(getDismissKey(placement));
    return false;
  } catch {
    return false;
  }
}

export function StickyMobileAdBanner({ placement }: StickyMobileAdBannerProps) {
  const slot = getAdSenseSlot(placement);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const thresholdReachedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isDismissedInStorage(placement)) {
      setIsDismissed(true);
    }
  }, [placement]);

  useEffect(() => {
    if (!slot || isDismissed) return;

    let rafId: number | null = null;

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (thresholdReachedRef.current) return;
        if (window.scrollY >= SCROLL_THRESHOLD) {
          thresholdReachedRef.current = true;
          timerRef.current = setTimeout(() => setIsVisible(true), SHOW_DELAY);
          window.removeEventListener("scroll", onScroll);
        }
      });
    };

    // Check if already scrolled past threshold
    if (window.scrollY >= SCROLL_THRESHOLD) {
      thresholdReachedRef.current = true;
      timerRef.current = setTimeout(() => setIsVisible(true), SHOW_DELAY);
    } else {
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [slot, isDismissed]);

  const handleDismiss = useCallback(() => {
    setIsDismissed(true);
    setIsVisible(false);
    try {
      localStorage.setItem(getDismissKey(placement), String(Date.now() + DISMISS_TTL));
    } catch {
      // Ignore storage errors
    }
  }, [placement]);

  if (!slot || isDismissed) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 inset-x-0 z-[90] md:hidden",
        "transition-transform duration-300 ease-out",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      {/* Dismiss button above the banner */}
      <button
        onClick={handleDismiss}
        className="absolute -top-8 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white text-xs backdrop-blur-sm"
        aria-label="Close ad"
      >
        ✕
      </button>

      {/* Ad container */}
      <div
        className="border-t border-gray-200 bg-white/95 px-3 py-2 backdrop-blur-sm"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <GoogleAdSenseSlot
          adSlot={slot}
          format="horizontal"
          responsive
          minHeight={50}
          className="mx-auto block w-full max-w-full"
        />
      </div>
    </div>
  );
}
