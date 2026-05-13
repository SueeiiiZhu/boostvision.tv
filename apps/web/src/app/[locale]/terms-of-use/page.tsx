import { RichText, SectionRenderer } from "@/components/shared";
import { PageAdSlot, StickyMobileAdBanner } from "@/components/ads";
import { hasAdSenseSlot } from "@/config/adsense";
import ExploreAppsLinks from "@/components/legal/ExploreAppsLinks";
import { getLegalPageBySlug } from "@/lib/strapi/api/pages";
import { getLocaleAlternates } from "@/lib/seo";
import { type BlocksContent } from "@strapi/blocks-react-renderer";
import { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string }>;
}

export const revalidate = 86400;

type LegalContent = BlocksContent | string;

/** Find the nearest heading boundary at or after `target` line index */
function findHeadingBoundary(lines: string[], target: number): number {
  const headingIndex = lines.findIndex((line, i) => i >= target && /^#{1,3}\s+/.test(line.trim()));
  return headingIndex > 0 ? headingIndex : target;
}

function splitContentForInlineAds(content?: LegalContent | null): LegalContent[] | null {
  if (!content) return null;

  if (typeof content === "string") {
    const lines = content.split("\n");
    if (lines.length < 8) return null;

    // Try triple-split for long content
    if (lines.length >= 20) {
      const oneThird = findHeadingBoundary(lines, Math.floor(lines.length / 3));
      const twoThirds = findHeadingBoundary(lines, Math.floor((lines.length * 2) / 3));

      if (oneThird < twoThirds) {
        const part1 = lines.slice(0, oneThird).join("\n").trim();
        const part2 = lines.slice(oneThird, twoThirds).join("\n").trim();
        const part3 = lines.slice(twoThirds).join("\n").trim();
        if (part1 && part2 && part3) return [part1, part2, part3];
      }
    }

    // Fallback: two-split
    const splitIndex = findHeadingBoundary(lines, Math.floor(lines.length / 2));
    const before = lines.slice(0, splitIndex).join("\n").trim();
    const after = lines.slice(splitIndex).join("\n").trim();
    if (!before || !after) return null;
    return [before, after];
  }

  if (!Array.isArray(content) || content.length < 4) return null;

  // Triple-split for BlocksContent with enough blocks
  if (content.length >= 10) {
    const oneThird = Math.ceil(content.length / 3);
    const twoThirds = Math.ceil((content.length * 2) / 3);
    const part1 = content.slice(0, oneThird);
    const part2 = content.slice(oneThird, twoThirds);
    const part3 = content.slice(twoThirds);
    if (part1.length && part2.length && part3.length) return [part1, part2, part3];
  }

  // Fallback: two-split
  const splitIndex = Math.ceil(content.length / 2);
  const before = content.slice(0, splitIndex);
  const after = content.slice(splitIndex);
  if (before.length === 0 || after.length === 0) return null;
  return [before, after];
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
  const showAfterTitleAd = hasAdSenseSlot("termsAfterTitle");
  const content = page?.content as LegalContent | undefined;
  const contentParts = splitContentForInlineAds(content);

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

        {/* After-title ad */}
        {showAfterTitleAd && (
          <section className="py-6">
            <div className="container-custom max-w-[900px]">
              <PageAdSlot placement="termsAfterTitle" minHeight={100} />
            </div>
          </section>
        )}

        {/* Content */}
        <section className="py-0 mt-0">
          <div className="container-custom max-w-[900px]">
            <div className="prose prose-lg max-w-none text-muted leading-[1.8] post-content">
              {content ? (
                contentParts ? (
                  <>
                    {contentParts.map((part, index) => (
                      <div key={index}>
                        <RichText content={part} />
                        {showInlineAd && index < contentParts.length - 1 ? (
                          <PageAdSlot
                            placement="termsInline"
                            minHeight={280}
                            unstyled
                            constrainWidth={false}
                            className="my-10"
                          />
                        ) : null}
                      </div>
                    ))}
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

        <ExploreAppsLinks />

        {page?.sections && <SectionRenderer sections={page.sections} />}

        {/* Spacer for sticky mobile ad */}
        <div className="h-20 md:hidden" />
      </main>

      {hasAdSenseSlot("termsStickyMobile") && (
        <StickyMobileAdBanner placement="termsStickyMobile" />
      )}
    </>
  );
}
