import { Metadata } from "next";
import { SEO } from "@/types/strapi";

interface GenerateMetadataOptions {
  seo?: SEO | null;
  defaultSeo?: SEO | null; // From GlobalSetting
  defaultTitle?: string;
  defaultDescription?: string;
  path?: string;
  type?: "website" | "article";
}

const SITE_URL = "https://www.boostvision.tv";
const SITE_NAME = "BoostVision";

export function generateMetadata(options: GenerateMetadataOptions): Metadata {
  const {
    seo,
    defaultSeo,
    defaultTitle,
    defaultDescription,
    path = "",
    type = "website",
  } = options;

  // Fallback chain: seo → defaultSeo → hardcoded defaults
  const effectiveSeo = seo || defaultSeo;

  const title = effectiveSeo?.metaTitle || defaultTitle || SITE_NAME;
  const description =
    effectiveSeo?.metaDescription ||
    defaultDescription ||
    "Professional screen mirroring and TV remote control apps";
  const canonical = effectiveSeo?.canonicalUrl || `${SITE_URL}${path}`;

  // Image URL with fallback
  const getImageUrl = (seoData?: SEO | null): string => {
    if (!seoData?.metaImage?.url) return `${SITE_URL}/images/og-image.webp`;
    return seoData.metaImage.url.startsWith("http")
      ? seoData.metaImage.url
      : `${SITE_URL}${seoData.metaImage.url}`;
  };

  const imageUrl = getImageUrl(seo) || getImageUrl(defaultSeo);

  const metadata: Metadata = {
    title,
    description,
    alternates: {
      canonical,
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
        width: effectiveSeo?.metaImage?.width || 1200,
        height: effectiveSeo?.metaImage?.height || 630,
        alt: effectiveSeo?.metaImage?.alternativeText || title,
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
