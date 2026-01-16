import { fetchStrapi, buildStrapiQuery } from "../client";
import { App } from "../../../types/strapi";

export async function getApps(params: {
  type?: 'screen-mirroring' | 'tv-remote';
  isFeatured?: boolean;
  limit?: number;
  locale?: string;
} = {}) {
  const query = buildStrapiQuery({
    populate: ["icon", "features"],
    filters: {
      ...(params.type && { type: { $eq: params.type } }),
      ...(params.isFeatured !== undefined && { isFeatured: { $eq: params.isFeatured } }),
    },
    pagination: {
      pageSize: params.limit || 100,
    },
    sort: ["order:asc", "createdAt:desc"],
    locale: params.locale,
  });

  return fetchStrapi<App[]>(`/apps${query}`);
}

export async function getAppBySlug(slug: string, locale?: string) {
  const query = buildStrapiQuery({
    populate: ["icon", "screenshots", "heroImage", "features", "seo"],
    filters: {
      slug: { $eq: slug },
    },
    locale,
  });

  const response = await fetchStrapi<App[]>(`/apps${query}`);
  return response.data?.[0] || null;
}

export async function getAppSlugs() {
  const query = buildStrapiQuery({
    fields: ["slug"],
    pagination: {
      pageSize: 1000,
    },
  });

  const response = await fetchStrapi<App[]>(`/apps${query}`);
  return response.data.map((app) => app.slug);
}
