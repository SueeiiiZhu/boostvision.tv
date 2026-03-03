import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { JsonLd } from "@/components/shared";
import { getLocaleAlternates, wrapSchema } from "@/lib/seo";
import { formatDate } from "@/lib/utils/formatDate";
import { getAuthorBySlug, getBlogPostsByAuthorSlug } from "@/lib/strapi/api/author";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export const revalidate = 600;

function getSocialLabel(platform: string) {
  return platform.charAt(0).toUpperCase() + platform.slice(1);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const author = await getAuthorBySlug(slug, locale);
  if (!author) {
    return { title: "Author Not Found" };
  }

  const alternates = getLocaleAlternates(`/authors/${slug}`, locale);
  const description =
    author.expertise || author.jobTitle || author.bio || `${author.name} profile on BoostVision`;

  return {
    title: `${author.name} | BoostVision`,
    description,
    alternates,
  };
}

export default async function AuthorProfilePage({ params }: Props) {
  const { locale, slug } = await params;

  const [author, postsResponse] = await Promise.all([
    getAuthorBySlug(slug, locale),
    getBlogPostsByAuthorSlug(slug, locale, 24, 1),
  ]);

  if (!author) {
    notFound();
  }

  const posts = postsResponse.data || [];

  const personSchema = wrapSchema({
    "@type": "Person",
    name: author.name,
    jobTitle: author.jobTitle,
    description: author.expertise || author.bio,
    image: author.avatar?.url,
    url: `https://www.boostvision.tv/authors/${author.slug}`,
    sameAs: (author.socialLinks || []).map((item) => item.url),
  });

  return (
    <>
      <JsonLd data={personSchema} />
      <main className="bg-white pb-24">
        <section className="pt-24 pb-16 border-b border-gray-100">
          <div className="container-custom max-w-[1000px]">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
              <div className="h-32 w-32 relative overflow-hidden rounded-full border border-gray-200 bg-section-bg shrink-0">
                <Image
                  src={author.avatar?.url || "/icons/author-placeholder.webp"}
                  alt={author.name}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-[40px] font-black text-heading leading-tight">{author.name}</h1>
                {author.jobTitle && (
                  <p className="mt-3 text-[18px] font-bold text-primary">{author.jobTitle}</p>
                )}
                {(author.expertise || author.bio) && (
                  <p className="mt-6 text-[17px] text-muted leading-[1.8] whitespace-pre-line">
                    {author.expertise || author.bio}
                  </p>
                )}
                {(author.socialLinks || []).length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
                    {author.socialLinks?.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-gray-200 text-[14px] font-bold text-heading hover:border-primary hover:text-primary transition-colors"
                      >
                        {getSocialLabel(link.platform)}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container-custom max-w-[1000px]">
            <h2 className="text-[30px] font-black text-heading mb-8">Published Articles</h2>
            {posts.length > 0 ? (
              <ul className="space-y-4">
                {posts.map((post) => (
                  <li key={post.id} className="rounded-2xl border border-gray-100 p-6">
                    <Link href={`/blog/${post.slug}`} className="text-[20px] font-bold text-heading hover:text-primary transition-colors">
                      {post.title}
                    </Link>
                    <p className="mt-2 text-[14px] text-muted">{formatDate(post.postDate || post.publishedAt)}</p>
                    {post.excerpt && (
                      <p className="mt-3 text-[16px] text-muted leading-[1.7] line-clamp-3">{post.excerpt}</p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[16px] text-muted">No published articles found for this author.</p>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
