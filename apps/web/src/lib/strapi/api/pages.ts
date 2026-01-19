import { fetchStrapi, buildStrapiQuery } from "../client";
import { Page } from "../../../types/strapi";

export async function getPageBySlug(slug: string) {
  const query = buildStrapiQuery({
    populate: {
      seo: true,
      sections: {
        populate: {
          backgroundImage: true,
          image: true,
          icon: true,
          features: {
            populate: ["icon"]
          },
          stats: true,
          reviews: true
        }
      }
    },
    filters: {
      slug: { $eq: slug },
    },
  });

  const response = await fetchStrapi<Page[]>(`/pages${query}`);
  return response.data?.[0] || null;
}

