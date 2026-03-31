import { Metadata } from "next";
import { SEO, StrapiImage } from "@/types/strapi";
import { routing } from "@/i18n/routing";
import { getLocaleAlternates } from "./hreflang";

type OgImageInput =
  | Pick<StrapiImage, "url" | "width" | "height" | "alternativeText">
  | null
  | undefined;

interface GenerateMetadataOptions {
  seo?: SEO | null;
  defaultSeo?: SEO | null; // From GlobalSetting
  pageTitle?: string; // Page's own title (e.g., post.title, page.title)
  defaultTitle?: string; // Fallback title if no pageTitle
  defaultDescription?: string;
  fallbackOgImage?: OgImageInput;
  fallbackOgImageUrl?: string;
  path?: string;
  locale?: string;
  type?: "website" | "article";
}

const SITE_URL = "https://www.boostvision.tv";
const SITE_NAME = "BoostVision";

export function generateMetadata(options: GenerateMetadataOptions): Metadata {
  const {
    seo,
    defaultSeo,
    pageTitle,
    defaultTitle,
    defaultDescription,
    fallbackOgImage,
    fallbackOgImageUrl,
    path = "",
    locale = routing.defaultLocale,
    type = "website",
  } = options;

  // Fallback chain: seo → defaultSeo → hardcoded defaults
  const effectiveSeo = seo || defaultSeo;

  // Title fallback priority:
  // 1. seo.metaTitle (SEO-optimized title from Strapi SEO component)
  // 2. pageTitle (page's own title, e.g., post.title, app.name)
  // 3. defaultTitle (caller-provided fallback)
  // 4. SITE_NAME (final fallback)
  const title = seo?.metaTitle || pageTitle || defaultTitle || SITE_NAME;
  const description =
    effectiveSeo?.metaDescription ||
    defaultDescription ||
    "Professional screen mirroring and TV remote control apps";

  // Canonical URL logic:
  // 1. Use page-specific canonicalUrl if set
  // 2. Otherwise, use current page path
  // Do NOT fallback to defaultSeo.canonicalUrl as it would make all pages point to the same URL
  const alternates = path ? getLocaleAlternates(path, locale) : undefined;
  const fallbackCanonical = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
  const canonical = seo?.canonicalUrl || alternates?.canonical || fallbackCanonical;

  // OG image fallback priority:
  // 1) Current entry SEO image
  // 2) Caller-provided content image (e.g. blog cover / hero image)
  // 3) Global default SEO image
  // 4) Static fallback image
  const toAbsoluteUrl = (url: string): string =>
    url.startsWith("http") ? url : `${SITE_URL}${url}`;

  const pickImage = (...candidates: OgImageInput[]) =>
    candidates.find((image) => Boolean(image?.url));

  const selectedImage = pickImage(seo?.metaImage, fallbackOgImage, defaultSeo?.metaImage);
  const imageUrl = selectedImage?.url
    ? toAbsoluteUrl(selectedImage.url)
    : fallbackOgImageUrl
    ? toAbsoluteUrl(fallbackOgImageUrl)
    : `${SITE_URL}/images/og-image.webp`;
  const imageWidth = selectedImage?.width || 1200;
  const imageHeight = selectedImage?.height || 630;
  const imageAlt = selectedImage?.alternativeText || title;

  const metadata: Metadata = {
    title,
    description,
    alternates: {
      canonical,
      ...(alternates?.languages ? { languages: alternates.languages } : {}),
    },
  };

  // Add keywords if provided (check both seo and defaultSeo)
  const keywords = effectiveSeo?.keywords;
  if (keywords) {
    metadata.keywords = keywords.split(",").map((k) => k.trim());
  }

  // Add robots meta if noIndex is true
  if (effectiveSeo?.noIndex) {
    metadata.robots = {
      index: false,
      follow: false,
    };
  }

  // OpenGraph
  metadata.openGraph = {
    title,
    description,
    url: canonical,
    siteName: SITE_NAME,
    images: [
      {
        url: imageUrl,
        width: imageWidth,
        height: imageHeight,
        alt: imageAlt,
      },
    ],
    locale: "en_US",
    type,
  };

  // Twitter Card
  metadata.twitter = {
    card: "summary_large_image",
    title,
    description,
    images: [imageUrl],
  };

  return metadata;
}
