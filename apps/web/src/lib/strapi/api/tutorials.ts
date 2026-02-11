import { fetchStrapi, buildStrapiQuery } from "../client";
import { Tutorial } from "../../../types/strapi";

export async function getTutorials(params: {
  appSlug?: string;
  appType?: 'screen-mirroring' | 'tv-remote';
  limit?: number;
} = {}) {
  const query = buildStrapiQuery({
    populate: {
      app: {
        populate: ['icon']
      },
      steps: {
        populate: ['image']
      }
    },
    filters: {
      ...(params.appSlug && { app: { slug: { $eq: params.appSlug } } }),
      ...(params.appType && { app: { type: { $eq: params.appType } } }),
    },
    pagination: {
      pageSize: params.limit || 100,
    },
    sort: ["order:asc", "createdAt:desc"],
  });

  return fetchStrapi<Tutorial[]>(`/tutorials${query}`);
}

export async function getTutorialBySlug(slug: string) {
  const query = buildStrapiQuery({
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
              items: true // blocks fields like iosContent/androidContent are automatic
            }
          },
          'sections.cta': {
            populate: ['links']
          }
        }
      },
      steps: {
        populate: ['image']
      },
      seo: {
        populate: ['metaImage']
      }
    },
    filters: {
      slug: { $eq: slug },
    },
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
