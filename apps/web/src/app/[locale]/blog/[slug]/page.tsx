import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { RichText } from "@/components/shared";
import { getBlogPostBySlug } from "@/lib/strapi/api/blog";
import { getGlobalSetting } from "@/lib/strapi/api/global";
import { formatDate } from "@/lib/utils/formatDate";
import { cn } from "@/lib/utils";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | BoostVision Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug, locale } = await params;

  // 增加错误捕获，防止 API 失败导致整页崩溃
  let post = null;
  let globalSetting = null;

  try {
    const [postData, globalData] = await Promise.all([
      getBlogPostBySlug(slug),
      getGlobalSetting(locale),
    ]);
    post = postData;
    globalSetting = globalData;
  } catch (error) {
    console.error("Data fetching error in BlogPostPage:", error);
  }

  if (!post) {
    notFound();
  }

  // 使用 Strapi 后台配置的相关文章，增加空值保护
  const relatedPosts = post?.relatedPosts || [];

  // 提取目录 (Table of Contents)
  const toc: { id: string; title: string; level: number }[] = [];
  if (typeof post.content === 'string') {
    // 1. 首先尝试匹配标准的 ## 和 ### 标题
    const headerMatches = Array.from(post.content.matchAll(/^(##|###) (.*$)/gim));

    for (const match of headerMatches) {
      const level = match[1].length;
      const rawTitle = match[2].trim();
      // 清理标题中的 ** 和 __ 标记，使目录显示纯文本
      const displayTitle = rawTitle.replace(/\*\*|\__/g, '');
      const id = displayTitle.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      toc.push({ id, title: displayTitle, level });
    }

    // 2. 如果没有找到标准的 # 标题，尝试捕获单独一行的加粗文本作为标题（兼容不规范写法）
    if (toc.length === 0) {
      const boldHeaderMatches = Array.from(post.content.matchAll(/^\*\*(.*?)\*\*\s*$/gim));
      for (const match of boldHeaderMatches) {
        const displayTitle = match[1].trim();
        const id = displayTitle.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        toc.push({ id, title: displayTitle, level: 2 });
      }
    }
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.coverImage?.url || "/images/blog-placeholder.webp",
    "datePublished": post.publishedAt,
    "author": {
      "@type": "Person",
      "name": post.author?.name
    },
    "publisher": {
      "@type": "Organization",
      "name": "BoostVision",
      "logo": "https://www.boostvision.tv/logo.svg"
    },
    "description": post.excerpt
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="bg-white">
        <article className="py-20">
          <div className="container-custom max-w-[1200px]">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Main Content Area */}
              <div className="flex-1 max-w-[850px]">
                {/* Header */}
                <header className="mb-12">
                  {/* <div className="mb-6 flex items-center gap-4 text-[15px] font-medium">
                    <Link href={`/blog/category/${post.category?.slug}`} className="text-primary hover:underline">
                      {post.category?.name}
                    </Link>
                    <span className="text-gray-300">|</span>
                    <span className="text-muted">{formatDate(post.publishedAt)}</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-muted">{post.readTime || 5} min read</span>
                  </div> */}
                  <h1 className="text-[42px] font-black text-heading leading-[1.3] mb-8">
                    {post.title}
                  </h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 relative overflow-hidden rounded-full border border-gray-100">
                        <Image src={post.author?.avatar?.url || "/icons/author-placeholder.webp"} alt={post.author?.name} fill className="object-cover" />
                      </div>
                      <span className="font-bold text-heading">{post.author?.name}</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <span className="text-muted text-[15px]">{formatDate(post.publishedAt)}</span>
                  </div>
                </header>

                {/* Content */}
                <div className="prose prose-lg max-w-none text-muted leading-[1.8] post-content">
                  <RichText content={post.content} />
                </div>

                {/* Author Bio Section */}
                <div className="mt-20 flex flex-col md:flex-row items-center gap-10 md:gap-0 rounded-[20px] border border-gray-200 p-10 md:p-12">
                  <div className="flex flex-col items-center shrink-0 md:pr-12 md:min-w-[200px]">
                    <div className="h-28 w-28 relative overflow-hidden rounded-full shadow-sm mb-4">
                      <Image src={post.author?.avatar?.url || "/icons/author-placeholder.webp"} alt={post.author?.name} fill className="object-cover" />
                    </div>
                    <span className="font-bold text-heading text-[20px] text-center">{post.author?.name}</span>
                  </div>

                  <div className="hidden md:block self-stretch w-px bg-gray-200" />

                  <div className="flex-1 md:pl-12 text-center md:text-left">
                    <p className="text-[18px] text-muted leading-[1.8]">
                      {post.author?.bio}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sidebar - Table of Contents */}
              <aside className="hidden lg:block w-[300px] shrink-0">
                <div className="sticky top-[120px]">
                  {/* Table of Contents */}
                  {toc.length > 0 && (
                    <div className="rounded-[30px] bg-section-bg p-8 border border-gray-100">
                      <h4 className="text-[20px] font-black text-heading mb-6">
                        {globalSetting?.tocTitle || "Contents"}
                      </h4>
                      <nav>
                        <ul className="space-y-4">
                          {toc.map((item) => (
                            <li
                              key={item.id}
                              className={cn(
                                item.level === 3 && "ml-4"
                              )}
                            >
                              <a
                                href={`#${item.id}`}
                                className={cn(
                                  "block transition-colors leading-snug",
                                  item.level === 2
                                    ? "text-[16px] font-bold text-muted hover:text-primary"
                                    : "text-[14px] font-medium text-muted/80 hover:text-primary"
                                )}
                              >
                                {item.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </nav>
                    </div>
                  )}
                </div>
              </aside>
            </div>

            {/* Related Blogs Section - Moved outside the flex container to span full width */}
            {relatedPosts.length > 0 && (
              <div className="mt-20 pt-20 border-t border-gray-100">
                <h4 className="text-[32px] font-black text-heading mb-10">
                  {globalSetting?.relatedPostsTitle || "Related Blogs"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {relatedPosts.map((p) => (
                    <div key={p.id} className="group">
                      <Link href={`/blog/${p.slug}`} className="block">
                        {p.coverImage && (
                          <div className="aspect-[16/10] relative overflow-hidden rounded-[24px] mb-5 shadow-sm group-hover:shadow-md transition-all duration-300">
                            <Image
                              src={p.coverImage.url}
                              alt={p.title}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          </div>
                        )}
                        <h5 className="text-[20px] font-bold text-heading leading-[1.4] group-hover:text-primary transition-colors line-clamp-2">
                          {p.title}
                        </h5>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </main>
    </>
  );
}
