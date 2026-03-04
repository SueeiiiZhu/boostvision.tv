import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { RichText, JsonLd } from "@/components/shared";
import { BlogCard } from "../_components/BlogCard";
import { getBlogPostBySlug } from "@/lib/strapi/api/blog";
import { getGlobalSetting } from "@/lib/strapi/api/global";
import { generateMetadata as genMetadata, generateArticleSchema, wrapSchema } from "@/lib/seo";
import { formatDate } from "@/lib/utils/formatDate";
import { cn } from "@/lib/utils";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const [post, globalSetting] = await Promise.all([
    getBlogPostBySlug(slug, locale),
    getGlobalSetting(locale),
  ]);

  if (!post) return { title: "Post Not Found" };
  const localizedBlogPath = locale === "en" ? `/blog/${slug}` : `/${locale}/blog/${slug}`;

  return genMetadata({
    seo: post.seo,
    defaultSeo: globalSetting?.defaultSeo,
    fallbackOgImage: post.coverImage,
    fallbackOgImageUrl: `${localizedBlogPath}/opengraph-image`,
    pageTitle: post.title,
    defaultTitle: `${post.title} | BoostVision Blog`,
    defaultDescription: post.excerpt,
    path: `/blog/${slug}`,
    locale,
    type: "article",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug, locale } = await params;

  // 增加错误捕获，防止 API 失败导致整页崩溃
  let post = null;
  let globalSetting = null;

  try {
    const [postData, globalData] = await Promise.all([
      getBlogPostBySlug(slug, locale),
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

  // Generate Article schema
  const authorProfileHref = post.author?.slug ? `/authors/${post.author.slug}` : undefined;
  const schema = generateArticleSchema({
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage?.url
      ? (post.coverImage.url.startsWith("http")
          ? post.coverImage.url
          : `https://www.boostvision.tv${post.coverImage.url}`)
      : undefined,
    datePublished: post.postDate,
    dateModified: post.updatedAt || post.postDate,
    authorName: post.author?.name || "BoostVision Team",
    authorUrl: post.author?.slug
      ? `https://www.boostvision.tv/authors/${post.author.slug}`
      : undefined,
    url: `https://www.boostvision.tv/blog/${slug}`,
  });

  const jsonLd = wrapSchema(schema);

  return (
    <>
      <JsonLd data={jsonLd} />
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
                      {authorProfileHref ? (
                        <Link href={authorProfileHref} className="font-bold text-heading hover:text-primary transition-colors">
                          {post.author?.name}
                        </Link>
                      ) : (
                        <span className="font-bold text-heading">{post.author?.name}</span>
                      )}
                    </div>
                    <span className="text-gray-300">|</span>
                    <span className="text-muted text-[15px]">{formatDate(post.postDate)}</span>
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
                    {authorProfileHref && (
                      <Link href={authorProfileHref} className="inline-block mt-4 text-primary font-bold hover:underline">
                        View full author profile
                      </Link>
                    )}
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
                  {relatedPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}

            {/* CTA Section - Explore Apps */}
            <div className="mt-20 pt-20 border-t border-gray-100">
              <div className="rounded-[40px] bg-section-bg p-16 text-center">
                <h4 className="text-[32px] font-black text-heading mb-6">
                  Ready to Try Our Apps?
                </h4>
                <p className="text-[18px] text-muted mb-10 max-w-[700px] mx-auto leading-relaxed">
                  Discover our professional screen mirroring and TV remote control apps for iPhone, iPad, and Android devices.
                </p>
                <div className="flex flex-wrap justify-center gap-6">
                  <Link
                    href="/app?tab=screen-mirroring"
                    className="inline-flex items-center justify-center px-10 py-4 text-[18px] font-bold text-white bg-primary rounded-full hover:translate-y-[-2px] transition-all shadow-xl"
                  >
                    Screen Mirroring Apps
                  </Link>
                  <Link
                    href="/app?tab=tv-remote"
                    className="inline-flex items-center justify-center px-10 py-4 text-[18px] font-bold text-heading bg-white border-2 border-gray-200 rounded-full hover:border-primary hover:text-primary transition-all"
                  >
                    TV Remote Apps
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
