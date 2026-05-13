import { routing } from "@/i18n/routing";

const SITE_URL = "https://www.boostvision.tv";

function normalizePath(inputPath: string): string {
  const raw = inputPath || "/";
  const [pathWithQuery, hash = ""] = raw.split("#", 2);
  const [pathnameRaw, query = ""] = pathWithQuery.split("?", 2);

  let pathname = pathnameRaw || "/";
  if (!pathname.startsWith("/")) pathname = `/${pathname}`;
  if (pathname !== "/" && pathname.endsWith("/")) pathname = pathname.slice(0, -1);

  let normalized = pathname;
  if (query) normalized += `?${query}`;
  if (hash) normalized += `#${hash}`;
  return normalized;
}

export function getLocalizedPath(path: string, locale: string): string {
  const normalizedPath = normalizePath(path);
  const [pathWithQuery, hash = ""] = normalizedPath.split("#", 2);
  const [pathname, query = ""] = pathWithQuery.split("?", 2);

  const isDefaultLocale = locale === routing.defaultLocale;
  const localizedPathname = isDefaultLocale
    ? pathname
    : pathname === "/"
      ? `/${locale}`
      : `/${locale}${pathname}`;

  let localizedPath = localizedPathname;
  if (query) localizedPath += `?${query}`;
  if (hash) localizedPath += `#${hash}`;
  return localizedPath;
}

function buildFullUrl(localizedPath: string): string {
  return localizedPath === "/" ? SITE_URL : `${SITE_URL}${localizedPath}`;
}

export function getHreflangLanguages(path: string): Record<string, string> {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [locale, buildFullUrl(getLocalizedPath(path, locale))]),
  );

  return {
    ...languages,
    "x-default": buildFullUrl(getLocalizedPath(path, routing.defaultLocale)),
  };
}

export function getLocaleAlternates(path: string, locale: string) {
  return {
    canonical: buildFullUrl(getLocalizedPath(path, locale)),
    languages: getHreflangLanguages(path),
  };
}
