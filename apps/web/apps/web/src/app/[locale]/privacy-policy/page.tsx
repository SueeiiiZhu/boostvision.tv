import { Header, Footer } from "@/components/layout";
import { RichText } from "@/components/shared";
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
                    At BoostVision, we are committed to protecting your privacy. This Privacy Policy explains how 
                    we collect, use, and safeguard your information when you use our applications and website.
                  </p>
                  
                  <h2 className="text-[28px] font-bold text-heading">1. Information We Collect</h2>
                  <p>
                    We may collect certain information when you interact with our services, including device 
                    identifiers, usage statistics, and information you provide directly to us.
                  </p>

                  <h2 className="text-[28px] font-bold text-heading">2. How We Use Your Information</h2>
                  <p>
                    Your information is used to provide and improve our services, communicate with you, 
                    and ensure a secure user experience.
                  </p>

                  <h2 className="text-[28px] font-bold text-heading">3. Data Security</h2>
                  <p>
                    We implement industry-standard security measures to protect your data from unauthorized 
                    access or disclosure.
                  </p>

                  <h2 className="text-[28px] font-bold text-heading">4. Third-Party Services</h2>
                  <p>
                    Our applications may interact with third-party platforms (like your TV manufacturer). 
                    Please review their respective privacy policies.
                  </p>

                  <h2 className="text-[28px] font-bold text-heading">5. Contact Us</h2>
                  <p>
                    If you have any questions about this policy, please contact us at support@boostvision.com.cn.
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
