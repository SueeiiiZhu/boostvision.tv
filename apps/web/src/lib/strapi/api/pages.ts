import { fetchStrapi, buildStrapiQuery } from "../client";
import { CACHE_TAGS, pageTag } from "../cacheTags";
import { Page } from "../../../types/strapi";

export async function getPageBySlug(slug: string) {
  const query = buildStrapiQuery({
    populate: {
      seo: true,
      sections: {
        on: {
          'sections.hero': {
            populate: '*'
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
          },
          'sections.apps-filter': {
            populate: ['screenMirroringIcon', 'tvRemoteIcon']
          }
        }
      }
    },
    filters: {
      slug: { $eq: slug },
    },
  });

  const response = await fetchStrapi<Page[]>(`/pages${query}`, {
    tags: [CACHE_TAGS.pages, pageTag(slug)],
  });
  return response.data?.[0] || null;
}
