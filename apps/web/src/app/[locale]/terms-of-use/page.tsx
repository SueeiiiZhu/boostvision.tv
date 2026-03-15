import { RichText, SectionRenderer } from "@/components/shared";
import { PageAdSlot } from "@/components/ads";
import { hasAdSenseSlot } from "@/config/adsense";
import { getLegalPageBySlug } from "@/lib/strapi/api/pages";
import { getLocaleAlternates } from "@/lib/seo";
import { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string }>;
}

export const revalidate = 86400;

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
              {page?.content ? (
                <RichText content={page.content} />
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
