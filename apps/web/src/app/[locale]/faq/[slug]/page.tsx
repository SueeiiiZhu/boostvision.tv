import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { RichText } from "@/components/shared";
import { FAQSectionRenderer } from "@/components/faq/FAQSectionRenderer";
import { getFAQBySlug } from "@/lib/strapi/api/faqs";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const faq = await getFAQBySlug(slug);

  if (!faq) return { title: "FAQ Not Found" };

  return {
    title: faq.seo?.title || `${faq.app?.name || 'App'} F.A.Q. | BoostVision Support`,
    description: faq.seo?.description || `Frequently asked questions and support for ${faq.app?.name || 'App'}.`,
  };
}

export default async function FAQDetailPage({ params }: Props) {
  const { slug } = await params;
  
  const faq = await getFAQBySlug(slug);

  if (!faq) {
    notFound();
  }

  const app = faq.app;

  return (
    <main className="bg-white pb-6">
      {/* 优先使用动态 sections */}
      {faq.sections && faq.sections.length > 0 ? (
        <FAQSectionRenderer sections={faq.sections} app={app!} faq={faq} />
      ) : (
        <>
          {/* Fallback Header Section (Legacy Layout) */}
          <section className="pt-24 pb-16 bg-white text-center">
            <div className="container-custom text-center">
              <div className="mx-auto mb-8 h-24 w-24 relative overflow-hidden rounded-[30px] shadow-2xl">
                <Image src={app?.icon?.url || "/icons/app-placeholder.webp"} alt={app?.name || "App"} fill className="object-cover" />
              </div>
              <h1 className="text-[40px] font-black text-heading mb-4">
                F.A.Q. of {app?.name}
              </h1>
              <p className="text-[18px] text-muted max-w-[800px] mx-auto font-light">
                Find answers to the most common questions about {app?.name}.
              </p>
            </div>
          </section>

          {/* FAQ Answer Section */}
          <section className="py-12">
            <div className="container-custom max-w-[900px]">
              <div className="rounded-[30px] bg-white border border-gray-100 card-shadow overflow-hidden">
                <div className="p-10">
                  <h2 className="text-[28px] font-black text-heading mb-8 flex items-start gap-4">
                    <span className="text-primary text-[32px] leading-none">Q.</span>
                    {faq.question}
                  </h2>
                  <div className="flex items-start gap-4">
                    <span className="text-muted text-[32px] leading-none">A.</span>
                    <RichText content={faq.answer} className="text-[17px] text-muted leading-[1.8] font-light" />
                  </div>
                </div>
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
        </>
      )}
    </main>
  );
}

