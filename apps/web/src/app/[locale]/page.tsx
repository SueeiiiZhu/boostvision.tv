import Image from "next/image";
import Link from "next/link";

import { SectionRenderer, JsonLd } from "@/components/shared";
import { getGlobalSetting } from "@/lib/strapi/api/global";
import { getPageBySlug } from "@/lib/strapi/api/pages";
import { generateMetadata as genMetadata, generateOrganizationSchema, generateWebSiteSchema, wrapInGraph } from "@/lib/seo";
import type { Metadata } from "next";

// ISR: serve stale page instantly while revalidating in background (1 hour)
// Reduces cold-start LCP hits by keeping cached pages fresh longer
export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const [globalSetting, homePage] = await Promise.all([
    getGlobalSetting(locale).catch(() => null),
    getPageBySlug("home").catch(() => null),
  ]);

  return genMetadata({
    seo: homePage?.seo,
    defaultSeo: globalSetting?.defaultSeo,
    defaultTitle: "BoostVision - Professional Screen Mirroring & TV Remote Apps",
    defaultDescription: "BoostVision provides professional screen mirroring and TV remote control apps for iPhone, iPad, and Android. Support Roku, Fire TV, Samsung, LG, and more.",
    path: "/",
    locale,
  });
}

export default async function Home() {
  const [globalSetting, homePage] = await Promise.all([
    getGlobalSetting(),
    getPageBySlug("home"),
  ]).catch(() => [null, null]);

  const stats = globalSetting?.statistics || {
    downloads: "28,000,000+",
    countries: "200+",
    customers: "10,000,000+",
    supportHours: "24/7/365"
  };

  // Generate structured data schemas
  const organizationSchema = generateOrganizationSchema({
    socialLinks: globalSetting?.socialLinks || [],
  });

  const websiteSchema = generateWebSiteSchema();

  const jsonLd = wrapInGraph([organizationSchema, websiteSchema]);

  return (
    <>
      <JsonLd data={jsonLd} />
      <main>
        {homePage?.sections && homePage.sections.length > 0 ? (
          <SectionRenderer sections={homePage.sections} />
        ) : (
          <>
            {/* Hero Section Fallback */}
            <section className="bg-white pt-20 pb-8 overflow-hidden">
              <div className="container-custom max-w-[1320px] px-3 md:px-4">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                  <div className="text-center lg:text-left">
                    <h1 className="max-w-[900px] font-[family-name:var(--font-heading)] text-[36px] font-black leading-tight tracking-tight sm:text-[44px] md:text-[52px] lg:text-[58px] animate-slide-up">
                      Screen Mirroring & TV Remote Apps
                    </h1>
                    <p className="mx-auto mt-8 max-w-[800px] text-[20px] text-muted leading-[1.6] animate-slide-up delay-100 lg:mx-0">
                      Mirror the screen of your iPhone, iPad, Android phone & tablet
                      directly to your Smart TV. <br className="hidden md:block" /> Try our professional remote control
                      apps on mobile device to improve smart home control experience.{" "}
                      <strong className="font-bold text-heading">No cables required.</strong>
                    </p>
                    <div className="mt-12 animate-slide-up delay-200 flex justify-center lg:justify-start">
                      <div className="group flex flex-col items-center gap-3 lg:flex-row lg:items-center lg:gap-6">
                        <Link href="/app" className="btn-gradient">
                          GET IT NOW
                        </Link>
                        <p className="text-[14px] font-medium text-muted/80 uppercase tracking-wider opacity-50 transition-opacity duration-200 group-hover:opacity-100">
                          Best choice for 20 million+ users
                        </p>
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="mt-14 mx-auto flex max-w-[760px] flex-wrap items-start justify-center gap-y-8">
                      {[
                        { label: "Downloads", value: stats.downloads, icon: "download", href: "/app" },
                        { label: "Countries and Regions", value: stats.countries, icon: "global", href: undefined },
                        { label: "Satisfied Customers", value: stats.customers, icon: "users", href: "/app" },
                        { label: "Customer Service", value: stats.supportHours, icon: "service", href: "/contact-us" },
                      ].map((stat) => {
                        const content = (
                          <div className="w-full flex justify-center md:justify-start">
                            <div className="flex items-center gap-2">
                              <Image src={`/icons/${stat.icon}.svg`} alt={stat.label} width={32} height={32} />
                              <span className="text-[24px] font-black text-heading leading-none">{stat.value}</span>
                              <span className="text-[11px] font-medium text-muted/80 uppercase tracking-wider leading-none">
                                {stat.label}
                              </span>
                            </div>
                          </div>
                        );

                        return stat.href ? (
                          <Link key={stat.label} href={stat.href} className="w-full md:w-1/2 px-2 transition-opacity hover:opacity-80">
                            {content}
                          </Link>
                        ) : (
                          <div key={stat.label} className="w-full md:w-1/2 px-2">{content}</div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Main Product Image */}
                  <div className="flex justify-center lg:justify-end">
                    <Image
                      src="/images/hero-devices.webp"
                      alt="BoostVision Apps"
                      width={1200}
                      height={600}
                      className="h-auto w-full max-w-[720px]"
                      sizes="(max-width: 768px) calc(100vw - 30px), (max-width: 1200px) 50vw, 720px"
                      priority
                      fetchPriority="high"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Final CTA Fallback */}
            <section className="py-32 text-center bg-white border-t border-gray-50">
              <div className="container-custom">
                <h2 className="mb-8 max-w-[900px] mx-auto text-[28px] md:text-[45px] leading-[1.1] font-black text-heading">
                  Free Download BoostVision Screen Mirroring & TV Remote Apps Today!
                </h2>
                <p className="text-muted mb-12 text-[20px] max-w-[700px] mx-auto leading-relaxed">
                  Go to our App download center to install screen mirroring and TV remote apps on iPhone and Android now.
                </p>
                <Link href="/app" className="btn-gradient">
                  GET IT NOW
                </Link>
              </div>
            </section>
          </>
        )}
      </main>
    </>
  );
}
