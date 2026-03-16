import { RichText, SectionRenderer } from "@/components/shared";
import { PageAdSlot } from "@/components/ads";
import { hasAdSenseSlot } from "@/config/adsense";
import { getLegalPageBySlug } from "@/lib/strapi/api/pages";
import { getLocaleAlternates } from "@/lib/seo";
import { type BlocksContent } from "@strapi/blocks-react-renderer";
import { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string }>;
}

export const revalidate = 86400;

type LegalContent = BlocksContent | string;

function splitContentForInlineAd(content?: LegalContent | null): { before: LegalContent; after: LegalContent } | null {
  if (!content) return null;

  if (typeof content === "string") {
    const lines = content.split("\n");
    if (lines.length < 8) return null;

    let splitIndex = Math.floor(lines.length / 2);
    const headingIndex = lines.findIndex((line, index) => index > splitIndex && /^#{1,3}\s+/.test(line.trim()));
    if (headingIndex > 0) {
      splitIndex = headingIndex;
    }

    const before = lines.slice(0, splitIndex).join("\n").trim();
    const after = lines.slice(splitIndex).join("\n").trim();
    if (!before || !after) return null;

    return { before, after };
  }

  if (!Array.isArray(content) || content.length < 4) return null;
  const splitIndex = Math.ceil(content.length / 2);
  const before = content.slice(0, splitIndex);
  const after = content.slice(splitIndex);
  if (before.length === 0 || after.length === 0) return null;

  return { before, after };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const page = await getLegalPageBySlug("terms-of-use");
  const alternates = getLocaleAlternates("/terms-of-use", locale);

  return {
    title: page?.title || "Terms of Use | BoostVision",
    description: "Read our terms of use to understand the rules for using our services.",
    alternates,
  };
}

export default async function TermsOfUsePage() {
  const page = await getLegalPageBySlug("terms-of-use");
  const showInlineAd = hasAdSenseSlot("termsInline");
  const content = page?.content as LegalContent | undefined;
  const splitContent = splitContentForInlineAd(content);

  return (
    <>
      <main className="bg-white">
        {/* Banner */}
        <section className="py-20 text-center">
          <div className="container-custom">
            <h1 className="mb-4 text-[40px] font-black text-heading">
              {page?.title || "Terms of Use"}
            </h1>
          </div>
        </section>

        {/* Content */}
        <section className="py-0 mt-0">
          <div className="container-custom max-w-[900px]">
            <div className="prose prose-lg max-w-none text-muted leading-[1.8] post-content">
              {content ? (
                splitContent ? (
                  <>
                    <RichText content={splitContent.before} />
                    {showInlineAd ? (
                      <PageAdSlot
                        placement="termsInline"
                        minHeight={280}
                        unstyled
                        constrainWidth={false}
                        className="my-10"
                      />
                    ) : null}
                    <RichText content={splitContent.after} />
                  </>
                ) : (
                  <>
                    <RichText content={content} />
                    {showInlineAd ? (
                      <PageAdSlot
                        placement="termsInline"
                        minHeight={280}
                        unstyled
                        constrainWidth={false}
                        className="mt-10"
                      />
                    ) : null}
                  </>
                )
              ) : (
                <div className="py-20 text-center text-muted italic">
                  Content is being updated in Strapi CMS. Please check back later.
                </div>
              )}
            </div>
          </div>
        </section>

        {showInlineAd ? (
          <section className="py-12">
            <div className="container-custom max-w-[900px]">
              <PageAdSlot placement="termsInline" minHeight={280} />
            </div>
          </section>
        ) : null}

        {page?.sections && <SectionRenderer sections={page.sections} />}
      </main>
    </>
  );
}
