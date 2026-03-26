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
} = {}) {
  const query = buildStrapiQuery({
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

export async function getFAQSeoBySlug(slug: string) {
  const query = buildStrapiQuery({
    fields: ["question", "slug"],
    populate: {
      app: {
        fields: ["name"]
      },
      seo: {
        populate: ["metaImage"]
      }
    },
    filters: {
      slug: { $eq: slug },
    },
  });

  const response = await fetchStrapi<FAQ[]>(`/faqs${query}`, {
    tags: [CACHE_TAGS.faqs, faqTag(slug)],
    revalidate: getFaqDetailRevalidate(),
  });

  return normalizeFaq(response.data?.[0] || null);
}

export async function getFAQPageBySlug(slug: string) {
  const query = buildStrapiQuery({
    fields: ['question', 'slug', 'answer', 'category', 'order'],
    populate: {
      app: {
        populate: {
          icon: true,
          downloadLinks: {
            populate: ['badge']
          }
        }
      },
      sections: {
        on: {
          'sections.hero': {
            populate: ['backgroundImage', 'image']
          },
          'sections.tutorial-accordion': {
            populate: {
              items: true
            }
          },
          'sections.cta': {
            populate: ['links']
          }
        }
      },
      seo: {
        populate: ['metaImage']
      }
    },
    filters: {
      slug: { $eq: slug },
    },
  });

  const response = await fetchStrapi<FAQ[]>(`/faqs${query}`, {
    tags: [CACHE_TAGS.faqs, faqTag(slug)],
    revalidate: getFaqDetailRevalidate(),
  });
  return normalizeFaq(response.data?.[0] || null);
}

export async function getFAQBySlug(slug: string) {
  return getFAQPageBySlug(slug);
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
