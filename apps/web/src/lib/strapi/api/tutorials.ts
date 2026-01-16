import { fetchStrapi, buildStrapiQuery } from "../client";
import { Tutorial } from "../../../types/strapi";

export async function getTutorials(params: {
  appSlug?: string;
  limit?: number;
  locale?: string;
} = {}) {
  const query = buildStrapiQuery({
    populate: ["app", "steps", "steps.image"],
    filters: {
      ...(params.appSlug && { app: { slug: { $eq: params.appSlug } } }),
    },
    pagination: {
      pageSize: params.limit || 100,
    },
    sort: ["order:asc", "createdAt:desc"],
    locale: params.locale,
  });

  return fetchStrapi<Tutorial[]>(`/tutorials${query}`);
}

export async function getTutorialBySlug(slug: string, locale?: string) {
  const query = buildStrapiQuery({
    populate: ["app", "steps", "steps.image", "seo"],
    filters: {
      slug: { $eq: slug },
    },
    locale,
  });

  const response = await fetchStrapi<Tutorial[]>(`/tutorials${query}`);
  return response.data?.[0] || null;
}

export async function getTutorialSlugs() {
  const query = buildStrapiQuery({
    fields: ["slug"],
    pagination: {
      pageSize: 1000,
    },
  });

  const response = await fetchStrapi<Tutorial[]>(`/tutorials${query}`);
  return response.data.map((item) => item.slug);
}
