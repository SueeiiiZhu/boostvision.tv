import Link from "next/link";
import Image from "next/image";
import { getApps } from "@/lib/strapi/api/apps";
import { App } from "@/types/strapi";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Download Screen Mirroring & TV Remote Apps | BoostVision",
  description: "Find and download professional screen mirroring and TV remote control apps for Roku, Fire TV, Samsung, LG, and more.",
  openGraph: {
    title: "Download Screen Mirroring & TV Remote Apps | BoostVision",
    description: "Professional apps for screen mirroring and smart TV control.",
  },
};

interface Props {
  searchParams: Promise<{ tab?: string }>;
}

export default async function AppsPage({ searchParams }: Props) {
  const { tab = "screen-mirroring" } = await searchParams;

  const appsResponse = await getApps({ limit: 100 }).catch(() => null);
  const apps = appsResponse?.data || [];

  const screenMirroringApps = apps.filter(app => app.type === 'screen-mirroring');
  const tvRemoteApps = apps.filter(app => app.type === 'tv-remote');

  const currentApps = tab === "screen-mirroring" ? screenMirroringApps : tvRemoteApps;

  return (
    <>
      <main className="bg-white">
        {/* Banner */}
        <section className="bg-section-bg py-24 text-center">
          <div className="container-custom">
            <h1 className="mb-6 text-[45px] font-black text-heading leading-[1.2]">
              Download Screen Mirroring & TV Remote Apps ｜BoostVision
            </h1>
            <p className="mx-auto max-w-[800px] text-[20px] text-muted leading-relaxed">
              Download screen mirroring & TV remote apps for free at App Store and Google Play Store.
            </p>
          </div>
        </section>

        {/* Apps List */}
        <section className="py-24">
          <div className="container-custom">
            {/* Tabs (Using Link for SEO friendly navigation) */}
            <div className="mb-20 flex flex-col md:flex-row justify-center gap-6">
              <Link
                href="/app?tab=screen-mirroring"
                scroll={false}
                className={cn(
                  "flex items-center justify-center gap-3 rounded-full px-12 py-5 text-[18px] font-black transition-all shadow-2xl",
                  tab === "screen-mirroring"
                    ? "bg-primary text-white hover:translate-y-[-4px]"
                    : "bg-white border-2 border-gray-100 text-heading hover:bg-section-bg"
                )}
              >
                <Image
                  src="/icons/mirror-tab.svg"
                  alt="mirror" width={24} height={24}
                  className={cn(tab === "screen-mirroring" && "brightness-0 invert")}
                />
                Screen Mirroring Apps
              </Link>

              <Link
                href="/app?tab=tv-remote"
                scroll={false}
                className={cn(
                  "flex items-center justify-center gap-3 rounded-full px-12 py-5 text-[18px] font-black transition-all shadow-2xl",
                  tab === "tv-remote"
                    ? "bg-primary text-white hover:translate-y-[-4px]"
                    : "bg-white border-2 border-gray-100 text-heading hover:bg-section-bg"
                )}
              >
                <Image
                  src="/icons/remote-tab.svg"
                  alt="remote" width={24} height={24}
                  className={cn(tab === "tv-remote" && "brightness-0 invert")}
                />
                TV Remote Apps
              </Link>
            </div>

            {/* Content Section */}
            <div className="min-h-[600px]">
              <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
                {currentApps.length > 0 ? currentApps.map((app) => (
                  <AppCatalogCard key={app.id} app={app} />
                )) : (
                  <div className="col-span-full py-20 text-center">
                    <p className="text-[18px] text-muted">No apps found in this category.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Support CTA */}
            <div className="mt-32 rounded-[40px] bg-section-bg p-16 text-center">
              <h3 className="text-[32px] font-black text-heading mb-6">Still have questions?</h3>
              <p className="text-[18px] text-muted mb-10 max-w-[700px] mx-auto leading-relaxed">
                If you have any thoughts and questions, you can contact us at: <br className="hidden md:block" />
                <Link href="/tutorial" className="text-primary hover:underline font-bold">How-to Guides</Link> or{" "}
                <Link href="/faq" className="text-primary hover:underline font-bold">F.A.Q</Link>
              </p>
              <a
                href="mailto:support@boostvision.com.cn"
                className="inline-block text-[24px] font-black text-primary border-b-2 border-primary/20 hover:border-primary transition-all pb-1"
              >
                support@boostvision.com.cn
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function AppCatalogCard({ app }: { app: App }) {
  return (
    <div className="group flex flex-col items-center rounded-[40px] bg-white p-12 text-center card-shadow transition-all duration-300 hover:translate-y-[-12px]">
      <Link href={`/app/${app.slug}`} className="mb-8 block">
        <div className="h-[120px] w-[120px] relative overflow-hidden rounded-[30px] shadow-2xl transition-transform duration-500 group-hover:scale-105">
          <Image
            src={app.icon?.url || "/icons/app-placeholder.webp"}
            alt={app.name}
            fill
            className="object-cover"
          />
        </div>
      </Link>
      <h3 className="mb-6 text-[24px] font-bold text-heading leading-tight min-h-[66px] flex items-center group-hover:text-primary transition-colors">
        <Link href={`/app/${app.slug}`}>{app.name}</Link>
      </h3>
      <p className="mb-10 text-[16px] text-muted leading-[1.7] line-clamp-4">
        {app.shortDescription}
      </p>

      <div className="mt-auto flex flex-col items-center gap-4 w-full">
        <div className="flex gap-3">
          {app.appStoreUrl && (
            <a href={app.appStoreUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <Image src="/images/app-store-badge.png" alt="App Store" width={140} height={42} />
            </a>
          )}
          {app.googlePlayUrl && (
            <a href={app.googlePlayUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <Image src="/images/google-play-badge.png" alt="Google Play" width={140} height={42} />
            </a>
          )}
        </div>
        {app.amazonUrl && (
          <a href={app.amazonUrl} target="_blank" rel="noopener noreferrer" className="text-[13px] font-bold text-muted hover:text-primary transition-colors uppercase tracking-widest">
            Available on Amazon
          </a>
        )}
      </div>
    </div>
  );
}
