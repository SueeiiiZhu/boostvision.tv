import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { RichText } from "@/components/shared";
import { getAppBySlug } from "@/lib/strapi/api/apps";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const app = await getAppBySlug(slug);

  if (!app) return { title: "App Not Found" };

  return {
    title: `${app.name} | BoostVision`,
    description: app.shortDescription,
  };
}

export default async function AppDetailPage({ params }: Props) {
  const { slug } = await params;
  const app = await getAppBySlug(slug);

  if (!app) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": app.name,
    "operatingSystem": "iOS, Android",
    "applicationCategory": "MultimediaApplication",
    "description": app.shortDescription,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "15000"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="bg-white">
        {/* Breadcrumbs */}
        <div className="bg-section-bg py-6">
          <div className="container-custom">
            <div className="flex items-center gap-2 text-[14px] font-medium text-muted">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <Link href="/app" className="hover:text-primary transition-colors">Apps</Link>
              <span>/</span>
              <span className="text-heading font-bold">{app.name}</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-24">
          <div className="container-custom">
            <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:gap-20">
              {/* Left: App Icon & Primary Info */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:w-2/3">
                <div className="flex flex-col items-center gap-10 md:flex-row md:items-start">
                  <div className="h-[160px] w-[160px] shrink-0 relative overflow-hidden rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] animate-fade-in">
                    <Image
                      src={app.icon?.url || "/icons/app-placeholder.webp"}
                      alt={app.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center animate-slide-up">
                    <h1 className="text-[40px] font-black text-heading leading-tight mb-4">
                      {app.name}
                    </h1>
                    <p className="text-[18px] text-muted leading-relaxed mb-8 max-w-[600px]">
                      {app.shortDescription}
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 md:justify-start">
                      {app.appStoreUrl && (
                        <a href={app.appStoreUrl} target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition-transform">
                          <Image src="/images/app-store-badge.png" alt="App Store" width={180} height={54} />
                        </a>
                      )}
                      {app.googlePlayUrl && (
                        <a href={app.googlePlayUrl} target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition-transform">
                          <Image src="/images/google-play-badge.png" alt="Google Play" width={180} height={54} />
                        </a>
                      )}
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-8 md:justify-start">
                      <div className="flex flex-col items-center md:items-start">
                        <span className="text-[20px] font-black text-heading">4.8 <span className="text-primary">★</span></span>
                        <span className="text-[12px] font-bold text-muted uppercase tracking-widest">Rating</span>
                      </div>
                      <div className="h-10 w-[1px] bg-gray-100 hidden md:block"></div>
                      <div className="flex flex-col items-center md:items-start">
                        <span className="text-[20px] font-black text-heading">{app.downloadCount || "10M+"}</span>
                        <span className="text-[12px] font-bold text-muted uppercase tracking-widest">Downloads</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content Tabs Placeholder (Original site uses tabs here) */}
                <div className="mt-20 w-full">
                  <div className="mb-10 flex border-b border-gray-100 overflow-x-auto scrollbar-hide">
                    <button className="border-b-4 border-primary px-8 py-4 text-[18px] font-black text-heading">About</button>
                    <button className="px-8 py-4 text-[18px] font-bold text-muted hover:text-heading transition-colors">Features</button>
                    <button className="px-8 py-4 text-[18px] font-bold text-muted hover:text-heading transition-colors">Tutorial</button>
                    <button className="px-8 py-4 text-[18px] font-bold text-muted hover:text-heading transition-colors">FAQ</button>
                  </div>

                  <div className="prose prose-lg max-w-none mb-16">
                    <RichText content={app.description} />
                  </div>

                  {/* Features Highlights Grid */}
                  {app.features && app.features.length > 0 && (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                      {app.features.map((feature) => (
                        <div key={feature.id} className="flex gap-6 p-8 rounded-[30px] bg-section-bg border border-gray-50 group hover:bg-white hover:card-shadow transition-all duration-300">
                          {feature.icon?.url && (
                            <div className="h-12 w-12 shrink-0 transform group-hover:scale-110 transition-transform">
                              <Image src={feature.icon.url} alt={feature.title} width={48} height={48} />
                            </div>
                          )}
                          <div>
                            <h4 className="text-[20px] font-bold text-heading mb-3">{feature.title}</h4>
                            <p className="text-[15px] text-muted leading-relaxed">{feature.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Screenshots Sidebar */}
            <div className="w-full lg:w-1/3">
              <div className="sticky top-28 rounded-[40px] bg-section-bg p-10 border border-gray-50">
                <h3 className="text-[24px] font-black text-heading mb-8 flex items-center gap-3">
                  <span className="h-8 w-1 bg-primary rounded-full"></span>
                  Screenshots
                </h3>
                <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide lg:flex-col lg:overflow-visible lg:pb-0">
                  {app.screenshots?.length > 0 ? app.screenshots.map((shot, i) => (
                    <div key={i} className="min-w-[260px] relative aspect-[9/16] overflow-hidden rounded-[30px] shadow-xl lg:min-w-0 transition-transform hover:scale-[1.02]">
                      <Image src={shot.url} alt={`screenshot ${i}`} fill className="object-cover" />
                    </div>
                  )) : (
                    <div className="aspect-[9/16] rounded-[30px] bg-gray-100 flex items-center justify-center text-muted font-bold">No Screenshots</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global CTA */}
        <section className="py-32 text-center bg-section-bg">
          <div className="container-custom">
            <h2 className="text-[35px] font-black text-heading mb-6">Experience {app.name} Today!</h2>
            <p className="text-[18px] text-muted mb-12 max-w-[600px] mx-auto leading-relaxed">
              Join millions of satisfied users and upgrade your home entertainment experience now.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {app.appStoreUrl && <a href={app.appStoreUrl} className="btn-gradient px-12">Get on App Store</a>}
              {app.googlePlayUrl && <a href={app.googlePlayUrl} className="btn-gradient px-12 bg-heading">Get on Google Play</a>}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
