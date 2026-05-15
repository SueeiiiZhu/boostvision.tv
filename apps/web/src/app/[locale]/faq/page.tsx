import Link from "next/link";
import Image from "next/image";
import { JsonLd } from "@/components/shared";
import { getFAQsForList } from "@/lib/strapi/api/faqs";
import { getPageBySlug } from "@/lib/strapi/api/pages";
import { generateFAQPageSchema, generateMetadata as genMetadata, wrapSchema } from "@/lib/seo";
import { BlocksContent } from "@strapi/blocks-react-renderer";
import { HeroSection, CTASection } from "@/types/strapi";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string }>;
}

export const revalidate = 7200;

function hasChildrenArray(block: unknown): block is { children: unknown[] } {
  return (
    typeof block === "object" &&
    block !== null &&
    Array.isArray((block as { children?: unknown }).children)
  );
}

function isTextChild(child: unknown): child is { type: string; text: string } {
  return (
    typeof child === "object" &&
    child !== null &&
    (child as { type?: unknown }).type === "text" &&
    typeof (child as { text?: unknown }).text === "string"
  );
}

function normalizeFaqAnswer(answer: string | BlocksContent): string {
  if (typeof answer === "string") {
    return answer.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 500);
  }

  if (Array.isArray(answer)) {
    const text = answer
      .filter(hasChildrenArray)
      .flatMap((block) => block.children as unknown[])
      .filter(isTextChild)
      .map((child) => child.text)
      .join(" ");

    return text.replace(/\s+/g, " ").trim().slice(0, 500);
  }

  return "";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const pageData = await getPageBySlug("faq").catch(() => null);

  return genMetadata({
    seo: pageData?.seo,
    defaultTitle: "Frequently Asked Questions | BoostVision Apps",
    defaultDescription: "Find answers to common questions about screen mirroring, TV cast, and remote control apps by BoostVision.",
    path: "/faq",
    locale,
  });
}

export default async function FAQPage({ searchParams }: Props) {
  const { type = "screen-mirroring" } = await searchParams;

  const [faqsResponse, pageData] = await Promise.all([
    getFAQsForList({
      appType: type as 'screen-mirroring' | 'tv-remote',
      limit: 100
    }).catch(() => null),
    getPageBySlug("faq").catch(() => null)
  ]);

  const faqs = faqsResponse?.data || [];
  const sections = pageData?.sections || [];

  const heroSection = sections.find(s => s.__component === 'sections.hero') as HeroSection | undefined;
  const ctaSection = sections.find(s => s.__component === 'sections.cta') as CTASection | undefined;
  const faqJsonLd =
    faqs.length > 0
      ? wrapSchema(
          generateFAQPageSchema({
            questions: faqs.map((faq) => ({
              question: faq.question,
              answer: normalizeFaqAnswer(faq.answer),
            })),
          })
        )
      : null;

  return (
    <>
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <main className="bg-white poppins-headings">
        {/* Banner */}
        <section className="bg-app-hero py-24 text-center">
          <div className="container-custom">
            <h1 className="mb-6 !text-[35px] text-white font-black leading-[1.2]">
              {heroSection?.title || "F.A.Q. of Screen Mirroring and TV Remote Apps"}
            </h1>
            <p className="mx-auto max-w-[800px] text-[20px] text-white/70 leading-relaxed">
              {heroSection?.subtitle || "Find answers by selecting your app."}
            </p>
          </div>
        </section>

        {/* Apps Selection */}
        <section className="bg-support-bg py-24">
          <div className="container-custom">
            {/* Tabs */}
            <div className="mb-16 flex justify-center gap-6">
              <Link
                href="/faq?type=screen-mirroring"
                scroll={false}
                className={cn(
                  "rounded-full px-12 py-4 text-[18px] font-bold shadow-xl transition-all",
                  type === "screen-mirroring"
                    ? "bg-heading text-white hover:translate-y-[-2px]"
                    : "bg-white border border-gray-100 text-heading hover:bg-section-bg card-shadow"
                )}
              >
                Screen Mirroring
              </Link>
              <Link
                href="/faq?type=tv-remote"
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

            {/* FAQs Grid */}
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
              {faqs.length > 0 ? faqs.map((faq) => {
                const app = faq.app;
                return (
                  <Link
                    key={faq.id}
                    href={`/faq/${faq.slug}`}
                    className="group flex flex-col items-center rounded-[30px] bg-white p-8 text-center card-shadow transition-all duration-300 hover:translate-y-[-10px]"
                  >
                    <div className="mb-6 h-20 w-20 relative overflow-hidden rounded-2xl shadow-md group-hover:scale-110 transition-transform">
                      <Image
                        src={app?.icon?.url || "/icons/app-placeholder.webp"}
                        alt={faq.question}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="mb-2 inline-flex items-center rounded-full bg-accent/20 px-3 py-1 text-[12px] font-bold text-heading">
                      FAQ
                    </span>
                    <h3 className="text-[18px] font-bold text-heading leading-tight group-hover:text-primary transition-colors">
                      {app?.name || faq.question}
                    </h3>
                  </Link>
                );
              }) : (
                <div className="col-span-full py-20 text-center">
                  <p className="text-[18px] text-muted">No FAQs found.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Bottom Support CTA */}
        <div className="mt-32 p-16 text-center">
          <h3 className="text-[32px] font-black text-heading mb-12">
            {ctaSection?.title || "Still have questions?"}
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
                  Tutorial
                </Link>
                <Link
                  href="/contact-us"
                  className="inline-flex items-center justify-center px-10 py-4 text-[18px] font-bold text-heading bg-white border-2 border-gray-200 rounded-full hover:border-primary hover:text-primary transition-all"
                >
                  Contact Us
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
    </>
  );
}
