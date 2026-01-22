import Link from "next/link";
import Image from "next/image";
import { getTutorials } from "@/lib/strapi/api/tutorials";
import { getPageBySlug } from "@/lib/strapi/api/pages";
import { HeroSection, CTASection } from "@/types/strapi";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Screen Mirroring & TV Remote Tutorials | BoostVision",
  description: "Learn how to use BoostVision apps with our detailed video and text tutorials for screen mirroring and smart TV control.",
};

interface Props {
  searchParams: Promise<{ type?: string }>;
}

export default async function TutorialPage({ searchParams }: Props) {
  const { type = "screen-mirroring" } = await searchParams;

  const [tutorialsResponse, pageData] = await Promise.all([
    getTutorials({
      appType: type as 'screen-mirroring' | 'tv-remote',
      limit: 100
    }).catch(() => null),
    getPageBySlug("tutorial").catch(() => null)
  ]);

  const tutorials = tutorialsResponse?.data || [];
  const sections = pageData?.sections || [];

  const heroSection = sections.find(s => s.__component === 'sections.hero') as HeroSection | undefined;
  const ctaSection = sections.find(s => s.__component === 'sections.cta') as CTASection | undefined;

  return (
    <main className="bg-white">
      {/* Banner */}
      <section className="bg-app-hero py-24 text-center">
        <div className="container-custom">
          <h2 className="mb-6 !text-[35px] text-white font-black text-heading leading-[1.2]">
            {heroSection?.title || "Download Screen Mirroring & TV Remote Apps ｜BoostVision"}
          </h2>
          <p className="mx-auto max-w-[800px] text-[20px] text-white/70 leading-relaxed">
            {heroSection?.subtitle || "Download screen mirroring & TV remote apps for free at App Store and Google Play Store."}
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

          {/* Tutorials Grid */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
            {tutorials.length > 0 ? tutorials.map((tutorial) => {
              const app = tutorial.app;
              return (
                <Link
                  key={tutorial.id}
                  href={`/tutorial/${app?.slug}`}
                  className="group flex flex-col items-center rounded-[30px] bg-white p-8 text-center card-shadow transition-all duration-300 hover:translate-y-[-10px]"
                >
                  <div className="mb-6 h-20 w-20 relative overflow-hidden rounded-2xl shadow-md group-hover:scale-110 transition-transform">
                    <Image
                      src={app?.icon?.url || "/icons/app-placeholder.webp"}
                      alt={tutorial.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-[18px] font-bold text-heading leading-tight group-hover:text-primary transition-colors">
                    {tutorial.title}
                  </h3>
                </Link>
              );
            }) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-[18px] text-muted">No tutorials found.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      {/* Bottom Support CTA */}
      <div className="mt-32 p-16 text-center">
        <h3 className="text-[32px] font-black text-heading mb-12">
          {ctaSection?.title}
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
    </main>
  );
}
