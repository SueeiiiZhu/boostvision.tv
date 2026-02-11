import Link from "next/link";
import Image from "next/image";
import { getApps } from "@/lib/strapi/api/apps";
import { getPageBySlug } from "@/lib/strapi/api/pages";
import { getGlobalSetting } from "@/lib/strapi/api/global";
import { generateMetadata as genMetadata } from "@/lib/seo";
import { App, HeroSection, CTASection, AppsFilterSection } from "@/types/strapi";
import { QRCode } from "@/components/shared";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const [pageData, globalSetting] = await Promise.all([
    getPageBySlug("app").catch(() => null),
    getGlobalSetting(locale).catch(() => null),
  ]);

  return genMetadata({
    seo: pageData?.seo,
    defaultSeo: globalSetting?.defaultSeo,
    defaultTitle: "Download Screen Mirroring & TV Remote Apps | BoostVision",
    defaultDescription: "Find and download professional screen mirroring and TV remote control apps for Roku, Fire TV, Samsung, LG, and more.",
    path: "/app",
  });
}

export default async function AppsPage({ params, searchParams }: Props) {
  const { tab = "screen-mirroring" } = await searchParams;

  // 并行获取 App 列表和页面配置数据
  const [appsResponse, pageData] = await Promise.all([
    getApps({ limit: 100 }).catch(() => null),
    getPageBySlug("app").catch(() => null)
  ]);

  const apps = appsResponse?.data || [];
  const sections = pageData?.sections || [];

  // 从动态区域中寻找 Hero 和 CTA 配置
  const heroSection = sections.find(s => s.__component === 'sections.hero') as HeroSection | undefined;
  const ctaSection = sections.find(s => s.__component === 'sections.cta') as CTASection | undefined;
  const filterSection = sections.find(s => s.__component === 'sections.apps-filter') as AppsFilterSection | undefined;

  const screenMirroringApps = apps.filter(app => app.type === 'screen-mirroring');
  const tvRemoteApps = apps.filter(app => app.type === 'tv-remote');

  const currentApps = tab === "screen-mirroring" ? screenMirroringApps : tvRemoteApps;

  return (
    <>
      <main className="bg-white">
        {/* Banner */}
        <section className="bg-app-hero py-24 text-center">
          <div className="container-custom">
            <h1 className="mb-6 !text-[35px] text-white font-black leading-[1.2]">
              {heroSection?.title || "Download Screen Mirroring & TV Remote Apps ｜BoostVision"}
            </h1>
            <p className="mx-auto max-w-[800px] text-[20px] text-white/70 leading-relaxed">
              {heroSection?.subtitle || "Download screen mirroring & TV remote apps for free at App Store and Google Play Store."}
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
                  src={filterSection?.screenMirroringIcon?.url || "/icons/mirror-tab.svg"}
                  alt="Screen mirroring apps icon" width={24} height={24}
                  className={cn(tab === "screen-mirroring" && "brightness-0 invert")}
                />
                {filterSection?.screenMirroringLabel || "Screen Mirroring Apps"}
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
                  src={filterSection?.tvRemoteIcon?.url || "/icons/remote-tab.svg"}
                  alt="TV remote control apps icon" width={24} height={24}
                  className={cn(tab === "tv-remote" && "brightness-0 invert")}
                />
                {filterSection?.tvRemoteLabel || "TV Remote Apps"}
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
              <h3 className="text-[32px] font-black text-heading mb-12">
                {ctaSection?.title || "Still have questions?"}
              </h3>

              {/* Links as Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
                {ctaSection?.links && ctaSection.links.length > 0 ? (
                  ctaSection.links.map((link) => (
                    <Link
                      key={link.id}
                      href={link.href}
                      className="inline-flex items-center justify-center px-10 py-4 text-[18px] font-bold text-heading bg-white border-2 border-gray-200 rounded-full hover:border-primary hover:text-primary transition-all"
                    >
                      {link.name}
                    </Link>
                  ))
                ) : (
                  <>
                    <Link
                      href="/tutorial"
                      className="inline-flex items-center justify-center px-10 py-4 text-[18px] font-bold text-heading bg-white border-2 border-gray-200 rounded-full hover:border-primary hover:text-primary transition-all"
                    >
                      How-to Guides
                    </Link>
                    <Link
                      href="/faq"
                      className="inline-flex items-center justify-center px-10 py-4 text-[18px] font-bold text-heading bg-white border-2 border-gray-200 rounded-full hover:border-primary hover:text-primary transition-all"
                    >
                      F.A.Q
                    </Link>
                  </>
                )}
              </div>

              {/* Description with Email */}
              <p className="text-[18px] text-muted leading-relaxed">
                {ctaSection?.description || "If you have any thoughts and questions, you can contact us at:"}{" "}
                <a
                  href={ctaSection?.buttonLink ? (ctaSection.buttonLink.startsWith('mailto:') ? ctaSection.buttonLink : `mailto:${ctaSection.buttonLink}`) : "mailto:support@boostvision.com.cn"}
                  className="text-primary hover:underline font-bold"
                >
                  {ctaSection?.buttonText || "support@boostvision.com.cn"}
                </a>
              </p>
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
        <div className="flex flex-row flex-nowrap justify-center gap-2">
          {app.downloadLinks && app.downloadLinks.length > 0 ? (
            app.downloadLinks.map((link) => {
              const ButtonContent = (
                <div className="relative group/qr hover:z-50 transition-all">
                  <Image src={link.badge.url} alt={link.platform} width={120} height={36} className="h-[36px] w-auto" />
                  {link.generateQRCode && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 invisible group-hover/qr:opacity-100 group-hover/qr:visible transition-all duration-300 z-50">
                      <QRCode data={link.url} size={80} />
                    </div>
                  )}
                </div>
              );

              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={link.isClickable ? "hover:opacity-80 transition-opacity" : "pointer-events-none opacity-50"}
                  {...(!link.isClickable && { 'aria-disabled': 'true' })}
                >
                  {ButtonContent}
                </a>
              );
            })
          ) : (
            <>
              {/* Fallback or empty */}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
