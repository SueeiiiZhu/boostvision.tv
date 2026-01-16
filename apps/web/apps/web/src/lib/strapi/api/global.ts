import { fetchStrapi, buildStrapiQuery } from "../client";
import { GlobalSetting } from "../../../types/strapi";

export async function getGlobalSetting() {
  const query = buildStrapiQuery({
    populate: ["logo", "favicon", "socialLinks", "statistics"],
  });

  const response = await fetchStrapi<GlobalSetting>(`/global-setting${query}`);
  return response.data;
}

