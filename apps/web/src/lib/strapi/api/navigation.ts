import { fetchStrapi, buildStrapiQuery } from "../client";
import { Navigation } from "../../../types/strapi";

export async function getNavigation(locale: string = 'en') {
  const query = buildStrapiQuery({
    locale,
    populate: {
      headerMenu: {
        populate: ['links']
      },
      footerColumns: {
        populate: ['links']
      },
      bottomMenu: true
    }
  });

  const response = await fetchStrapi<Navigation>(`/navigation${query}`);
  return response.data;
}
