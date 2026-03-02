import { fetchStrapi, buildStrapiQuery } from "../client";
import { CACHE_TAGS, blogPostTag } from "../cacheTags";
import { BlogPost, BlogCategory } from "../../../types/strapi";

export async function getBlogPosts(params: {
  categorySlug?: string;
  isFeatured?: boolean;
  limit?: number;
  page?: number;
} = {}) {
  const query = buildStrapiQuery({
    populate: {
      coverImage: true,
      category: true,
      author: {
        populate: ["avatar"],
      },
    },
    filters: {
      ...(params.categorySlug && { category: { slug: { $eq: params.categorySlug } } }),
      ...(params.isFeatured !== undefined && { isFeatured: { $eq: params.isFeatured } }),
    },
    pagination: {
      page: params.page || 1,
      pageSize: params.limit || 10,
    },
    sort: ["publishedAt:desc"],
  });

  return fetchStrapi<BlogPost[]>(`/blog-posts${query}`, {
    tags: [CACHE_TAGS.blogPosts],
  });
}

export async function getBlogPostBySlug(slug: string, locale: string = 'en') {
  const populate = {
    coverImage: true,
    category: true,
    author: {
      populate: ["avatar"],
    },
    relatedPosts: {
      populate: {
        coverImage: true,
        author: {
          populate: ["avatar"],
        },
      },
    },
    seo: {
      populate: ['metaImage']
    },
  };

  // Step 1: Find the document by slug (no locale filter — slug is non-localizable)
  const slugQuery = buildStrapiQuery({
    populate,
    filters: { slug: { $eq: slug } },
  });
  const slugResponse = await fetchStrapi<BlogPost[]>(`/blog-posts${slugQuery}`, {
    tags: [CACHE_TAGS.blogPosts, blogPostTag(slug)],
  });
  const defaultPost = slugResponse.data?.[0];
  if (!defaultPost) return null;

  // Step 2: If a non-default locale is requested, fetch the localized version by documentId
  if (locale !== 'en') {
    const localizedQuery = buildStrapiQuery({ locale, populate });
    try {
      const localizedResponse = await fetchStrapi<BlogPost>(
        `/blog-posts/${defaultPost.documentId}${localizedQuery}`,
        {
          tags: [CACHE_TAGS.blogPosts, blogPostTag(slug)],
        }
      );
      if (localizedResponse.data) return localizedResponse.data;
    } catch {
      // Localized version not available, fall back to default
    }
  }

  return defaultPost;
}

export async function getBlogCategories() {
  return fetchStrapi<BlogCategory[]>("/blog-categories", {
    tags: [CACHE_TAGS.blogCategories],
  });
}

export async function getBlogPostSlugs() {
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

    const response = await fetchStrapi<BlogPost[]>(`/blog-posts${query}`, {
      tags: [CACHE_TAGS.blogPosts],
    });
    const slugs = response.data.map((post) => post.slug);
    allSlugs = [...allSlugs, ...slugs];

    // Check if there are more pages
    const totalPages = response.meta?.pagination?.pageCount || 1;
    hasMore = page < totalPages;
    page++;
  }

  return allSlugs;
}
