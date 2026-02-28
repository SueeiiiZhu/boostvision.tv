import { getBlogPosts, getBlogCategories } from "@/lib/strapi/api/blog";
import { getPageBySlug } from "@/lib/strapi/api/pages";
import { HeroSection, CTASection } from "@/types/strapi";
import { getLocaleAlternates } from "@/lib/seo";
import { BlogList } from "./_components";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const alternates = getLocaleAlternates("/blog", locale);

  return {
    title: "Streaming & Screen Mirroring Blog | BoostVision",
    description: "Stay updated with the latest news and guides about screen mirroring, TV cast technologies, and smart home entertainment.",
    alternates,
    openGraph: {
      title: "Streaming & Screen Mirroring Blog | BoostVision",
      description: "Expert insights and guides for better smart TV experience.",
      url: alternates.canonical,
      images: [],
    },
  };
}

export default async function BlogPage() {
  const [postsResponse, categoriesResponse, pageData] = await Promise.all([
    getBlogPosts({
      limit: 12,
      page: 1,
    }),
    getBlogCategories(),
    getPageBySlug("blog").catch(() => null),
  ]).catch(() => [null, null, null]);

  const posts = postsResponse?.data || [];
  const pagination = postsResponse?.meta?.pagination;
  const categories = categoriesResponse?.data || [];
  const sections = pageData?.sections || [];

  const heroSection = sections.find((s) => s.__component === "sections.hero") as HeroSection | undefined;
  const ctaSection = sections.find((s) => s.__component === "sections.cta") as CTASection | undefined;

  return (
    <BlogList
      posts={posts}
      categories={categories}
      currentCategory="all"
      currentPage={1}
      totalPages={pagination?.pageCount || 1}
      heroSection={heroSection}
      ctaSection={ctaSection}
    />
  );
}
