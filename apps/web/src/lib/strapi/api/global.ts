import { cache } from 'react';
import { fetchStrapi, buildStrapiQuery } from "../client";
import { CACHE_TAGS, globalSettingLocaleTag } from "../cacheTags";
import { GlobalSetting } from "../../../types/strapi";
import { normalizeGlobalSetting } from "../normalize";

export const getGlobalSetting = cache(async function getGlobalSetting(locale: string = 'en') {
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

  try {
    const response = await fetchStrapi<GlobalSetting>(`/global-setting${query}`, {
      tags: [CACHE_TAGS.globalSetting, globalSettingLocaleTag(locale)],
      silent: locale !== "en",
    });
    return normalizeGlobalSetting(response.data);
  } catch (error) {
    if (locale === "en") {
      console.error("Failed to fetch global settings:", error);
      return null;
    }

    const fallbackLocale = "en";
    const fallbackQuery = buildStrapiQuery({
      locale: fallbackLocale,
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

    try {
      const fallbackResponse = await fetchStrapi<GlobalSetting>(`/global-setting${fallbackQuery}`, {
        tags: [CACHE_TAGS.globalSetting, globalSettingLocaleTag(fallbackLocale)],
      });
      console.warn(`[Strapi] Missing global-setting for locale "${locale}", fallback to "en".`);
      return normalizeGlobalSetting(fallbackResponse.data);
    } catch (fallbackError) {
      console.error(`Failed to fetch global settings for locale "${locale}" and fallback "en":`, fallbackError);
      return null;
    }
  }
});
