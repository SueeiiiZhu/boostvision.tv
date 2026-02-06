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
        populate: ["coverImage"],
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
  const query = buildStrapiQuery({
    fields: ["slug"],
    pagination: {
      pageSize: 1000,
    },
  });

  const response = await fetchStrapi<BlogPost[]>(`/blog-posts${query}`);
  return response.data.map((post) => post.slug);
}
