import { fetchStrapi, buildStrapiQuery } from "../client";
import { CACHE_TAGS, pageTag } from "../cacheTags";
import { Page } from "../../../types/strapi";
import { getLegalRevalidate } from "../revalidate";
import { normalizePage } from "../normalize";

const PAGE_POPULATE = {
  seo: true,
  sections: {
    on: {
      "sections.hero": {
        populate: {
          image: true,
          backgroundImage: true,
          statistics: true,
        },
      },
      "sections.why-choose": {
        populate: {
          features: {
            populate: ["icon"],
          },
        },
      },
      "sections.feature-highlight": {
        populate: ["image"],
      },
      "sections.statistics": {
        populate: {
          stats: true,
        },
      },
      "sections.reviews": {
        populate: {
          reviews: true,
        },
      },
      "sections.cta": true,
      "sections.apps-grid": true,
      "sections.brands-grid": {
        populate: {
          brands: {
            populate: ["icon"],
          },
        },
      },
      "sections.apps-filter": {
        populate: ["screenMirroringIcon", "tvRemoteIcon"],
      },
    },
  },
};

export async function getPageBySlug(slug: string, locale: string = "en") {
  const query = buildStrapiQuery({
    locale,
    populate: PAGE_POPULATE,
    filters: {
      slug: { $eq: slug },
    },
  });

  const response = await fetchStrapi<Page[]>(`/pages${query}`, {
    tags: [CACHE_TAGS.pages, pageTag(slug)],
  });

  if (response.data?.length === 0 && locale !== "en") {
    const fallbackQuery = buildStrapiQuery({
      locale: "en",
      populate: PAGE_POPULATE,
      filters: {
        slug: { $eq: slug },
      },
    });

    const fallbackResponse = await fetchStrapi<Page[]>(`/pages${fallbackQuery}`, {
      tags: [CACHE_TAGS.pages, pageTag(slug)],
      silent: true,
    });

    return normalizePage(fallbackResponse.data?.[0] || null);
  }

  return normalizePage(response.data?.[0] || null);
}

export async function getLegalPageBySlug(slug: "terms-of-use" | "privacy-policy") {
  const query = buildStrapiQuery({
    fields: ["title", "slug", "content"],
    populate: {
      seo: true,
      sections: {
        on: {
          "sections.cta": true,
          "sections.hero": {
            populate: ["backgroundImage", "image"]
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
    revalidate: getLegalRevalidate(),
  });

  return normalizePage(response.data?.[0] || null);
}
