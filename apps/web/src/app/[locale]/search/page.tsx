import { globalSearch } from "@/lib/strapi/api/search";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q = "" } = await searchParams;
  return {
    title: q ? `Search results for "${q}" | BoostVision` : "Search | BoostVision",
    description: `Search results for ${q} on BoostVision website.`,
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q: query = "" } = await searchParams;
  const results = await globalSearch(query);

  const totalResults = results.apps.length + results.blogs.length;

  return (
    <>
      <main className="bg-white min-h-screen">
        {/* Banner */}
        <section className="bg-section-bg py-20">
          <div className="container-custom">
            <h1 className="text-[35px] font-black text-heading mb-4">
              {query ? `Search results for "${query}"` : "Search"}
            </h1>
            <p className="text-muted text-[18px]">
              {query 
                ? `Found ${totalResults} results for your search.`
                : "Enter a keyword to search across apps and blog posts."}
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container-custom">
            <div className="max-w-[1000px] mx-auto space-y-20">
              
              {/* Apps Results */}
              {results.apps.length > 0 && (
                <div>
                  <h2 className="text-[24px] font-bold text-heading mb-8 flex items-center gap-3">
                    <span className="h-8 w-1 bg-primary rounded-full"></span>
                    Apps
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {results.apps.map((app) => (
                      <Link 
                        key={app.id} 
                        href={`/app/${app.slug}`}
                        className="flex items-center gap-6 p-6 rounded-[30px] bg-white border border-gray-100 card-shadow hover:translate-y-[-4px] transition-all group"
                      >
                        <div className="h-20 w-20 relative overflow-hidden rounded-2xl shadow-md shrink-0">
                          <Image src={app.icon?.url || "/icons/app-placeholder.webp"} alt={app.name} fill className="object-cover" />
                        </div>
                        <div>
                          <h3 className="text-[18px] font-bold text-heading group-hover:text-primary transition-colors">{app.name}</h3>
                          <p className="text-[14px] text-muted line-clamp-2 mt-1">{app.shortDescription}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Blog Results */}
              {results.blogs.length > 0 && (
                <div>
                  <h2 className="text-[24px] font-bold text-heading mb-8 flex items-center gap-3">
                    <span className="h-8 w-1 bg-primary rounded-full"></span>
                    Blog Posts
                  </h2>
                  <div className="space-y-6">
                    {results.blogs.map((post) => (
                      <Link 
                        key={post.id} 
                        href={`/blog/${post.slug}`}
                        className="flex flex-col md:flex-row gap-8 p-8 rounded-[30px] bg-white border border-gray-100 card-shadow hover:translate-y-[-4px] transition-all group"
                      >
                        <div className="w-full md:w-[240px] aspect-video relative overflow-hidden rounded-2xl shadow-sm shrink-0">
                          <Image src={post.coverImage?.url || "/images/blog-placeholder.webp"} alt={post.title} fill className="object-cover" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <span className="text-[12px] font-bold text-primary uppercase tracking-wider mb-2">{post.category?.name}</span>
                          <h3 className="text-[20px] font-bold text-heading group-hover:text-primary transition-colors mb-3">{post.title}</h3>
                          <p className="text-[15px] text-muted line-clamp-2">{post.excerpt}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {query && totalResults === 0 && (
                <div className="text-center py-20 bg-section-bg rounded-[40px]">
                  <div className="text-[60px] mb-6">🔍</div>
                  <h3 className="text-[24px] font-bold text-heading mb-4">No results found</h3>
                  <p className="text-muted text-[18px] max-w-[500px] mx-auto">
                    We couldn't find anything matching "{query}". <br />
                    Try checking your spelling or using different keywords.
                  </p>
                  <Link href="/" className="mt-10 inline-block btn-gradient px-10">Back to Home</Link>
                </div>
              )}

              {/* Empty Search */}
              {!query && (
                <div className="text-center py-20">
                   <p className="text-muted italic">Please enter a keyword in the search bar above.</p>
                </div>
              )}

            </div>
          </div>
        </section>
      </main>
    </>
  );
}
