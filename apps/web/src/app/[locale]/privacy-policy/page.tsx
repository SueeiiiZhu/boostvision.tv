import { Header, Footer } from "@/components/layout";
import { RichText, SectionRenderer } from "@/components/shared";
import { getPageBySlug } from "@/lib/strapi/api/pages";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("privacy-policy");
  return {
    title: page?.title || "Privacy Policy | BoostVision",
    description: "Read our privacy policy to understand how we handle your data.",
  };
}

export default async function PrivacyPolicyPage() {
  const page = await getPageBySlug("privacy-policy");

  return (
    <>
      <Header />
      <main className="bg-white">
        {/* Banner */}
        <section className="bg-section-bg py-20 text-center">
          <div className="container-custom">
            <h1 className="mb-4 text-[40px] font-black text-heading">
              {page?.title || "Privacy Policy"}
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
      <Footer />
    </>
  );
}
