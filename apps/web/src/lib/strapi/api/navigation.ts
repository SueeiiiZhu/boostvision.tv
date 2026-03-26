import { fetchStrapi, buildStrapiQuery } from "../client";
import { CACHE_TAGS, navigationLocaleTag } from "../cacheTags";
import { Navigation } from "../../../types/strapi";
import { normalizeNavigation } from "../normalize";

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

  const response = await fetchStrapi<Navigation>(`/navigation${query}`, {
    tags: [CACHE_TAGS.navigation, navigationLocaleTag(locale)],
  });
  return normalizeNavigation(response.data);
}
