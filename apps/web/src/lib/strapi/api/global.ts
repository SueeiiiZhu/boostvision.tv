import { fetchStrapi, buildStrapiQuery } from "../client";
import { GlobalSetting } from "../../../types/strapi";

export async function getGlobalSetting(locale: string = 'en') {
  try {
    const query = buildStrapiQuery({
      locale,
      populate: [
        "logo",
        "favicon",
        "footerLogo",
        "socialLinks",
        "statistics",
        "googlePlayBadge",
        "appStoreBadge",
        "defaultSeo",
        "defaultSeo.metaImage"
      ],
    });

    const response = await fetchStrapi<GlobalSetting>(`/global-setting${query}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch global settings:", error);
    return null;
  }
}

