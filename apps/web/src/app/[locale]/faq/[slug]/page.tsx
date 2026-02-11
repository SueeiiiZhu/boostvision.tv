import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { RichText, JsonLd } from "@/components/shared";
import { FAQSectionRenderer } from "@/components/faq/FAQSectionRenderer";
import { getFAQBySlug } from "@/lib/strapi/api/faqs";
import { getGlobalSetting } from "@/lib/strapi/api/global";
import { generateMetadata as genMetadata, wrapSchema } from "@/lib/seo";
import { Metadata } from "next";
import { BlocksContent } from "@strapi/blocks-react-renderer";

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
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [faq, globalSetting] = await Promise.all([
    getFAQBySlug(slug),
    getGlobalSetting(),
  ]);

  if (!faq) return { title: "FAQ Not Found" };

  return genMetadata({
    seo: faq.seo,
    defaultSeo: globalSetting?.defaultSeo,
    pageTitle: faq.question,
    defaultTitle: `${faq.app?.name || 'App'} F.A.Q. | BoostVision Support`,
    defaultDescription: `Frequently asked questions and support for ${faq.app?.name || 'App'}.`,
    path: `/faq/${slug}`,
  });
}

export default async function FAQDetailPage({ params }: Props) {
  const { slug } = await params;

  const faq = await getFAQBySlug(slug);

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
      .filter((block: any) => block.type === 'paragraph')
      .map((block: any) =>
        block.children
          ?.filter((child: any) => child.type === 'text')
          .map((child: any) => child.text)
          .join('')
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

  // Generate Question schema for single FAQ
  // Extract plain text answer for schema
  const answerText = htmlAnswer
    ? htmlAnswer.replace(/<[^>]*>/g, '').substring(0, 500)
    : blocksAnswer
    ? JSON.stringify(blocksAnswer).substring(0, 500)
    : faq.question;

  const schema = {
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: answerText,
    },
  };

  const jsonLd = wrapSchema(schema);

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
    </main>
    </>
  );
}

