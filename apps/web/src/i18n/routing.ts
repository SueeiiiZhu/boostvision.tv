import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'pt', 'es', 'fr', 'de', 'ja'],

  // Used when no locale matches
  defaultLocale: 'en',

  // Custom prefixing behavior if needed
  localePrefix: 'as-needed',

  // Disable auto-detection from Accept-Language/cookie so the URL fully controls the locale
  localeDetection: false,
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
