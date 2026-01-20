import { RichText, SectionRenderer } from "@/components/shared";
import { getPageBySlug } from "@/lib/strapi/api/pages";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("terms-of-use");
  return {
    title: page?.title || "Terms of Use | BoostVision",
    description: "Read our terms of use to understand the rules for using our services.",
  };
}

export default async function TermsOfUsePage() {
  const page = await getPageBySlug("terms-of-use");

  return (
    <>
      <main className="bg-white">
        {/* Banner */}
        <section className="bg-section-bg py-20 text-center">
          <div className="container-custom">
            <h1 className="mb-4 text-[40px] font-black text-heading">
              {page?.title || "Terms of Use"}
            </h1>
            <p className="text-muted">
              Last Updated: {page?.updatedAt ? new Date(page.updatedAt).toLocaleDateString() : "January 15, 2026"}
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-20">
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
