type AnalyticsValue = string | number | boolean | null | undefined | unknown;

export type AnalyticsEventName =
  | 'appstore_click'
  | 'googleplay_click'
  | 'cta_click'
  | 'nav_click';

export interface AnalyticsParams {
  [key: string]: AnalyticsValue;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const ENTRY_PAGE_KEY = 'bv_entry_page_path';
const PREVIOUS_PAGE_KEY = 'bv_previous_page_path';
const CURRENT_PAGE_KEY = 'bv_current_page_path';

export function getPageType(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const localeStripped = segments.length > 0 && segments[0].length === 2 ? segments.slice(1) : segments;

  if (localeStripped.length === 0) return 'home';
  if (localeStripped[0] === 'app') return localeStripped.length > 1 ? 'app_detail' : 'app_list';
  if (localeStripped[0] === 'blog') return localeStripped.length > 1 ? 'blog_detail' : 'blog_list';
  if (localeStripped[0] === 'tutorial') return localeStripped.length > 1 ? 'tutorial_detail' : 'tutorial_list';
  if (localeStripped[0] === 'faq') return localeStripped.length > 1 ? 'faq_detail' : 'faq_list';
  if (localeStripped[0] === 'search') return 'search';
  return localeStripped[0] || 'unknown';
}

export function getLocaleFromPath(pathname: string): string {
  return pathname.split('/').filter(Boolean)[0] || 'en';
}

export function updatePageContext(currentPath: string) {
  if (typeof window === 'undefined') return;

  const current = sessionStorage.getItem(CURRENT_PAGE_KEY);

  if (!sessionStorage.getItem(ENTRY_PAGE_KEY)) {
    sessionStorage.setItem(ENTRY_PAGE_KEY, currentPath);
  }

  if (current && current !== currentPath) {
    sessionStorage.setItem(PREVIOUS_PAGE_KEY, current);
  }

  sessionStorage.setItem(CURRENT_PAGE_KEY, currentPath);
}

export function getPageContext() {
  if (typeof window === 'undefined') {
    return {
      entry_page_path: undefined,
      previous_page_path: undefined,
    };
  }

  return {
    entry_page_path: sessionStorage.getItem(ENTRY_PAGE_KEY) || undefined,
    previous_page_path: sessionStorage.getItem(PREVIOUS_PAGE_KEY) || undefined,
  };
}

/**
 * Push a gtag command using the canonical `arguments`-object shape.
 *
 * We do NOT branch on `window.gtag` and fall back to
 * `dataLayer.push(['event', ...])`: a plain array is not a valid gtag command
 * and gtag.js silently ignores it once it loads. Because GA is lazy-loaded
 * (see AnalyticsWrapper), clicks that happen before gtag.js is ready would be
 * lost. Pushing a real `arguments` object via this shim queues the command so
 * gtag.js replays it correctly whenever it finishes loading.
 */
const gtagPush: (...args: unknown[]) => void = function () {
  window.dataLayer = window.dataLayer || [];
  // gtag.js consumes each dataLayer entry as an `arguments` object, so we must
  // push `arguments` here rather than a normal array.
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
};

function buildPagePayload(params: AnalyticsParams = {}) {
  const pagePath = window.location.pathname;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  return {
    ...params,
    ...(gaId ? { send_to: gaId } : {}),
    current_page_url: window.location.href,
    current_page_path: pagePath,
    page_title: document.title,
    referrer: document.referrer,
    timestamp: new Date().toISOString(),
    page_path: pagePath,
    page_location: window.location.href,
    page_type: getPageType(pagePath),
    locale: getLocaleFromPath(pagePath),
    ...getPageContext(),
  };
}

export function trackEvent(eventName: string, params: AnalyticsParams = {}) {
  if (typeof window === 'undefined') return;
  gtagPush('event', eventName, buildPagePayload(params));
}

/**
 * Report a GA4 page_view for client-side (SPA) navigations.
 *
 * gtag('config') only fires page_view once on initial script load. Next.js
 * App Router navigations change the URL without a full reload, so without this
 * every page after the landing page goes uncounted.
 */
export function trackPageView(params: AnalyticsParams = {}) {
  if (typeof window === 'undefined') return;
  gtagPush('event', 'page_view', buildPagePayload(params));
}
