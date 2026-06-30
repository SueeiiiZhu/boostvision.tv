import { HeroSection } from "@/types/strapi";

interface ListPageHeroProps {
  heroSection?: HeroSection;
  fallbackTitle: string;
  fallbackSubtitle: string;
}

export function ListPageHero({
  heroSection,
  fallbackTitle,
  fallbackSubtitle,
}: ListPageHeroProps) {
  return (
    <section className="bg-app-hero py-12 text-center md:py-24">
      <div className="container-custom">
        <h1 className="mb-4 text-[24px] font-normal leading-[1.25] text-white tracking-tight md:mb-6 md:text-[40px] md:font-black">
          {heroSection?.title || fallbackTitle}
        </h1>
        <p className="mx-auto max-w-[800px] text-[16px] leading-relaxed text-white/70 md:text-[20px]">
          {heroSection?.subtitle || fallbackSubtitle}
        </p>
      </div>
    </section>
  );
}
