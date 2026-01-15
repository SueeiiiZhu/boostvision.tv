import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header, Footer } from "@/components/layout";

export const metadata: Metadata = {
  title: "F.A.Q. | BoostVision",
  description: "The library of answers to frequently asked questions, seek by selecting your app and you will find the answer.",
};

const faqs = {
  screenMirroring: [
    { name: "Smart TV Cast App", slug: "universal-tv-cast", icon: "/apps/smart-tv-cast.png" },
    { name: "Miracast App: Screen Cast", slug: "miracast", icon: "/apps/miracast.png" },
    { name: "Screen Mirroring App", slug: "screen-mirroring", icon: "/apps/screen-mirroring.png" },
    { name: "TV Cast for Chromecast", slug: "tv-cast-for-chromecast", icon: "/apps/chromecast.png" },
  ],
  tvRemote: [
    // ... more would be loaded from Strapi
  ]
};

export default function FAQPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        {/* Page Header */}
        <section className="bg-section-bg py-16 text-center">
          <div className="container-custom">
            <h2 className="text-[36px] font-bold text-heading">
              Support for Screen Mirroring & TV Remote Apps
            </h2>
            <p className="mt-4 text-[18px] text-muted">
              The library of answers to frequently asked questions, seek by selecting your app and you will find the answer.
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

        {/* FAQ Grid */}
        <section className="pb-20">
          <div className="container-custom">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
              {faqs.screenMirroring.map((item) => (
                <Link
                  key={item.slug}
                  href={`/faq/${item.slug}`}
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
            <Link href="/tutorial" className="text-[18px] font-bold text-primary hover:underline">Tutorial</Link>
            <p className="text-muted">
              Alternatively you can contact us via email,{" "}
              <Link href="mailto:support@boostvision.com.cn" className="text-primary font-medium">support@boostvision.com.cn</Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
