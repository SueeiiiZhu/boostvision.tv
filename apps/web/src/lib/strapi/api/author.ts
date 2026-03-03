import { fetchStrapi, buildStrapiQuery } from "../client";
import { authorTag, CACHE_TAGS } from "../cacheTags";
import { Author, BlogPost } from "../../../types/strapi";

const authorPopulate = {
  avatar: true,
  socialLinks: true,
};

export async function getAuthorBySlug(slug: string, locale: string = "en") {
  const slugQuery = buildStrapiQuery({
    populate: authorPopulate,
    filters: { slug: { $eq: slug } },
  });

  const slugResponse = await fetchStrapi<Author[]>(`/authors${slugQuery}`, {
    tags: [CACHE_TAGS.authors, authorTag(slug)],
  });
  const defaultAuthor = slugResponse.data?.[0];
  if (!defaultAuthor) return null;

  if (locale !== "en") {
    const localizedQuery = buildStrapiQuery({
      locale,
      populate: authorPopulate,
    });

    try {
      const localizedResponse = await fetchStrapi<Author>(
        `/authors/${defaultAuthor.documentId}${localizedQuery}`,
        { tags: [CACHE_TAGS.authors, authorTag(slug)] }
      );
      if (localizedResponse.data) return localizedResponse.data;
    } catch {
      // Localized author not available, use default locale content.
    }
  }

  return defaultAuthor;
}

export async function getBlogPostsByAuthorSlug(
  slug: string,
  locale: string = "en",
  limit: number = 12,
  page: number = 1
) {
  const query = buildStrapiQuery({
    locale,
    filters: {
      author: {
        slug: { $eq: slug },
      },
    },
    populate: {
      coverImage: true,
      category: true,
      author: {
        populate: ["avatar"],
      },
    },
    sort: ["publishedAt:desc"],
    pagination: {
      page,
      pageSize: limit,
    },
  });

  return fetchStrapi<BlogPost[]>(`/blog-posts${query}`, {
    tags: [CACHE_TAGS.blogPosts, CACHE_TAGS.authors, authorTag(slug)],
  });
}

export async function getAuthorSlugs() {
  let allSlugs: string[] = [];
  let page = 1;
  let hasMore = true;
  const pageSize = 100;

  while (hasMore) {
    const query = buildStrapiQuery({
      fields: ["slug"],
      pagination: {
        page,
        pageSize,
      },
    });

    const response = await fetchStrapi<Author[]>(`/authors${query}`, {
      tags: [CACHE_TAGS.authors],
    });
    const slugs = response.data.map((author) => author.slug).filter(Boolean);
    allSlugs = [...allSlugs, ...slugs];

    const totalPages = response.meta?.pagination?.pageCount || 1;
    hasMore = page < totalPages;
    page++;
  }

  return allSlugs;
}
