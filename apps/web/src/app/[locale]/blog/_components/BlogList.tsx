import Link from "next/link";
import { BlogPost, BlogCategory, HeroSection, CTASection } from "@/types/strapi";
import { cn } from "@/lib/utils";
import { BlogCard } from "./BlogCard";
import { Pagination } from "./Pagination";

interface BlogListProps {
  posts: BlogPost[];
  categories: BlogCategory[];
  currentCategory?: string; // "all" or category slug
  currentPage: number;
  totalPages: number;
  heroSection?: HeroSection;
  ctaSection?: CTASection;
}

export function BlogList({
  posts,
  categories,
  currentCategory = "all",
  currentPage,
  totalPages,
  heroSection,
  ctaSection,
}: BlogListProps) {
  // Generate base URL for pagination
  const baseUrl = currentCategory === "all" ? "/blog" : `/blog/category/${currentCategory}`;

  return (
    <main className="bg-white">
      {/* Banner */}
      <section className="bg-app-hero py-24 text-center">
        <div className="container-custom">
          <h1 className="mb-4 text-[40px] font-black text-white uppercase tracking-tight">
            {heroSection?.title || "BLOG"}
          </h1>
          <p className="mx-auto max-w-[700px] text-[20px] text-white/70 leading-relaxed">
            {heroSection?.subtitle || "Acquire informations about streaming application, level up your entertainment experience."}
          </p>
        </div>
      </section>

      {/* Categories & Posts */}
      <section className="py-24">
        <div className="container-custom">
          {/* Category Filter - Temporarily Hidden */}
          {/* TODO: Re-enable when category feature is ready */}
          {/* <div className="mb-16 flex flex-wrap justify-center gap-4">
            <Link
              href="/blog"
              scroll={false}
              className={cn(
                "rounded-full px-10 py-3 text-[16px] font-bold shadow-xl transition-all hover:translate-y-[-2px]",
                currentCategory === "all"
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-100 text-heading hover:bg-section-bg card-shadow"
              )}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/blog/category/${cat.slug}`}
                scroll={false}
                className={cn(
                  "rounded-full px-10 py-3 text-[16px] font-bold shadow-xl transition-all hover:translate-y-[-2px]",
                  currentCategory === cat.slug
                    ? "bg-primary text-white"
                    : "bg-white border border-gray-100 text-heading hover:bg-section-bg card-shadow"
                )}
              >
                {cat.name}
              </Link>
            ))}
          </div> */}

          {/* Posts Grid */}
          <div className="min-h-[600px]">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
              {posts.length > 0 ? (
                posts.map((post) => <BlogCard key={post.id} post={post} />)
              ) : (
                <div className="col-span-full py-20 text-center">
                  <p className="text-[18px] text-muted">No blog posts found in this category.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  baseUrl={baseUrl}
                />
              </div>
            )}
          </div>

          {/* Support CTA Section */}
          <div className="mt-32 p-16 text-center">
            <h3 className="text-[32px] font-black text-heading mb-12">
              {ctaSection?.title}
            </h3>

            {/* Links as Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
              {ctaSection?.links && ctaSection.links.length > 0 ? (
                ctaSection.links.map((link) => (
                  <Link
                    key={link.id}
                    href={link.href}
                    className="inline-flex items-center justify-center px-10 py-4 text-[18px] font-bold text-heading bg-white border-2 border-gray-200 rounded-full hover:border-primary hover:text-primary transition-all"
                  >
                    {link.name}
                  </Link>
                ))
              ) : (
                <>
                  <Link
                    href="/tutorial"
                    className="inline-flex items-center justify-center px-10 py-4 text-[18px] font-bold text-heading bg-white border-2 border-gray-200 rounded-full hover:border-primary hover:text-primary transition-all"
                  >
                    Tutorial
                  </Link>
                  <Link
                    href="/faq"
                    className="inline-flex items-center justify-center px-10 py-4 text-[18px] font-bold text-heading bg-white border-2 border-gray-200 rounded-full hover:border-primary hover:text-primary transition-all"
                  >
                    FAQ
                  </Link>
                </>
              )}
            </div>

            {/* Description with Email */}
            <p className="text-[18px] text-muted leading-relaxed">
              {ctaSection?.description || "If you have any thoughts and questions, you can contact us at:"}{" "}
              <a
                href={ctaSection?.buttonLink ? (ctaSection.buttonLink.startsWith('mailto:') ? ctaSection.buttonLink : `mailto:${ctaSection.buttonLink}`) : "mailto:support@boostvision.com.cn"}
                className="text-primary hover:underline font-bold"
              >
                {ctaSection?.buttonText || "support@boostvision.com.cn"}
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
