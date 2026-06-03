/**
 * Pure helpers for deriving analytics event names from store/download URLs.
 *
 * These intentionally live in a non-`'use client'` module so they can be
 * called from Server Components (e.g. during static prerendering) as well as
 * from Client Components. Re-exporting them from a `'use client'` module turns
 * them into client references, which throws
 * "Attempted to call getStoreClickEventName() from the server" at build time.
 */

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

export function getStoreClickEventName(
  href: string | undefined
): 'appstore_click' | 'googleplay_click' | undefined {
  const suffix = getDownloadEventSuffix(href);
  if (suffix === 'AppStore') return 'appstore_click';
  if (suffix === 'GooglePlay') return 'googleplay_click';
  return undefined;
}
