import { notFound } from "next/navigation";
import { getBlogPosts, getBlogCategories } from "@/lib/strapi/api/blog";
import { getPageBySlug } from "@/lib/strapi/api/pages";
import { HeroSection, CTASection } from "@/types/strapi";
import { BlogList } from "../../_components";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ page: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page } = await params;
  const pageNumber = parseInt(page, 10);

  return {
    title: `Blog - Page ${pageNumber} | BoostVision`,
    description: `Browse our blog articles - Page ${pageNumber}. Stay updated with the latest news and guides about screen mirroring and TV cast technologies.`,
    openGraph: {
      title: `Blog - Page ${pageNumber} | BoostVision`,
      description: "Expert insights and guides for better smart TV experience.",
      images: [],
    },
  };
}

export async function generateStaticParams() {
  // Fetch total posts to calculate page count
  const postsResponse = await getBlogPosts({ limit: 12, page: 1 });
  const totalPages = postsResponse?.meta?.pagination?.pageCount || 1;

  // Generate params for pages 2 and onwards (page 1 is handled by /blog)
  const params = [];
  for (let i = 2; i <= totalPages; i++) {
    params.push({ page: i.toString() });
  }

  return params;
}

export default async function BlogPagePaginated({ params }: Props) {
  const { page } = await params;
  const pageNumber = parseInt(page, 10);

  // Validate page number
  if (isNaN(pageNumber) || pageNumber < 2) {
    notFound();
  }

  const [postsResponse, categoriesResponse, pageData] = await Promise.all([
    getBlogPosts({
      limit: 12,
      page: pageNumber,
    }),
    getBlogCategories(),
    getPageBySlug("blog").catch(() => null),
  ]).catch(() => [null, null, null]);

  const posts = postsResponse?.data || [];
  const pagination = postsResponse?.meta?.pagination;
  const categories = categoriesResponse?.data || [];
  const sections = pageData?.sections || [];

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
      currentCategory="all"
      currentPage={pageNumber}
      totalPages={pagination?.pageCount || 1}
      heroSection={heroSection}
      ctaSection={ctaSection}
    />
  );
}
