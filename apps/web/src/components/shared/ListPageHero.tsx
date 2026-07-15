import { ReactNode } from "react";
import { HeroSection } from "@/types/strapi";
import { cn } from "@/lib/utils";

interface ListPageHeroProps {
  heroSection?: HeroSection;
  fallbackTitle: string;
  fallbackSubtitle: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  children?: ReactNode;
}

export function ListPageHero({
  heroSection,
  fallbackTitle,
  fallbackSubtitle,
  className,
  titleClassName,
  subtitleClassName,
  children,
}: ListPageHeroProps) {
  return (
    <section className={cn("bg-app-hero py-12 text-center md:py-24", className)}>
      <div className="container-custom">
        <h1
          className={cn(
            "mb-4 text-[24px] font-normal leading-[1.25] tracking-tight text-white md:mb-6 md:text-[40px] md:font-black",
            titleClassName
          )}
        >
          {heroSection?.title || fallbackTitle}
        </h1>
        <p
          className={cn(
            "mx-auto max-w-[800px] text-[16px] leading-relaxed text-white/70 md:text-[20px]",
            subtitleClassName
          )}
        >
          {heroSection?.subtitle || fallbackSubtitle}
        </p>
        {children}
      </div>
    </section>
  );
}
