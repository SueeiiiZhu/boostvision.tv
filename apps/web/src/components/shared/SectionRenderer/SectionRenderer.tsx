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

function renderSection(section: Section, index: number, featureHighlightOrder: number) {
  switch (section.__component) {
    case 'sections.hero':
      return <Hero key={index} data={section} />;
    case 'sections.feature-highlight':
      return <FeatureHighlight key={index} data={section} order={featureHighlightOrder} />;
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
  let featureHighlightOrder = 0;

  return (
    <>
      {sections.map((section, index) => {
        if (section.__component === 'sections.feature-highlight') {
          featureHighlightOrder += 1;
        }
        const element = renderSection(section, index, featureHighlightOrder);
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
  <section className="bg-white pt-12 md:pt-24 pb-12 overflow-hidden">
    <div className="container-custom max-w-[1320px] px-3 md:px-4">
      <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 lg:order-1 text-center lg:text-left">
          <h1 className="max-w-[900px] text-[32px] md:text-[55px] font-black leading-tight">
            {data.title.includes('&') ? data.title.split('&')[0] : data.title}
            {data.title.includes('&') && (
              <>
                <br className="hidden md:block" />
                {` & ${data.title.split('&')[1]}`}
              </>
            )}
          </h1>
          <p className="mx-auto mt-8 max-w-[800px] text-[16px] text-muted leading-[1.6] lg:mx-0">
            {data.subtitle}
          </p>
          {data.ctaText && data.ctaLink && (
            <div className="mt-6 lg:mt-12 flex justify-center lg:justify-start">
              <div className="group flex flex-col items-center gap-3 lg:flex-row lg:items-center lg:gap-6">
                <Link href={data.ctaLink} className="btn-gradient inline-flex items-center gap-4 px-12">
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
                {data.ctaSubtext && (
                  <p className="text-[14px] font-medium text-muted/80 uppercase tracking-wider opacity-50 transition-opacity duration-200 group-hover:opacity-100">
                    {data.ctaSubtext}
                  </p>
                )}
              </div>
            </div>
          )}

          {data.statistics && (
            <div className="mt-14 mx-auto flex max-w-[760px] flex-wrap items-start justify-center gap-y-4 px-12 md:gap-y-8 md:px-0">
              {[
                { label: "Downloads", value: data.statistics.downloads, icon: "downloads" },
                { label: "Countries and Regions", value: data.statistics.countries, icon: "global" },
                { label: "Satisfied Customers", value: data.statistics.customers, icon: "users" },
                { label: "Customer Service", value: data.statistics.supportHours, icon: "service" },
              ].map((stat) => (
                <div key={stat.label} className="w-full md:w-1/2 px-2 flex justify-start">
                  <div className="flex items-center gap-2">
                    <Image src={`/icons/${stat.icon}.svg`} alt={stat.label} width={20} height={20} />
                    <span className="text-[14px] text-heading leading-none">{stat.value}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {(data.image || data.backgroundImage) && (
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <OptimizedImage
              src={(data.image || data.backgroundImage)!.url}
              alt={data.title}
              width={1200}
              height={600}
              className="h-auto w-full max-w-[720px]"
              sizes="(max-width: 768px) calc(100vw - 30px), (max-width: 1200px) 50vw, 720px"
              priority
              fetchPriority="high"
            />
          </div>
        )}
      </div>
    </div>
  </section>
);

const FeatureHighlight: React.FC<{ data: FeatureHighlightSection; order: number }> = ({ data, order }) => (
  <section className={cn("py-5 md:py-32", order % 2 === 1 ? "bg-white" : "bg-[#f3f9ff]")}>
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
          <div className="mb-6 flex items-center gap-3 md:block md:mb-0">
            <div className="inline-flex h-12 sm:h-14 w-auto items-center justify-center sm:justify-start">
              <Image
                src={`/icons/${data.labelColor}-label.svg`}
                alt={`${data.labelColor} feature label`}
                width={32}
                height={32}
              />
            </div>
            <h2 className="text-[24px] md:text-[40px] font-black leading-[1.1] text-heading md:mb-8">{data.title}</h2>
          </div>
          <p className="text-[18px] text-muted leading-[1.8]">
            {data.description}
          </p>
        </div>
      </div>
    </div>
  </section>
);

const CTA: React.FC<{ data: CTASection }> = ({ data }) => (
  <section className="py-16 md:py-32 text-center bg-section-bg-cta relative overflow-hidden">
    <div className="container-custom relative z-10">
      <h2 className="mb-8 max-w-[1000px] mx-auto text-[22px] md:text-[40px] leading-[1.2] font-black text-heading">
        {data.title}
      </h2>
      <p className="text-muted/70 mb-10 md:mb-16 text-[16px] md:text-[20px] max-w-[850px] mx-auto leading-relaxed">
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
  <section className="pt-12 pb-20 md:pt-16 md:pb-32 bg-gradient-to-b from-white to-section-bg-2 text-center">
    <div className="container-custom max-w-[1320px] px-3 md:px-4">
      {data.badge && (
        <span className="mb-4 inline-flex items-center rounded-full bg-gradient-to-r from-primary to-accent px-4 py-1 text-[12px] font-bold tracking-[0.12em] text-white">
          {data.badge}
        </span>
      )}
      <h2 className="text-[24px] md:text-[40px] font-black text-heading mb-8 md:mb-14">{data.title}</h2>
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2 md:gap-x-12 md:gap-y-20 lg:grid-cols-4">
        {data.features.map((feature, i) => (
          <div key={i} className="group grid grid-cols-[96px_1fr] items-center gap-x-5 gap-y-2 rounded-[24px] border border-[#dfe8ff] bg-white/85 p-5 shadow-[0_8px_24px_rgba(30,108,244,0.08)] transition-transform duration-300 hover:-translate-y-1 md:flex md:flex-col md:px-6 md:py-8">
            <div className="h-24 w-24 shrink-0 flex items-center justify-center transform transition-transform duration-500 group-hover:scale-110 md:mb-8 md:h-[120px] md:w-full md:max-w-[320px]">
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
            <h3 className="text-[20px] md:text-[22px] font-bold text-heading leading-tight min-h-0 md:min-h-[60px] flex items-center justify-start text-left md:mb-4 md:justify-center md:text-center">
              {feature.title}
            </h3>
            <p className="col-span-2 text-[16px] text-muted leading-[1.6] max-w-none text-left md:col-auto md:max-w-[280px] md:text-center">
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
  <section className="pt-20 pb-32 bg-white text-center">
    <div className="container-custom">
      <div className="flex justify-center mb-6">
        <Image src="/icons/stars.svg" alt="stars" width={140} height={28} />
      </div>
      <h2 className="mb-3 text-[24px] md:text-[40px] font-bold text-heading">{data.title}</h2>
      <p className="text-primary font-black text-[18px] md:text-[22px] mb-10 md:mb-20">{data.rating}</p>

      <div className="md:hidden -mx-2 px-2">
        <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {data.reviews.map((review, i) => (
            <div key={i} className="snap-start shrink-0 w-[88%]">
              <div className="flex h-full flex-col items-center bg-section-bg-cta p-7 rounded-[20px] border border-[#dfe8ff] md:card-shadow text-center">
                <p className="flex-1 text-[16px] text-muted/80 font-medium italic mb-8 leading-[1.75]">
                  &quot;{review.text}&quot;
                </p>
                <p className="mt-auto inline-flex items-center gap-2 text-[19px] font-black text-heading">
                  <Image src="/icons/user-icon.svg" alt="" width={19} height={19} className="h-[19px] w-[19px]" />
                  <span>{review.name}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden md:grid grid-cols-3 gap-10">
        {data.reviews.map((review, i) => (
          <div key={i} className="flex h-full flex-col items-center bg-section-bg-cta p-12 rounded-[30px] border border-[#dfe8ff] card-shadow text-center">
            <p className="flex-1 text-[17px] text-muted/80 font-medium italic mb-10 leading-[1.8]">
              &quot;{review.text}&quot;
            </p>
            <p className="mt-auto inline-flex items-center gap-2 text-[19px] font-black text-heading">
              <Image src="/icons/user-icon.svg" alt="" width={19} height={19} className="h-[19px] w-[19px]" />
              <span>{review.name}</span>
            </p>
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
    <section className={cn("pt-12 pb-16 md:pt-20 md:pb-32", data.backgroundColor === 'section-bg' ? "bg-section-bg" : "bg-white")}>
      <div className="container-custom">
        <div className="flex flex-col items-center mb-6 md:mb-20">
          <span className="mb-4 inline-flex items-center rounded-full bg-gradient-to-r from-primary to-accent px-4 py-1 text-[12px] font-bold tracking-[0.12em] text-white">
            BOOSTVISION
          </span>
          <h2 className="text-[24px] md:text-[40px] font-bold text-primary mb-6">{data.title}</h2>
          <div className="h-1.5 w-16 bg-primary rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 gap-x-12 gap-y-[5px] md:grid-cols-2 md:gap-y-16 lg:grid-cols-3">
          {apps.map((app) => (
            <AppListCard key={app.id} app={app} />
          ))}
        </div>
      </div>
    </section>
  );
}

const BrandsGrid: React.FC<{ data: BrandsGridSection }> = ({ data }) => (
  <section className="pt-10 pb-16 md:pt-24 md:pb-32 text-white text-center bg-section-bg-3">
    <div className="container-custom">
      <div className="mb-4 flex justify-center">
        <div className="h-10 w-10 md:h-20 md:w-20 flex items-center justify-center">
          <Image src="/icons/device-support.svg" alt="support" width={24} height={24} className="md:h-12 md:w-12 h-6 w-6" />
        </div>
      </div>
      <h2 className="text-white mb-6 text-[24px] md:text-[40px] font-bold">{data.title}</h2>
      <p className="mx-auto max-w-[850px] text-white/70 text-[16px] md:text-[18px] leading-[1.8] mb-5 md:mb-16">
        {data.description}
      </p>

      <div className="md:hidden -mx-2 px-2">
        <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {Array.from({ length: Math.ceil(data.brands.length / 6) }, (_, pageIndex) => (
            <div key={pageIndex} className="snap-start shrink-0 w-[88%]">
              <div className="grid grid-cols-2 gap-3">
                {data.brands.slice(pageIndex * 6, pageIndex * 6 + 6).map((brand, i) => (
                  <div key={`${pageIndex}-${i}`} className="brand-pill h-14 px-2">
                    {brand.icon ? (
                      <OptimizedImage src={brand.icon.url} alt={brand.title} width={100} height={32} className="h-full w-auto object-contain" fetchPriority="low" />
                    ) : (
                      <span className="text-[14px] font-black text-heading">{brand.title}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden md:grid grid-cols-4 gap-4 lg:grid-cols-5">
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
    <Link href={`/app/${app.slug}`} className="group flex h-full items-center gap-6 rounded-[24px] border border-[#dfe8ff] bg-white p-4 md:p-6 shadow-[0_8px_24px_rgba(30,108,244,0.08)] transition-transform hover:translate-y-[-4px]">
      <div className="h-20 w-20 shrink-0 relative overflow-hidden">
        <OptimizedImage src={app.icon?.url || "/icons/app-placeholder.webp"} alt={app.name} fill className="object-cover" fetchPriority="low" />
      </div>
      <div className="flex flex-col pt-1">
        <h3 className="mb-[calc(var(--spacing)*1)] md:mb-3 text-[20px] font-bold text-heading leading-tight group-hover:text-primary transition-colors">
          {app.name}
        </h3>
        <p className="text-[13px] md:text-[14px] text-muted leading-[1.4] md:leading-relaxed line-clamp-3">
          {app.shortDescription}
        </p>
      </div>
    </Link>
  );
}
