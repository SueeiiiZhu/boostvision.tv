import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { RichText } from "@/components/shared";
import { getTutorials } from "@/lib/strapi/api/tutorials";
import { getAppBySlug } from "@/lib/strapi/api/apps";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const app = await getAppBySlug(slug, locale);

  if (!app) return { title: "Tutorial Not Found" };

  return {
    title: `How to Use ${app.name} | BoostVision Tutorial`,
    description: `Step-by-step guide and video tutorial for ${app.name}.`,
  };
}

export default async function TutorialDetailPage({ params }: Props) {
  const { slug, locale } = await params;
  
  // Fetch app and its tutorials
  const [app, tutorialsResponse] = await Promise.all([
    getAppBySlug(slug, locale),
    getTutorials({ appSlug: slug, locale }),
  ]);

  if (!app || !tutorialsResponse.data?.length) {
    notFound();
  }

  const tutorial = tutorialsResponse.data[0];

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
              How to use {app.name}
            </h1>
            <p className="text-[18px] text-muted max-w-[800px] mx-auto">
              Follow our step-by-step guide to get started with {app.name} on your device.
            </p>
          </div>
        </section>

        {/* Video Tutorial */}
        {tutorial.videoUrl && (
          <section className="py-20">
            <div className="container-custom max-w-[1000px]">
              <h2 className="text-[30px] font-black text-heading mb-10 text-center">Video Tutorial</h2>
              <div className="aspect-video w-full overflow-hidden rounded-[40px] shadow-2xl bg-black">
                {tutorial.videoEmbed ? (
                  <div dangerouslySetInnerHTML={{ __html: tutorial.videoEmbed }} className="h-full w-full" />
                ) : (
                  <iframe 
                    src={tutorial.videoUrl.replace("watch?v=", "embed/")} 
                    className="h-full w-full"
                    allowFullScreen
                  />
                )}
              </div>
            </div>
          </section>
        )}

        {/* Step by Step Guide */}
        <section className="py-20">
          <div className="container-custom max-w-[900px]">
            <h2 className="text-[30px] font-black text-heading mb-16 text-center">Step-by-Step Guide</h2>
            <div className="space-y-20">
              {tutorial.steps.sort((a, b) => a.stepNumber - b.stepNumber).map((step, index) => (
                <div key={step.id} className="flex flex-col md:flex-row items-center gap-12 group">
                  <div className="w-full md:w-1/2">
                    <div className="mb-6 flex items-center gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-[20px] font-black text-white shadow-lg">
                        {step.stepNumber}
                      </span>
                      <h3 className="text-[24px] font-bold text-heading">{step.title}</h3>
                    </div>
                    <div className="text-[17px] text-muted leading-[1.8]">
                      <RichText content={step.description} />
                    </div>
                  </div>
                  <div className="w-full md:w-1/2">
                    {step.image?.url && (
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[30px] shadow-xl transition-transform duration-500 group-hover:scale-[1.02]">
                        <Image src={step.image.url} alt={step.title} fill className="object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* More Apps Link */}
        <section className="mt-20 text-center">
           <Link href="/tutorial" className="text-primary font-bold hover:underline text-[18px]">
              ← Back to all tutorials
           </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
