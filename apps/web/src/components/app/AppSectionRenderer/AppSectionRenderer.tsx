import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Section, HeroSection, FeatureHighlightSection, WhyChooseSection, CTASection, BrandsGridSection, App, GlobalSetting } from '@/types/strapi';
import { cn } from '@/lib/utils';
import { RichText, QRCode } from '@/components/shared';

interface AppSectionRendererProps {
    sections: Section[];
    app: App;
    globalSetting?: GlobalSetting | null;
}

/**
 * AppSectionRenderer - Server Component
 * Dedicated renderer for App Detail pages to match their unique style
 */
export function AppSectionRenderer({ sections, app, globalSetting }: AppSectionRendererProps) {
    if (!sections || sections.length === 0) return null;

    return (
        <>
            {sections.map((section, index) => {
                switch (section.__component) {
                    case 'sections.hero':
                        return <AppHero key={index} data={section} app={app} globalSetting={globalSetting} />;
                    case 'sections.why-choose':
                        return <AppWhyChoose key={index} data={section} />;
                    case 'sections.cta':
                        return <AppCTA key={index} data={section} app={app} />;
                    case 'sections.brands-grid':
                        return <AppBrandsGrid key={index} data={section} app={app} />;
                    case 'sections.feature-highlight':
                        return <AppFeatureHighlight key={index} data={section} app={app} isEven={index % 2 === 1} />;
                    default:
                        // For sections not specifically styled for App pages, 
                        // we could potentially fallback to standard SectionRenderer components
                        return null;
                }
            })}
        </>
    );
}

const AppHero: React.FC<{ data: HeroSection; app: App; globalSetting?: GlobalSetting | null }> = ({ data, app, globalSetting }) => (
    <section className="pt-0 md:pt-24 pb-20 bg-white">
        <div className="container-custom">
            <div className="flex flex-col lg:flex-row items-center gap-0 md:gap-16 lg:gap-24">
                {/* Left Column: Text Content */}
                <div className="order-2 lg:order-1 flex-1 text-left">
                    <h1 className="text-[30px] md:text-[55px] font-black text-heading leading-[1.1] mb-8 tracking-tight">
                        {data.title || app.displayTitle || app.name}
                    </h1>

                    {/* 使用 RichText 渲染 Hero 描述 */}
                    <RichText
                        content={data.subtitle || app.shortDescription}
                        className="text-[16px] text-muted/80 leading-relaxed mb-10 max-w-[500px]"
                    />

                    {/* Stats Section */}
                    <div className="flex flex-col gap-4 mb-12">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-6 h-6">
                                <Image src="/icons/downloads.svg" alt="download" width={20} height={20} className="w-5 h-5" />
                            </div>
                            <span className="text-[15px] md:text-[18px] font-semibold text-muted/90 tracking-normal md:tracking-wide">
                                {app.downloadCount || "3+ Million"}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-6 h-6">
                                <Image src="/icons/rate.svg" alt="rate" width={20} height={20} className="w-5 h-5" />
                            </div>
                            <span className="text-[15px] md:text-[18px] font-semibold text-muted/90 tracking-normal md:tracking-wide">
                                {globalSetting?.appStoreRateLabel || "Decent App Store Rate:"} 
                                {/* <span className="text-primary">{app.rating || "4.8"}</span> */}
                            </span>
                            <div className="flex items-center gap-1 ml-1">
                                {/* 渲染 5 颗星逻辑 - 放在文字后面 */}
                                {[...Array(5)].map((_, i) => {
                                    const parsedRating =
                                        typeof app.rating === "number"
                                            ? app.rating
                                            : typeof app.rating === "string"
                                                ? Number(app.rating)
                                                : NaN;
                                    const rating =
                                        Number.isFinite(parsedRating) && parsedRating > 0 && parsedRating <= 5
                                            ? parsedRating
                                            : 4.8;
                                    const starValue = i + 1;

                                    if (starValue <= Math.floor(rating)) {
                                        // 全星
                                        return <Image key={i} src="/icons/star-icon.svg" alt="star" width={18} height={18} className="w-[18px] h-[18px]" />;
                                    } else if (starValue === Math.ceil(rating) && rating % 1 !== 0) {
                                        // 半星逻辑
                                        return (
                                            <div key={i} className="relative w-[18px] h-[18px]">
                                                <div className="absolute inset-0 opacity-20">
                                                    <Image src="/icons/star-icon.svg" alt="star" width={18} height={18} />
                                                </div>
                                                <div className="absolute inset-0 overflow-hidden w-1/2">
                                                    <Image src="/icons/star-icon.svg" alt="star" width={18} height={18} className="max-w-none" />
                                                </div>
                                            </div>
                                        );
                                    } else {
                                        // 空星（底色）
                                        return (
                                            <div key={i} className="opacity-20">
                                                <Image key={i} src="/icons/star-icon.svg" alt="star" width={18} height={18} className="w-[18px] h-[18px]" />
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Download Buttons */}
                    <div className="flex flex-wrap justify-center md:justify-start gap-6">
                        {app.downloadLinks && app.downloadLinks.length > 0 ? (
                            app.downloadLinks.map((link) => {
                                const ButtonContent = (
                                    <div className="relative group/qr">
                                        <Image
                                            src={link.badge.url}
                                            alt={link.platform}
                                            width={180} height={54}
                                            className="h-[54px] w-auto"
                                        />
                                        {link.generateQRCode && (
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 opacity-0 invisible group-hover/qr:opacity-100 group-hover/qr:visible transition-all duration-300 z-[100] pointer-events-none">
                                                <QRCode data={link.url} size={120} />
                                            </div>
                                        )}
                                    </div>
                                );

                                return (
                                    <a
                                        key={link.id}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={link.isClickable ? "hover:z-10 transition-transform hover:scale-105" : "pointer-events-none opacity-70"}
                                        {...(!link.isClickable && { 'aria-disabled': 'true' })}
                                    >
                                        {ButtonContent}
                                    </a>
                                );
                            })
                        ) : null}
                    </div>
                </div>

                {/* Right Column: Hero Image */}
                <div className="order-1 lg:order-2 flex-1 relative animate-fade-in">
                    {(data.image || app.heroImage) ? (
                        <div className="relative w-full min-h-[240px] md:min-h-0" style={{ aspectRatio: '4 / 3' }}>
                            <Image
                                src={(data.image || app.heroImage)!.url}
                                alt={app.name}
                                fill
                                className="object-contain"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        </div>
                    ) : (
                        <div className="aspect-[4/3] bg-section-bg rounded-[40px] flex items-center justify-center">
                            <Image src="/logo.svg" alt="BoostVision logo placeholder" width={200} height={50} className="opacity-20" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    </section>
);

const AppWhyChoose: React.FC<{ data: WhyChooseSection }> = ({ data }) => (
    <section className="pt-6 md:pt-8 pb-14 md:pb-16 bg-section-bg-2 text-center">
        <div className="container-custom md:max-w-[1320px]">
            <h2 className="text-[28px] md:text-[40px] font-black text-heading mt-[1em] mb-[1em]">{data.title}</h2>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
                {data.features.map((feature, i) => (
                    <div key={i} className="group grid grid-cols-[96px_1fr] items-center gap-x-5 gap-y-4 rounded-[40px] bg-white p-6 card-shadow transition-all duration-500 hover:-translate-y-3 md:flex md:flex-col md:gap-0 md:p-8">
                        <div className="h-24 w-24 shrink-0 flex items-center justify-center transform transition-transform duration-500 group-hover:scale-110 md:mb-10 md:h-[120px] md:w-auto">
                            {feature.icon && (
                                <Image
                                    src={feature.icon.url}
                                    alt={feature.title}
                                    width={160}
                                    height={120}
                                    className="h-auto w-auto max-h-full max-w-full object-contain"
                                />
                            )}
                        </div>
                        <h3 className="text-[22px] font-black text-heading leading-tight min-h-0 flex items-center justify-start text-left md:mb-6 md:min-h-[60px] md:justify-center md:text-center">
                            {feature.title}
                        </h3>
                        <RichText
                            content={feature.description}
                            className="col-span-2 text-[16px] text-muted leading-[1.6] max-w-none text-left md:col-auto md:max-w-[280px] md:text-center"
                        />
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const AppFeatureHighlight: React.FC<{ data: FeatureHighlightSection, app: App, isEven?: boolean }> = ({ data, app, isEven }) => (
    <section className={cn("py-32", isEven ? "bg-section-bg-2" : "bg-white")}>
        <div className="container-custom">
            <div className={cn(
                "flex flex-col lg:flex-row items-center gap-16 lg:gap-24",
                data.imagePosition === 'right' && "lg:flex-row-reverse"
            )}>
                <div className="w-full lg:w-1/2">
                    {data.image && (
                        <Image
                            src={data.image.url}
                            alt={data.title}
                            width={600}
                            height={450}
                            className="w-full h-auto"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                    )}
                </div>
                <div
                    className="w-full lg:w-1/2"
                    style={{ paddingInline: 'clamp(12px, 3.5vw, 24px)' }}
                >
                    <div className="mb-6 flex items-center gap-6 md:mb-0 md:flex-col md:items-start md:gap-[0.5em] md:text-left">
                        <div className="flex h-14 w-auto items-center justify-start">
                            <Image
                                src={`/icons/${data.labelColor}-label.svg`}
                                alt={`${data.labelColor} feature label`}
                                width={32}
                                height={32}
                            />
                        </div>
                        <h2 className="text-[28px] md:text-[40px] font-black leading-[1.1] text-heading text-left md:mb-8">{data.title}</h2>
                    </div>

                    {/* description 和 richText 现在可以共存，且都使用 RichText 渲染 */}
                    {data.description && (
                        <RichText content={data.description} className="mb-6" />
                    )}

                    {data.richText && (
                        <RichText
                            content={data.richText}
                            className="mb-10 app-zigzag-list-tight"
                            variant={data.labelColor === 'blue' ? 'blue-circle' : 'gray-square'}
                        />
                    )}

                    {/* Download Buttons inside column */}
                    <div className="flex flex-wrap justify-center md:justify-start gap-6">
                        {app.downloadLinks && app.downloadLinks.length > 0 ? (
                            app.downloadLinks.map((link) => {
                                const ButtonContent = (
                                    <div className="relative group/qr">
                                        <Image
                                            src={link.badge.url}
                                            alt={link.platform}
                                            width={180} height={54}
                                            className="h-[54px] w-auto"
                                        />
                                        {link.generateQRCode && (
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 opacity-0 invisible group-hover/qr:opacity-100 group-hover/qr:visible transition-all duration-300 z-[100] pointer-events-none">
                                                <QRCode data={link.url} size={120} />
                                            </div>
                                        )}
                                    </div>
                                );

                                return (
                                    <a
                                        key={link.id}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={link.isClickable ? "hover:z-10 transition-transform hover:scale-105" : "pointer-events-none opacity-70"}
                                        {...(!link.isClickable && { 'aria-disabled': 'true' })}
                                    >
                                        {ButtonContent}
                                    </a>
                                );
                            })
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const AppBrandsGrid: React.FC<{ data: BrandsGridSection; app: App }> = ({ data, app }) => (
    <section className="py-32 bg-white text-center">
        <div className="container-custom">
            <h2 className="text-[28px] md:text-[40px] font-black text-heading mb-6 tracking-tight">
                {data.title || `${app.name} Support all Smart TVs & Sticks`}
            </h2>
            <RichText
                content={data.description || "Stream your favorite media to the big screen with ease. It offers wide compatibility with popular TV brands and devices."}
                className="text-[18px] text-muted mb-20 max-w-[850px] mx-auto leading-relaxed"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-12 items-center justify-items-center opacity-60">
                {(data.brands && data.brands.length > 0) ? data.brands.map((brand, i) => (
                    <div key={i} className="flex flex-col items-center gap-4 group hover:opacity-100 transition-opacity">
                        <div className="h-12 w-auto relative flex items-center justify-center">
                            {brand.icon ? (
                                <Image src={brand.icon.url} alt={brand.title} width={120} height={40} className="h-full w-auto object-contain" />
                            ) : (
                                <span className="text-[24px] font-black text-heading/40 group-hover:text-primary transition-colors">{brand.title}</span>
                            )}
                        </div>
                    </div>
                )) : (
                    ['Samsung TV', 'Chromecast', 'LG TV', 'Roku TV', 'Fire TV'].map((brand, i) => (
                        <div key={i} className="flex flex-col items-center gap-4 group hover:opacity-100 transition-opacity">
                            <div className="h-12 w-auto relative">
                                <span className="text-[24px] font-black text-heading/40 group-hover:text-primary transition-colors">{brand}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    </section>
);

const AppCTA: React.FC<{ data: CTASection; app: App }> = ({ data, app }) => (
    <section className="py-16 md:py-32 text-center bg-section-bg-cta text-white">
        <div className="container-custom">
            <h2 className="mb-8 max-w-[1000px] mx-auto text-[30px] md:text-[45px] leading-[1.2] font-black text-heading">
                {data.title || `Free Download ${app.name} on Android or iPhone, iPad Today!`}
            </h2>
            <RichText
                content={data.description || `Get and install the ${app.name} and start screencasting from iPhone, iPad or Android phone to TV now`}
                className="text-muted/70 mb-10 md:mb-16 text-[16px] md:text-[20px] max-w-[850px] mx-auto leading-relaxed"
            />

            <div className="flex flex-wrap justify-center gap-6 mb-20">
                {app.downloadLinks && app.downloadLinks.length > 0 ? (
                    app.downloadLinks.map((link) => (
                        <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={link.isClickable ? "transition-transform hover:scale-105" : "pointer-events-none opacity-70"}
                            {...(!link.isClickable && { 'aria-disabled': 'true' })}
                        >
                            <Image
                                src={link.badge.url}
                                alt={link.platform}
                                width={220}
                                height={66}
                                className="h-[66px] w-auto"
                            />
                        </a>
                    ))
                ) : null}
            </div>

            {/* <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
                <Link href="/tutorial" className="inline-flex items-center justify-center px-10 py-4 text-[18px] font-bold text-heading bg-white border-2 border-gray-200 rounded-full hover:border-primary hover:text-primary transition-all">Tutorial</Link>
                <Link href="/faq" className="inline-flex items-center justify-center px-10 py-4 text-[18px] font-bold text-heading bg-white border-2 border-gray-200 rounded-full hover:border-primary hover:text-primary transition-all">F.A.Q.</Link>
            </div> */}
            {/* Links as Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
                {data?.links && data.links.length > 0 ? (
                    data.links.map((link) => (
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

            <div className="max-w-[800px] mx-auto pt-10 border-t border-white/10">
                <p className="text-[18px] text-muted leading-relaxed">
                    {data.buttonText || "If you have any thoughts and questions, you can contact us at:"}{" "}
                    <a
                        href={data.buttonLink ? (data.buttonLink.startsWith('mailto:') ? data.buttonLink : `mailto:${data.buttonLink}`) : "mailto:support@boostvision.com.cn"}
                        className="text-primary hover:underline font-bold"
                    >
                        {data.buttonLink || "support@boostvision.com.cn"}
                    </a>
                </p>
            </div>
        </div>
    </section>
);
