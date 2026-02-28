import { RichText, SectionRenderer } from "@/components/shared";
import { getPageBySlug } from "@/lib/strapi/api/pages";
import { getLocaleAlternates } from "@/lib/seo";
import { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const page = await getPageBySlug("privacy-policy");
  const alternates = getLocaleAlternates("/privacy-policy", locale);

  return {
    title: page?.title || "Privacy Policy | BoostVision",
    description: "Read our privacy policy to understand how we handle your data.",
    alternates,
  };
}

export default async function PrivacyPolicyPage() {
  const page = await getPageBySlug("privacy-policy");

  return (
    <>
      <main className="bg-white">
        {/* Banner */}
        <section className="py-20 text-center">
          <div className="container-custom">
            <h1 className="mb-4 text-[40px] font-black text-heading">
              {page?.title || "Privacy Policy"}
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

        {page?.sections && <SectionRenderer sections={page.sections} />}
      </main>
    </>
  );
}
