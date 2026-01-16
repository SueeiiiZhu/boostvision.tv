import { fetchStrapi, buildStrapiQuery } from "../client";
import { BlogPost, BlogCategory } from "../../../types/strapi";

export async function getBlogPosts(params: {
  categorySlug?: string;
  isFeatured?: boolean;
  limit?: number;
  locale?: string;
} = {}) {
  const query = buildStrapiQuery({
    populate: ["coverImage", "category", "author"],
    filters: {
      ...(params.categorySlug && { category: { slug: { $eq: params.categorySlug } } }),
      ...(params.isFeatured !== undefined && { isFeatured: { $eq: params.isFeatured } }),
    },
    pagination: {
      pageSize: params.limit || 10,
    },
    sort: ["publishedAt:desc"],
    locale: params.locale,
  });

  return fetchStrapi<BlogPost[]>(`/blog-posts${query}`);
}

export async function getBlogPostBySlug(slug: string, locale?: string) {
  const query = buildStrapiQuery({
    populate: ["coverImage", "category", "author", "seo"],
    filters: {
      slug: { $eq: slug },
    },
    locale,
  });

  const response = await fetchStrapi<BlogPost[]>(`/blog-posts${query}`);
  return response.data?.[0] || null;
}

export async function getBlogCategories(locale?: string) {
  const query = buildStrapiQuery({ locale });
  return fetchStrapi<BlogCategory[]>(`/blog-categories${query}`);
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
