import Link from "next/link";
import Image from "next/image";
import { BlogPost, BlogCategory, HeroSection, CTASection } from "@/types/strapi";
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
  currentCategory = "all",
  currentPage,
  totalPages,
  heroSection,
  ctaSection,
}: BlogListProps) {
  // Generate base URL for pagination
  const baseUrl = currentCategory === "all" ? "/blog" : `/blog/category/${currentCategory}`;
  const descriptionList = (ctaSection?.description || "")
    .split("\n")
    .map((line) => line.trim().replace(/^[-*•]\s*/, ""))
    .filter(Boolean);

  return (
    <main className="bg-white poppins-headings">
      {/* Banner */}
      <section className="bg-app-hero py-12 text-center">
        <div className="container-custom">
          <h1 className="mb-4 text-[40px] font-black text-white tracking-tight">
            {heroSection?.title || "Blogs"}
          </h1>
          <p className="mx-auto max-w-[700px] text-[16px] md:text-[20px] text-white/70 leading-relaxed">
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

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-h-[600px] px-4 py-4 -mx-4 -my-4">
              <div className="grid grid-cols-1 gap-8 animate-fade-in">
                {posts.length > 0 ? (
                  posts.map((post) => <BlogCard key={post.id} post={post} />)
                ) : (
                  <div className="col-span-full py-20 text-center">
                    <p className="text-[18px] text-muted">No blog posts found in this category.</p>
                  </div>
                )}
              </div>

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

            <aside className="lg:sticky lg:top-28 lg:h-fit">
              <div className="rounded-[28px] border-2 border-primary/40 bg-section-bg-cta p-6">
                <Image
                  src="/logo.svg"
                  alt="BoostVision Logo"
                  width={220}
                  height={56}
                  className="h-auto w-[180px]"
                  priority={false}
                />
                <p className="mt-5 text-[22px] font-bold leading-[1.3] text-heading/90">
                  {ctaSection?.title || "Best TV app suite"}
                </p>
                <ul className="mt-6 list-outside list-[square] space-y-2.5 pl-6 text-[18px] leading-[1.4] text-muted marker:text-heading/70">
                  {descriptionList.length > 0 ? (
                    descriptionList.map((line, index) => (
                      <li key={`${line}-${index}`}>{line}</li>
                    ))
                  ) : (
                    <>
                      <li>Fast, stable casting</li>
                      <li>Low-latency screen mirror</li>
                      <li>Easy setup on TV and desktop</li>
                    </>
                  )}
                </ul>
                <Link
                  href={ctaSection?.buttonLink || "/download"}
                  className="btn-gradient mt-8 inline-flex w-full px-7 py-2.5 text-[22px] font-medium leading-[1.2]"
                >
                  {ctaSection?.buttonText || "Download Now"}
                </Link>
                {ctaSection?.links && ctaSection.links.length > 0 && (
                  <div className="mt-5 flex flex-col gap-2">
                    {ctaSection.links.map((link) => (
                      <Link
                        key={link.id}
                        href={link.href || "#"}
                        className="text-[15px] leading-[1.4] text-primary underline underline-offset-2 hover:text-primary/80"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
