import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
  // Match internationalized pathnames and .html files
  // Note: We include paths without dots AND .html files specifically
  matcher: [
    '/((?!api|_next|_vercel).*)',  // Match all except api, _next, _vercel
  ]
};
