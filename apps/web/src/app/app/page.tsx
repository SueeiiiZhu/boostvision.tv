import Link from "next/link";
import Image from "next/image";
import { Header, Footer } from "@/components/layout";
import { getApps } from "@/lib/strapi/api/apps";
import { App } from "@/types/strapi";

export default async function AppsPage() {
  const appsResponse = await getApps({ limit: 100 }).catch(() => null);
  const apps = appsResponse?.data || [];

  const screenMirroringApps = apps.filter(app => app.type === 'screen-mirroring');
  const tvRemoteApps = apps.filter(app => app.type === 'tv-remote');

  return (
    <>
      <Header />
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
            {/* Tabs (Static version for SSR) */}
            <div className="mb-20 flex flex-col md:flex-row justify-center gap-6">
               <button className="flex items-center justify-center gap-3 rounded-full bg-primary px-12 py-5 text-[18px] font-black text-white shadow-2xl hover:translate-y-[-4px] transition-all">
                 <Image src="/icons/mirror-white.svg" alt="mirror" width={24} height={24} />
                 Screen Mirroring Apps
               </button>
               <button className="flex items-center justify-center gap-3 rounded-full bg-white border-2 border-gray-100 px-12 py-5 text-[18px] font-black text-heading hover:bg-section-bg hover:translate-y-[-4px] transition-all card-shadow">
                 <Image src="/icons/remote-dark.svg" alt="remote" width={24} height={24} />
                 TV Remote Apps
               </button>
            </div>

            {/* Content Sections */}
            <div className="space-y-32">
              {/* Screen Mirroring Section */}
              <div id="screen-mirroring">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
                  {screenMirroringApps.length > 0 ? screenMirroringApps.map((app) => (
                    <AppCatalogCard key={app.id} app={app} />
                  )) : Array(6).fill(null).map((_, i) => (
                    <div key={i} className="animate-pulse rounded-[40px] bg-gray-50 h-[480px]"></div>
                  ))}
                </div>
              </div>

              {/* TV Remote Section */}
              <div id="tv-remote" className="pt-20 border-t border-gray-100">
                <div className="mb-16 text-center">
                   <h2 className="text-[35px] font-black text-heading mb-4">TV Remote Apps</h2>
                </div>
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
                  {tvRemoteApps.length > 0 ? tvRemoteApps.map((app) => (
                    <AppCatalogCard key={app.id} app={app} />
                  )) : Array(6).fill(null).map((_, i) => (
                    <div key={i} className="animate-pulse rounded-[40px] bg-gray-50 h-[480px]"></div>
                  ))}
                </div>
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
      <Footer />
    </>
  );
}

function AppCatalogCard({ app }: { app: App }) {
  return (
    <div className="group flex flex-col items-center rounded-[40px] bg-white p-12 text-center card-shadow transition-all duration-300 hover:translate-y-[-12px]">
      <Link href={`/app/${app.slug}`} className="mb-8 block">
        <div className="h-[120px] w-[120px] relative overflow-hidden rounded-[30px] shadow-2xl transition-transform duration-500 group-hover:scale-105">
          <Image 
            src={app.icon?.url || "/icons/app-placeholder.png"} 
            alt={app.name} 
            fill 
            className="object-cover" 
          />
        </div>
      </Link>
      <h3 className="mb-6 text-[24px] font-black text-heading leading-tight min-h-[66px] flex items-center group-hover:text-primary transition-colors">
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
