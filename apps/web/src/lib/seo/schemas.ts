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
    ...(downloadCount && {
      interactionStatistic: {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/DownloadAction",
        userInteractionCount: downloadCount,
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
