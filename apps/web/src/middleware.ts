import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

// Supported locales from routing config
const locales = ['en', 'pt', 'es', 'fr', 'de', 'ja'];

// Internal header used to bypass redirect logic during path existence checks
const SKIP_REDIRECT_HEADER = 'x-skip-redirect-check';

// Make a HEAD request to check if a path returns 404
async function pathExists(request: NextRequest, pathname: string): Promise<boolean> {
  try {
    const url = new URL(pathname, request.nextUrl.origin);
    const res = await fetch(url.toString(), {
      method: 'HEAD',
      headers: { [SKIP_REDIRECT_HEADER]: '1' },
    });
    return res.status !== 404;
  } catch {
    return false;
  }
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If this is an internal path-check request, skip all redirect logic
  if (request.headers.get(SKIP_REDIRECT_HEADER)) {
    return NextResponse.next();
  }

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
  const nonDefaultLocales = ['pt', 'es', 'fr', 'de', 'ja', 'jp']; // All locales except 'en'

  if (nonDefaultLocales.includes(firstSegment)) {
    // Only redirect if the path does not exist as a valid page
    const exists = await pathExists(request, pathname);
    if (!exists) {
      const url = request.nextUrl.clone();
      // Remove the locale prefix and redirect
      const pathWithoutLocale = segments.slice(1).join('/');
      url.pathname = pathWithoutLocale ? `/${pathWithoutLocale}` : '/';

      // Use 302 temporary redirect (since this is a temporary solution)
      return NextResponse.redirect(url, 302);
    }
  }

  // Handle legacy .html blog URLs
  // Example: /go-to-settings-on-hisense-tv-without-remote.html
  // Redirect to: /blog/go-to-settings-on-hisense-tv-without-remote
  // Example: /blog/article-name.html -> /blog/article-name
  if (pathname.endsWith('.html')) {
    // Only redirect if the .html path does not exist as a valid resource
    const exists = await pathExists(request, pathname);
    if (!exists) {
      const url = request.nextUrl.clone();
      // Remove .html extension
      const pathWithoutHtml = pathname.replace(/\.html$/, '');

      // Check if path already starts with /blog/
      if (pathWithoutHtml.startsWith('/blog/')) {
        // Already has /blog/ prefix, just remove .html
        url.pathname = pathWithoutHtml;
      } else {
        // Extract slug and add /blog/ prefix
        const slug = pathWithoutHtml.replace(/^\//, '');
        url.pathname = `/blog/${slug}`;
      }

      // Use 301 permanent redirect for SEO
      return NextResponse.redirect(url, 301);
    }
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
