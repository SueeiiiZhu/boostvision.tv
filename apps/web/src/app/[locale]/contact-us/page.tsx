import { getPageBySlug } from "@/lib/strapi/api/pages";
import { getGlobalSetting } from "@/lib/strapi/api/global";
import { generateMetadata as genMetadata } from "@/lib/seo";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const [page, globalSetting] = await Promise.all([
    getPageBySlug("contact-us").catch(() => null),
    getGlobalSetting(locale).catch(() => null),
  ]);

  return genMetadata({
    seo: page?.seo,
    defaultSeo: globalSetting?.defaultSeo,
    pageTitle: page?.title,
    defaultTitle: "Contact Us | BoostVision",
    defaultDescription: "Get in touch with BoostVision for support, business inquiries, or feedback.",
    path: "/contact-us",
    locale,
  });
}

export default async function ContactUsPage() {
  const page = await getPageBySlug("contact-us");

  return (
    <main className="bg-white pb-24">
      {/* Page Title */}
      <section className="pt-24 pb-12 text-center">
        <div className="container-custom">
          <h1 className="text-[48px] font-medium text-heading leading-tight mb-0">
            {page?.title || "Contact Us"}
          </h1>
        </div>
      </section>

      <div className="container-custom max-w-[1140px]">
        {/* Get Answers in Document */}
        <section className="py-16">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-[350px] aspect-square">
                <Image
                  src="/images/contact-us/faq.svg"
                  alt="FAQ"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-[32px] font-medium text-heading mb-6 text-center lg:text-left">
                Get Answers in Document
              </h2>
              <p className="text-[16px] font-light text-muted leading-relaxed mb-10 text-center lg:text-left">
                The fastest way to find the answer to your question is to seek through the frequently asked questions that we documented.
              </p>
              <div className="flex justify-center lg:justify-start">
                <Link href="/faq" className="btn-gradient text-[24px] px-8 py-4 rounded-[50px] font-normal">
                  Go to F.A.Q.
                </Link>
              </div>
            </div>
          </div>
        </section>

        <hr className="my-12 border-gray-100" />

        {/* Following our Social Media */}
        <section className="py-16">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-[350px] aspect-square">
                <Image
                  src="/images/contact-us/contact-social-media.svg"
                  alt="Social Media"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-[32px] font-medium text-heading mb-6 text-center lg:text-left">
                Following our Social Media
              </h2>
              <p className="text-[16px] font-light text-muted leading-relaxed mb-10 text-center lg:text-left">
                We are generating useful content across the internet, follow us and keep in touch through social media.
              </p>
              <div className="flex justify-center lg:justify-start gap-8">
                <a href="https://www.facebook.com/boostvisionapps" target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-2xl shadow-lg hover:translate-y-[-4px] transition-transform">
                  <Image src="/images/contact-us/facebook.svg" alt="Facebook" width={24} height={24} />
                </a>
                <a href="https://twitter.com/BoostVisio86997" target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-2xl shadow-lg hover:translate-y-[-4px] transition-transform">
                  <Image src="/images/contact-us/twitter.svg" alt="Twitter" width={24} height={24} />
                </a>
                <a href="https://www.youtube.com/@boostvision1021" target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-2xl shadow-lg hover:translate-y-[-4px] transition-transform">
                  <Image src="/images/contact-us/youtube.svg" alt="YouTube" width={24} height={24} />
                </a>
              </div>
            </div>
          </div>
        </section>

        <hr className="my-12 border-gray-100" />

        {/* Still Find no Solution? */}
        <section className="py-16">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-[350px] aspect-square">
                <Image
                  src="/images/contact-us/contact-email.svg"
                  alt="Email Us"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-[32px] font-medium text-heading mb-6 text-center lg:text-left">
                Still Find no Solution?
              </h2>
              <p className="text-[16px] font-light text-muted leading-relaxed mb-10 text-center lg:text-left">
                Always feel free to contact us through our customer service E-mail, we will back you up with professional solutions.
              </p>
              <div className="flex justify-center lg:justify-start">
                <a href="mailto:support@boostvision.com.cn" className="btn-gradient text-[24px] px-8 py-4 rounded-[50px] font-normal">
                  E-mail us
                </a>
              </div>
            </div>
          </div>
        </section>

        <hr className="my-12 border-gray-100" />

        {/* Coordinate Section */}
        <section className="py-24 text-center">
          <h2 className="text-[36px] font-medium text-heading mb-12">
            Coordinate your Smart TV and Smart Phone Now
          </h2>
          <div className="flex justify-center">
            <Link href="/app" className="btn-gradient text-[24px] px-12 py-5 rounded-[50px] font-normal">
              GET IT NOW
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
