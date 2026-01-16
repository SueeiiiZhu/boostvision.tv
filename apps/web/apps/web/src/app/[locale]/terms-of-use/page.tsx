import { Header, Footer } from "@/components/layout";
import { RichText } from "@/components/shared";
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
      <Header />
      <main className="bg-white">
        {/* Banner */}
        <section className="bg-section-bg py-20 text-center">
          <div className="container-custom">
            <h1 className="mb-4 text-[40px] font-black text-heading">
              {page?.title || "Terms of Use"}
            </h1>
            <p className="text-muted">Last Updated: January 15, 2026</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-20">
          <div className="container-custom max-w-[900px]">
            <div className="prose prose-lg max-w-none text-muted leading-[1.8] post-content">
              {page?.content ? (
                <RichText content={page.content} />
              ) : (
                <div className="space-y-10">
                  <p>
                    By accessing and using BoostVision's applications and website, you agree to comply with 
                    these Terms of Use.
                  </p>
                  
                  <h2 className="text-[28px] font-bold text-heading">1. License to Use</h2>
                  <p>
                    We grant you a limited, non-exclusive license to use our software for personal, non-commercial 
                    purposes in accordance with these terms.
                  </p>

                  <h2 className="text-[28px] font-bold text-heading">2. User Restrictions</h2>
                  <p>
                    You may not reverse engineer, decompile, or attempt to extract the source code of our 
                    applications. Misuse of our services may lead to termination of your access.
                  </p>

                  <h2 className="text-[28px] font-bold text-heading">3. Intellectual Property</h2>
                  <p>
                    All content, logos, and software are the property of BoostVision and are protected 
                    by international copyright laws.
                  </p>

                  <h2 className="text-[28px] font-bold text-heading">4. Disclaimer of Warranties</h2>
                  <p>
                    Our services are provided "as is" without any warranties, express or implied. 
                    We do not guarantee that our services will always be error-free or uninterrupted.
                  </p>

                  <h2 className="text-[28px] font-bold text-heading">5. Limitation of Liability</h2>
                  <p>
                    BoostVision shall not be liable for any indirect, incidental, or consequential damages 
                    arising from your use of our services.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
