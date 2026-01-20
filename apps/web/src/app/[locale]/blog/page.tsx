import Link from "next/link";
import Image from "next/image";
import { getBlogPosts, getBlogCategories } from "@/lib/strapi/api/blog";
import { BlogPost } from "@/types/strapi";
import { formatDate } from "@/lib/utils/formatDate";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Streaming & Screen Mirroring Blog | BoostVision",
  description: "Stay updated with the latest news and guides about screen mirroring, TV cast technologies, and smart home entertainment.",
  openGraph: {
    title: "Streaming & Screen Mirroring Blog | BoostVision",
    description: "Expert insights and guides for better smart TV experience.",
  },
};

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function BlogPage({ searchParams }: Props) {
  const { category: categorySlug = "all" } = await searchParams;

  const [postsResponse, categoriesResponse] = await Promise.all([
    getBlogPosts({ 
      limit: 12, 
      categorySlug: categorySlug === "all" ? undefined : categorySlug 
    }),
    getBlogCategories(),
  ]).catch(() => [null, null]);

  const posts = postsResponse?.data || [];
  const categories = categoriesResponse?.data || [];

  return (
    <>
      <main className="bg-white">
        {/* Banner */}
        <section className="bg-section-bg py-24 text-center">
          <div className="container-custom">
            <h1 className="mb-4 text-[45px] font-black text-heading uppercase tracking-tight">BLOG</h1>
            <p className="mx-auto max-w-[700px] text-[18px] text-muted leading-relaxed">
              Acquire informations about streaming application, level up your entertainment experience.
            </p>
          </div>
        </section>

        {/* Categories & Posts */}
        <section className="py-24">
          <div className="container-custom">
            {/* Category Filter */}
            <div className="mb-16 flex flex-wrap justify-center gap-4">
              <Link 
                href="/blog?category=all"
                scroll={false}
                className={cn(
                  "rounded-full px-10 py-3 text-[16px] font-bold shadow-xl transition-all hover:translate-y-[-2px]",
                  categorySlug === "all" 
                    ? "bg-primary text-white" 
                    : "bg-white border border-gray-100 text-heading hover:bg-section-bg card-shadow"
                )}
              >
                All
              </Link>
              {categories.map((cat) => (
                <Link 
                  key={cat.id} 
                  href={`/blog?category=${cat.slug}`}
                  scroll={false}
                  className={cn(
                    "rounded-full px-10 py-3 text-[16px] font-bold shadow-xl transition-all hover:translate-y-[-2px]",
                    categorySlug === cat.slug 
                      ? "bg-primary text-white" 
                      : "bg-white border border-gray-100 text-heading hover:bg-section-bg card-shadow"
                  )}
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            {/* Posts Grid */}
            <div className="min-h-[600px]">
              <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
                {posts.length > 0 ? posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                )) : (
                  <div className="col-span-full py-20 text-center">
                    <p className="text-[18px] text-muted">No blog posts found in this category.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Support CTA Section */}
            <div className="mt-32 rounded-[40px] footer-gradient p-16 text-center text-white">
               <h3 className="text-white text-[35px] font-black mb-6">Still have questions?</h3>
               <p className="text-white/80 text-[20px] mb-12 max-w-[600px] mx-auto leading-relaxed">
                 If you have any thoughts and questions, you can contact us at: <br className="hidden md:block" />
                 <Link href="/tutorial" className="text-white hover:underline font-bold">Tutorial</Link> or{" "}
                 <Link href="/faq" className="text-white hover:underline font-bold">FAQ</Link>
               </p>
               <a 
                href="mailto:support@boostvision.com.cn" 
                className="inline-block text-[24px] font-black text-white border-b-2 border-white/30 hover:border-white transition-all pb-1"
               >
                 support@boostvision.com.cn
               </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-[30px] bg-white card-shadow transition-all duration-300 hover:translate-y-[-10px]">
      <Link href={`/blog/${post.slug}`} className="relative h-[240px] w-full overflow-hidden">
        <Image
          src={post.coverImage?.url || "/images/blog-placeholder.webp"}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute left-6 top-6 rounded-full bg-primary/90 px-4 py-1.5 text-[12px] font-bold text-white backdrop-blur-sm">
          {post.category?.name}
        </div>
      </Link>
      <div className="flex flex-col p-10">
        <h3 className="mb-6 text-[22px] font-bold text-heading leading-[1.4] line-clamp-2 min-h-[62px] group-hover:text-primary transition-colors">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 relative overflow-hidden rounded-full border border-gray-100">
               <Image src={post.author?.avatar?.url || "/icons/author-placeholder.webp"} alt={post.author?.name} fill className="object-cover" />
             </div>
             <span className="text-[14px] font-bold text-heading">{post.author?.name}</span>
          </div>
          <span className="text-[14px] font-medium text-muted">{formatDate(post.publishedAt)}</span>
        </div>
      </div>
    </div>
  );
}
