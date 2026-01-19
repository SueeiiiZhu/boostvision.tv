import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Section, HeroSection, FeatureHighlightSection, CTASection, WhyChooseSection, StatisticsSection, ReviewsSection } from '@/types/strapi';
import { cn } from '@/lib/utils';

interface SectionRendererProps {
  sections: Section[];
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({ sections }) => {
  return (
    <>
      {sections.map((section, index) => {
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
          default:
            return null;
        }
      })}
    </>
  );
};

const Hero: React.FC<{ data: HeroSection }> = ({ data }) => (
  <section className="bg-white pt-24 pb-12 text-center overflow-hidden">
    <div className="container-custom">
      <h1 className="mx-auto max-w-[900px]">
        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {data.title.split('&')[0]}
        </span>
        {data.title.includes('&') && ` & ${data.title.split('&')[1]}`}
      </h1>
      <p className="mx-auto mt-8 max-w-[800px] text-[20px] text-muted leading-[1.6]">
        {data.subtitle}
      </p>
      {data.ctaText && data.ctaLink && (
        <div className="mt-12">
          <Link href={data.ctaLink} className="btn-gradient">
            {data.ctaText}
          </Link>
        </div>
      )}
      {data.backgroundImage && (
        <div className="mt-24 flex justify-center scale-105 transform">
          <Image
            src={data.backgroundImage.url}
            alt={data.title}
            width={1200}
            height={600}
            className="h-auto w-full max-w-[1100px]"
            priority
          />
        </div>
      )}
    </div>
  </section>
);

const FeatureHighlight: React.FC<{ data: FeatureHighlightSection }> = ({ data }) => (
  <div className={cn(
    "flex flex-col lg:flex-row items-center gap-16 lg:gap-24",
    data.imagePosition === 'right' && "lg:flex-row-reverse"
  )}>
    <div className="w-full lg:w-1/2">
      <Image src={data.image.url} alt={data.title} width={600} height={450} className="w-full h-auto" />
    </div>
    <div className="w-full lg:w-1/2">
      <div className={cn(
        "mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl",
        data.labelColor === 'green' ? "bg-[#e8f3ff]" : "bg-[#e8f3ff]" // Adjust colors based on theme
      )}>
        <Image src={`/icons/${data.labelColor}-label.svg`} alt="icon" width={32} height={32} />
      </div>
      <h2 className="text-[40px] font-black leading-[1.1] text-heading mb-8">{data.title}</h2>
      <p className="text-[18px] text-muted leading-[1.8]">
        {data.description}
      </p>
    </div>
  </div>
);

const CTA: React.FC<{ data: CTASection }> = ({ data }) => (
  <section className="py-32 text-center bg-white border-t border-gray-50">
    <div className="container-custom">
      <h2 className="mb-8 max-w-[900px] mx-auto text-[45px] leading-[1.1] font-black text-heading">
        {data.title}
      </h2>
      <p className="text-muted mb-12 text-[20px] max-w-[700px] mx-auto leading-relaxed">
        {data.description}
      </p>
      <Link href={data.buttonLink} className="btn-gradient">
        {data.buttonText}
      </Link>
    </div>
  </section>
);

const WhyChoose: React.FC<{ data: WhyChooseSection }> = ({ data }) => (
  <section className="py-32 bg-section-bg text-center">
    <div className="container-custom">
      <h2 className="section-heading mb-20">{data.title}</h2>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
        {data.features.map((feature, i) => (
          <div key={i} className="group flex flex-col items-center rounded-3xl bg-white p-10 card-shadow hover:translate-y-[-10px] transition-all duration-300">
            <div className="mb-8 h-20 w-20 transform transition-transform group-hover:scale-110">
              {feature.icon && <Image src={feature.icon.url} alt={feature.title} width={80} height={80} />}
            </div>
            <h3 className="mb-6 text-[22px] font-bold text-heading leading-[1.3]">{feature.title}</h3>
            <p className="text-[15px] text-muted leading-[1.7]">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Statistics: React.FC<{ data: StatisticsSection }> = ({ data }) => (
  <div className="mt-20 flex flex-wrap items-center justify-center gap-y-10 gap-x-12 md:gap-x-20">
    {[
      { label: "Downloads", value: data.stats.downloads, icon: "download" },
      { label: "Countries and Regions", value: data.stats.countries, icon: "global" },
      { label: "Satisfied Customers", value: data.stats.customers, icon: "users" },
      { label: "Customer Service", value: data.stats.supportHours, icon: "service" },
    ].map((stat) => (
      <div key={stat.label} className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-3">
          <Image src={`/icons/${stat.icon}.svg`} alt={stat.label} width={32} height={32} />
          <span className="text-[24px] font-black text-heading leading-none">{stat.value}</span>
        </div>
        <span className="text-[14px] font-medium text-muted uppercase tracking-tight">{stat.label}</span>
      </div>
    ))}
  </div>
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
            <h4 className="text-[19px] font-black text-heading">{review.name}</h4>
          </div>
        ))}
      </div>
    </div>
  </section>
);
