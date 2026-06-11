import Link from "next/link";
import Image from "next/image";
import { getTutorialsForList } from "@/lib/strapi/api/tutorials";
import { getPageBySlug } from "@/lib/strapi/api/pages";
import { generateMetadata as genMetadata } from "@/lib/seo";
import { HeroSection, CTASection, Tutorial } from "@/types/strapi";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string }>;
}

export const revalidate = 21600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const pageData = await getPageBySlug("tutorial", locale).catch(() => null);

  return genMetadata({
    seo: pageData?.seo,
    defaultTitle: "Screen Mirroring & TV Remote Tutorials | BoostVision",
    defaultDescription: "Learn how to use BoostVision apps with our detailed video and text tutorials for screen mirroring and smart TV control.",
    path: "/tutorial",
    locale,
  });
}

export default async function TutorialPage({ params }: Props) {
  const { locale } = await params;

  const [screenMirroringResponse, tvRemoteResponse, pageData] = await Promise.all([
    getTutorialsForList({
      appType: "screen-mirroring",
      limit: 100,
      locale,
    }).catch(() => null),
    getTutorialsForList({
      appType: "tv-remote",
      limit: 100,
      locale,
    }).catch(() => null),
    getPageBySlug("tutorial", locale).catch(() => null)
  ]);

  const screenMirroringTutorials = screenMirroringResponse?.data || [];
  const tvRemoteTutorials = tvRemoteResponse?.data || [];
  const sections = pageData?.sections || [];

  const heroSection = sections.find(s => s.__component === 'sections.hero') as HeroSection | undefined;
  const ctaSection = sections.find(s => s.__component === 'sections.cta') as CTASection | undefined;

  return (
    <main className="bg-white poppins-headings">
      {/* Banner */}
      <section className="bg-app-hero py-24 text-center">
        <div className="container-custom">
          <h1 className="mb-6 !text-[35px] text-white font-black leading-[1.2]">
            {heroSection?.title || "Screen Mirroring & TV Remote Tutorials ｜BoostVision"}
          </h1>
          <p className="mx-auto max-w-[800px] text-[20px] text-white/70 leading-relaxed">
            {heroSection?.subtitle || "Download screen mirroring & TV remote apps for free at App Store and Google Play Store."}
          </p>
        </div>
      </section>

      {/* Apps Selection */}
      <section className="bg-section-bg-cta py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <TutorialCategory
              title="Screen Mirroring Apps"
              tutorials={screenMirroringTutorials}
              className="bg-[#eef6ff]"
            />
            <TutorialCategory
              title="TV Remote Apps"
              tutorials={tvRemoteTutorials}
              className="bg-[#f1f8f0]"
            />
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

function TutorialCategory({
  title,
  tutorials,
  className,
}: {
  title: string;
  tutorials: Tutorial[];
  className: string;
}) {
  return (
    <section className={`${className} rounded-[28px] p-5 md:p-8`}>
      <h2 className="mb-6 text-[24px] font-black text-heading md:text-[28px]">
        {title}
      </h2>
      <div className="flex flex-col gap-4">
        {tutorials.length > 0 ? tutorials.map((tutorial) => {
          const app = tutorial.app;
          const tutorialHref = tutorial.slug ? `/tutorial/${tutorial.slug}` : app?.slug ? `/tutorial/${app.slug}` : "/tutorial";
          return (
            <Link
              key={tutorial.id}
              href={tutorialHref}
              className="group flex min-h-[84px] w-full items-center gap-4 rounded-[18px] border border-white/70 bg-white px-4 py-4 text-left shadow-[0_10px_30px_rgba(20,48,92,0.08)] transition-colors duration-300 hover:border-primary/25 hover:bg-white/95 md:px-5"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[14px] shadow-sm">
                <Image
                  src={app?.icon?.url || "/icons/app-placeholder.webp"}
                  alt={app?.name || tutorial.title}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="min-w-0 flex-1 text-[17px] font-bold leading-tight text-heading transition-colors group-hover:text-primary">
                {app?.name || tutorial.title}
              </span>
            </Link>
          );
        }) : (
          <div className="rounded-[18px] border border-white/70 bg-white px-5 py-10 text-center">
            <p className="text-[16px] text-muted">No tutorials found.</p>
          </div>
        )}
      </div>
    </section>
  );
}
