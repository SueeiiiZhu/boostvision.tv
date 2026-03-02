import { fetchStrapi, buildStrapiQuery } from "../client";
import { CACHE_TAGS, appTag } from "../cacheTags";
import { App } from "../../../types/strapi";

export async function getApps(params: {
  type?: 'screen-mirroring' | 'tv-remote';
  isFeatured?: boolean;
  limit?: number;
} = {}) {
  const query = buildStrapiQuery({
    populate: {
      icon: true,
      features: true,
      downloadLinks: {
        populate: ['badge']
      }
    },
    filters: {
      ...(params.type && { type: { $eq: params.type } }),
      ...(params.isFeatured !== undefined && { isFeatured: { $eq: params.isFeatured } }),
    },
    pagination: {
      pageSize: params.limit || 100,
    },
    sort: ["order:asc", "createdAt:desc"],
  });

  return fetchStrapi<App[]>(`/apps${query}`, {
    tags: [CACHE_TAGS.apps],
  });
}

export async function getAppBySlug(slug: string) {
  const query = buildStrapiQuery({
    populate: {
      icon: true,
      screenshots: true,
      heroImage: true,
      downloadLinks: {
        populate: ['badge']
      },
      features: {
        populate: ['icon']
      },
      sections: {
        on: {
          'sections.hero': {
            populate: ['backgroundImage', 'image', 'statistics']
          },
          'sections.why-choose': {
            populate: {
              features: {
                populate: ['icon']
              }
            }
          },
          'sections.feature-highlight': {
            populate: ['image']
          },
          'sections.statistics': {
            populate: {
              stats: true
            }
          },
          'sections.reviews': {
            populate: {
              reviews: true
            }
          },
          'sections.cta': {
            populate: ['links']
          },
          'sections.apps-grid': true,
          'sections.brands-grid': {
            populate: {
              brands: {
                populate: ['icon']
              }
            }
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

  const response = await fetchStrapi<App[]>(`/apps${query}`, {
    tags: [CACHE_TAGS.apps, appTag(slug)],
  });
  return response.data?.[0] || null;
}

export async function getAppSlugs() {
  const query = buildStrapiQuery({
    fields: ["slug"],
    pagination: {
      pageSize: 1000,
    },
  });

  const response = await fetchStrapi<App[]>(`/apps${query}`, {
    tags: [CACHE_TAGS.apps],
  });
  return response.data.map((app) => app.slug);
}
