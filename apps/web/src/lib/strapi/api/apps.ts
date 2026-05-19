import { fetchStrapi, buildStrapiQuery } from "../client";
import { CACHE_TAGS, appTag } from "../cacheTags";
import { App } from "../../../types/strapi";
import { normalizeApp, normalizeApps } from "../normalize";

export async function getApps(params: {
  type?: 'screen-mirroring' | 'tv-remote';
  isFeatured?: boolean;
  limit?: number;
  locale?: string;
} = {}) {
  const query = buildStrapiQuery({
    ...(params.locale && { locale: params.locale }),
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

  const response = await fetchStrapi<App[]>(`/apps${query}`, {
    tags: [CACHE_TAGS.apps],
  });

  return {
    ...response,
    data: normalizeApps(response.data),
  };
}

export async function getAppBySlug(slug: string, locale: string = "en") {
  const populate = {
    icon: true,
    screenshots: true,
    heroImage: true,
    downloadLinks: {
      populate: ["badge"]
    },
    features: {
      populate: ["icon"]
    },
    sections: {
      on: {
        "sections.hero": {
          populate: ["backgroundImage", "image", "statistics"]
        },
        "sections.why-choose": {
          populate: {
            features: {
              populate: ["icon"]
            }
          }
        },
        "sections.feature-highlight": {
          populate: ["image"]
        },
        "sections.statistics": {
          populate: {
            stats: true
          }
        },
        "sections.reviews": {
          populate: {
            reviews: true
          }
        },
        "sections.cta": {
          populate: ["links"]
        },
        "sections.apps-grid": true,
        "sections.brands-grid": {
          populate: {
            brands: {
              populate: ["icon"]
            }
          }
        }
      }
    },
    seo: {
      populate: ["metaImage"]
    }
  };

  // Step 1: resolve by non-localized slug
  const query = buildStrapiQuery({
    populate,
    filters: {
      slug: { $eq: slug },
    },
  });

  const response = await fetchStrapi<App[]>(`/apps${query}`, {
    tags: [CACHE_TAGS.apps, appTag(slug)],
  });
  const defaultApp = response.data?.[0];
  if (!defaultApp) return null;

  // Step 2: if locale is not default, fetch localized record by documentId
  if (locale !== "en") {
    const localizedQuery = buildStrapiQuery({ locale, populate });
    try {
      const localizedResponse = await fetchStrapi<App>(
        `/apps/${defaultApp.documentId}${localizedQuery}`,
        {
          tags: [CACHE_TAGS.apps, appTag(slug)],
        }
      );
      if (localizedResponse.data) return normalizeApp(localizedResponse.data);
    } catch {
      // Localized app not available; fall back to default locale content
    }
  }

  return normalizeApp(defaultApp);
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
