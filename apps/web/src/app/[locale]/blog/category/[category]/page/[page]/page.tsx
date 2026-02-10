import { notFound } from "next/navigation";
import { getBlogPosts, getBlogCategories } from "@/lib/strapi/api/blog";
import { getPageBySlug } from "@/lib/strapi/api/pages";
import { HeroSection, CTASection } from "@/types/strapi";
import { BlogList } from "../../../../_components";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ category: string; page: string }>;
}

// Allow dynamic params for pages beyond those generated at build time
export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, page } = await params;
  const pageNumber = parseInt(page, 10);

  // Fetch category info
  const categoriesResponse = await getBlogCategories();
  const categories = categoriesResponse?.data || [];
  const currentCategory = categories.find((cat) => cat.slug === category);

  const categoryName = currentCategory?.name || category;

  return {
    title: `${categoryName} - Page ${pageNumber} | BoostVision Blog`,
    description: `Browse ${categoryName} articles - Page ${pageNumber}. Stay updated with the latest news and guides.`,
    openGraph: {
      title: `${categoryName} - Page ${pageNumber} | BoostVision Blog`,
      description: `Expert insights and guides about ${categoryName}.`,
      images: [],
    },
  };
}

export async function generateStaticParams() {
  const categoriesResponse = await getBlogCategories();
  const categories = categoriesResponse?.data || [];

  const params = [];

  for (const cat of categories) {
    // Fetch posts for this category to get page count
    const postsResponse = await getBlogPosts({
      limit: 12,
      page: 1,
      categorySlug: cat.slug,
    });

    const totalPages = postsResponse?.meta?.pagination?.pageCount || 1;

    // Generate params for pages 2 and onwards (page 1 is handled by /blog/category/[category])
    for (let i = 2; i <= totalPages; i++) {
      params.push({
        category: cat.slug,
        page: i.toString(),
      });
    }
  }

  return params;
}

export default async function BlogCategoryPagePaginated({ params }: Props) {
  const { category, page } = await params;
  const pageNumber = parseInt(page, 10);

  // Validate page number
  if (isNaN(pageNumber) || pageNumber < 2) {
    notFound();
  }

  const [postsResponse, categoriesResponse, pageData] = await Promise.all([
    getBlogPosts({
      limit: 12,
      page: pageNumber,
      categorySlug: category,
    }),
    getBlogCategories(),
    getPageBySlug("blog").catch(() => null),
  ]).catch(() => [null, null, null]);

  const posts = postsResponse?.data || [];
  const pagination = postsResponse?.meta?.pagination;
  const categories = categoriesResponse?.data || [];
  const sections = pageData?.sections || [];

  // Verify category exists
  const categoryExists = categories.some((cat) => cat.slug === category);
  if (!categoryExists) {
    notFound();
  }

  // If page number exceeds total pages, show 404
  if (pagination && pageNumber > pagination.pageCount) {
    notFound();
  }

  const heroSection = sections.find((s) => s.__component === "sections.hero") as HeroSection | undefined;
  const ctaSection = sections.find((s) => s.__component === "sections.cta") as CTASection | undefined;

  return (
    <BlogList
      posts={posts}
      categories={categories}
      currentCategory={category}
      currentPage={pageNumber}
      totalPages={pagination?.pageCount || 1}
      heroSection={heroSection}
      ctaSection={ctaSection}
    />
  );
}
