/**
 * Schema.org JSON-LD generators for structured data
 */

const SITE_URL = "https://www.boostvision.tv";
const SITE_NAME = "BoostVision";

type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | JsonLdObject
  | JsonLdValue[];

type JsonLdObject = {
  [key: string]: JsonLdValue;
};

interface OrganizationSchemaOptions {
  socialLinks?: Array<{ platform: string; url: string }>;
}

/**
 * Generate Organization schema for homepage
 */
export function generateOrganizationSchema(
  options: OrganizationSchemaOptions = {}
): JsonLdObject {
  const { socialLinks = [] } = options;

  return {
    "@type": "Organization",
    "@id": `${SITE_URL}#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.svg`,
    },
    sameAs: socialLinks.map((link) => link.url),
  };
}

/**
 * Generate WebSite schema for homepage
 */
export function generateWebSiteSchema(): JsonLdObject {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}#website`,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: {
      "@id": `${SITE_URL}#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

interface SoftwareApplicationSchemaOptions {
  name: string;
  description: string;
  rating?: number | null;
  ratingCount?: number | null;
  downloadCount?: string;
  operatingSystem?: string;
  applicationCategory?: string;
  image?: string;
  url: string;
}

/**
 * Parse a download count string (e.g. "1+ Million Downloads", "3M+", "500K")
 * into an integer for schema.org userInteractionCount.
 * Returns undefined if the string cannot be parsed.
 */
function parseDownloadCount(value: string | undefined): number | undefined {
  if (!value) return undefined;

  const cleaned = value.replace(/[,\s]/g, "").toLowerCase();

  // Direct integer (e.g. "1000000" or "28000000+")
  const directMatch = cleaned.match(/^(\d+)\+?$/);
  if (directMatch) {
    const num = parseInt(directMatch[1], 10);
    return Number.isFinite(num) && num > 0 ? num : undefined;
  }

  // Patterns like "1+ million", "3m+", "500k", "1.5 million downloads"
  const match = cleaned.match(
    /(\d+(?:\.\d+)?)\+?\s*(million|billion|m|b|k)?/,
  );
  if (!match) return undefined;

  const num = parseFloat(match[1]);
  if (!Number.isFinite(num) || num <= 0) return undefined;

  const multipliers: Record<string, number> = {
    k: 1_000,
    m: 1_000_000,
    million: 1_000_000,
    b: 1_000_000_000,
    billion: 1_000_000_000,
  };

  const unit = match[2];
  const multiplier = unit ? multipliers[unit] ?? 1 : 1;

  return Math.round(num * multiplier);
}

/**
 * Generate SoftwareApplication schema for app pages
 */
export function generateSoftwareApplicationSchema(
  options: SoftwareApplicationSchemaOptions
): JsonLdObject {
  const {
    name,
    description,
    rating,
    ratingCount,
    downloadCount,
    operatingSystem = "iOS, Android",
    applicationCategory = "MultimediaApplication",
    image,
    url,
  } = options;

  const hasValidAggregateRating =
    typeof rating === "number" &&
    Number.isFinite(rating) &&
    rating > 0 &&
    rating <= 5 &&
    typeof ratingCount === "number" &&
    Number.isFinite(ratingCount) &&
    ratingCount > 0;

  const parsedDownloadCount = parseDownloadCount(downloadCount);

  return {
    "@type": "SoftwareApplication",
    name,
    description,
    operatingSystem,
    applicationCategory,
    url,
    ...(image && { image }),
    ...(hasValidAggregateRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: rating.toString(),
        ratingCount: ratingCount.toString(),
        bestRating: "5",
        worstRating: "1",
      },
    }),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    ...(parsedDownloadCount && {
      interactionStatistic: {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/DownloadAction",
        userInteractionCount: parsedDownloadCount,
      },
    }),
  };
}

interface ArticleSchemaOptions {
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  authorUrl?: string;
  url: string;
}

/**
 * Generate Article/BlogPosting schema for blog posts
 */
export function generateArticleSchema(
  options: ArticleSchemaOptions
): JsonLdObject {
  const {
    headline,
    description,
    image,
    datePublished,
    dateModified,
    authorName,
    authorUrl,
    url,
  } = options;

  return {
    "@type": "BlogPosting",
    headline,
    description,
    ...(image && { image }),
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: authorName,
      ...(authorUrl && { url: authorUrl }),
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

interface FAQPageSchemaOptions {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

/**
 * Generate FAQPage schema for FAQ pages
 */
export function generateFAQPageSchema(
  options: FAQPageSchemaOptions
): JsonLdObject {
  const { questions } = options;

  return {
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
}

interface HowToSchemaOptions {
  name: string;
  description: string;
  image?: string;
  totalTime?: string;
  steps: Array<{
    name: string;
    text: string;
    image?: string;
  }>;
}

/**
 * Generate HowTo schema for tutorial pages
 */
export function generateHowToSchema(
  options: HowToSchemaOptions
): JsonLdObject {
  const { name, description, image, totalTime, steps } = options;

  return {
    "@type": "HowTo",
    name,
    description,
    ...(image && { image }),
    ...(totalTime && { totalTime }),
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image }),
    })),
  };
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generate BreadcrumbList schema from path segments.
 * Items should be ordered from root to current page.
 */
export function generateBreadcrumbSchema(
  items: BreadcrumbItem[],
): JsonLdObject {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Wrap multiple schemas in @graph for homepage
 */
export function wrapInGraph(schemas: JsonLdObject[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@graph": schemas,
  };
}

/**
 * Wrap single schema with @context
 */
export function wrapSchema(schema: JsonLdObject): JsonLdObject {
  return {
    "@context": "https://schema.org",
    ...schema,
  };
}
