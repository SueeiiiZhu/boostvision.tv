import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { getAppBySlug, getApps } from "@/lib/strapi/api/apps";
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

  return (
    <>
      <Header />
      <main className="bg-white">
        {/* Breadcrumbs Placeholder */}
        
        {/* Hero Section */}
        <section className="py-20">
          <div className="container-custom flex flex-col items-center gap-12 lg:flex-row lg:items-start">
            {/* Left: App Icon & Info */}
            <div className="w-full lg:w-2/3">
              <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
                <div className="h-32 w-32 shrink-0 relative overflow-hidden rounded-3xl shadow-xl">
                  <Image src={app.icon?.url || "/icons/app-placeholder.png"} alt={app.name} fill className="object-cover" />
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-[36px] font-black text-heading leading-tight">{app.name}</h1>
                  <p className="mt-4 text-[18px] text-muted leading-relaxed">
                    {app.shortDescription}
                  </p>
                  
                  <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
                    {app.appStoreUrl && (
                      <a href={app.appStoreUrl} target="_blank" rel="noopener noreferrer">
                        <Image src="/images/app-store-badge.png" alt="App Store" width={160} height={48} />
                      </a>
                    )}
                    {app.googlePlayUrl && (
                      <a href={app.googlePlayUrl} target="_blank" rel="noopener noreferrer">
                        <Image src="/images/google-play-badge.png" alt="Google Play" width={160} height={48} />
                      </a>
                    )}
                  </div>
                  
                  <div className="mt-6 flex items-center justify-center gap-6 md:justify-start text-[15px] font-medium text-heading">
                    <div className="flex items-center gap-2">
                       <span className="text-primary text-[18px]">★</span>
                       <span>{app.rating || "4.8"} Rating</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <span>{app.downloadCount || "10M+"} Downloads</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-16 prose prose-lg max-w-none text-muted">
                <h2 className="text-[28px] font-bold text-heading mb-6">About this app</h2>
                <div className="whitespace-pre-line text-[16px] leading-[1.8]">
                  {app.description}
                </div>
              </div>

              {/* Features List */}
              {app.features && app.features.length > 0 && (
                <div className="mt-16">
                  <h2 className="text-[28px] font-bold text-heading mb-8">Key Features</h2>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {app.features.map((feature) => (
                      <div key={feature.id} className="flex gap-4 p-6 rounded-2xl bg-section-bg border border-gray-100">
                        {feature.icon?.url && (
                          <div className="h-10 w-10 shrink-0">
                            <Image src={feature.icon.url} alt={feature.title} width={40} height={40} />
                          </div>
                        )}
                        <div>
                          <h4 className="text-[18px] font-bold text-heading mb-2">{feature.title}</h4>
                          <p className="text-[14px] text-muted leading-relaxed">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Screenshots & Sidebar */}
            <div className="w-full lg:w-1/3">
               <div className="sticky top-28">
                 <h3 className="text-[22px] font-bold text-heading mb-6">Screenshots</h3>
                 <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide lg:flex-col lg:overflow-visible lg:pb-0">
                    {app.screenshots?.map((shot, i) => (
                      <div key={i} className="min-w-[240px] relative aspect-[9/16] overflow-hidden rounded-2xl shadow-md lg:min-w-0">
                        <Image src={shot.url} alt={`screenshot ${i}`} fill className="object-cover" />
                      </div>
                    ))}
                 </div>
               </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
