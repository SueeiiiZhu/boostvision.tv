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
      <main>
        {/* Banner */}
        <section className="bg-section-bg py-20 text-center">
          <div className="container-custom">
            <h1 className="mb-4">BLOG</h1>
            <p className="text-[18px]">
              Acquire informations about streaming application, level up your entertainment experience.
            </p>
          </div>
        </section>

        {/* Categories & Posts */}
        <section className="py-20">
          <div className="container-custom">
            {/* Category Filter */}
            <div className="mb-12 flex flex-wrap justify-center gap-3">
              <button className="rounded-full bg-primary px-6 py-2 text-[15px] font-medium text-white shadow-md">
                All
              </button>
              {categories.map((cat) => (
                <button key={cat.id} className="rounded-full bg-white border border-gray-100 px-6 py-2 text-[15px] font-medium text-heading hover:bg-gray-50 transition-colors">
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination Placeholder */}
            <div className="mt-16 flex justify-center">
               {/* Pagination UI */}
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="bg-section-bg py-20 text-center">
          <div className="container-custom">
            <h2 className="mb-8">Still have questions?</h2>
            <p className="mb-8 text-[18px]">
              If you have any thoughts and questions, you can contact us at: <br />
              <Link href="/tutorial" className="text-primary hover:underline">Tutorial</Link> or{" "}
              <Link href="/faq" className="text-primary hover:underline">FAQ</Link>
            </p>
            <a href="mailto:support@boostvision.com.cn" className="text-[20px] font-bold text-primary">
              support@boostvision.com.cn
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-[20px] bg-white card-shadow transition-transform hover:translate-y-[-8px]">
      <Link href={`/blog/${post.slug}`} className="relative h-[220px] w-full overflow-hidden">
        <Image
          src={post.coverImage?.url || "/images/blog-placeholder.jpg"}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </Link>
      <div className="flex flex-col p-8">
        <h3 className="mb-4 text-[20px] font-bold text-heading leading-[1.4] line-clamp-2 min-h-[56px] group-hover:text-primary transition-colors">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <div className="mt-auto flex items-center justify-between text-[14px]">
          <span className="font-bold text-primary">{post.category?.name}</span>
          <span className="text-muted">{formatDate(post.publishedAt)}</span>
        </div>
      </div>
    </div>
  );
}
