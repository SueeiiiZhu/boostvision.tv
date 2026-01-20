import Link from "next/link";
import Image from "next/image";
import { getApps } from "@/lib/strapi/api/apps";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Screen Mirroring & TV Remote Tutorials | BoostVision",
  description: "Learn how to use BoostVision apps with our detailed video and text tutorials for screen mirroring and smart TV control.",
  openGraph: {
    title: "Screen Mirroring & TV Remote Tutorials | BoostVision",
    description: "Step-by-step guides for BoostVision apps.",
  },
};

interface Props {
  searchParams: Promise<{ type?: string }>;
}

export default async function TutorialPage({ searchParams }: Props) {
  const { type = "screen-mirroring" } = await searchParams;

  const appsResponse = await getApps({ limit: 100 }).catch(() => null);
  const apps = appsResponse?.data || [];

  const filteredApps = apps.filter(app => app.type === type);

  return (
    <>
      <main className="bg-white">
        {/* Banner */}
        <section className="bg-section-bg py-24 text-center">
          <div className="container-custom">
            <h1 className="mb-6 text-[45px] font-black text-heading leading-[1.2]">
              Tutorial of Screen Mirroring and TV Remote Apps
            </h1>
            <p className="mx-auto max-w-[800px] text-[20px] text-muted leading-relaxed">
              Guides and manuals in video and text, find tutorials by selecting your app.
            </p>
          </div>
        </section>

        {/* Apps Selection */}
        <section className="py-24">
          <div className="container-custom">
            {/* Tabs */}
            <div className="mb-16 flex justify-center gap-6">
              <Link 
                href="/tutorial?type=screen-mirroring"
                scroll={false}
                className={cn(
                  "rounded-full px-12 py-4 text-[18px] font-bold shadow-xl transition-all",
                  type === "screen-mirroring" 
                    ? "bg-primary text-white hover:translate-y-[-2px]" 
                    : "bg-white border border-gray-100 text-heading hover:bg-section-bg card-shadow"
                )}
              >
                Screen Mirroring
              </Link>
              <Link 
                href="/tutorial?type=tv-remote"
                scroll={false}
                className={cn(
                  "rounded-full px-12 py-4 text-[18px] font-bold shadow-xl transition-all",
                  type === "tv-remote" 
                    ? "bg-primary text-white hover:translate-y-[-2px]" 
                    : "bg-white border border-gray-100 text-heading hover:bg-section-bg card-shadow"
                )}
              >
                TV Remote App
              </Link>
            </div>

            {/* Apps Grid */}
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
              {filteredApps.length > 0 ? filteredApps.map((app) => (
                <Link 
                  key={app.id} 
                  href={`/tutorial/${app.slug}`}
                  className="group flex flex-col items-center rounded-[30px] bg-white p-8 text-center card-shadow transition-all duration-300 hover:translate-y-[-10px]"
                >
                  <div className="mb-6 h-20 w-20 relative overflow-hidden rounded-2xl shadow-md group-hover:scale-110 transition-transform">
                    <Image src={app.icon?.url || "/icons/app-placeholder.webp"} alt={app.name} fill className="object-cover" />
                  </div>
                  <h3 className="text-[18px] font-bold text-heading leading-tight group-hover:text-primary transition-colors">
                    {app.name}
                  </h3>
                </Link>
              )) : (
                <div className="col-span-full py-20 text-center">
                  <p className="text-[18px] text-muted">No apps found.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-section-bg py-24 text-center">
          <div className="container-custom">
            <h2 className="mb-8 text-[32px] font-black text-heading">Still have questions?</h2>
            <p className="mb-10 text-[18px] text-muted">
              If you have any thoughts and questions, you can contact us at: 
              <Link href="/faq" className="text-primary hover:underline font-bold ml-2">F.A.Q</Link>
            </p>
            <a href="mailto:support@boostvision.com.cn" className="text-[20px] font-bold text-primary">
              support@boostvision.com.cn
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
