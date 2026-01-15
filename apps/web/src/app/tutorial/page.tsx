import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header, Footer } from "@/components/layout";

export const metadata: Metadata = {
  title: "Tutorial of Screen Mirroring & TV Remote Apps | BoostVision",
  description: "Guides and manuals in video and text, find tutorials by selecting your app.",
};

const tutorials = {
  screenMirroring: [
    { name: "TV Cast for Chromecast", slug: "tv-cast-for-chromecast", icon: "/apps/chromecast.png" },
    { name: "Screen Mirroring App", slug: "screen-mirroring", icon: "/apps/screen-mirroring.png" },
    { name: "Miracast App: Screen Cast", slug: "miracast", icon: "/apps/miracast.png" },
    { name: "Smart TV Cast App", slug: "universal-tv-cast", icon: "/apps/smart-tv-cast.png" },
  ],
  tvRemote: [
    // ... more would be loaded from Strapi
  ]
};

export default function TutorialPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        {/* Page Header */}
        <section className="bg-section-bg py-16 text-center">
          <div className="container-custom">
            <h2 className="text-[36px] font-bold text-heading">
              Tutorial of Screen Mirroring and TV Remote Apps
            </h2>
            <p className="mt-4 text-[18px] text-muted">
              Guides and manuals in video and text, find tutorials by selecting your app.
            </p>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="container-custom py-10">
          <div className="flex justify-center gap-12 border-b border-gray-100">
            <button className="pb-4 text-[20px] font-bold text-primary border-b-2 border-primary">
              Screen Mirroring
            </button>
            <button className="pb-4 text-[20px] font-bold text-heading hover:text-primary">
              TV Remote App
            </button>
          </div>
        </div>

        {/* Tutorial Grid */}
        <section className="pb-20">
          <div className="container-custom">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
              {tutorials.screenMirroring.map((item) => (
                <Link
                  key={item.slug}
                  href={`/tutorial/${item.slug}`}
                  className="group flex flex-col items-center text-center"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-[20px] mb-6 card-shadow border border-gray-50">
                    <Image
                      src={item.icon}
                      alt={item.name}
                      fill
                      className="object-contain p-8 transition-transform group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-[18px] font-bold text-heading group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom Support Info */}
        <section className="py-12 border-t border-gray-100">
          <div className="container-custom flex flex-col md:flex-row items-center justify-center gap-8">
            <Link href="/faq" className="text-[18px] font-bold text-primary hover:underline">F.A.Q</Link>
            <p className="text-muted">
              If you have any thoughts and questions, you can contact us at:{" "}
              <Link href="mailto:support@boostvision.com.cn" className="text-primary font-medium">support@boostvision.com.cn</Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
