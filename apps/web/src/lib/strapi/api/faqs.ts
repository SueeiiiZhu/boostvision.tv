import { fetchStrapi, buildStrapiQuery } from "../client";
import { CACHE_TAGS, faqTag } from "../cacheTags";
import { FAQ } from "../../../types/strapi";
import { getFaqDetailRevalidate, getFaqRevalidate } from "../revalidate";
import { normalizeFaq } from "../normalize";

export async function getFAQsForList(params: {
  appSlug?: string;
  appType?: 'screen-mirroring' | 'tv-remote';
  category?: string;
  limit?: number;
  locale?: string;
} = {}) {
  const query = buildStrapiQuery({
    ...(params.locale && { locale: params.locale }),
    fields: ["question", "slug"],
    populate: {
      app: {
        fields: ["name", "slug", "type"],
        populate: {
          icon: true
        }
      }
    },
    filters: {
      ...(params.appSlug && { app: { slug: { $eq: params.appSlug } } }),
      ...(params.appType && { app: { type: { $eq: params.appType } } }),
      ...(params.category && { category: { $eq: params.category } }),
    },
    pagination: {
      pageSize: params.limit || 100,
    },
    sort: ["order:asc", "createdAt:desc"],
  });

  return fetchStrapi<FAQ[]>(`/faqs${query}`, {
    tags: [CACHE_TAGS.faqs],
    revalidate: getFaqRevalidate(),
  });
}

export async function getFAQSeoBySlug(slug: string, locale: string = "en") {
  const populate = {
    app: {
      fields: ["name"]
    },
    seo: {
      populate: ["metaImage"]
    }
  };

  const query = buildStrapiQuery({
    fields: ["question", "slug"],
    populate,
    filters: {
      slug: { $eq: slug },
    },
  });

  const response = await fetchStrapi<FAQ[]>(`/faqs${query}`, {
    tags: [CACHE_TAGS.faqs, faqTag(slug)],
    revalidate: getFaqDetailRevalidate(),
  });
  const defaultFaq = response.data?.[0];
  if (!defaultFaq) return null;

  if (locale !== "en") {
    const localizedQuery = buildStrapiQuery({ locale, fields: ["question", "slug"], populate });
    try {
      const localizedResponse = await fetchStrapi<FAQ>(
        `/faqs/${defaultFaq.documentId}${localizedQuery}`,
        {
          tags: [CACHE_TAGS.faqs, faqTag(slug)],
          revalidate: getFaqDetailRevalidate(),
        }
      );
      if (localizedResponse.data) return normalizeFaq(localizedResponse.data);
    } catch {
      // Localized FAQ not available; use default locale.
    }
  }

  return normalizeFaq(defaultFaq);
}

export async function getFAQPageBySlug(slug: string, locale: string = "en") {
  const populate = {
    app: {
      populate: {
        icon: true,
        downloadLinks: {
          populate: ["badge"]
        }
      }
    },
    sections: {
      on: {
        "sections.hero": {
          populate: ["backgroundImage", "image"]
        },
        "sections.tutorial-accordion": {
          populate: {
            items: true
          }
        },
        "sections.cta": {
          populate: ["links"]
        }
      }
    },
    seo: {
      populate: ["metaImage"]
    }
  };

  const query = buildStrapiQuery({
    fields: ['question', 'slug', 'answer', 'category', 'order'],
    populate,
    filters: {
      slug: { $eq: slug },
    },
  });

  const response = await fetchStrapi<FAQ[]>(`/faqs${query}`, {
    tags: [CACHE_TAGS.faqs, faqTag(slug)],
    revalidate: getFaqDetailRevalidate(),
  });
  const defaultFaq = response.data?.[0];
  if (!defaultFaq) return null;

  if (locale !== "en") {
    const localizedQuery = buildStrapiQuery({
      locale,
      fields: ["question", "slug", "answer", "category", "order"],
      populate,
    });
    try {
      const localizedResponse = await fetchStrapi<FAQ>(
        `/faqs/${defaultFaq.documentId}${localizedQuery}`,
        {
          tags: [CACHE_TAGS.faqs, faqTag(slug)],
          revalidate: getFaqDetailRevalidate(),
        }
      );
      if (localizedResponse.data) return normalizeFaq(localizedResponse.data);
    } catch {
      // Localized FAQ not available; use default locale.
    }
  }

  return normalizeFaq(defaultFaq);
}

export async function getFAQBySlug(slug: string, locale: string = "en") {
  return getFAQPageBySlug(slug, locale);
}

export async function getFAQSlugs() {
  const query = buildStrapiQuery({
    fields: ["slug"],
    pagination: {
      pageSize: 1000,
    },
  });

  const response = await fetchStrapi<FAQ[]>(`/faqs${query}`, {
    tags: [CACHE_TAGS.faqs],
    revalidate: getFaqDetailRevalidate(),
  });
  return response.data.map((item) => item.slug);
}

export async function getFAQs(params: {
  appSlug?: string;
  appType?: 'screen-mirroring' | 'tv-remote';
  category?: string;
  limit?: number;
} = {}) {
  return getFAQsForList(params);
}
