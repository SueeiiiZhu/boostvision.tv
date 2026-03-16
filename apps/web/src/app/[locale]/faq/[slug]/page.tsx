import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { RichText, JsonLd } from "@/components/shared";
import { FAQSectionRenderer } from "@/components/faq/FAQSectionRenderer";
import { PageAdSlot } from "@/components/ads";
import { getFAQPageBySlug, getFAQSeoBySlug } from "@/lib/strapi/api/faqs";
import { generateFAQPageSchema, generateMetadata as genMetadata, wrapSchema } from "@/lib/seo";
import { Metadata } from "next";
import { BlocksContent } from "@strapi/blocks-react-renderer";
import { hasAdSenseSlot } from "@/config/adsense";

// Helper function to decode HTML entities
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export const revalidate = 7200;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const faq = await getFAQSeoBySlug(slug);

  if (!faq) return { title: "FAQ Not Found" };

  return genMetadata({
    seo: faq.seo,
    pageTitle: faq.question,
    defaultTitle: `${faq.app?.name || 'App'} F.A.Q. | BoostVision Support`,
    defaultDescription: `Frequently asked questions and support for ${faq.app?.name || 'App'}.`,
    path: `/faq/${slug}`,
    locale,
  });
}

function isParagraphBlock(block: unknown): block is { type: string; children?: unknown[] } {
  return (
    typeof block === "object" &&
    block !== null &&
    (block as { type?: unknown }).type === "paragraph"
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

export default async function FAQDetailPage({ params }: Props) {
  const { slug } = await params;

  const faq = await getFAQPageBySlug(slug);

  if (!faq) {
    notFound();
  }

  // Extract and decode HTML from answer
  let htmlAnswer: string | null = null;
  let blocksAnswer: BlocksContent | null = null;

  if (typeof faq.answer === 'string') {
    // Direct string answer
    htmlAnswer = decodeHtmlEntities(faq.answer);
  } else if (Array.isArray(faq.answer)) {
    // BlocksContent format - check if it contains HTML in text nodes
    const allText = faq.answer
      .filter(isParagraphBlock)
      .map((block) =>
        ((block.children || []) as unknown[])
          .filter(isTextChild)
          .map((child) => child.text)
          .join("")
      )
      .join('\n');

    // Check if the text contains HTML tags
    if (/<[a-z][\s\S]*>/i.test(allText)) {
      htmlAnswer = decodeHtmlEntities(allText);
    } else {
      blocksAnswer = faq.answer as BlocksContent;
    }
  }

  const app = faq.app;

  // Build FAQPage schema (single entry wrapped in mainEntity[])
  const answerText = htmlAnswer
    ? htmlAnswer.replace(/<[^>]*>/g, '').substring(0, 500)
    : blocksAnswer
    ? JSON.stringify(blocksAnswer).substring(0, 500)
    : faq.question;

  const schema = generateFAQPageSchema({
    questions: [
      {
        question: faq.question,
        answer: answerText,
      },
    ],
  });

  const jsonLd = wrapSchema(schema);
  const showBottomAd = hasAdSenseSlot("faqBottom");

  return (
    <>
      <JsonLd data={jsonLd} />
      <main className="bg-white pb-6">
      {/* 优先使用动态 sections */}
      {faq.sections && faq.sections.length > 0 ? (
        <FAQSectionRenderer sections={faq.sections} app={app!} faq={faq} />
      ) : (
        <>
          {/* Fallback Header Section (Legacy Layout) */}
          <section className="pt-24 pb-16 bg-white text-center">
            <div className="container-custom text-center">
              <div className="mx-auto mb-8 h-24 w-24 relative overflow-hidden rounded-[30px] shadow-2xl">
                <Image src={app?.icon?.url || "/icons/app-placeholder.webp"} alt={app?.name || "App"} fill className="object-cover" />
              </div>
              <h1 className="text-[40px] font-black text-heading mb-4">
                F.A.Q. of {app?.name}
              </h1>
              <p className="text-[18px] text-muted max-w-[800px] mx-auto font-light">
                Find answers to the most common questions about {app?.name}.
              </p>
            </div>
          </section>

          {/* FAQ Answer Section */}
          <section className="py-12">
            <div className="container-custom max-w-[900px]">
              <div className="rounded-[30px] bg-white border border-gray-100 card-shadow overflow-hidden">
                <div className="p-10">
                  <h2 className="text-[28px] font-black text-heading mb-8 flex items-start gap-4">
                    <span className="text-primary text-[32px] leading-none">Q.</span>
                    {faq.question}
                  </h2>
                  <div className="flex items-start gap-4">
                    <span className="text-muted text-[32px] leading-none">A.</span>
                    {htmlAnswer ? (
                      <div
                        className="text-[17px] text-muted leading-[1.8] font-light prose prose-lg max-w-none prose-a:text-primary prose-a:font-bold hover:prose-a:underline"
                        dangerouslySetInnerHTML={{ __html: htmlAnswer }}
                      />
                    ) : blocksAnswer ? (
                      <RichText content={blocksAnswer} className="text-[17px] text-muted leading-[1.8] font-light" />
                    ) : (
                      <div className="text-[17px] text-muted leading-[1.8] font-light text-red-500">
                        Error: Unable to render answer content
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Related Links Section */}
          <section className="mt-12">
            <div className="container-custom max-w-[900px]">
              <div className="rounded-[30px] bg-section-bg p-10 text-center">
                <p className="text-muted text-[16px] mb-8">
                  Didn&apos;t find what you were looking for?
                </p>
                <div className="flex flex-wrap justify-center gap-6 mb-8">
                  {app && (
                    <>
                      <Link
                        href={`/app/${app.slug}`}
                        className="inline-flex items-center justify-center px-8 py-3 text-[16px] font-bold text-white bg-primary rounded-full hover:translate-y-[-2px] transition-all shadow-xl"
                      >
                        Download {app.name}
                      </Link>
                      <Link
                        href={`/tutorial?type=${app.type}`}
                        className="inline-flex items-center justify-center px-8 py-3 text-[16px] font-bold text-heading bg-white border-2 border-gray-200 rounded-full hover:border-primary hover:text-primary transition-all"
                      >
                        View Tutorials
                      </Link>
                    </>
                  )}
                  <Link
                    href="/contact-us"
                    className="inline-flex items-center justify-center px-8 py-3 text-[16px] font-bold text-heading bg-white border-2 border-gray-200 rounded-full hover:border-primary hover:text-primary transition-all"
                  >
                    Contact Support
                  </Link>
                </div>
                <Link href="/faq" className="text-muted font-bold hover:text-heading transition-colors text-[16px]">
                  ← Back to all FAQs
                </Link>
              </div>
            </div>
          </section>
        </>
      )}

      {showBottomAd ? (
        <section className="mt-12">
          <div className="container-custom max-w-[1000px]">
            <PageAdSlot placement="faqBottom" minHeight={280} />
          </div>
        </section>
      ) : null}
    </main>
    </>
  );
}
