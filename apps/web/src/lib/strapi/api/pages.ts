import { fetchStrapi, buildStrapiQuery } from "../client";
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

  const response = await fetchStrapi<Page[]>(`/pages${query}`);

  // Debug logging
  console.log('[getPageBySlug] Slug:', slug);
  console.log('[getPageBySlug] Response:', JSON.stringify(response, null, 2));
  console.log('[getPageBySlug] Data length:', response.data?.length);

  return response.data?.[0] || null;
}

