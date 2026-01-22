import { fetchStrapi, buildStrapiQuery } from "../client";
import { GlobalSetting } from "../../../types/strapi";

export async function getGlobalSetting(locale: string = 'en') {
  const query = buildStrapiQuery({
    locale,
    populate: ["logo", "favicon", "footerLogo", "socialLinks", "statistics", "googlePlayBadge", "appStoreBadge"],
  });

  const response = await fetchStrapi<GlobalSetting>(`/global-setting${query}`);
  return response.data;
}

