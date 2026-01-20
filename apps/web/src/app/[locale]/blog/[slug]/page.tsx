import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { RichText } from "@/components/shared";
import { getBlogPostBySlug } from "@/lib/strapi/api/blog";
import { formatDate } from "@/lib/utils/formatDate";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
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
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
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
          <div className="container-custom max-w-[900px]">
            {/* Header */}
            <header className="mb-12 text-center">
              <div className="mb-6 flex items-center justify-center gap-4 text-[15px] font-medium">
                <Link href={`/blog/category/${post.category?.slug}`} className="text-primary hover:underline">
                  {post.category?.name}
                </Link>
                <span className="text-gray-300">|</span>
                <span className="text-muted">{formatDate(post.publishedAt)}</span>
                <span className="text-gray-300">|</span>
                <span className="text-muted">{post.readTime || 5} min read</span>
              </div>
              <h1 className="text-[42px] font-black text-heading leading-[1.3] mb-8">
                {post.title}
              </h1>
              <div className="flex items-center justify-center gap-3">
                 <div className="h-10 w-10 relative overflow-hidden rounded-full border border-gray-100">
                   <Image src={post.author?.avatar?.url || "/icons/author-placeholder.webp"} alt={post.author?.name} fill className="object-cover" />
                 </div>
                 <span className="font-bold text-heading">{post.author?.name}</span>
              </div>
            </header>

            {/* Featured Image */}
            <div className="mb-12 relative aspect-[16/9] w-full overflow-hidden rounded-[30px] shadow-2xl">
              <Image 
                src={post.coverImage?.url || "/images/blog-placeholder.webp"} 
                alt={post.title} 
                fill 
                className="object-cover" 
                priority
              />
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none text-muted leading-[1.8] post-content">
               <RichText content={post.content} />
            </div>

            {/* Author Bio Section */}
            <div className="mt-20 flex items-center gap-8 rounded-[30px] bg-section-bg p-10 border border-gray-100">
               <div className="h-24 w-24 shrink-0 relative overflow-hidden rounded-full shadow-md">
                  <Image src={post.author?.avatar?.url || "/icons/author-placeholder.webp"} alt={post.author?.name} fill className="object-cover" />
               </div>
               <div>
                  <h4 className="text-[20px] font-bold text-heading mb-2">Written by {post.author?.name}</h4>
                  <p className="text-[16px] text-muted leading-relaxed">{post.author?.bio}</p>
               </div>
            </div>

            {/* Support CTA */}
            <div className="mt-20 rounded-[30px] footer-gradient p-12 text-center text-white">
               <h3 className="text-white text-[30px] font-bold mb-4">Still have questions?</h3>
               <p className="text-white/80 text-[18px] mb-8">
                 If you have any thoughts and questions, you can contact us at: <br />
                 Tutorial or FAQ
               </p>
               <a href="mailto:support@boostvision.com.cn" className="text-[22px] font-bold text-white hover:underline">
                 support@boostvision.com.cn
               </a>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
