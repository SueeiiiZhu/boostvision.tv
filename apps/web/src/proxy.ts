import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);
const appRedirects = new Map<string, string>([
  ['beko-tv-screen-mirroring', 'screen-mirroring'],
  ['element-tv-remote', 'universal-tv-remote'],
  ['grundig-tv-screen-mirroring', 'screen-mirroring'],
  ['haier-tv-remote', 'universal-tv-remote'],
  ['haier-tv-screen-mirroring', 'screen-mirroring'],
  ['hisense-tv-screen-mirroring', 'screen-mirroring'],
  ['hitachi-tv-remote', 'universal-tv-remote'],
  ['hitachi-tv-screen-mirroring', 'screen-mirroring'],
  ['insignia-tv-remote', 'universal-tv-remote'],
  ['jvc-tv-remote', 'universal-tv-remote'],
  ['lg-tv-screen-mirroring', 'screen-mirroring'],
  ['magnavox-tv-remote', 'universal-tv-remote'],
  ['onn-tv-remote', 'universal-tv-remote'],
  ['onn-tv-screen-mirroring', 'screen-mirroring'],
  ['panasonic-tv-remote', 'universal-tv-remote'],
  ['panasonic-tv-screen-mirroring', 'screen-mirroring'],
  ['philips-tv-screen-mirroring', 'screen-mirroring'],
  ['philips-universal-remote', 'universal-tv-remote'],
  ['rca-tv-remote', 'universal-tv-remote'],
  ['sanyo-tv-remote', 'universal-tv-remote'],
  ['screen-mirroring-firestick', 'screen-mirroring'],
  ['screen-mirroring-for-roku', 'screen-mirroring'],
  ['screen-mirroring-samsung-tv', 'screen-mirroring'],
  ['seiki-tv-remote', 'universal-tv-remote'],
  ['sharp-tv-remote', 'universal-tv-remote'],
  ['sharp-tv-screen-mirroring', 'screen-mirroring'],
  ['sony-tv-screen-mirroring', 'screen-mirroring'],
  ['tcl-remote', 'universal-tv-remote'],
  ['tcl-tv-screen-mirroring', 'screen-mirroring'],
  ['toshiba-tv-screen-mirroring', 'screen-mirroring'],
  ['vizio-tv-screen-mirroring', 'screen-mirroring'],
  ['westinghouse-tv-remote', 'universal-tv-remote'],
]);

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Legacy locale mapping: jp -> ja
  if (pathname === '/jp' || pathname.startsWith('/jp/')) {
    const url = request.nextUrl.clone();
    const restPath = pathname.slice('/jp'.length);
    url.pathname = `/ja${restPath}`;
    return NextResponse.redirect(url, 301);
  }

  // Consolidate non-core app pages to their core destinations with a single-hop 301.
  const segments = pathname.replace(/^\/+/, '').split('/');
  const maybeLocale = segments[0];
  const hasLocalePrefix = routing.locales.includes(maybeLocale as (typeof routing.locales)[number]);
  const localePrefix = hasLocalePrefix ? `/${maybeLocale}` : '';
  const contentSegments = hasLocalePrefix ? segments.slice(1) : segments;

  if (contentSegments[0] === 'app' && contentSegments.length === 2) {
    const targetSlug = appRedirects.get(contentSegments[1]);
    if (targetSlug) {
      const url = request.nextUrl.clone();
      url.pathname = `${localePrefix}/app/${targetSlug}`;
      return NextResponse.redirect(url, 301);
    }
  }

  // Skip processing for static files (images, fonts, etc.) except .html files
  const staticFileExtensions = [
    '.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.ico',
    '.woff', '.woff2', '.ttf', '.eot', '.otf',
    '.css', '.js', '.json', '.xml', '.txt', '.pdf',
    '.mp4', '.webm', '.ogg', '.mp3', '.wav',
    '.zip', '.gz', '.tar'
  ];

  if (staticFileExtensions.some(ext => pathname.endsWith(ext))) {
    return NextResponse.next();
  }

  // Handle legacy .html blog URLs
  // Example: /go-to-settings-on-hisense-tv-without-remote.html -> /blog/go-to-settings-on-hisense-tv-without-remote
  // Example: /blog/article-name.html -> /blog/article-name
  if (pathname.endsWith('.html')) {
    const url = request.nextUrl.clone();
    const pathWithoutHtml = pathname.replace(/\.html$/, '');
    const segments = pathWithoutHtml.replace(/^\/+/, '').split('/');
    const maybeLocale = segments[0];
    const hasLocalePrefix = routing.locales.includes(maybeLocale as (typeof routing.locales)[number]);

    const localePrefix = hasLocalePrefix ? `/${maybeLocale}` : '';
    const contentSegments = hasLocalePrefix ? segments.slice(1) : segments;
    const contentPath = contentSegments.join('/');

    const normalizedContentPath = contentPath.startsWith('blog/')
      ? contentPath
      : `blog/${contentPath}`;

    url.pathname = `${localePrefix}/${normalizedContentPath}`.replace(/\/+$/, '');

    return NextResponse.redirect(url, 301);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel).*)',
  ]
};
