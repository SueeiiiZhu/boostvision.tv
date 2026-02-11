import { fetchStrapi, buildStrapiQuery } from "../client";
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

  return fetchStrapi<BlogPost[]>(`/blog-posts${query}`);
}

export async function getBlogPostBySlug(slug: string) {
  const query = buildStrapiQuery({
    populate: {
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
      seo: true,
    },
    filters: {
      slug: { $eq: slug },
    },
  });

  const response = await fetchStrapi<BlogPost[]>(`/blog-posts${query}`);
  return response.data?.[0] || null;
}

export async function getBlogCategories() {
  return fetchStrapi<BlogCategory[]>("/blog-categories");
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

    const response = await fetchStrapi<BlogPost[]>(`/blog-posts${query}`);
    const slugs = response.data.map((post) => post.slug);
    allSlugs = [...allSlugs, ...slugs];

    // Check if there are more pages
    const totalPages = response.meta?.pagination?.pageCount || 1;
    hasMore = page < totalPages;
    page++;
  }

  return allSlugs;
}
