import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { RichText } from "@/components/shared";
import { getFAQs } from "@/lib/strapi/api/faqs";
import { getAppBySlug } from "@/lib/strapi/api/apps";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const app = await getAppBySlug(slug);

  if (!app) return { title: "FAQ Not Found" };

  return {
    title: `${app.name} F.A.Q. | BoostVision Support`,
    description: `Frequently asked questions and support for ${app.name}.`,
  };
}

export default async function FAQDetailPage({ params }: Props) {
  const { slug } = await params;
  
  // Fetch app and its FAQs
  const [app, faqsResponse] = await Promise.all([
    getAppBySlug(slug),
    getFAQs({ appSlug: slug }),
  ]);

  if (!app || !faqsResponse.data?.length) {
    notFound();
  }

  const faqs = faqsResponse.data;

  return (
    <>
      <Header />
      <main className="bg-white pb-32">
        {/* Header Section */}
        <section className="bg-section-bg py-20">
          <div className="container-custom text-center">
            <div className="mx-auto mb-8 h-24 w-24 relative overflow-hidden rounded-[30px] shadow-2xl">
              <Image src={app.icon?.url || "/icons/app-placeholder.webp"} alt={app.name} fill className="object-cover" />
            </div>
            <h1 className="text-[40px] font-black text-heading mb-4">
              F.A.Q. of {app.name}
            </h1>
            <p className="text-[18px] text-muted max-w-[800px] mx-auto">
              Find answers to the most common questions about {app.name}.
            </p>
          </div>
        </section>

        {/* FAQs List */}
        <section className="py-20">
          <div className="container-custom max-w-[900px]">
            <div className="space-y-6">
              {faqs.sort((a, b) => a.order - b.order).map((faq) => (
                <div key={faq.id} className="rounded-[30px] bg-white border border-gray-100 card-shadow overflow-hidden">
                  <div className="p-10">
                    <h3 className="text-[22px] font-bold text-heading mb-6 flex items-start gap-4">
                      <span className="text-primary text-[28px] leading-none">Q.</span>
                      {faq.question}
                    </h3>
                    <div className="flex items-start gap-4">
                      <span className="text-muted text-[28px] leading-none">A.</span>
                      <div className="text-[17px] text-muted leading-[1.8] post-content">
                        <RichText content={faq.answer} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Support Link */}
        <section className="mt-12 text-center">
           <p className="text-muted text-[16px] mb-8">
             Didn&apos;t find what you were looking for? 
           </p>
           <div className="flex justify-center gap-6">
              <Link href="/tutorial" className="text-primary font-bold hover:underline">View Tutorials</Link>
              <Link href="/contact-us" className="text-primary font-bold hover:underline">Contact Support</Link>
           </div>
           <div className="mt-16">
              <Link href="/faq" className="text-muted font-bold hover:text-heading transition-colors">
                ← Back to all FAQs
              </Link>
           </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

