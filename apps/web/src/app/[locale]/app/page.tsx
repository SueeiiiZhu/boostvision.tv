import Link from "next/link";
import Image from "next/image";
import { getApps } from "@/lib/strapi/api/apps";
import { getPageBySlug } from "@/lib/strapi/api/pages";
import { getGlobalSetting } from "@/lib/strapi/api/global";
import { generateMetadata as genMetadata } from "@/lib/seo";
import { App, HeroSection, CTASection } from "@/types/strapi";
import { QRCode } from "@/components/shared";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string }>;
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
    locale,
  });
}

export default async function AppsPage() {
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
  const groupedApps = Object.entries(
    apps.reduce<Record<string, App[]>>((acc, app) => {
      const typeKey = app.type || "other";
      if (!acc[typeKey]) acc[typeKey] = [];
      acc[typeKey].push(app);
      return acc;
    }, {})
  );

  return (
    <>
      <main className="bg-white poppins-headings">
        {/* Banner */}
        <section className="bg-app-hero py-12 text-center">
          <div className="container-custom">
            <h1 className="mb-4 text-[40px] font-black text-white tracking-tight">
              {heroSection?.title || "Download Screen Mirroring & TV Remote Apps ｜BoostVision"}
            </h1>
            <p className="mx-auto max-w-[700px] text-[16px] md:text-[20px] text-white/70 leading-relaxed">
              {heroSection?.subtitle || "Download screen mirroring & TV remote apps for free at App Store and Google Play Store."}
            </p>
          </div>
        </section>

        {/* Apps List */}
        <section className="py-12 md:py-24">
          <div className="container-custom">
            <div className="min-h-[600px]">
              {groupedApps.length > 0 ? groupedApps.map(([type, typeApps], index) => (
                <section key={type} className="animate-fade-in">
                  <div className="mb-8 flex justify-start md:mb-10">
                    <h2
                      className="text-left text-[24px] font-bold text-heading md:text-[32px]"
                      style={{
                        borderLeft: `5px solid ${index === 0 ? "rgb(184, 247, 50)" : index === 1 ? "rgb(30, 108, 244)" : "rgb(229, 231, 235)"}`,
                        paddingLeft: "1em",
                      }}
                    >
                      {formatAppTypeTitle(type)}
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-2">
                    {typeApps.map((app) => (
                      <AppCatalogCard key={app.id} app={app} />
                    ))}
                  </div>
                  {index < groupedApps.length - 1 && (
                    <div className="my-12 h-px w-full bg-gray-200 md:my-16" />
                  )}
                </section>
              )) : (
                <div className="py-20 text-center">
                  <p className="text-[18px] text-muted">No apps found.</p>
                </div>
              )}
            </div>

            {/* Bottom Support CTA */}
            <div className="mt-32 rounded-[40px] bg-section-bg-cta p-8 text-center md:p-16">
              <h3 className="mb-8 text-[24px] font-heading font-semibold text-heading md:mb-12 md:text-[32px]">
                {ctaSection?.title || "Still have questions?"}
              </h3>

              {/* Links as Buttons */}
              <div className="mb-10 flex flex-wrap items-center justify-center gap-3 md:gap-6">
                {ctaSection?.links && ctaSection.links.length > 0 ? (
                  ctaSection.links.map((link) => (
                    <Link
                      key={link.id}
                      href={link.href}
                      className="inline-flex w-[calc(50%-0.375rem)] md:w-[240px] items-center justify-center px-4 py-3 text-[15px] font-bold text-heading bg-white border-2 border-gray-200 rounded-full hover:border-primary hover:text-primary transition-all md:px-10 md:py-4 md:text-[18px]"
                    >
                      {link.name}
                    </Link>
                  ))
                ) : (
                  <>
                    <Link
                      href="/tutorial"
                      className="inline-flex w-[calc(50%-0.375rem)] md:w-[240px] items-center justify-center px-4 py-3 text-[15px] font-bold text-heading bg-white border-2 border-gray-200 rounded-full hover:border-primary hover:text-primary transition-all md:px-10 md:py-4 md:text-[18px]"
                    >
                      How-to Guides
                    </Link>
                    <Link
                      href="/faq"
                      className="inline-flex w-[calc(50%-0.375rem)] md:w-[240px] items-center justify-center px-4 py-3 text-[15px] font-bold text-heading bg-white border-2 border-gray-200 rounded-full hover:border-primary hover:text-primary transition-all md:px-10 md:py-4 md:text-[18px]"
                    >
                      F.A.Q
                    </Link>
                  </>
                )}
              </div>

              {/* Description with Email */}
              <p className="text-[15px] text-muted leading-relaxed md:text-[18px]">
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

function formatAppTypeTitle(type: string) {
  return type
    .split("-")
    .filter(Boolean)
    .map((word) => {
      if (word.toLowerCase() === "tv") return "TV";
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function AppCatalogCard({ app }: { app: App }) {
  return (
    <div className="relative z-0 isolate flex flex-col items-start rounded-[40px] bg-white p-6 text-left card-shadow md:flex-row md:items-center md:justify-between md:gap-6 md:p-8">
      <div className="mb-5 w-full md:mb-0 md:flex-1">
        <div className="flex items-center gap-4">
          <Link href={`/app/${app.slug}`} className="block shrink-0">
            <div className="h-[72px] w-[72px] relative overflow-hidden md:h-[88px] md:w-[88px]">
              <Image
                src={app.icon?.url || "/icons/app-placeholder.webp"}
                alt={app.name}
                fill
                className="object-contain"
              />
            </div>
          </Link>

          <h3 className="min-w-0 text-[20px] font-bold text-heading leading-tight md:text-[24px]">
            <Link href={`/app/${app.slug}`}>{app.name}</Link>
          </h3>
        </div>

        <p className="mt-3 text-[15px] text-muted leading-[1.7] line-clamp-4 md:text-[16px]">
          {app.shortDescription}
        </p>
      </div>

      <div className="mt-auto flex w-full flex-col items-center gap-4 md:mt-0 md:w-auto md:items-end">
        <div className="flex w-full flex-col items-center justify-center gap-3 md:w-auto md:flex-col md:items-end md:justify-start md:gap-3 md:isolate">
          {app.downloadLinks && app.downloadLinks.length > 0 ? (
            app.downloadLinks.map((link) => {
              const ButtonContent = (
                <div className="relative group/qr z-0">
                  <Image
                    src={link.badge.url}
                    alt={link.platform}
                    width={120}
                    height={36}
                    className="h-12 w-full object-contain sm:h-14"
                  />
                  {link.generateQRCode && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 invisible group-hover/qr:opacity-100 group-hover/qr:visible transition-all duration-300 z-[260] pointer-events-none">
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
                  className={cn(
                    "relative z-0 mx-auto flex w-[160px] justify-center sm:w-[186px] md:mx-0 md:hover:z-[250] md:focus-within:z-[250]",
                    link.isClickable ? "transition duration-200 hover:brightness-95" : "pointer-events-none opacity-50"
                  )}
                  {...(!link.isClickable && { 'aria-disabled': 'true' })}
                >
                  {ButtonContent}
                </a>
              );
            })
          ) : (
            <div
              className="mx-auto flex h-12 w-[160px] items-center justify-center rounded-[10px] bg-gray-100 text-[14px] font-medium font-heading lowercase tracking-wide text-gray-600 sm:h-14 sm:w-[186px] md:mx-0"
              aria-label="coming soon"
            >
              coming soon
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
