import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

// Supported locales from routing config
const locales = ['en', 'pt', 'es', 'fr', 'de', 'ja'];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip processing for static files (images, fonts, etc.) except .html files
  // This allows .html redirects while letting other static assets pass through
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

  // Temporarily redirect non-default locale paths to default locale
  // TODO: Remove this when i18n is fully configured
  // Example: /pt/ -> /, /es/blog -> /blog
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  const nonDefaultLocales = ['pt', 'es', 'fr', 'de', 'ja']; // All locales except 'en'

  if (nonDefaultLocales.includes(firstSegment)) {
    const url = request.nextUrl.clone();
    // Remove the locale prefix and redirect
    const pathWithoutLocale = segments.slice(1).join('/');
    url.pathname = pathWithoutLocale ? `/${pathWithoutLocale}` : '/';

    // Use 302 temporary redirect (since this is a temporary solution)
    return NextResponse.redirect(url, 302);
  }

  // Handle legacy .html blog URLs
  // Example: /go-to-settings-on-hisense-tv-without-remote.html
  // Redirect to: /blog/go-to-settings-on-hisense-tv-without-remote
  if (pathname.endsWith('.html')) {
    const url = request.nextUrl.clone();
    // Extract slug: article-name
    const slug = pathname.replace(/\.html$/, '').replace(/^\//, '');
    url.pathname = `/blog/${slug}`;

    // Use 301 permanent redirect for SEO
    return NextResponse.redirect(url, 301);
  }

  // Continue with internationalization middleware
  return intlMiddleware(request);
}

export const config = {
  // Match internationalized pathnames and .html files
  // Note: We include paths without dots AND .html files specifically
  matcher: [
    '/((?!api|_next|_vercel).*)',  // Match all except api, _next, _vercel
  ]
};
