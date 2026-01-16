import Image from "next/image";
import { Header, Footer } from "@/components/layout";
import { RichText } from "@/components/shared";
import { getPageBySlug } from "@/lib/strapi/api/pages";
import { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const page = await getPageBySlug("about-us", locale);
  return {
    title: page?.title || "About Us | BoostVision",
    description: "Learn more about BoostVision and our mission to improve smart home control experience.",
  };
}

export default async function AboutUsPage({ params }: Props) {
  const { locale } = await params;
  const page = await getPageBySlug("about-us", locale);

  return (
    <>
      <Header />
      <main className="bg-white">
        {/* Banner */}
        <section className="bg-section-bg py-24 text-center">
          <div className="container-custom">
            <h1 className="mb-6 text-[45px] font-black text-heading leading-tight">
              {page?.title || "About BoostVision"}
            </h1>
            <p className="mx-auto max-w-[800px] text-[20px] text-muted leading-relaxed">
              Improving your Smart TV experience with advanced wireless solutions.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-24">
          <div className="container-custom max-w-[900px]">
            {page?.content ? (
              <RichText content={page.content} className="post-content" />
            ) : (
              <div className="space-y-12 text-[18px] text-muted leading-[1.8]">
                <p>
                  BoostVision is dedicated to enhancing the way you interact with your Smart TV and mobile devices. 
                  Our suite of applications provides seamless screen mirroring and advanced remote control solutions 
                  for millions of users worldwide.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-12">
                   <div className="rounded-[30px] bg-section-bg p-10 border border-gray-100">
                      <h3 className="text-[24px] font-bold text-heading mb-4">Our Mission</h3>
                      <p className="text-[16px]">To simplify smart home control and content sharing through innovative wireless technology.</p>
                   </div>
                   <div className="rounded-[30px] bg-section-bg p-10 border border-gray-100">
                      <h3 className="text-[24px] font-bold text-heading mb-4">Our Vision</h3>
                      <p className="text-[16px]">To become the world's leading provider of smart device connectivity solutions.</p>
                   </div>
                </div>

                <p>
                  Founded by a team of technology enthusiasts, we believe that controlling your TV should be as easy as 
                  using your smartphone. No more searching for lost physical remotes or dealing with messy cables.
                </p>
                
                <div className="relative aspect-video w-full overflow-hidden rounded-[40px] shadow-2xl my-16">
                   <Image src="/images/about-hero.jpg" alt="About BoostVision" fill className="object-cover" />
                </div>

                <h2 className="text-[32px] font-black text-heading mt-16 mb-8 text-center">Global Impact</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                   <div>
                      <div className="text-[35px] font-black text-primary mb-2">28M+</div>
                      <div className="text-[14px] font-bold text-muted uppercase">Downloads</div>
                   </div>
                   <div>
                      <div className="text-[35px] font-black text-primary mb-2">200+</div>
                      <div className="text-[14px] font-bold text-muted uppercase">Countries</div>
                   </div>
                   <div>
                      <div className="text-[35px] font-black text-primary mb-2">10M+</div>
                      <div className="text-[14px] font-bold text-muted uppercase">Satisfied Users</div>
                   </div>
                   <div>
                      <div className="text-[35px] font-black text-primary mb-2">24/7</div>
                      <div className="text-[14px] font-bold text-muted uppercase">Support</div>
                   </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
