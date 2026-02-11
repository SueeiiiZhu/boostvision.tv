import { notFound } from "next/navigation";
import { getBlogPosts, getBlogCategories } from "@/lib/strapi/api/blog";
import { getPageBySlug } from "@/lib/strapi/api/pages";
import { HeroSection, CTASection } from "@/types/strapi";
import { BlogList } from "../../_components";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;

  // Fetch category info
  const categoriesResponse = await getBlogCategories();
  const categories = categoriesResponse?.data || [];
  const currentCategory = categories.find((cat) => cat.slug === category);

  const categoryName = currentCategory?.name || category;

  return {
    title: `${categoryName} Articles | BoostVision Blog`,
    description: `Browse ${categoryName} articles. Stay updated with the latest news and guides about screen mirroring and TV cast technologies.`,
    alternates: {
      canonical: `https://www.boostvision.tv/blog/category/${category}`,
    },
    openGraph: {
      title: `${categoryName} Articles | BoostVision Blog`,
      description: `Expert insights and guides about ${categoryName}.`,
      url: `https://www.boostvision.tv/blog/category/${category}`,
      images: [],
    },
  };
}

export async function generateStaticParams() {
  const categoriesResponse = await getBlogCategories();
  const categories = categoriesResponse?.data || [];

  return categories.map((cat) => ({
    category: cat.slug,
  }));
}

export default async function BlogCategoryPage({ params }: Props) {
  const { category } = await params;

  const [postsResponse, categoriesResponse, pageData] = await Promise.all([
    getBlogPosts({
      limit: 12,
      page: 1,
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

  const heroSection = sections.find((s) => s.__component === "sections.hero") as HeroSection | undefined;
  const ctaSection = sections.find((s) => s.__component === "sections.cta") as CTASection | undefined;

  return (
    <BlogList
      posts={posts}
      categories={categories}
      currentCategory={category}
      currentPage={1}
      totalPages={pagination?.pageCount || 1}
      heroSection={heroSection}
      ctaSection={ctaSection}
    />
  );
}
