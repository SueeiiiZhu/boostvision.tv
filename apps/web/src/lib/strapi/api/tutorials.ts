import { fetchStrapi, buildStrapiQuery } from "../client";
import { CACHE_TAGS, tutorialTag } from "../cacheTags";
import { Tutorial } from "../../../types/strapi";
import { getTutorialDetailRevalidate, getTutorialRevalidate } from "../revalidate";
import { normalizeTutorial } from "../normalize";

export async function getTutorialsForList(params: {
  appSlug?: string;
  appType?: 'screen-mirroring' | 'tv-remote';
  limit?: number;
  locale?: string;
} = {}) {
  const query = buildStrapiQuery({
    ...(params.locale && { locale: params.locale }),
    fields: ["title", "slug"],
    populate: {
      app: {
        fields: ["name", "slug", "type"],
        populate: {
          icon: true
        }
      }
    },
    filters: {
      ...(params.appSlug && { app: { slug: { $eq: params.appSlug } } }),
      ...(params.appType && { app: { type: { $eq: params.appType } } }),
    },
    pagination: {
      pageSize: params.limit || 100,
    },
    sort: ["order:asc", "createdAt:desc"],
  });

  return fetchStrapi<Tutorial[]>(`/tutorials${query}`, {
    tags: [CACHE_TAGS.tutorials],
    revalidate: getTutorialRevalidate(),
  });
}

export async function getTutorialSeoBySlug(slug: string, locale: string = "en") {
  const populate = {
    app: {
      fields: ["name"]
    },
    seo: {
      populate: ["metaImage"]
    }
  };

  const query = buildStrapiQuery({
    fields: ["title", "slug"],
    populate,
    filters: {
      slug: { $eq: slug },
    },
  });

  const response = await fetchStrapi<Tutorial[]>(`/tutorials${query}`, {
    tags: [CACHE_TAGS.tutorials, tutorialTag(slug)],
    revalidate: getTutorialDetailRevalidate(),
  });
  const defaultTutorial = response.data?.[0];
  if (!defaultTutorial) return null;

  if (locale !== "en") {
    const localizedQuery = buildStrapiQuery({ locale, fields: ["title", "slug"], populate });
    try {
      const localizedResponse = await fetchStrapi<Tutorial>(
        `/tutorials/${defaultTutorial.documentId}${localizedQuery}`,
        {
          tags: [CACHE_TAGS.tutorials, tutorialTag(slug)],
          revalidate: getTutorialDetailRevalidate(),
        }
      );
      if (localizedResponse.data) return normalizeTutorial(localizedResponse.data);
    } catch {
      // Localized tutorial not available; use default locale.
    }
  }

  return normalizeTutorial(defaultTutorial);
}

export async function getTutorialPageBySlug(slug: string, locale: string = "en") {
  const populate = {
    app: {
      populate: {
        icon: true,
        downloadLinks: {
          populate: ["badge"]
        }
      }
    },
    sections: {
      on: {
        "sections.hero": {
          populate: ["backgroundImage", "image"]
        },
        "sections.tutorial-accordion": {
          populate: {
            items: true // blocks fields like iosContent/androidContent are automatic
          }
        },
        "sections.cta": {
          populate: ["links"]
        }
      }
    },
    steps: {
      populate: ["image"]
    },
    seo: {
      populate: ["metaImage"]
    }
  };

  const query = buildStrapiQuery({
    populate,
    filters: {
      slug: { $eq: slug },
    },
  });

  const response = await fetchStrapi<Tutorial[]>(`/tutorials${query}`, {
    tags: [CACHE_TAGS.tutorials, tutorialTag(slug)],
    revalidate: getTutorialDetailRevalidate(),
  });
  const defaultTutorial = response.data?.[0];
  if (!defaultTutorial) return null;

  if (locale !== "en") {
    const localizedQuery = buildStrapiQuery({ locale, populate });
    try {
      const localizedResponse = await fetchStrapi<Tutorial>(
        `/tutorials/${defaultTutorial.documentId}${localizedQuery}`,
        {
          tags: [CACHE_TAGS.tutorials, tutorialTag(slug)],
          revalidate: getTutorialDetailRevalidate(),
        }
      );
      if (localizedResponse.data) return normalizeTutorial(localizedResponse.data);
    } catch {
      // Localized tutorial not available; use default locale.
    }
  }

  return normalizeTutorial(defaultTutorial);
}

export async function getTutorialBySlug(slug: string, locale: string = "en") {
  return getTutorialPageBySlug(slug, locale);
}

export async function getTutorialSlugs() {
  const query = buildStrapiQuery({
    fields: ["slug"],
    pagination: {
      pageSize: 1000,
    },
  });

  const response = await fetchStrapi<Tutorial[]>(`/tutorials${query}`, {
    tags: [CACHE_TAGS.tutorials],
    revalidate: getTutorialDetailRevalidate(),
  });
  return response.data.map((item) => item.slug);
}

export async function getTutorials(params: {
  appSlug?: string;
  appType?: 'screen-mirroring' | 'tv-remote';
  limit?: number;
} = {}) {
  return getTutorialsForList(params);
}
