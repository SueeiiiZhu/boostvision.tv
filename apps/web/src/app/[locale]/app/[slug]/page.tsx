import { RichText, QRCode, JsonLd } from "@/components/shared";
import { AppSectionRenderer } from "@/components/app/AppSectionRenderer";
import { getAppBySlug } from "@/lib/strapi/api/apps";
import { getGlobalSetting } from "@/lib/strapi/api/global";
import { generateMetadata as genMetadata, generateSoftwareApplicationSchema, wrapSchema } from "@/lib/seo";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [app, globalSetting] = await Promise.all([
    getAppBySlug(slug),
    getGlobalSetting(),
  ]);

  if (!app) return { title: "App Not Found" };

  return genMetadata({
    seo: app.seo,
    defaultSeo: globalSetting?.defaultSeo,
    defaultTitle: `${app.name} | BoostVision`,
    defaultDescription: app.shortDescription,
    path: `/app/${slug}`,
  });
}

export default async function AppDetailPage({ params }: Props) {
  const { slug } = await params;
  const [app, globalSetting] = await Promise.all([
    getAppBySlug(slug),
    getGlobalSetting()
  ]);

  if (!app) {
    notFound();
  }

  // Generate SoftwareApplication schema
  const schema = generateSoftwareApplicationSchema({
    name: app.name,
    description: app.shortDescription,
    rating: app.rating || 4.8,
    downloadCount: app.downloadCount,
    image: app.icon?.url,
    url: `https://www.boostvision.tv/app/${slug}`,
  });

  const jsonLd = wrapSchema(schema);

  return (
    <>
      <JsonLd data={jsonLd} />
      <main className="bg-white">
        {/* 如果有动态配置的 sections，优先使用 */}
        {app.sections && app.sections.length > 0 ? (
          <AppSectionRenderer sections={app.sections} app={app} globalSetting={globalSetting} />
        ) : (
          <>
            {/* Hero Section - Two Column Layout */}
            <section className="pt-24 pb-20 bg-white">
              <div className="container-custom">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                  {/* Left Column: Text Content */}
                  <div className="flex-1 text-left">
                    <h1 className="text-[25px] md:text-[55px] font-black text-heading leading-[1.1] mb-8 tracking-tight">
                      {app.displayTitle || app.name}
                    </h1>
                    <p className="text-[16px] text-muted/80 leading-relaxed mb-10 max-w-[500px]">
                      {app.shortDescription}
                    </p>

                    {/* Stats Section */}
                    <div className="flex flex-col gap-4 mb-12">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 text-primary">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                        </div>
                        <span className="text-[18px] font-black text-heading uppercase tracking-wide">
                          {app.downloadCount || "3+ Million"} Downloads
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 text-accent">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        </div>
                        <span className="text-[18px] font-black text-heading uppercase tracking-wide">
                          {globalSetting?.appStoreRateLabel || "Decent App Store Rate:"} <span className="text-primary">{app.rating || "4.8"}★</span>
                        </span>
                      </div>
                    </div>

                    {/* Download Buttons */}
                    <div className="flex flex-wrap gap-6">
                      {app.downloadLinks && app.downloadLinks.length > 0 ? (
                        app.downloadLinks.map((link) => {
                          const ButtonContent = (
                            <div className="relative group/qr">
                              <Image
                                src={link.badge.url}
                                alt={link.platform}
                                width={180} height={54}
                                className="h-[54px] w-auto"
                              />
                              {link.generateQRCode && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 opacity-0 invisible group-hover/qr:opacity-100 group-hover/qr:visible transition-all duration-300 z-50">
                                  <QRCode data={link.url} size={120} />
                                </div>
                              )}
                            </div>
                          );

                          if (!link.isClickable) {
                            return (
                              <div key={link.id} className="cursor-not-allowed">
                                {ButtonContent}
                              </div>
                            );
                          }

                          return (
                            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105">
                              {ButtonContent}
                            </a>
                          );
                        })
                      ) : null}
                    </div>
                  </div>

                  {/* Right Column: Hero Image */}
                  <div className="flex-1 relative animate-fade-in">
                    {app.heroImage ? (
                      <Image
                        src={app.heroImage.url}
                        alt={app.name}
                        width={600}
                        height={450}
                        className="w-full h-auto object-contain"
                        priority
                      />
                    ) : (
                      <div className="aspect-[4/3] bg-section-bg rounded-[40px] flex items-center justify-center">
                        <Image src="/logo.svg" alt="BoostVision logo placeholder" width={200} height={50} className="opacity-20" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Features Grid Section (Using Why Choose Style) */}
            {app.features && app.features.length > 0 && (
              <section className="py-32 bg-[#f8faff] text-center">
                <div className="container-custom">
                  <h2 className="text-[40px] font-black text-heading mb-24 tracking-tight">
                    Wireless Cast with the {app.name}
                  </h2>
                  <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
                    {app.features.slice(0, 4).map((feature) => (
                      <div key={feature.id} className="group flex flex-col items-center rounded-[40px] bg-white p-12 card-shadow hover:translate-y-[-12px] transition-all duration-500">
                        <div className="mb-10 h-24 w-24 flex items-center justify-center transform transition-transform duration-500 group-hover:scale-110">
                          {feature.icon?.url && (
                            <Image
                              src={feature.icon.url}
                              alt={feature.title}
                              width={96}
                              height={96}
                              className="h-full w-full object-contain"
                            />
                          )}
                        </div>
                        <h3 className="mb-6 text-[22px] font-black text-heading leading-tight min-h-[60px] flex items-center justify-center">
                          {feature.title}
                        </h3>
                        <p className="text-[16px] text-muted leading-[1.6] max-w-[280px]">
                          {feature.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* App Description Section */}
            {app.description && (
              <section className="py-32 bg-white">
                <div className="container-custom max-w-[950px] mx-auto text-left prose prose-lg prose-headings:font-black prose-headings:text-heading prose-p:text-muted/90 prose-p:text-[17px] prose-p:leading-[1.8]">
                  <RichText content={app.description} />
                </div>
              </section>
            )}

            {/* Device Brands Section */}
            <section className="py-32 bg-white text-center">
              <div className="container-custom">
                <h2 className="text-[40px] font-black text-heading mb-6 tracking-tight">
                  {app.name} Support all Smart TVs & Sticks
                </h2>
                <p className="text-[18px] text-muted mb-20 max-w-[850px] mx-auto leading-relaxed">
                  Stream your favorite media to the big screen with ease. It offers wide compatibility with popular TV brands and devices.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-12 items-center justify-items-center opacity-60">
                  {['Samsung TV', 'Chromecast', 'LG TV', 'Roku TV', 'Fire TV'].map((brand, i) => (
                    <div key={i} className="flex flex-col items-center gap-4 group hover:opacity-100 transition-opacity">
                      <div className="h-12 w-auto relative">
                        <span className="text-[24px] font-black text-heading/40 group-hover:text-primary transition-colors">{brand}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Screenshots Section */}
            {app.screenshots && app.screenshots.length > 0 && (
              <section className="py-32 bg-[#f8faff] overflow-hidden">
                <div className="container-custom">
                  <h2 className="text-[40px] font-black text-heading text-center mb-20 tracking-tight">App Screenshots</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                    {app.screenshots.map((shot, i) => (
                      <div key={i} className="relative aspect-[9/19.5] overflow-hidden rounded-[35px] shadow-2xl hover:translate-y-[-10px] transition-transform duration-500">
                        <Image src={shot.url} alt={`${app.name} screenshot ${i + 1}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Final CTA Section */}
            <section className="py-32 text-center bg-section-bg-3 text-white">
              <div className="container-custom">
                <h2 className="text-[42px] md:text-[50px] font-black mb-10 leading-[1.1] max-w-[950px] mx-auto tracking-tight">
                  Free Download {app.name} on Android or iPhone, iPad Today!
                </h2>
                <p className="text-[20px] text-white/70 mb-14 max-w-[850px] mx-auto leading-relaxed">
                  Get and install the {app.name} and start screencasting from iPhone, iPad or Android phone to TV now
                </p>

                <div className="flex flex-wrap justify-center gap-6 mb-20">
                  {app.downloadLinks && app.downloadLinks.length > 0 ? (
                    app.downloadLinks.map((link) => (
                      <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105">
                        <Image
                          src={link.badge.url}
                          alt={link.platform}
                          width={220} height={66}
                          className="h-[66px] w-auto"
                        />
                      </a>
                    ))
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-12 mb-16">
                  <Link href={`/tutorial?type=${app.type}`} className="text-[20px] font-black border-b-2 border-white/20 hover:border-white transition-all pb-1 uppercase tracking-wider">
                    How to Use {app.name}
                  </Link>
                  <Link href={`/faq?type=${app.type}`} className="text-[20px] font-black border-b-2 border-white/20 hover:border-white transition-all pb-1 uppercase tracking-wider">
                    {app.name} F.A.Q.
                  </Link>
                </div>

                <div className="max-w-[800px] mx-auto pt-10 border-t border-white/10">
                  <p className="text-[16px] text-white/40 leading-relaxed">
                    If you have any thoughts and questions, you can contact us at: <br />
                    <a href="mailto:support@boostvision.com.cn" className="text-white/60 hover:text-white transition-colors font-bold underline decoration-white/20 underline-offset-4">support@boostvision.com.cn</a>
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </>
  );
}
