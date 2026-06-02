'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent, updatePageContext, type AnalyticsEventName } from '@/lib/analytics/events';

function normalizeUrl(url: string) {
  try {
    const parsed = new URL(url, window.location.origin);
    parsed.hash = '';
    return parsed.toString();
  } catch {
    return url;
  }
}

function isAppStoreUrl(url: string) {
  return url.includes('apps.apple.com');
}

function isGooglePlayUrl(url: string) {
  return url.includes('play.google.com');
}

function isInternalAppEntry(url: string) {
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.origin === window.location.origin && /^\/[a-z]{2}\/app\/?$|^\/app\/?$/.test(parsed.pathname);
  } catch {
    return url === '/app';
  }
}

function getText(anchor: HTMLAnchorElement) {
  return (
    anchor.dataset.analyticsLabel ||
    anchor.getAttribute('aria-label') ||
    anchor.textContent?.trim().replace(/\s+/g, ' ') ||
    anchor.querySelector('img')?.getAttribute('alt') ||
    ''
  );
}

function getPlacement(anchor: HTMLAnchorElement) {
  return (
    anchor.dataset.analyticsPlacement ||
    anchor.closest<HTMLElement>('[data-analytics-placement]')?.dataset.analyticsPlacement ||
    (anchor.closest('.blog-download-banner') ? 'blog_download_banner' : undefined)
  );
}

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    updatePageContext(pathname || window.location.pathname);
  }, [pathname]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>('a[href]');
      if (!anchor) return;

      const rawUrl = anchor.getAttribute('href') || '';
      if (!rawUrl || rawUrl.startsWith('#')) return;

      const linkUrl = normalizeUrl(rawUrl);
      const navRoot = anchor.closest<HTMLElement>('[data-analytics-nav-area]');
      const explicitEvent = anchor.dataset.analyticsEvent as AnalyticsEventName | undefined;
      let eventName: AnalyticsEventName | undefined;

      if (navRoot) {
        eventName = 'nav_click';
      } else if (isAppStoreUrl(linkUrl)) {
        eventName = 'appstore_click';
      } else if (isGooglePlayUrl(linkUrl)) {
        eventName = 'googleplay_click';
      } else if (explicitEvent === 'cta_click' || isInternalAppEntry(linkUrl)) {
        eventName = 'cta_click';
      }

      if (!eventName) return;

      trackEvent(eventName, {
        link_url: linkUrl,
        link_text: getText(anchor),
        app_slug: anchor.dataset.analyticsAppSlug,
        app_name: anchor.dataset.analyticsAppName,
        placement: getPlacement(anchor),
        cta_type: anchor.dataset.analyticsCtaType,
        nav_area: navRoot?.dataset.analyticsNavArea,
        nav_level: anchor.dataset.analyticsNavLevel,
        parent_label: anchor.dataset.analyticsParentLabel,
      });
    };

    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick, { capture: true });
  }, []);

  return null;
}
