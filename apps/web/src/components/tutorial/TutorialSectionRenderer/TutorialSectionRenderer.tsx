"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Section, HeroSection, CTASection, TutorialAccordionSection, App, Tutorial, TutorialItem } from '@/types/strapi';
import { cn } from '@/lib/utils';
import { RichText } from '@/components/shared';
import { PageAdSlot } from '@/components/ads';
import { hasAdSenseSlot } from '@/config/adsense';

interface TutorialSectionRendererProps {
    sections: Section[];
    app: App;
    tutorial: Tutorial;
}

type TextNode = {
    type: 'text';
    text: string;
};

type ParagraphBlock = Extract<TutorialItem["content"][number], { type: 'paragraph' }>;

/**
 * TutorialSectionRenderer - Client Component (for accordion/tab logic)
 * Dedicated renderer for Tutorial pages to match their unique style
 */
export function TutorialSectionRenderer({ sections, app }: TutorialSectionRendererProps) {
    if (!sections || sections.length === 0) return null;

    return (
        <>
            {sections.map((section, index) => {
                switch (section.__component) {
                    case 'sections.hero':
                        return <TutorialHero key={index} data={section} app={app} />;
                    case 'sections.tutorial-accordion':
                        return <TutorialAccordion key={index} data={section} app={app} />;
                    case 'sections.cta':
                        return <TutorialCTA key={index} data={section} />;
                    default:
                        return null;
                }
            })}
        </>
    );
}

const TutorialHero: React.FC<{ data: HeroSection; app: App }> = ({ data, app }) => (
    <section className="pt-24 pb-16 bg-white text-center">
        <div className="container-custom max-w-[1000px]">
            <h1 className="text-[28px] md:text-[48px] font-black text-heading leading-[1.2] mb-6 tracking-tight">
                {data.title || `Tutorial of ${app.name} Streaming & Mirroring for iOS and Android`}
            </h1>

            <RichText
                content={data.subtitle || "Step by step tutorial to get your app work properly, with videos and text instruction."}
                className="text-[18px] text-muted leading-relaxed mb-10 max-w-[800px] mx-auto font-light"
            />

            {/* Download Buttons */}
            <div className="flex flex-wrap justify-center gap-6">
                {app.downloadLinks && app.downloadLinks.slice(0, 2).map((link) => (
                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105">
                        <Image
                            src={link.badge.url}
                            alt={link.platform}
                            width={180} height={54}
                            className="h-[54px] w-auto"
                        />
                    </a>
                ))}
            </div>
        </div>
    </section>
);

const TutorialAccordion: React.FC<{ data: TutorialAccordionSection; app: App }> = ({ data, app }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="py-12 bg-white">
            <div className="container-custom max-w-[1000px]">
                <div className="space-y-6">
                    {data.items.map((item, index) => (
                        <AccordionItem
                            key={index}
                            item={item}
                            app={app}
                            isOpen={openIndex === index}
                            onToggle={() => setOpenIndex((prev) => (prev === index ? null : index))}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

const AccordionItem: React.FC<{ item: TutorialItem; app: App; isOpen: boolean; onToggle: () => void }> = ({ item, app, isOpen, onToggle }) => {
    const [isMounted, setIsMounted] = useState(false);

    // Helper function to decode HTML entities
    const decodeHtmlEntities = (text: string): string => {
        return text
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&apos;/g, "'")
            .replace(/&amp;/g, '&');
    };

    // Set mounted state
    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const extractTextFromBlocks = (content: TutorialItem["content"]) => {
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

    // Process content only on client side
    const getProcessedContent = () => {
        if (!item.content || !isMounted) {
            return { html: null, useRichText: true };
        }

        let htmlContent: string | null = null;
        let shouldUseRichText = true;

        if (typeof item.content === 'string') {
            // Check if it contains HTML tags
            if (/<[a-z][\s\S]*>/i.test(item.content)) {
                htmlContent = decodeHtmlEntities(item.content);
                shouldUseRichText = false;
            }
        } else if (Array.isArray(item.content)) {
            // Extract text from BlocksContent
            const allText = extractTextFromBlocks(item.content);

            // Check if the text contains HTML tags
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
            "mb-8 rounded-[40px] border border-gray-200 bg-white transition-all duration-500 overflow-hidden",
            isOpen ? "translate-y-[-4px]" : "hover:border-primary/30"
        )}>
            {/* Header */}
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between px-12 py-4 text-left transition-colors"
            >
                <h3 className="text-[12px] md:text-[16px] font-black text-heading">
                    {item.title}
                </h3>
                <span className={cn(
                    "transition-transform duration-500 text-muted",
                    isOpen ? "rotate-180" : ""
                )}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            </button>

            {/* Content with Scroll stretching animation */}
            <div className={cn(
                "grid transition-all duration-500 ease-in-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            )}>
                <div className="overflow-hidden">
                    <div className="px-12 pb-12">
                        <div className="pt-8 border-t border-gray-50" suppressHydrationWarning>
                            {item.content && (
                                processedContent.useRichText ? (
                                    <RichText
                                        content={item.content}
                                        className="text-[17px] text-muted font-light leading-[1.8]"
                                    />
                                ) : processedContent.html ? (
                                    <div
                                        className="text-[17px] text-muted font-light leading-[1.8] prose prose-lg max-w-none prose-a:text-primary prose-a:font-bold hover:prose-a:underline [&_a]:text-primary [&_a]:font-bold [&_a:hover]:underline"
                                        dangerouslySetInnerHTML={{ __html: processedContent.html }}
                                    />
                                ) : null
                            )}
                        </div>

                        {isOpen && hasAdSenseSlot('tutorialAccordion') ? (
                            <div className="mt-10 border-t border-gray-50 pt-10">
                                <PageAdSlot
                                    placement="tutorialAccordion"
                                    minHeight={250}
                                />
                            </div>
                        ) : null}

                        {item.showDownloadButtons && (
                            <div className="mt-16 flex flex-wrap justify-center gap-8 pt-12 border-t border-gray-50">
                                {app.downloadLinks && app.downloadLinks.slice(0, 2).map((link) => (
                                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105">
                                        <Image
                                            src={link.badge.url}
                                            alt={link.platform}
                                            width={200} height={60}
                                            className="h-[60px] w-auto"
                                        />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const TutorialCTA: React.FC<{ data: CTASection }> = ({ data }) => (
    <section className="pt-20 pb-5 bg-white text-center border-t border-gray-50 mt-12">
        <div className="container-custom">
            <div className="flex flex-wrap justify-center items-center gap-12 mb-10">
                {data.links && data.links.map((link) => (
                    <Link
                        key={link.id}
                        href={link.href}
                        className="inline-flex items-center justify-center px-10 py-4 text-[18px] font-bold text-heading bg-white border-2 border-gray-200 rounded-full hover:border-primary hover:text-primary transition-all"
                    >
                        {link.name}
                    </Link>
                ))}
            </div>

            <p className="text-[18px] text-muted font-light">
                {data.description || "If you have any thoughts and questions, you can contact us at:"}{" "}
                <a
                    href={data.buttonLink ? (data.buttonLink.startsWith('mailto:') ? data.buttonLink : `mailto:${data.buttonLink}`) : "mailto:support@boostvision.com.cn"}
                    className="text-primary hover:underline font-bold"
                >
                    {data.buttonLink || "support@boostvision.com.cn"}
                </a>
            </p>
        </div>
    </section>
);
