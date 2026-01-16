import { fetchStrapi, buildStrapiQuery } from "../client";
import { Page } from "../../../types/strapi";

export async function getPageBySlug(slug: string, locale?: string) {
  const query = buildStrapiQuery({
    populate: ["seo"],
    filters: {
      slug: { $eq: slug },
    },
    locale,
  });

  const response = await fetchStrapi<Page[]>(`/pages${query}`);
  return response.data?.[0] || null;
}
