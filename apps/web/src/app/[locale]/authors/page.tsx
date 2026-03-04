import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getLocaleAlternates } from "@/lib/seo";
import { getAuthors } from "@/lib/strapi/api/author";

interface Props {
  params: Promise<{ locale: string }>;
}

export const revalidate = 600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const alternates = getLocaleAlternates("/authors", locale);

  return {
    title: "Authors | BoostVision",
    description: "Meet the BoostVision authors and explore their published articles.",
    alternates,
  };
}

export default async function AuthorsPage({ params }: Props) {
  const { locale } = await params;
  const response = await getAuthors(locale, 200);
  const authors = response.data || [];

  return (
    <main className="bg-white pb-24">
      <section className="pt-24 pb-12 text-center">
        <div className="container-custom">
          <h1 className="text-[48px] font-black text-heading leading-tight">Authors</h1>
          <p className="mt-4 text-[18px] text-muted">
            Explore expert profiles and published content from the BoostVision editorial team.
          </p>
        </div>
      </section>

      <section className="pb-12">
        <div className="container-custom max-w-[1140px]">
          {authors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {authors.map((author) => (
                <article key={author.id} className="rounded-[24px] border border-gray-100 p-8">
                  <div className="flex gap-5 items-start">
                    <div className="relative h-20 w-20 rounded-full overflow-hidden border border-gray-200 shrink-0">
                      <Image
                        src={author.avatar?.url || "/icons/author-placeholder.webp"}
                        alt={author.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-[24px] font-black text-heading leading-tight">
                        <Link href={`/authors/${author.slug}`} className="hover:text-primary transition-colors">
                          {author.name}
                        </Link>
                      </h2>
                      {author.jobTitle && (
                        <p className="mt-2 text-[15px] font-bold text-primary">{author.jobTitle}</p>
                      )}
                      {(author.expertise || author.bio) && (
                        <p className="mt-3 text-[15px] text-muted leading-[1.7] line-clamp-4">
                          {author.expertise || author.bio}
                        </p>
                      )}
                      <div className="mt-4 flex items-center justify-between gap-4">
                        <span className="text-[14px] font-medium text-muted">
                          Published Articles: {author.blogPosts?.length || 0}
                        </span>
                        <Link href={`/authors/${author.slug}`} className="text-[14px] font-bold text-primary hover:underline">
                          View profile
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-center text-[16px] text-muted">No authors found.</p>
          )}
        </div>
      </section>
    </main>
  );
}
