import { Header, Footer } from "@/components/layout";
import { getPageBySlug } from "@/lib/strapi/api/pages";
import { Metadata } from "next";
import { Link } from "@/i18n/routing";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const page = await getPageBySlug("contact-us", locale);
  return {
    title: page?.title || "Contact Us | BoostVision",
    description: "Get in touch with BoostVision for support, business inquiries, or feedback.",
  };
}

export default async function ContactUsPage({ params }: Props) {
  const { locale } = await params;
  const page = await getPageBySlug("contact-us", locale);

  return (
    <>
      <Header />
      <main className="bg-white">
        {/* Banner */}
        <section className="bg-section-bg py-24 text-center">
          <div className="container-custom">
            <h1 className="mb-6 text-[45px] font-black text-heading leading-tight">
              {page?.title || "Contact Us"}
            </h1>
            <p className="mx-auto max-w-[800px] text-[20px] text-muted leading-relaxed">
              We're here to help you. Reach out to us for any questions or feedback.
            </p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-24">
          <div className="container-custom max-w-[1000px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               {/* Support Card */}
               <div className="rounded-[40px] bg-white p-12 border border-gray-100 card-shadow text-center flex flex-col items-center">
                  <div className="mb-8 h-20 w-20 rounded-3xl bg-[#e8f3ff] flex items-center justify-center">
                     <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                     </svg>
                  </div>
                  <h3 className="text-[26px] font-black text-heading mb-4">Support Inquiry</h3>
                  <p className="text-muted mb-8 leading-relaxed">
                    Need help with an app? Have a technical question? Our support team is available 24/7.
                  </p>
                  <a href="mailto:support@boostvision.com.cn" className="text-[20px] font-bold text-primary hover:underline">
                    support@boostvision.com.cn
                  </a>
               </div>

               {/* Business Card */}
               <div className="rounded-[40px] bg-white p-12 border border-gray-100 card-shadow text-center flex flex-col items-center">
                  <div className="mb-8 h-20 w-20 rounded-3xl bg-[#f5fcf0] flex items-center justify-center">
                     <svg className="h-10 w-10 text-[#82c91e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                     </svg>
                  </div>
                  <h3 className="text-[26px] font-black text-heading mb-4">Business Inquiry</h3>
                  <p className="text-muted mb-8 leading-relaxed">
                    Interested in partnerships or business collaboration? We'd love to hear from you.
                  </p>
                  <a href="mailto:business@boostvision.com.cn" className="text-[20px] font-bold text-[#82c91e] hover:underline">
                    business@boostvision.com.cn
                  </a>
               </div>
            </div>

            {/* Additional Info */}
            <div className="mt-20 rounded-[40px] bg-section-bg p-12 text-center">
               <h3 className="text-[24px] font-bold text-heading mb-6">Frequently Asked Questions</h3>
               <p className="text-muted mb-10 text-[18px]">
                 You might find an instant answer in our comprehensive FAQ section.
               </p>
               <Link href="/faq" className="btn-gradient px-12">
                 Visit FAQ Center
               </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
