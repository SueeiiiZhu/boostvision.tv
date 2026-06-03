'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent, updatePageContext } from '@/lib/analytics/events';

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

export function getDownloadEventSuffix(
  href: string | undefined
): 'DirectDownload' | 'GooglePlay' | 'AppStore' | 'MicrosoftStore' {
  if (!href || typeof href !== 'string') return 'DirectDownload';
  const lower = href.toLowerCase();
  if (lower.includes('play.google.com')) return 'GooglePlay';
  if (lower.includes('apps.apple.com') || lower.includes('itunes.apple.com')) return 'AppStore';
  if (lower.includes('apps.microsoft.com')) return 'MicrosoftStore';
  return 'DirectDownload';
}

export function getStoreClickEventName(href: string | undefined): 'appstore_click' | 'googleplay_click' | undefined {
  const suffix = getDownloadEventSuffix(href);
  if (suffix === 'AppStore') return 'appstore_click';
  if (suffix === 'GooglePlay') return 'googleplay_click';
  return undefined;
}

interface AnalyticsTrackerProps extends TrackEventOptions {
  eventName?: string;
  eventNamePrefix?: string;
  children: React.ReactElement<ChildLinkProps>;
}

type ChildLinkProps = {
  href?: string;
  to?: string;
  onClick?: (e: React.MouseEvent) => void;
};

export const AnalyticsTracker: React.FC<AnalyticsTrackerProps> = ({
  eventName: eventNameProp,
  eventNamePrefix,
  children,
  ...options
}) => {
  const child = React.Children.only(children) as React.ReactElement<ChildLinkProps>;

  const handleClick = (e: React.MouseEvent) => {
    child.props.onClick?.(e);

    const autoRedirectUrl = child.props.href ?? child.props.to;
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

  return React.cloneElement(child, { onClick: handleClick });
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
