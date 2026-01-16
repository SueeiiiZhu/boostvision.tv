import { fetchStrapi, buildStrapiQuery } from "../client";
import { FAQ } from "../../../types/strapi";

export async function getFAQs(params: {
  appSlug?: string;
  category?: string;
  limit?: number;
  locale?: string;
} = {}) {
  const query = buildStrapiQuery({
    populate: ["app"],
    filters: {
      ...(params.appSlug && { app: { slug: { $eq: params.appSlug } } }),
      ...(params.category && { category: { $eq: params.category } }),
    },
    pagination: {
      pageSize: params.limit || 100,
    },
    sort: ["order:asc", "createdAt:desc"],
    locale: params.locale,
  });

  return fetchStrapi<FAQ[]>(`/faqs${query}`);
}

export async function getFAQBySlug(slug: string, locale?: string) {
  const query = buildStrapiQuery({
    populate: ["app", "seo"],
    filters: {
      slug: { $eq: slug },
    },
    locale,
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
