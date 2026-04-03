import Image from "next/image";
import Link from "next/link";

import { SectionRenderer, JsonLd } from "@/components/shared";
import { getApps } from "@/lib/strapi/api/apps";
import { getGlobalSetting } from "@/lib/strapi/api/global";
import { getPageBySlug } from "@/lib/strapi/api/pages";
import { generateMetadata as genMetadata, generateOrganizationSchema, generateWebSiteSchema, wrapInGraph } from "@/lib/seo";
import type { App } from "@/types/strapi";
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
  const [appsResponse, globalSetting, homePage] = await Promise.all([
    getApps({ limit: 8, isFeatured: true }),
    getGlobalSetting(),
    getPageBySlug("home"),
  ]).catch(() => [null, null, null]);

  const apps = appsResponse?.data || [];
  const screenMirroringApps = apps.filter(app => app.type === 'screen-mirroring').slice(0, 4);
  const tvRemoteApps = apps.filter(app => app.type === 'tv-remote').slice(0, 4);

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
            <section className="bg-white pt-20 pb-8 text-center overflow-hidden">
              <div className="container-custom">
                <h1 className="mx-auto max-w-[900px] font-[family-name:var(--font-heading)] text-[36px] font-black leading-tight tracking-tight sm:text-[44px] md:text-[52px] lg:text-[58px] animate-slide-up">
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Screen Mirroring
                  </span>{" "}
                  & TV Remote Apps
                </h1>
                <p className="mx-auto mt-8 max-w-[800px] text-[20px] text-muted leading-[1.6] animate-slide-up delay-100">
                  Mirror the screen of your iPhone, iPad, Android phone & tablet
                  directly to your Smart TV. <br className="hidden md:block" /> Try our professional remote control
                  apps on mobile device to improve smart home control experience.{" "}
                  <strong className="font-bold text-heading">No cables required.</strong>
                </p>
                <div className="mt-12 animate-slide-up delay-200">
                  <Link href="/app" className="btn-gradient">
                    GET IT NOW
                  </Link>
                </div>
                <p className="mt-8 text-[14px] font-medium text-muted/80 uppercase tracking-wider">
                  Best choice for 20 million+ users
                </p>

                {/* Stats Row */}
                <div className="mt-20 flex flex-wrap items-center justify-center gap-y-10 gap-x-12 md:gap-x-20">
                  {[
                    { label: "Downloads", value: stats.downloads, icon: "download", href: "/app" },
                    { label: "Countries and Regions", value: stats.countries, icon: "global", href: undefined },
                    { label: "Satisfied Customers", value: stats.customers, icon: "users", href: "/app" },
                    { label: "Customer Service", value: stats.supportHours, icon: "service", href: "/contact-us" },
                  ].map((stat) => {
                    const content = (
                      <div className="flex flex-col items-center gap-3">
                        <div className="flex items-center gap-3">
                          <Image src={`/icons/${stat.icon}.svg`} alt={stat.label} width={32} height={32} />
                          <span className="text-[24px] font-black text-heading leading-none">{stat.value}</span>
                        </div>
                      </div>
                    );

                    return stat.href ? (
                      <Link key={stat.label} href={stat.href} className="transition-opacity hover:opacity-80">
                        {content}
                      </Link>
                    ) : (
                      <div key={stat.label}>{content}</div>
                    );
                  })}
                </div>

                {/* Main Product Image */}
                <div className="mt-16 flex justify-center scale-105 transform">
                  <Image
                    src="/images/hero-devices.webp"
                    alt="BoostVision Apps"
                    width={1200}
                    height={600}
                    className="h-auto w-full max-w-[1100px]"
                    sizes="(max-width: 768px) calc(100vw - 30px), (max-width: 1200px) calc(90vw - 30px), 1100px"
                    priority
                    fetchPriority="high"
                  />
                </div>
              </div>
            </section>

            {/* Why Choose Section Fallback */}
            <section className="bg-section-bg pt-20 pb-32 text-center">
              <div className="container-custom">
                <h2 className="section-heading mb-20">
                  Why Choose BoostVision Apps?
                </h2>
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
                  {[
                    {
                      title: "TV Cast via Wi-Fi Network",
                      desc: "We are committed to enhancing your Smart TV experience with our advanced wireless solutions. Whether you control Smart TV or cast media to TV with our app, they are all wireless and no hardware or cables needed.",
                      icon: "wifi"
                    },
                    {
                      title: "High Quality Screen Mirroring",
                      desc: "BoostVision streaming apps provide screen mirroring and TV Cast services. With our apps, you can easily cast mobile screen or media files from smart phone to TV in low latency and high-definition quality.",
                      icon: "mirror"
                    },
                    {
                      title: "Physical Remote Replacements",
                      desc: "Lost your TV remote? No worries! Just try our apps and use your phone as a remote control to play, pause, and navigate through the Smart TV. We provide the ability of full control to your TV with phone or tablet.",
                      icon: "remote"
                    },
                    {
                      title: "Multiple TV Compatibility",
                      desc: "Our apps are designed to work with a wide range of smart TV models. Whether you own a Chromecast, Roku, Firesitck, Samsung, LG, Sony, Vizio, or other smart TVs, our apps can integrate them for a smoother experience.",
                      icon: "compatibility"
                    }
                  ].map((item) => (
                    <div key={item.title} className="group flex flex-col items-center rounded-3xl bg-white p-10 card-shadow hover:translate-y-[-10px] transition-all duration-300">
                      <div className="mb-8 h-20 w-20 transform transition-transform group-hover:scale-110">
                        <Image src={`/icons/why-${item.icon}.svg`} alt={item.title} width={80} height={80} />
                      </div>
                      <h3 className="mb-6 text-[22px] font-bold text-heading leading-[1.3]">
                        {item.title}
                      </h3>
                      <p className="text-[15px] text-muted leading-[1.7]">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Dynamic Apps Section - These usually stay dynamic but fetched from Strapi Apps collection */}
            {/* Screen Mirroring & TV Cast Apps Section */}
            <section className="py-32">
              <div className="container-custom">
                <h2 className="section-heading mb-16">Screen Mirroring & TV Cast Apps</h2>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                  {(screenMirroringApps.length > 0 ? screenMirroringApps : Array<App | null>(4).fill(null)).map((app, i) => (
                    <AppProductCard key={app?.slug || i} app={app} />
                  ))}
                </div>
              </div>
            </section>

            {/* Advanced TV Remote Apps Section */}
            <section className="py-32 bg-section-bg">
              <div className="container-custom">
                <h2 className="section-heading mb-16">Advanced TV Remote Apps</h2>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                  {(tvRemoteApps.length > 0 ? tvRemoteApps : Array<App | null>(4).fill(null)).map((app, i) => (
                    <AppProductCard key={app?.slug || i} app={app} />
                  ))}
                </div>
              </div>
            </section>

            {/* Feature Highlights Fallback */}
            <section className="py-32 bg-white">
              <div className="container-custom">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 mb-32">
                  <div className="w-full lg:w-1/2">
                    <Image
                      src="/images/highlight-mirror.webp"
                      alt="Mirroring Highlight"
                      width={600}
                      height={450}
                      className="w-full h-auto"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                  <div className="w-full lg:w-1/2">
                    <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8f3ff]">
                      <Image src="/icons/green-label.svg" alt="mirror" width={32} height={32} />
                    </div>
                    <h2 className="text-[40px] font-black leading-[1.1] text-heading mb-8">Screen Mirroring <br /> & TV Cast</h2>
                    <p className="text-[18px] text-muted leading-[1.8]">
                      BoostVision provides various screen mirroring solutions for mobile devices, including the mainstream cast technologies like DLNA, Miracast, uPNP and Google Cast. You can cast mobile screen, online meetings, live streams, web video and local files to TV without cable.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row-reverse items-center gap-16 lg:gap-24">
                  <div className="w-full lg:w-1/2">
                    <Image
                      src="/images/highlight-remote.webp"
                      alt="Remote Highlight"
                      width={600}
                      height={450}
                      className="w-full h-auto"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                  <div className="w-full lg:w-1/2">
                    <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8f3ff]">
                      <Image src="/icons/blue-label.svg" alt="remote" width={32} height={32} />
                    </div>
                    <h2 className="text-[40px] font-black leading-[1.1] text-heading mb-8">Smart TV <br /> Remote Apps</h2>
                    <p className="text-[18px] text-muted leading-[1.8]">
                      Lost Firesitck remote or Roku? Never worry about that. With our versatile remote apps, you can effortless control Roku TV & Roku Stick, Fire TV & Firestick, Samsung, LG webOS, Vizio, Sony TV, and more from anywhere in your room with a single tap.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Support Section Fallback */}
            <section className="footer-gradient py-32 text-white text-center">
              <div className="container-custom">
                <div className="mb-10 flex justify-center">
                  <div className="h-20 w-20 rounded-3xl bg-white/10 flex items-center justify-center">
                    <Image src="/icons/device-support.svg" alt="support" width={48} height={48} />
                  </div>
                </div>
                <h2 className="text-white mb-6 text-[40px] font-bold">Support Most Devices</h2>
                <p className="mx-auto max-w-[850px] text-white/70 text-[18px] leading-[1.8] mb-16">
                  With wide compatibility, our products support most of main-stream TV brands. You can enjoy seamless connectivity and stay tuned for even more compatibility updates.
                </p>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {[
                    { name: "Chromecast", icon: "brand-chromecast.webp" },
                    { name: "Samsung", icon: "brand-samsung.webp" },
                    { name: "Fire TV", icon: "brand-fire-tv.webp" },
                    { name: "Roku", icon: "brand-roku.webp" },
                    { name: "Apple TV", icon: "brand-apple-tv.webp" },
                    { name: "Hisense", icon: "brand-hisense.webp" },
                  ].map((brand) => (
                    <div key={brand.name} className="brand-pill border border-white/5 bg-white shadow-none h-16 px-4">
                      <Image src={`/icons/${brand.icon}`} alt={brand.name} width={120} height={40} className="h-full w-auto object-contain" />
                    </div>
                  ))}
                  {[
                    "Sanyo", "Magnavox", "Haier", "JVC TV", "RCA", "Seiki"
                  ].map((brand) => (
                    <div key={brand} className="brand-pill border border-white/5 bg-white shadow-none h-16">
                      <span className="text-[17px] font-black text-heading">{brand}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Reviews Section Fallback */}
            <section className="py-32 bg-white text-center">
              <div className="container-custom">
                <div className="flex justify-center mb-6">
                  <Image src="/icons/stars.svg" alt="stars" width={140} height={28} />
                </div>
                <h2 className="mb-3 text-[40px] font-bold text-heading">BoostVision Apps Reviews</h2>
                <p className="text-primary font-black text-[22px] mb-20">Excellent Rate：4.8/5.0</p>

                <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                  {[
                    { name: "Nicole Taylor", text: "It's pretty good, does the job perfectly. Very handy for when the kids have hid the remote again but can't remember where." },
                    { name: "Miguel Miguel", text: "Very good, easy to be able to connect to my fire tv even with bad internet and be able to switch to the other one that was good and watch it well." },
                    { name: "Elon Custodiol", text: "Very good bro, it works like a remote but on cell phone, can bring it everywhere and super convenient! that's why I give 5 💫" }
                  ].map((review) => (
                    <div key={review.name} className="flex flex-col items-center bg-white p-12 rounded-[30px] card-shadow text-center">
                      <p className="text-[17px] text-heading font-medium italic mb-10 leading-[1.8]">
                        &quot;{review.text}&quot;
                      </p>
                      <cite className="text-[19px] font-black text-heading not-italic">{review.name}</cite>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Final CTA Fallback */}
            <section className="py-32 text-center bg-white border-t border-gray-50">
              <div className="container-custom">
                <h2 className="mb-8 max-w-[900px] mx-auto text-[45px] leading-[1.1] font-black text-heading">
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

function AppProductCard({ app }: { app: App | null }) {
  // Placeholder data if app is null
  const data = app ?? {
    name: "Sample App Name",
    shortDescription: "Description of the app goes here. Usually two lines of text explaining core value.",
    icon: { url: "/icons/app-placeholder.webp" },
    slug: "#"
  };

  return (
    <div className="flex flex-col items-center rounded-[30px] bg-white p-10 text-center card-shadow group hover:translate-y-[-10px] transition-all duration-300">
      <div className="mb-8 h-24 w-24 relative overflow-hidden rounded-[22px] shadow-lg group-hover:scale-105 transition-transform">
        <Image src={data.icon?.url} alt={data.name} fill className="object-cover" />
      </div>
      <h3 className="mb-4 text-[20px] font-bold text-heading leading-tight min-h-[50px] flex items-center">{data.name}</h3>
      <p className="mb-8 text-[15px] text-muted leading-relaxed line-clamp-3">
        {data.shortDescription}
      </p>
      <Link href={`/app/${data.slug}`} className="mt-auto text-[16px] font-bold text-primary hover:underline">
        Learn More
      </Link>
    </div>
  );
}
