import Link from "next/link";
import Image from "next/image";
import { Header, Footer } from "@/components/layout";
import { getBlogPosts, getBlogCategories } from "@/lib/strapi/api/blog";
import { BlogPost } from "@/types/strapi";
import { formatDate } from "@/lib/utils/formatDate";

export default async function BlogPage() {
  const [postsResponse, categoriesResponse] = await Promise.all([
    getBlogPosts({ limit: 12 }),
    getBlogCategories(),
  ]).catch(() => [null, null]);

  const posts = postsResponse?.data || [];
  const categories = categoriesResponse?.data || [];

  return (
    <>
      <Header />
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
              <button className="rounded-full bg-primary px-10 py-3 text-[16px] font-bold text-white shadow-xl hover:translate-y-[-2px] transition-all">
                All
              </button>
              {categories.map((cat) => (
                <button 
                  key={cat.id} 
                  className="rounded-full bg-white border border-gray-100 px-10 py-3 text-[16px] font-bold text-heading hover:bg-section-bg hover:translate-y-[-2px] transition-all card-shadow"
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
              {posts.length > 0 ? posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              )) : (
                // Placeholder cards if no data
                Array(6).fill(null).map((_, i) => (
                  <div key={i} className="animate-pulse flex flex-col rounded-[30px] bg-gray-50 h-[450px]"></div>
                ))
              )}
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
      <Footer />
    </>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-[30px] bg-white card-shadow transition-all duration-300 hover:translate-y-[-10px]">
      <Link href={`/blog/${post.slug}`} className="relative h-[240px] w-full overflow-hidden">
        <Image
          src={post.coverImage?.url || "/images/blog-placeholder.jpg"}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Category Overlay */}
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
               <Image src={post.author?.avatar?.url || "/icons/author-placeholder.png"} alt={post.author?.name} fill className="object-cover" />
             </div>
             <span className="text-[14px] font-bold text-heading">{post.author?.name}</span>
          </div>
          <span className="text-[14px] font-medium text-muted">{formatDate(post.publishedAt)}</span>
        </div>
      </div>
    </div>
  );
}
