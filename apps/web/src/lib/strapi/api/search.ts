import { fetchStrapi, buildStrapiQuery } from "../client";
import { App, BlogPost } from "../../../types/strapi";

export interface SearchResults {
  apps: App[];
  blogs: BlogPost[];
}

export async function globalSearch(query: string, locale?: string): Promise<SearchResults> {
  if (!query || query.length < 2) {
    return { apps: [], blogs: [] };
  }

  // Search in Apps (name, shortDescription)
  const appsQuery = buildStrapiQuery({
    filters: {
      $or: [
        { name: { $containsi: query } },
        { shortDescription: { $containsi: query } },
      ],
    },
    populate: ["icon"],
    pagination: { pageSize: 5 },
    locale,
  });

  // Search in Blogs (title, excerpt)
  const blogsQuery = buildStrapiQuery({
    filters: {
      $or: [
        { title: { $containsi: query } },
        { excerpt: { $containsi: query } },
      ],
    },
    populate: ["coverImage", "category"],
    pagination: { pageSize: 5 },
    locale,
  });

  const [appsResponse, blogsResponse] = await Promise.all([
    fetchStrapi<App[]>(`/apps${appsQuery}`),
    fetchStrapi<BlogPost[]>(`/blog-posts${blogsQuery}`),
  ]).catch(() => [{ data: [] }, { data: [] }]);

  return {
    apps: appsResponse.data || [],
    blogs: blogsResponse.data || [],
  };
}
