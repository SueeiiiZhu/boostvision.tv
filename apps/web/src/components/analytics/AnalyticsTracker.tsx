'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent, updatePageContext } from '@/lib/analytics/events';
import { getDownloadEventSuffix, getStoreClickEventName } from './storeEvents';

interface TrackEventOptions {
  category?: string;
  label?: string;
  value?: number;
  redirect_url?: string;
  [key: string]: unknown;
}

export const trackLinkClick = (
  eventName: string,
  targetUrl: string,
  otherOptions: TrackEventOptions = {}
) => {
  trackEvent(eventName, {
    ...otherOptions,
    redirect_url: targetUrl,
  });
};

interface AnalyticsTrackerProps extends TrackEventOptions {
  eventName?: string;
  eventNamePrefix?: string;
  children: React.ReactNode;
}

/**
 * Wraps a link (or any clickable subtree) and fires a GA4 event on click.
 *
 * Implementation note: this intentionally renders a `display: contents`
 * wrapper and listens for the bubbled click instead of using
 * `React.Children.only` + `React.cloneElement`. The Slot/clone pattern is
 * fragile across the RSC boundary (a Server Component passing a single
 * Client Component element such as `next/link` / next-intl `Link` as
 * `children`) and throws "React.Children.only expected to receive a single
 * React element child." during static prerendering on Next 16 / React 19.
 * The `display: contents` wrapper is transparent to layout, so the inner
 * link keeps its place in any flex/grid container.
 */
export const AnalyticsTracker: React.FC<AnalyticsTrackerProps> = ({
  eventName: eventNameProp,
  eventNamePrefix,
  children,
  ...options
}) => {
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as Element | null;
    const anchor = target?.closest?.('a') as HTMLAnchorElement | null;
    const autoRedirectUrl = anchor?.getAttribute('href') ?? undefined;

    const resolvedEventName =
      eventNameProp != null
        ? eventNameProp
        : eventNamePrefix != null
          ? `${eventNamePrefix}_${getDownloadEventSuffix(autoRedirectUrl)}`
          : undefined;

    if (resolvedEventName) {
      trackEvent(resolvedEventName, {
        redirect_url: autoRedirectUrl,
        ...options,
      });
    }
  };

  return (
    <span style={{ display: 'contents' }} onClick={handleClick}>
      {children}
    </span>
  );
};

export function PageContextTracker() {
  const pathname = usePathname();

  useEffect(() => {
    updatePageContext(pathname || window.location.pathname);
  }, [pathname]);

  useEffect(() => {
    const handleRichTextDownloadClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>('.blog-download-banner a[href]');
      if (!anchor) return;

      const href = anchor.getAttribute('href') || undefined;
      const eventName = getStoreClickEventName(href);
      if (!eventName) return;

      trackEvent(eventName, {
        redirect_url: href,
        placement: anchor.dataset.analyticsPlacement || 'blog_download_banner',
        app_slug: anchor.dataset.analyticsAppSlug,
        app_name: anchor.dataset.analyticsAppName,
        link_text: anchor.dataset.analyticsLabel || anchor.getAttribute('aria-label') || '',
      });
    };

    document.addEventListener('click', handleRichTextDownloadClick, { capture: true });
    return () => document.removeEventListener('click', handleRichTextDownloadClick, { capture: true });
  }, []);

  return null;
}
