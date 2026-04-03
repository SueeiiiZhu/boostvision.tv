import React, { Suspense } from 'react';
import Image from 'next/image';
import OptimizedImage from '../OptimizedImage';
import Link from 'next/link';
import { Section, HeroSection, FeatureHighlightSection, CTASection, WhyChooseSection, StatisticsSection, ReviewsSection, AppsGridSection, BrandsGridSection, App } from '@/types/strapi';
import { cn } from '@/lib/utils';
import { getApps } from '@/lib/strapi/api/apps';

interface SectionRendererProps {
  sections: Section[];
}

function renderSection(section: Section, index: number) {
  switch (section.__component) {
    case 'sections.hero':
      return <Hero key={index} data={section} />;
    case 'sections.feature-highlight':
      return <FeatureHighlight key={index} data={section} />;
    case 'sections.cta':
      return <CTA key={index} data={section} />;
    case 'sections.why-choose':
      return <WhyChoose key={index} data={section} />;
    case 'sections.statistics':
      return <Statistics key={index} data={section} />;
    case 'sections.reviews':
      return <Reviews key={index} data={section} />;
    case 'sections.apps-grid':
      return <AppsGrid key={index} data={section} />;
    case 'sections.brands-grid':
      return <BrandsGrid key={index} data={section} />;
    default:
      return null;
  }
}

/**
 * SectionRenderer - Server Component
 * Handles dynamic page building from Strapi sections.
 *
 * The first section (Hero) renders immediately to optimize LCP.
 * Subsequent sections are wrapped in individual Suspense boundaries so they
 * can stream progressively, reducing the initial HTML/RSC payload and allowing
 * the browser to paint the hero before async sections (e.g. AppsGrid) resolve.
 */
export async function SectionRenderer({ sections }: SectionRendererProps) {
  if (!sections || sections.length === 0) return null;

  return (
    <>
      {sections.map((section, index) => {
        const element = renderSection(section, index);
        if (!element) return null;

        // First section (hero) renders immediately — critical for LCP
        if (index === 0) return element;

        // Below-fold sections stream progressively to reduce initial payload
        return (
          <Suspense key={index} fallback={<div style={{ minHeight: '200px' }} />}>
            {element}
          </Suspense>
        );
      })}
    </>
  );
}

const Hero: React.FC<{ data: HeroSection }> = ({ data }) => (
  <section className="bg-white pt-24 pb-12 text-center overflow-hidden">
    <div className="container-custom">
      <h1 className="mx-auto max-w-[900px] text-[25px] md:text-[55px] font-black leading-tight">
        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {data.title.includes('&') ? data.title.split('&')[0] : data.title}
        </span>
        {data.title.includes('&') && (
          <>
            <br className="hidden md:block" />
            {` & ${data.title.split('&')[1]}`}
          </>
        )}
      </h1>
      <p className="mx-auto mt-8 max-w-[800px] text-[16px] text-muted leading-[1.6]">
        {data.subtitle}
      </p>
      {data.ctaText && data.ctaLink && (
        <div className="mt-12">
          <Link href={data.ctaLink} className="btn-gradient group inline-flex items-center gap-4 px-12">
            {data.ctaText}
            <svg
              className="w-6 h-6 transition-transform group-hover:translate-x-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      )}

      {data.ctaSubtext && (
        <p className="mt-2 text-[12px] tracking-widest scale-80">
          {data.ctaSubtext}
        </p>
      )}

      {data.statistics && (
        <div className="mt-20 flex flex-wrap items-center justify-center gap-y-10 gap-x-12 md:gap-x-20">
          {[
            { label: "Downloads", value: data.statistics.downloads, icon: "downloads" },
            { label: "Countries and Regions", value: data.statistics.countries, icon: "global" },
            { label: "Satisfied Customers", value: data.statistics.customers, icon: "users" },
            { label: "Customer Service", value: data.statistics.supportHours, icon: "service" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-3">
                <Image src={`/icons/${stat.icon}.svg`} alt={stat.label} width={20} height={20} />
                <span className="text-[14px] text-heading leading-none">{stat.value}</span>
              </div>
              {/* <span className="text-[14px] font-medium text-muted uppercase tracking-tight">{stat.label}</span> */}
            </div>
          ))}
        </div>
      )}

      {(data.image || data.backgroundImage) && (
        <div className="mt-24 flex justify-center scale-105 transform">
          <OptimizedImage
            src={(data.image || data.backgroundImage)!.url}
            alt={data.title}
            width={1200}
            height={600}
            className="h-auto w-full max-w-[1100px]"
            sizes="(max-width: 768px) calc(100vw - 30px), (max-width: 1200px) calc(90vw - 30px), 1100px"
            priority
            fetchPriority="high"
          />
        </div>
      )}
    </div>
  </section>
);

const FeatureHighlight: React.FC<{ data: FeatureHighlightSection }> = ({ data }) => (
  <section className="py-32 bg-white">
    <div className="container-custom">
      <div className={cn(
        "flex flex-col lg:flex-row items-center gap-16 lg:gap-24",
        data.imagePosition === 'right' && "lg:flex-row-reverse"
      )}>
        <div className="w-full lg:w-1/2">
          {data.image && (
            <OptimizedImage
              src={data.image.url}
              alt={data.title}
              width={600}
              height={450}
              className="w-full h-auto"
              sizes="(max-width: 1024px) 100vw, 50vw"
              fetchPriority="low"
            />
          )}
        </div>
        <div className="w-full lg:w-1/2">
          <div className={cn(
            "mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl",
            data.labelColor === 'green' ? "bg-[#e8f3ff]" : "bg-[#e8f3ff]"
          )}>
            <Image src={`/icons/${data.labelColor}-label.svg`} alt={`${data.labelColor} feature label`} width={32} height={32} />
          </div>
          <h2 className="text-[40px] font-black leading-[1.1] text-heading mb-8">{data.title}</h2>
          <p className="text-[18px] text-muted leading-[1.8]">
            {data.description}
          </p>
        </div>
      </div>
    </div>
  </section>
);

const CTA: React.FC<{ data: CTASection }> = ({ data }) => (
  <section className="py-32 text-center bg-section-bg-cta relative overflow-hidden">
    <div className="container-custom relative z-10">
      <h2 className="mb-8 max-w-[1000px] mx-auto text-[45px] leading-[1.2] font-black text-heading">
        {data.title}
      </h2>
      <p className="text-muted/70 mb-16 text-[20px] max-w-[850px] mx-auto leading-relaxed">
        {data.description}
      </p>
      <Link href={data.buttonLink} className="btn-gradient group inline-flex items-center gap-4 px-12">
        <span>{data.buttonText}</span>
        <svg
          className="w-6 h-6 transition-transform group-hover:translate-x-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
    </div>
  </section>
);

const WhyChoose: React.FC<{ data: WhyChooseSection }> = ({ data }) => (
  <section className="py-32 bg-section-bg-2 text-center">
    <div className="container-custom">
      <h2 className="text-[40px] font-black text-heading mb-24">{data.title}</h2>
      <div className="grid grid-cols-1 gap-x-12 gap-y-20 md:grid-cols-2 lg:grid-cols-4">
        {data.features.map((feature, i) => (
          <div key={i} className="group flex flex-col items-center">
            <div className="mb-12 h-[120px] flex items-center justify-center transform transition-transform duration-500 group-hover:scale-110">
              {feature.icon && (
                <OptimizedImage
                  src={feature.icon.url}
                  alt={feature.title}
                  width={160}
                  height={120}
                  className="h-auto w-auto max-h-full max-w-full object-contain"
                  fetchPriority="low"
                />
              )}
            </div>
            <h3 className="mb-6 text-[22px] font-bold text-heading leading-tight min-h-[60px] flex items-start justify-center">
              {feature.title}
            </h3>
            <p className="text-[16px] text-muted leading-[1.6] max-w-[280px]">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Statistics: React.FC<{ data: StatisticsSection }> = ({ data }) => (
  <section className="py-20">
    <div className="container-custom">
      <div className="flex flex-wrap items-center justify-center gap-y-10 gap-x-12 md:gap-x-20">
        {[
          { label: "Downloads", value: data.stats.downloads, icon: "download" },
          { label: "Countries and Regions", value: data.stats.countries, icon: "global" },
          { label: "Satisfied Customers", value: data.stats.customers, icon: "users" },
          { label: "Customer Service", value: data.stats.supportHours, icon: "service" },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <Image src={`/icons/${stat.icon}.svg`} alt={stat.label} width={32} height={32} />
            </div>
            <span className="text-[14px] font-medium text-muted uppercase tracking-tight">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Reviews: React.FC<{ data: ReviewsSection }> = ({ data }) => (
  <section className="py-32 bg-white text-center">
    <div className="container-custom">
      <div className="flex justify-center mb-6">
        <Image src="/icons/stars.svg" alt="stars" width={140} height={28} />
      </div>
      <h2 className="mb-3 text-[40px] font-bold text-heading">{data.title}</h2>
      <p className="text-primary font-black text-[22px] mb-20">Excellent Rate：{data.rating}</p>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        {data.reviews.map((review, i) => (
          <div key={i} className="flex flex-col items-center bg-white p-12 rounded-[30px] card-shadow text-center">
            <p className="text-[17px] text-heading font-medium italic mb-10 leading-[1.8]">
              &quot;{review.text}&quot;
            </p>
            <p className="text-[19px] font-black text-heading">{review.name}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

async function AppsGrid({ data }: { data: AppsGridSection }) {
  const res = await getApps({ type: data.type, limit: data.limit });
  const apps = res.data || [];

  return (
    <section className={cn("py-32", data.backgroundColor === 'section-bg' ? "bg-section-bg" : "bg-white")}>
      <div className="container-custom">
        <div className="flex flex-col items-center mb-20">
          <h2 className="text-[40px] text-primary mb-6">{data.title}</h2>
          <div className="h-1.5 w-16 bg-primary rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 gap-x-12 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {apps.map((app) => (
            <AppListCard key={app.id} app={app} />
          ))}
        </div>
      </div>
    </section>
  );
}

const BrandsGrid: React.FC<{ data: BrandsGridSection }> = ({ data }) => (
  <section className="py-32 text-white text-center bg-section-bg-3">
    <div className="container-custom">
      <div className="mb-10 flex justify-center">
        <div className="h-20 w-20 rounded-3xl bg-white/10 flex items-center justify-center">
          <Image src="/icons/device-support.svg" alt="support" width={48} height={48} />
        </div>
      </div>
      <h3 className="text-white mb-6 text-[20px] font-bold">{data.title}</h3>
      <p className="mx-auto max-w-[850px] text-white/70 text-[18px] leading-[1.8] mb-16">
        {data.description}
      </p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {data.brands.map((brand, i) => (
          <div key={i} className="brand-pill h-16 px-4">
            {brand.icon ? (
              <OptimizedImage src={brand.icon.url} alt={brand.title} width={120} height={40} className="h-full w-auto object-contain" fetchPriority="low" />
            ) : (
              <span className="text-[17px] font-black text-heading">{brand.title}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);

function AppListCard({ app }: { app: App }) {
  return (
    <Link href={`/app/${app.slug}`} className="group flex items-start gap-6 transition-transform hover:translate-y-[-4px]">
      <div className="h-20 w-20 shrink-0 relative overflow-hidden rounded-[20px] shadow-lg border border-gray-100">
        <OptimizedImage src={app.icon?.url || "/icons/app-placeholder.webp"} alt={app.name} fill className="object-cover" fetchPriority="low" />
      </div>
      <div className="flex flex-col pt-1">
        <h3 className="mb-3 text-[20px] font-bold text-heading leading-tight group-hover:text-primary transition-colors">
          {app.name}
        </h3>
        <p className="text-[15px] text-muted leading-relaxed line-clamp-3">
          {app.shortDescription}
        </p>
      </div>
    </Link>
  );
}
