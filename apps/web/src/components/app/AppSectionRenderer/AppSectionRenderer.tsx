"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Section, HeroSection, FeatureHighlightSection, WhyChooseSection, CTASection, BrandsGridSection, App, GlobalSetting, AppHelpSection, FAQAccordionItem, TutorialItem, AppCompatibilitySection } from '@/types/strapi';
import { cn } from '@/lib/utils';
import { RichText, QRCode } from '@/components/shared';
import { AnalyticsLink } from '@/components/analytics';

interface AppSectionRendererProps {
    sections: Section[];
    app: App;
    globalSetting?: GlobalSetting | null;
}

/**
 * AppSectionRenderer - Client Component
 * Dedicated renderer for App Detail pages to match their unique style
 */
export function AppSectionRenderer({ sections, app, globalSetting }: AppSectionRendererProps) {
    if (!sections || sections.length === 0) return null;
    const hasAppHelpSection = sections.some((section) => section.__component === 'sections.app-help');
    const relatedTutorials = (app.tutorials ?? [])
        .slice()
        .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999))
        .slice(0, 4);
    const relatedFaqs = (app.faqs ?? [])
        .slice()
        .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999))
        .slice(0, 4);
    const hasRelatedHelp = relatedTutorials.length > 0 || relatedFaqs.length > 0;

    return (
        <>
            {sections.map((section, index) => {
                switch (section.__component) {
                    case 'sections.hero':
                        return <AppHero key={index} data={section} app={app} globalSetting={globalSetting} />;
                    case 'sections.why-choose':
                        return <AppWhyChoose key={index} data={section} />;
                    case 'sections.app-help':
                        return <AppHelp key={index} data={section} app={app} />;
                    case 'sections.app-compatibility':
                        return <AppCompatibility key={index} data={section} />;
                    case 'sections.cta':
                        return (
                            <React.Fragment key={index}>
                                {!hasAppHelpSection && hasRelatedHelp ? (
                                    <AppRelatedHelp
                                        app={app}
                                        tutorials={relatedTutorials}
                                        faqs={relatedFaqs}
                                    />
                                ) : null}
                                <AppCTA data={section} app={app} />
                            </React.Fragment>
                        );
                    case 'sections.brands-grid':
                        return <AppBrandsGrid key={index} data={section} app={app} />;
                    case 'sections.feature-highlight':
                        return <AppFeatureHighlight key={index} data={section} isEven={index % 2 === 1} />;
                    default:
                        // For sections not specifically styled for App pages, 
                        // we could potentially fallback to standard SectionRenderer components
                        return null;
                }
            })}
        </>
    );
}

type TextNode = {
    type: 'text';
    text: string;
};

type ParagraphBlock = Extract<TutorialItem["content"][number], { type: 'paragraph' }>;

const AppHelp: React.FC<{ data: AppHelpSection; app: App }> = ({ data, app }) => {
    const topLevelBlogs = data.blogs ?? [];
    const blogs = topLevelBlogs.filter((blog, index, arr) => arr.findIndex((item) => item.id === blog.id) === index);
    const faqItems = data.faqItems ?? [];
    const [openFaqItemId, setOpenFaqItemId] = React.useState<number | null>(null);

    if (blogs.length === 0 && faqItems.length === 0) return null;

    return (
        <section className="bg-gradient-to-b from-section-bg-2 to-white py-16 md:py-24">
            <div className="container-custom">
                {data.title ? (
                    <h2 className="text-[28px] md:text-[32px] font-black text-heading text-center mb-12 tracking-tight">
                        {data.title}
                    </h2>
                ) : null}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {blogs.length > 0 ? (
                        <div className="rounded-[28px] bg-transparent p-0 md:bg-transparent md:p-10">
                            <h3 className="mb-6 flex items-center justify-center gap-[0.5em] text-[22px] font-black text-heading md:inline-flex md:justify-start">
                                <Image
                                    src="/icons/guide-icon.svg"
                                    alt=""
                                    width={24}
                                    height={24}
                                    className="h-[1em] w-[1em] shrink-0"
                                    aria-hidden="true"
                                />
                                <span>{data.tutorialTitle || 'Related Tutorials'}</span>
                            </h3>
                            <div className="flex flex-col items-start gap-3">
                                {blogs.map((blog) => (
                                    <Link
                                        key={blog.id}
                                        href={`/blog/${blog.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group inline-flex min-h-[64px] w-full items-center rounded-[40px] border border-gray-200 bg-white px-5 py-4 text-left transition-all duration-300 hover:border-primary/30 md:px-8"
                                    >
                                        <span className="block min-w-0 flex-1 truncate text-[16px] font-black text-heading transition-colors group-hover:text-[#1e6cf4]">
                                            {blog.title}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {faqItems.length > 0 ? (
                        <div className="rounded-[28px] bg-transparent p-0 md:bg-transparent md:p-10">
                            <h3 className="mb-6 flex items-center justify-center gap-[0.5em] text-[22px] font-black text-heading md:inline-flex md:justify-start">
                                <Image
                                    src="/icons/faq-icon.svg"
                                    alt=""
                                    width={24}
                                    height={24}
                                    className="h-[1em] w-[1em] shrink-0"
                                    aria-hidden="true"
                                />
                                <span>{data.faqTitle || `FAQ for ${app.name}`}</span>
                            </h3>
                            <div className="space-y-4">
                                {faqItems.map((item) => (
                                    <AppHelpAccordionItem
                                        key={item.id}
                                        item={item}
                                        isOpen={openFaqItemId === item.id}
                                        onToggle={() => {
                                            setOpenFaqItemId((currentId) => currentId === item.id ? null : item.id);
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    );
};

const AppCompatibility: React.FC<{ data: AppCompatibilitySection }> = ({ data }) => {
    const brandItems = (data.brandItems ?? []).filter((item) => item.brandLogo || item.deviceList || item.description);
    const [activeIndex, setActiveIndex] = React.useState(0);
    const activeIndexRef = React.useRef(0);
    const panelRefs = React.useRef<Array<HTMLDivElement | null>>([]);
    const [maxPanelHeight, setMaxPanelHeight] = React.useState(0);
    const mobileCardTrackRef = React.useRef<HTMLDivElement | null>(null);
    const mobileCardRefs = React.useRef<Array<HTMLDivElement | null>>([]);
    const cardSettleTimerRef = React.useRef<number | null>(null);

    React.useEffect(() => {
        setActiveIndex(0);
        activeIndexRef.current = 0;
    }, [brandItems.length]);

    React.useEffect(() => {
        activeIndexRef.current = activeIndex;
    }, [activeIndex]);

    React.useEffect(() => {
        const measure = () => {
            const nextHeight = panelRefs.current.reduce((max, element) => {
                const height = element?.offsetHeight ?? 0;
                return height > max ? height : max;
            }, 0);
            setMaxPanelHeight(nextHeight);
        };

        const frame = window.requestAnimationFrame(measure);
        window.addEventListener("resize", measure);

        return () => {
            window.cancelAnimationFrame(frame);
            window.removeEventListener("resize", measure);
        };
    }, [brandItems]);

    React.useEffect(() => {
        return () => {
            if (cardSettleTimerRef.current) window.clearTimeout(cardSettleTimerRef.current);
        };
    }, []);

    if (brandItems.length === 0) return null;

    const activeItem = brandItems[Math.min(activeIndex, brandItems.length - 1)];
    const deviceList = parseDeviceList(activeItem?.deviceList);

    const resolveClosestIndex = (container: HTMLDivElement, items: Array<HTMLDivElement | null>) => {
        const containerCenter = container.scrollLeft + container.clientWidth / 2;
        let closestIndex = 0;
        let smallestDistance = Number.POSITIVE_INFINITY;

        items.forEach((item, index) => {
            if (!item) return;
            const itemCenter = item.offsetLeft + item.clientWidth / 2;
            const distance = Math.abs(itemCenter - containerCenter);
            if (distance < smallestDistance) {
                smallestDistance = distance;
                closestIndex = index;
            }
        });

        return closestIndex;
    };

    const handleMobileCardScroll = () => {
        const container = mobileCardTrackRef.current;
        if (!container) return;
        if (cardSettleTimerRef.current) window.clearTimeout(cardSettleTimerRef.current);
        cardSettleTimerRef.current = window.setTimeout(() => {
            const nextIndex = resolveClosestIndex(container, mobileCardRefs.current);
            if (nextIndex !== activeIndexRef.current) {
                setActiveIndex(nextIndex);
                activeIndexRef.current = nextIndex;
            }
        }, 80);
    };

    const handleMobileCardTouchEnd = () => {
        const container = mobileCardTrackRef.current;
        if (!container) return;
        if (cardSettleTimerRef.current) window.clearTimeout(cardSettleTimerRef.current);
        const nextIndex = resolveClosestIndex(container, mobileCardRefs.current);
        if (nextIndex !== activeIndexRef.current) {
            setActiveIndex(nextIndex);
            activeIndexRef.current = nextIndex;
        }
    };

    return (
        <section className="bg-section-bg-3 py-16 text-white md:py-24">
            <div className="container-custom">
                {data.title ? (
                    <h2 className="mx-auto mb-6 max-w-[900px] text-center text-[28px] font-black tracking-tight md:text-[32px]">
                        {data.title}
                    </h2>
                ) : null}
                {data.description ? (
                    <p className="mx-auto mb-14 max-w-[900px] text-center text-[16px] leading-[1.8] text-white/70 md:text-[18px]">
                        {data.description}
                    </p>
                ) : null}

                <div
                    ref={mobileCardTrackRef}
                    onScroll={handleMobileCardScroll}
                    onTouchEnd={handleMobileCardTouchEnd}
                    className={cn(
                        "flex gap-4 md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                        brandItems.length === 1
                            ? "justify-center overflow-visible"
                            : "snap-x snap-mandatory overflow-x-auto"
                    )}
                >
                    {brandItems.map((item, index) => (
                        <div
                            key={item.id}
                            ref={(element) => {
                                mobileCardRefs.current[index] = element;
                            }}
                            className={cn(
                                "shrink-0 rounded-[30px] border border-white/12 bg-white/6 p-6 backdrop-blur-[2px]",
                                brandItems.length === 1
                                    ? "w-full max-w-[420px]"
                                    : "w-[88%] snap-center"
                            )}
                        >
                            <div className="mb-6 flex min-h-[52px] items-center justify-center border-b border-white/12 pb-5">
                                {item.brandLogo ? (
                                    <Image
                                        src={item.brandLogo.url}
                                        alt={item.brandLogo.alternativeText || item.brandLogo.name || `Brand ${index + 1}`}
                                        width={160}
                                        height={56}
                                        className="h-10 w-auto object-contain"
                                    />
                                ) : (
                                    <span className="text-[16px] font-black text-white">
                                        {`Brand ${index + 1}`}
                                    </span>
                                )}
                            </div>
                            <div>
                                {item.description ? (
                                    <RichText
                                        content={item.description}
                                        className="mb-8 [&_a]:text-[#b8f732] [&_a]:font-bold [&_blockquote]:bg-white/8 [&_blockquote]:text-white/90 [&_code]:bg-white/10 [&_code]:text-white [&_em]:text-white/90 [&_h1]:!text-white [&_h2]:!text-white [&_h3]:!text-white [&_h4]:!text-white [&_li]:!text-white/80 [&_ol]:!text-white/80 [&_p]:!text-white/80 [&_strong]:!text-white [&_table]:text-white/80 [&_td]:border-white/10 [&_th]:border-white/10 [&_ul]:!text-white/80"
                                    />
                                ) : (
                                    <p className="mb-8 text-[16px] leading-[1.75] text-white/60">
                                        No compatibility details provided.
                                    </p>
                                )}
                            </div>
                            <div>
                                {renderDeviceList(parseDeviceList(item.deviceList))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mb-10 hidden flex-wrap items-end justify-center gap-x-8 gap-y-5 border-b border-white/12 pb-5 md:flex">
                    {brandItems.map((item, index) => {
                        const isActive = index === activeIndex;
                        const fallbackName = item.brandLogo?.alternativeText || item.brandLogo?.name || `Brand ${index + 1}`;

                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setActiveIndex(index)}
                                className={cn(
                                    "relative flex min-h-[52px] items-center justify-center px-2 py-2 transition-all duration-300",
                                    isActive
                                        ? "text-white"
                                        : "text-white/55 hover:text-white/80"
                                )}
                            >
                                {item.brandLogo ? (
                                    <Image
                                        src={item.brandLogo.url}
                                        alt={fallbackName}
                                        width={160}
                                        height={56}
                                        className={cn(
                                            "h-10 w-auto object-contain transition-opacity duration-300",
                                            isActive ? "opacity-100" : "opacity-60"
                                        )}
                                    />
                                ) : (
                                    <span className={cn("text-[16px] font-black", isActive ? "text-white" : "text-white/70")}>
                                        {fallbackName}
                                    </span>
                                )}
                                <span
                                    className={cn(
                                        "absolute inset-x-0 -bottom-[21px] h-[3px] rounded-full bg-[#b8f732] transition-opacity duration-300",
                                        isActive ? "opacity-100" : "opacity-0"
                                    )}
                                />
                            </button>
                        );
                    })}
                </div>

                <div
                    className="hidden gap-8 rounded-[36px] border border-white/12 bg-white/6 p-8 backdrop-blur-[2px] md:grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:p-10"
                    style={maxPanelHeight > 0 ? { minHeight: `${maxPanelHeight}px` } : undefined}
                >
                    <div>
                        {deviceList.length > 0 ? (
                            <ul className="space-y-4">
                                {deviceList.map((device, index) => (
                                    <li key={`${device}-${index}`} className="flex items-start gap-4">
                                        <span className="mt-[0.45em] h-3 w-3 shrink-0 bg-[#b8f732]" />
                                        <span className="text-[16px] leading-[1.75] text-white/82 md:text-[17px]">
                                            {device}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-[16px] leading-[1.75] text-white/60">
                                No device list provided.
                            </p>
                        )}
                    </div>

                    <div className="relative">
                        {activeItem?.description ? (
                            <RichText
                                content={activeItem.description}
                                className="[&_a]:text-[#b8f732] [&_a]:font-bold [&_blockquote]:bg-white/8 [&_blockquote]:text-white/90 [&_code]:bg-white/10 [&_code]:text-white [&_em]:text-white/90 [&_h1]:!text-white [&_h2]:!text-white [&_h3]:!text-white [&_h4]:!text-white [&_li]:!text-white/80 [&_ol]:!text-white/80 [&_p]:!text-white/80 [&_strong]:!text-white [&_table]:text-white/80 [&_td]:border-white/10 [&_th]:border-white/10 [&_ul]:!text-white/80"
                            />
                        ) : (
                            <p className="text-[16px] leading-[1.75] text-white/60">
                                No compatibility details provided.
                            </p>
                        )}
                        <div className="pointer-events-none absolute left-0 top-0 -z-10 invisible w-full">
                            {brandItems.map((item, index) => (
                                <div
                                    key={item.id}
                                    ref={(element) => {
                                        panelRefs.current[index] = element;
                                    }}
                                    className="grid w-full gap-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
                                >
                                    <div>
                                        {renderDeviceList(parseDeviceList(item.deviceList))}
                                    </div>
                                    <div>
                                        {item.description ? (
                                            <RichText
                                                content={item.description}
                                                className="[&_a]:text-[#b8f732] [&_a]:font-bold [&_blockquote]:bg-white/8 [&_blockquote]:text-white/90 [&_code]:bg-white/10 [&_code]:text-white [&_em]:text-white/90 [&_h1]:!text-white [&_h2]:!text-white [&_h3]:!text-white [&_h4]:!text-white [&_li]:!text-white/80 [&_ol]:!text-white/80 [&_p]:!text-white/80 [&_strong]:!text-white [&_table]:text-white/80 [&_td]:border-white/10 [&_th]:border-white/10 [&_ul]:!text-white/80"
                                            />
                                        ) : (
                                            <p className="text-[16px] leading-[1.75] text-white/60">
                                                No compatibility details provided.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

function parseDeviceList(value?: string | null): string[] {
    if (!value) return [];

    const normalized = value
        .split(/\r?\n|,|;/)
        .map((item) => item.replace(/^\s*([-*•]|\d+\.)\s*/, "").trim())
        .filter(Boolean);

    return Array.from(new Set(normalized));
}

function renderDeviceList(deviceList: string[]) {
    if (deviceList.length > 0) {
        return (
            <ul className="space-y-4">
                {deviceList.map((device, index) => (
                    <li key={`${device}-${index}`} className="flex items-start gap-4">
                        <span className="mt-[0.45em] h-3 w-3 shrink-0 bg-[#b8f732]" />
                        <span className="text-[16px] leading-[1.75] text-white/82 md:text-[17px]">
                            {device}
                        </span>
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <p className="text-[16px] leading-[1.75] text-white/60">
            No device list provided.
        </p>
    );
}

const AppHelpAccordionItem: React.FC<{
    item: FAQAccordionItem;
    isOpen: boolean;
    onToggle: () => void;
}> = ({ item, isOpen, onToggle }) => {
    const [isMounted, setIsMounted] = React.useState(false);

    const decodeHtmlEntities = (text: string): string => {
        return text
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&apos;/g, "'")
            .replace(/&amp;/g, '&');
    };

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const extractTextFromBlocks = (content: FAQAccordionItem["content"]) => {
        if (!Array.isArray(content)) {
            return "";
        }

        return content
            .filter((block): block is ParagraphBlock => block.type === 'paragraph')
            .map((block) =>
                block.children
                    .filter((child): child is TextNode => child.type === 'text')
                    .map((child) => child.text)
                    .join('')
            )
            .join('\n');
    };

    const getProcessedContent = () => {
        if (!item.content || !isMounted) {
            return { html: null, useRichText: true };
        }

        let htmlContent: string | null = null;
        let shouldUseRichText = true;

        if (typeof item.content === 'string') {
            if (/<[a-z][\s\S]*>/i.test(item.content)) {
                htmlContent = decodeHtmlEntities(item.content);
                shouldUseRichText = false;
            }
        } else if (Array.isArray(item.content)) {
            const allText = extractTextFromBlocks(item.content);

            if (/<[a-z][\s\S]*>/i.test(allText)) {
                htmlContent = decodeHtmlEntities(allText);
                shouldUseRichText = false;
            }
        }

        return { html: htmlContent, useRichText: shouldUseRichText };
    };

    const processedContent = getProcessedContent();

    return (
        <div className={cn(
            "rounded-[24px] border border-gray-200 bg-white transition-all duration-300 overflow-hidden",
            isOpen ? "translate-y-[-2px]" : "hover:border-primary/30"
        )}>
            <button
                onClick={onToggle}
                className="flex w-full items-center justify-between px-4 py-5 text-left md:px-6"
            >
                <h4 className="text-[15px] font-black text-heading">{item.title}</h4>
                <span className={cn("text-muted transition-transform duration-300", isOpen ? "rotate-180" : "")}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            </button>

            <div className={cn(
                "grid transition-all duration-300 ease-in-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            )}>
                <div className="overflow-hidden">
                    <div className="border-t border-gray-100 px-4 pb-6 pt-5 md:px-6" suppressHydrationWarning>
                        {item.content && (
                            processedContent.useRichText ? (
                                <RichText
                                    content={item.content}
                                    className="text-[14px] text-muted font-light leading-[1.25em] [&_*]:!text-[14px] [&_li]:!leading-[1.25em] [&_ol]:!my-3 [&_ol]:!space-y-2 [&_p]:!mb-3 [&_p]:!leading-[1.25em] [&_ul]:!my-3 [&_ul]:!space-y-2"
                                />
                            ) : processedContent.html ? (
                                <div
                                    className="text-[14px] text-muted font-light leading-[1.25em] prose max-w-none prose-a:text-primary prose-a:font-bold hover:prose-a:underline [&_*]:!text-[14px] [&_a]:text-primary [&_a]:font-bold [&_a:hover]:underline [&_li]:!leading-[1.25em] [&_p]:!leading-[1.25em]"
                                    dangerouslySetInnerHTML={{ __html: processedContent.html }}
                                />
                            ) : null
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const AppRelatedHelp: React.FC<{
    app: App;
    tutorials: Array<{ id: number; title: string; slug: string; order?: number }>;
    faqs: Array<{ id: number; question: string; slug: string; order?: number }>;
}> = ({ app, tutorials, faqs }) => (
    <section className="py-16 md:py-24 bg-white">
        <div className="container-custom">
            <h2 className="text-[28px] md:text-[32px] font-black text-heading text-center mb-12 tracking-tight">
                More Help for {app.name}
            </h2>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {tutorials.length > 0 ? (
                    <div className="rounded-[28px] border border-gray-100 bg-[#f8faff] p-8 md:p-10">
                        <h3 className="text-[22px] font-black text-heading mb-6">Related Tutorials</h3>
                        <div className="space-y-3">
                            {tutorials.map((tutorial) => (
                                <Link
                                    key={tutorial.id}
                                    href={`/tutorial/${tutorial.slug}`}
                                    className="block rounded-xl bg-white px-4 py-3 text-[16px] font-semibold text-heading transition-colors hover:text-primary"
                                >
                                    {tutorial.title}
                                </Link>
                            ))}
                        </div>
                    </div>
                ) : null}

                {faqs.length > 0 ? (
                    <div className="rounded-[28px] border border-gray-100 bg-[#f8faff] p-8 md:p-10">
                        <h3 className="text-[22px] font-black text-heading mb-6">Related FAQs</h3>
                        <div className="space-y-3">
                            {faqs.map((faq) => (
                                <Link
                                    key={faq.id}
                                    href={`/faq/${faq.slug}`}
                                    className="block rounded-xl bg-white px-4 py-3 text-[16px] font-semibold text-heading transition-colors hover:text-primary"
                                >
                                    {faq.question}
                                </Link>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    </section>
);

const AppHero: React.FC<{ data: HeroSection; app: App; globalSetting?: GlobalSetting | null }> = ({ data, app, globalSetting }) => (
    <section className="pt-0 md:pt-24 pb-20 bg-white">
        <div className="container-custom">
            <div className="flex flex-col lg:flex-row items-center gap-0 md:gap-16 lg:gap-24">
                {/* Left Column: Text Content */}
                <div className="order-2 lg:order-1 flex-1 text-left">
                    <h1 className="text-[28px] md:text-[36px] font-black text-heading leading-[1.1] mb-8 tracking-tight">
                        {data.title || app.displayTitle || app.name}
                    </h1>

                    {/* 使用 RichText 渲染 Hero 描述 */}
                    <RichText
                        content={data.subtitle || app.shortDescription}
                        className="text-[16px] text-muted/80 leading-[1.25em] mb-10 max-w-[500px]"
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
                    <div className="flex flex-col sm:flex-row sm:flex-wrap items-center md:items-start justify-center md:justify-start gap-4 sm:gap-6">
                        {app.downloadLinks && app.downloadLinks.length > 0 ? (
                            app.downloadLinks.map((link) => {
                                const ButtonContent = (
                                    <div className="relative group/qr">
                                        <Image
                                            src={link.badge.url}
                                            alt={link.platform}
                                            width={180} height={54}
                                            className="h-12 sm:h-14 w-auto"
                                        />
                                        {link.generateQRCode && (
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 opacity-0 invisible group-hover/qr:opacity-100 group-hover/qr:visible transition-all duration-300 z-[100] pointer-events-none">
                                                <QRCode data={link.url} size={120} />
                                            </div>
                                        )}
                                    </div>
                                );

                                return (
                                    <AnalyticsLink
                                        key={link.id}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={link.isClickable ? "hover:z-10 transition-transform hover:scale-105" : "pointer-events-none opacity-70"}
                                        placement="app_section_hero"
                                        appSlug={app.slug}
                                        appName={app.name}
                                        label={link.platform}
                                        {...(!link.isClickable && { 'aria-disabled': 'true' })}
                                    >
                                        {ButtonContent}
                                    </AnalyticsLink>
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
            <h2 className="text-[28px] md:text-[32px] font-black text-heading mt-[1em] mb-[1em]">{data.title}</h2>
            <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 md:grid md:grid-cols-2 md:gap-10 md:overflow-visible md:pb-0 lg:grid-cols-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {data.features.map((feature, i) => (
                    <div key={i} className="group grid w-[86%] shrink-0 snap-center grid-cols-[96px_1fr] items-center gap-x-5 gap-y-4 rounded-[40px] bg-white p-6 text-left card-shadow transition-all duration-500 hover:-translate-y-3 md:w-auto md:flex md:flex-col md:gap-0 md:p-8 md:text-center">
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

const AppFeatureHighlight: React.FC<{ data: FeatureHighlightSection, isEven?: boolean }> = ({ data, isEven }) => (
    <section className={cn("py-16 md:py-32", isEven ? "bg-section-bg-2" : "bg-white")}>
        <div className="container-custom">
            <div className={cn(
                "flex flex-col lg:flex-row items-center gap-8 lg:gap-24",
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
                        <div className="flex h-12 sm:h-14 w-auto items-center justify-center sm:justify-start">
                            <Image
                                src={`/icons/${data.labelColor}-label.svg`}
                                alt={`${data.labelColor} feature label`}
                                width={32}
                                height={32}
                            />
                        </div>
                        <h2 className="text-[20px] md:text-[32px] font-black leading-[1.1] text-heading text-left md:mb-4">{data.title}</h2>
                    </div>

                    {/* description 和 richText 现在可以共存，且都使用 RichText 渲染 */}
                    {data.description && (
                        <RichText content={data.description} className="mb-6 md:mb-3" />
                    )}

                    {data.richText && (
                        <RichText
                            content={data.richText}
                            className="mb-10 md:mb-5 app-zigzag-list-tight"
                            variant={data.labelColor === 'blue' ? 'blue-circle' : 'gray-square'}
                        />
                    )}
                </div>
            </div>
        </div>
    </section>
);

const AppBrandsGrid: React.FC<{ data: BrandsGridSection; app: App }> = ({ data, app }) => (
    <section className="py-32 bg-white text-center">
        <div className="container-custom">
            <h2 className="text-[28px] md:text-[32px] font-black text-heading mb-6 tracking-tight">
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
            <h2 className="mb-8 max-w-[1000px] mx-auto text-[24px] md:text-[32px] leading-[1.2] font-black text-heading">
                {data.title || `Free Download ${app.name} on Android or iPhone, iPad Today!`}
            </h2>
            <RichText
                content={data.description || `Get and install the ${app.name} and start screencasting from iPhone, iPad or Android phone to TV now`}
                className="text-muted/70 mb-10 md:mb-16 text-[16px] md:text-[20px] max-w-[850px] mx-auto leading-relaxed"
            />

            <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-4 sm:gap-6 mb-20">
                {app.downloadLinks && app.downloadLinks.length > 0 ? (
                    app.downloadLinks.map((link) => (
                        <AnalyticsLink
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={link.isClickable ? "transition-transform hover:scale-105" : "pointer-events-none opacity-70"}
                            placement="app_section_bottom"
                            appSlug={app.slug}
                            appName={app.name}
                            label={link.platform}
                            {...(!link.isClickable && { 'aria-disabled': 'true' })}
                        >
                            <Image
                                src={link.badge.url}
                                alt={link.platform}
                                width={220}
                                height={66}
                                className="h-12 sm:h-14 w-auto"
                            />
                        </AnalyticsLink>
                    ))
                ) : null}
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
