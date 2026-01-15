"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header, Footer } from "@/components/layout";
import { cn } from "@/lib/utils";

// This would normally come from Strapi, using mock for UI refinement
const mockApps = [
  { id: 1, name: "Screen Mirroring App", type: "screen-mirroring", shortDescription: "Mirror screen & cast media from iPhone or Android to smart TVs via DLNA protocol.", icon: "/icons/app-mirror.png", slug: "screen-mirroring", googlePlayUrl: "#", appStoreUrl: "#" },
  { id: 2, name: "TV Cast for Chromecast", type: "screen-mirroring", shortDescription: "Mirror screen & cast media to Google Chromecast devices.", icon: "/icons/app-chromecast.png", slug: "tv-cast-for-chromecast", googlePlayUrl: "#", appStoreUrl: "#" },
  { id: 3, name: "Miracast App: Screen Cast", type: "screen-mirroring", shortDescription: "Mirror screen & cast media from iPhone or Android to various smart TVs.", icon: "/icons/app-miracast.png", slug: "miracast", googlePlayUrl: "#", appStoreUrl: "#" },
  { id: 4, name: "Smart TV Cast App", type: "screen-mirroring", shortDescription: "Mirror screen & cast media from iOS & Android device to multiple brands of smart TV.", icon: "/icons/app-smart-tv.png", slug: "universal-tv-cast", googlePlayUrl: "#", appStoreUrl: "#" },
  { id: 5, name: "Remote for Fire TV", type: "tv-remote", shortDescription: "Remote app for iOS & Android to control amazon fire tv & fire stick.", icon: "/icons/app-fire.png", slug: "fire-tv-remote", googlePlayUrl: "#", appStoreUrl: "#" },
  { id: 6, name: "Remote for LG TV", type: "tv-remote", shortDescription: "Remote app for iOS & Android to control LG smart TV with WebOS.", icon: "/icons/app-lg.png", slug: "lg-tv-remote", googlePlayUrl: "#", appStoreUrl: "#" },
  { id: 7, name: "Remote for Roku TV", type: "tv-remote", shortDescription: "Remote app for iOS & Android to control Roku TV & Roku streaming stick.", icon: "/icons/app-roku.png", slug: "roku-tv-remote", googlePlayUrl: "#", appStoreUrl: "#" },
  { id: 8, name: "Remote for Samsung TV", type: "tv-remote", shortDescription: "Remote app for iOS & Android to control Samsung smart TV.", icon: "/icons/app-samsung.png", slug: "samsung-tv-remote", googlePlayUrl: "#", appStoreUrl: "#" },
];

export default function AppsPage() {
  const [activeTab, setActiveTab] = useState<"screen-mirroring" | "tv-remote">("screen-mirroring");

  const filteredApps = mockApps.filter(app => app.type === activeTab);

  return (
    <>
      <Header />
      <main className="pt-[98px]">
        {/* Banner */}
        <section className="bg-section-bg py-16 text-center">
          <div className="container-custom">
            <h1 className="mb-4 text-[32px] md:text-[42px] font-black text-heading">
              Download Screen Mirroring & TV Remote Apps ｜BoostVision
            </h1>
            <p className="text-[16px] md:text-[18px] text-muted max-w-[800px] mx-auto">
              Download screen mirroring & TV remote apps for free at App Store and Google Play Store.
            </p>
          </div>
        </section>

        {/* Apps List */}
        <section className="py-20">
          <div className="container-custom">
            {/* Tabs */}
            <div className="mb-16 flex flex-wrap justify-center gap-4">
               <button 
                 onClick={() => setActiveTab("screen-mirroring")}
                 className={cn(
                   "flex items-center gap-2 rounded-full px-8 py-3 text-[16px] font-bold transition-all duration-300",
                   activeTab === "screen-mirroring" 
                    ? "bg-primary text-white shadow-xl translate-y-[-2px]" 
                    : "bg-white text-heading border border-gray-100 hover:bg-gray-50"
                 )}
               >
                 <Image 
                   src="/icons/tab-mirroring.svg" 
                   alt="" 
                   width={20} 
                   height={20} 
                   className={cn(activeTab === "screen-mirroring" ? "brightness-0 invert" : "")} 
                 />
                 Screen Mirroring Apps
               </button>
               <button 
                 onClick={() => setActiveTab("tv-remote")}
                 className={cn(
                   "flex items-center gap-2 rounded-full px-8 py-3 text-[16px] font-bold transition-all duration-300",
                   activeTab === "tv-remote" 
                    ? "bg-primary text-white shadow-xl translate-y-[-2px]" 
                    : "bg-white text-heading border border-gray-100 hover:bg-gray-50"
                 )}
               >
                 <Image 
                   src="/icons/tab-remote.svg" 
                   alt="" 
                   width={20} 
                   height={20} 
                   className={cn(activeTab === "tv-remote" ? "brightness-0 invert" : "")} 
                 />
                 TV Remote Apps
               </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredApps.map((app) => (
                <div key={app.id} className="flex flex-col items-center rounded-[30px] bg-white p-10 text-center card-shadow transition-all duration-300 hover:translate-y-[-8px] border border-transparent hover:border-primary/10">
                  <div className="mb-8 h-24 w-24 relative overflow-hidden rounded-[24px] shadow-lg">
                    <Image src={app.icon} alt={app.name} fill className="object-cover" />
                  </div>
                  <h3 className="mb-4 text-[22px] font-bold text-heading leading-tight min-h-[54px] flex items-center">
                    <Link href={`/app/${app.slug}`} className="hover:text-primary transition-colors">
                      {app.name}
                    </Link>
                  </h3>
                  <p className="mb-8 text-[15px] text-muted leading-relaxed line-clamp-3">
                    {app.shortDescription}
                  </p>
                  
                  <div className="mt-auto flex flex-col sm:flex-row gap-4 w-full justify-center">
                    {app.googlePlayUrl && (
                      <a href={app.googlePlayUrl} className="hover:opacity-80 transition-opacity">
                        <Image src="/images/google-play-badge.png" alt="Google Play" width={135} height={40} className="mx-auto" />
                      </a>
                    )}
                    {app.appStoreUrl && (
                      <a href={app.appStoreUrl} className="hover:opacity-80 transition-opacity">
                        <Image src="/images/app-store-badge.png" alt="App Store" width={135} height={40} className="mx-auto" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="bg-section-bg py-20 text-center">
          <div className="container-custom">
            <h2 className="mb-8 text-[32px] font-bold text-heading">Still have questions?</h2>
            <p className="mb-10 text-[18px] text-muted leading-relaxed">
              If you have any thoughts and questions, you can contact us at: <br />
              <Link href="/tutorial" className="text-primary font-bold hover:underline">How-to Guides</Link> or{" "}
              <Link href="/faq" className="text-primary font-bold hover:underline">F.A.Q</Link>
            </p>
            <a href="mailto:support@boostvision.com.cn" className="text-[22px] font-black text-primary hover:underline">
              support@boostvision.com.cn
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
