'use client';

import { useEffect, useRef } from 'react';

interface GoogleAdSenseSlotProps {
  adSlot: string;
  className?: string;
  format?: string;
  responsive?: boolean;
  minHeight?: number;
}

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export function GoogleAdSenseSlot({
  adSlot,
  className,
  format = 'auto',
  responsive = true,
  minHeight = 280,
}: GoogleAdSenseSlotProps) {
  const adRef = useRef<HTMLModElement | null>(null);
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (!adClient || !adSlot || !adRef.current) {
      return;
    }

    if (adRef.current.getAttribute('data-ad-initialized') === 'true') {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      adRef.current.setAttribute('data-ad-initialized', 'true');
    } catch {
      // Ignore runtime pushes before script availability.
    }
  }, [adClient, adSlot]);

  if (!adClient || !adSlot) {
    return null;
  }

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle ${className || ''}`.trim()}
      style={{ display: 'block', minHeight, width: '100%', maxWidth: '100%' }}
      data-ad-client={adClient}
      data-ad-slot={adSlot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? 'true' : 'false'}
    />
  );
}
