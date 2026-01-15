import Link from "next/link";
import Image from "next/image";
import { Header, Footer } from "@/components/layout";
import { getApps } from "@/lib/strapi/api/apps";
import { getGlobalSetting } from "@/lib/strapi/api/global";

export default async function Home() {
  // Fetch real data from Strapi
  const [appsResponse, globalSetting] = await Promise.all([
    getApps({ limit: 8 }),
    getGlobalSetting(),
  ]).catch(() => [null, null]);

  const apps = appsResponse?.data || [];
  const screenMirroringApps = apps.filter(app => app.type === 'screen-mirroring').slice(0, 4);
  const tvRemoteApps = apps.filter(app => app.type === 'tv-remote').slice(0, 4);
  
  const stats = globalSetting?.statistics || {
    downloads: "28,000,000+",
    countries: "200+",
    customers: "10,000,000+",
    supportHours: "24/7/365"
  };

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-white py-20 text-center mt-[98px]">
          <div className="container-custom">
            <h1 className="mx-auto max-w-[850px] text-[40px] md:text-[55px] font-[900] leading-[1.1] text-heading">
              <span className="text-gradient">Screen Mirroring</span> <br className="hidden md:block" /> & TV Remote Apps
            </h1>
            <p className="mx-auto mt-6 max-w-[750px] text-[18px] text-muted leading-[1.6]">
              Mirror the screen of your iPhone, iPad, Android phone & tablet
              directly to your Smart TV. <br /> Try our professional remote control
              apps on mobile device to improve smart home control experience.{" "}
              <strong>No cables required.</strong>
            </p>
            <div className="mt-10">
              <Link href="/app" className="btn-gradient">
                GET IT NOW
              </Link>
            </div>
            <p className="mt-6 text-[14px] text-muted">
              Best choice for 20 million+ users
            </p>

            {/* Stats Row */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 md:gap-16">
              <div className="flex items-center gap-2">
                <Image src="/icons/download.svg" alt="download" width={24} height={24} />
                <span className="text-[16px] font-medium text-heading">{stats.downloads} Downloads</span>
              </div>
              <div className="flex items-center gap-2">
                <Image src="/icons/global.svg" alt="global" width={24} height={24} />
                <span className="text-[16px] font-medium text-heading">{stats.countries} Countries and Regions</span>
              </div>
              <div className="flex items-center gap-2">
                <Image src="/icons/users.svg" alt="users" width={24} height={24} />
                <span className="text-[16px] font-medium text-heading">{stats.customers} Satisfied Customers</span>
              </div>
              <div className="flex items-center gap-2">
                <Image src="/icons/service.svg" alt="service" width={24} height={24} />
                <span className="text-[16px] font-medium text-heading">{stats.supportHours} Customer Service</span>
              </div>
            </div>

            {/* Main Product Image */}
            <div className="mt-16 flex justify-center">
              <Image
                src="/images/hero-devices.png"
                alt="BoostVision Apps"
                width={1000}
                height={500}
                className="h-auto w-full max-w-[1000px]"
                priority
              />
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="py-20 text-center">
          <div className="container-custom">
            <h2 className="mb-16 text-[40px] font-bold text-heading">
              Why Choose BoostVision Apps?
            </h2>
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "TV Cast via Wi-Fi Network",
                  desc: "We are committed to enhancing your Smart TV experience with our advanced wireless solutions.",
                  icon: "wifi"
                },
                {
                  title: "High Quality Screen Mirroring",
                  desc: "BoostVision streaming apps provide screen mirroring and TV Cast services.",
                  icon: "mirror"
                },
                {
                  title: "Physical Remote Replacements",
                  desc: "Lost your TV remote? No worries! Just try our apps and use your phone as a remote control.",
                  icon: "remote"
                },
                {
                  title: "Multiple TV Compatibility",
                  desc: "Our apps are designed to work with a wide range of smart TV models.",
                  icon: "compatibility"
                }
              ].map((item) => (
                <div key={item.title} className="flex flex-col items-center">
                  <div className="mb-6 h-20 w-20">
                    <Image src={`/icons/why-${item.icon}.svg`} alt={item.title} width={80} height={80} />
                  </div>
                  <h3 className="mb-4 text-[24px] font-semibold text-heading leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-[16px] text-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Screen Mirroring & TV Cast Apps Section */}
        <section className="py-20 bg-section-bg">
          <div className="container-custom">
            <h2 className="section-heading">Screen Mirroring & TV Cast Apps</h2>
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {(screenMirroringApps.length > 0 ? screenMirroringApps : [
                { name: "Screen Mirroring App", shortDescription: "Mirror screen & cast media via DLNA protocol.", icon: { url: "/icons/app-mirror.png" }, slug: "screen-mirroring" },
                { name: "TV Cast for Chromecast", shortDescription: "Mirror screen & cast media to Google Chromecast.", icon: { url: "/icons/app-chromecast.png" }, slug: "tv-cast-for-chromecast" },
                { name: "Miracast App: Screen Cast", shortDescription: "Mirror screen & cast media to various smart TVs.", icon: { url: "/icons/app-miracast.png" }, slug: "miracast" },
                { name: "Smart TV Cast App", shortDescription: "Mirror screen & cast media to multiple brands.", icon: { url: "/icons/app-smart-tv.png" }, slug: "universal-tv-cast" }
              ]).map((app: any) => (
                <Link key={app.slug} href={`/app/${app.slug}`} className="flex items-start gap-4 rounded-[20px] bg-white p-6 card-shadow hover:translate-y-[-4px] transition-transform">
                  <div className="h-16 w-16 shrink-0 relative overflow-hidden rounded-xl">
                    <Image src={app.icon?.url} alt={app.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="text-[18px] font-bold text-heading">{app.name}</h4>
                    <p className="mt-2 text-[14px] text-muted leading-relaxed line-clamp-2">{app.shortDescription}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Advanced TV Remote Apps Section */}
        <section className="py-20">
          <div className="container-custom">
            <h2 className="section-heading">Advanced TV Remote Apps</h2>
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {(tvRemoteApps.length > 0 ? tvRemoteApps : [
                { name: "Remote for Fire TV & Stick", shortDescription: "Control amazon fire tv & fire stick.", icon: { url: "/icons/app-fire.png" }, slug: "fire-tv-remote" },
                { name: "Remote for Roku TV & Stick", shortDescription: "Control Roku TV & Roku streaming stick.", icon: { url: "/icons/app-roku.png" }, slug: "roku-tv-remote" },
                { name: "Remote for Samsung TV", shortDescription: "Control Samsung smart TV.", icon: { url: "/icons/app-samsung.png" }, slug: "samsung-tv-remote" },
                { name: "Remote for LG TV", shortDescription: "Control LG smart TV with WebOS.", icon: { url: "/icons/app-lg.png" }, slug: "lg-tv-remote" }
              ]).map((app: any) => (
                <Link key={app.slug} href={`/app/${app.slug}`} className="flex items-start gap-4 rounded-[20px] bg-white p-6 card-shadow hover:translate-y-[-4px] transition-transform">
                  <div className="h-16 w-16 shrink-0 relative overflow-hidden rounded-xl">
                    <Image src={app.icon?.url} alt={app.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="text-[18px] font-bold text-heading">{app.name}</h4>
                    <p className="mt-2 text-[14px] text-muted leading-relaxed line-clamp-2">{app.shortDescription}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Brands Section */}
        <section className="footer-gradient py-20 text-white text-center">
          <div className="container-custom">
            <h2 className="text-white mb-6">Support Most Devices</h2>
            <p className="mx-auto max-w-[800px] text-white/70 mb-12">
              With wide compatibility, our products support most of main-stream TV brands.
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {[
                "Chromecast", "Samsung", "Fire TV", "Roku", "Apple TV", "Hisense",
                "Sanyo", "Magnavox", "Haier", "JVC TV", "RCA", "Seiki"
              ].map((brand) => (
                <div key={brand} className="brand-pill">
                  <span className="text-[16px] font-bold text-heading">{brand}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-20 bg-white text-center">
          <div className="container-custom">
            <div className="flex justify-center mb-4">
              <Image src="/icons/stars.svg" alt="stars" width={120} height={24} />
            </div>
            <h2 className="mb-2">BoostVision Apps Reviews</h2>
            <p className="text-muted mb-16 font-medium text-[18px]">Excellent Rate：4.8/5.0</p>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-3">
              {[
                { name: "Nicole Taylor", text: "It's pretty good, does the job perfectly. Very handy for when the kids have hid the remote again." },
                { name: "Miguel Miguel", text: "Very good, easy to be able to connect to my fire tv even with bad internet." },
                { name: "Elon Custodiol", text: "Very good bro, it works like a remote but on cell phone, super convenient!" }
              ].map((review) => (
                <div key={review.name} className="flex flex-col items-center bg-white p-8 rounded-[20px] shadow-xl border border-gray-50">
                  <p className="text-[16px] text-heading italic mb-6 leading-relaxed">
                    &quot;{review.text}&quot;
                  </p>
                  <h4 className="text-[18px] font-bold text-heading">{review.name}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 text-center bg-white">
          <div className="container-custom">
            <h2 className="mb-6 max-w-[800px] mx-auto leading-tight">
              Free Download BoostVision Screen Mirroring & TV Remote Apps Today!
            </h2>
            <p className="text-muted mb-10 text-[18px]">
              Go to our App download center to install screen mirroring and TV remote apps on iPhone and Android now.
            </p>
            <Link href="/app" className="btn-gradient">
              GET IT NOW
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
