import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { RichText } from "@/components/shared";
import { TutorialSectionRenderer } from "@/components/tutorial/TutorialSectionRenderer";
import { getTutorialBySlug } from "@/lib/strapi/api/tutorials";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tutorial = await getTutorialBySlug(slug);

  if (!tutorial) return { title: "Tutorial Not Found" };

  return {
    title: tutorial.seo?.title || `How to Use ${tutorial.app?.name || 'App'} | BoostVision Tutorial`,
    description: tutorial.seo?.description || `Step-by-step guide and video tutorial for ${tutorial.app?.name || 'App'}.`,
  };
}

export default async function TutorialDetailPage({ params }: Props) {
  const { slug } = await params;
  
  const tutorial = await getTutorialBySlug(slug);

  if (!tutorial) {
    notFound();
  }
  console.log(tutorial);
  const app = tutorial.app;

  return (
    <main className="bg-white pb-6">
      {/* 优先使用动态 sections */}
      {tutorial.sections && tutorial.sections.length > 0 ? (
        <TutorialSectionRenderer sections={tutorial.sections} app={app!} tutorial={tutorial} />
      ) : (
        <>
          {/* Fallback Header Section (Legacy Layout) */}
          <section className="pt-24 pb-16 bg-white text-center">
            <div className="container-custom max-w-[1000px]">
              <h1 className="text-[28px] md:text-[48px] font-black text-heading leading-[1.2] mb-6 tracking-tight">
                How to use {app?.name}
              </h1>
              <p className="text-[18px] text-muted leading-relaxed mb-10 max-w-[800px] mx-auto font-light">
                Follow our step-by-step guide to get started with {app?.name} on your device.
              </p>
              
              {/* Download Buttons */}
              <div className="flex flex-wrap justify-center gap-6">
                {app?.downloadLinks && app.downloadLinks.slice(0, 2).map((link) => (
                  <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105">
                    <Image
                      src={link.badge.url}
                      alt={link.platform}
                      width={180} height={54}
                      className="h-[54px] w-auto"
                    />
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* Video Tutorial */}
          {tutorial.videoUrl && (
            <section className="py-12">
              <div className="container-custom max-w-[1000px]">
                <div className="aspect-video w-full overflow-hidden rounded-[40px] shadow-2xl bg-black">
                  {tutorial.videoEmbed ? (
                    <div dangerouslySetInnerHTML={{ __html: tutorial.videoEmbed }} className="h-full w-full" />
                  ) : (
                    <iframe 
                      src={tutorial.videoUrl.replace("watch?v=", "embed/")} 
                      className="h-full w-full border-none"
                      allowFullScreen
                    />
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Step by Step Guide */}
          <section className="py-12">
            <div className="container-custom max-w-[900px]">
              <h2 className="text-[32px] font-medium text-heading mb-16 text-center">Step-by-Step Guide</h2>
              <div className="space-y-20">
                {tutorial.steps?.sort((a, b) => a.stepNumber - b.stepNumber).map((step, index) => (
                  <div key={step.id} className="flex flex-col md:flex-row items-center gap-12 group">
                    <div className="w-full md:w-1/2">
                      <div className="mb-6 flex items-center gap-4">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-[20px] font-black text-white shadow-lg">
                          {step.stepNumber}
                        </span>
                        <h3 className="text-[24px] font-bold text-heading">{step.title}</h3>
                              </div>
                              <RichText content={step.description} className="text-[17px] text-muted leading-[1.8] font-light" />
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
        </>
      )}
    </main>
  );
}

