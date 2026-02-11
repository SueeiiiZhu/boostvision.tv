import { fetchStrapi, buildStrapiQuery } from "../client";
import { FAQ } from "../../../types/strapi";

export async function getFAQs(params: {
  appSlug?: string;
  appType?: 'screen-mirroring' | 'tv-remote';
  category?: string;
  limit?: number;
} = {}) {
  const query = buildStrapiQuery({
    populate: {
      app: {
        populate: ['icon']
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

  return fetchStrapi<FAQ[]>(`/faqs${query}`);
}

export async function getFAQBySlug(slug: string) {
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
      seo: true
    },
    filters: {
      slug: { $eq: slug },
    },
  });

  const response = await fetchStrapi<FAQ[]>(`/faqs${query}`);
  return response.data?.[0] || null;
}

export async function getFAQSlugs() {
  const query = buildStrapiQuery({
    fields: ["slug"],
    pagination: {
      pageSize: 1000,
    },
  });

  const response = await fetchStrapi<FAQ[]>(`/faqs${query}`);
  return response.data.map((item) => item.slug);
}
