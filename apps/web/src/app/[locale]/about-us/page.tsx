import Image from "next/image";
import Link from "next/link";
import { RichText } from "@/components/shared";
import { getPageBySlug } from "@/lib/strapi/api/pages";
import { getLocaleAlternates } from "@/lib/seo";
import { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const page = await getPageBySlug("about-us");
  const alternates = getLocaleAlternates("/about-us", locale);

  return {
    title: page?.title || "About us | BoostVision",
    description: "Information about Chengdu BoostVision Technology Company, the software developer focuses on screen mirroring and TV remote apps.",
    alternates,
  };
}

export default async function AboutUsPage() {
  const page = await getPageBySlug("about-us");

  return (
    <main className="bg-white pb-24">
      {/* Page Title */}
      <section className="pt-24 pb-12 text-center">
        <div className="container-custom">
          <h1 className="text-[48px] font-black text-heading leading-tight mb-0">
            {page?.title || "About us"}
          </h1>
        </div>
      </section>

      <div className="container-custom max-w-[1140px]">
        {/* Intro Section */}
        <section className="py-16">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1">
              <div className="text-[16px] text-muted leading-[1.8] space-y-6">
                <p>
                  <strong>BoostVision</strong> is a startup company which focuses on mobile app development. Our mission is to deliver apps for users to interact between mobile phone and TV more conveniently.
                </p>
                <p>
                  We believe that we can empower everyone to cast photos/videos/audio, screen mirroring to TV and remote control for smart TVs, and we are working towards this goal by building apps which support all kinds of TV and sticks for screen mirroring and TV remote control.
                </p>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-[500px] aspect-[4/3] rounded-[40px] overflow-hidden bg-gradient-to-br from-[#1e6cf4]/10 to-[#b8f732]/10 flex items-center justify-center p-12">
                <Image
                  src="/logo.svg"
                  alt="BoostVision Logo"
                  width={300}
                  height={80}
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Products */}
        <section className="py-16 border-t border-gray-50">
          <h2 className="text-[32px] font-bold text-heading text-center mb-16">Our Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-32 px-4 lg:px-20">
            <div>
              <h3 className="text-[20px] font-bold text-heading mb-8">Screen Mirroring Apps</h3>
              <ul className="space-y-4 text-[16px] text-primary font-medium">
                <li><Link href="/app/tv-cast-for-chromecast" className="hover:underline">TV Cast for Chromecast</Link></li>
                <li><Link href="/app/universal-tv-cast" className="hover:underline">Universal TV Cast</Link></li>
                <li><Link href="/app/screen-mirroring" className="hover:underline">Screen Mirroring: TV Cast App</Link></li>
                <li><Link href="/app/miracast" className="hover:underline">Miracast for Screen Mirroring</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-[20px] font-bold text-heading mb-8">TV Remote Control Apps</h3>
              <ul className="space-y-4 text-[16px] text-primary font-medium">
                <li><Link href="/app/lg-tv-remote" className="hover:underline">Remote for LG TV</Link></li>
                <li><Link href="/app/samsung-tv-remote" className="hover:underline">Remote for Samsung TV</Link></li>
                <li><Link href="/app/fire-tv-remote" className="hover:underline">Remote for Fire TV & Fire Stick</Link></li>
                <li><Link href="/app/roku-tv-remote" className="hover:underline">Remote for Roku TV</Link></li>
                <li><Link href="/app/universal-tv-remote" className="hover:underline">Universal TV Remote</Link></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="py-16 border-t border-gray-50">
          <h2 className="text-[32px] font-bold text-heading text-center mb-10">Our Team</h2>
          <div className="max-w-[1000px] mx-auto text-[16px] text-muted leading-[1.8] text-center">
            <p>
              We&apos;re a startup company founded in 2019 and we&apos;re proud to announce that we have reached break even in 2022. For now, our team has over thirty talents, including product managers, engineers and marketers, and 70% are female, so work-life-balance is the pursuit. Building a comfortable working environment is important when it comes to building the best possible products as we can develop and deliver apps with innovation. Our team is connected with an important mission - to help mobile users to interact with smart TV more easily and conveniently.
            </p>
          </div>
        </section>

        {/* Our Technology */}
        <section className="py-16 border-t border-gray-50">
          <h2 className="text-[32px] font-bold text-heading text-center mb-10">Our Technology</h2>
          <div className="max-w-[1000px] mx-auto text-[16px] text-muted leading-[1.8] text-center">
            <p>
              On the path to our goal of interacting with smart TV more accessible, we&apos;re constantly improving the user experience of our apps for screen mirroring and remote control. We have supported all the main-streamed TV brands, including Chromecast™, Fire TV™, Roku™, LG™, Samsung™, Sony™, Panosonic™ and so on. For screen mirroring, we have implemented all the streaming protocols including AirPlay, GoogleCast, DLNA and Miracast, so our apps can mirror screen from mobile phone both iOS and Android. We&apos;re excited to work on cutting edge mobile apps, but we&apos;re even more proud that we get to build an easy-to-use, versatile, and mission oriented products.
            </p>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 border-t border-gray-50">
          <h2 className="text-[32px] font-bold text-heading text-center mb-20">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20 px-4">
            {values.map((value, i) => (
              <div key={i} className="text-center group">
                <div className="mb-8 flex justify-center">
                  <div className="relative w-32 h-32 transform group-hover:scale-110 transition-transform duration-500">
                    <Image
                      src={value.icon}
                      alt={value.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <h4 className="text-[20px] font-bold text-heading mb-4">{value.title}</h4>
                <p className="text-[14px] text-muted leading-relaxed px-4">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Connect with us */}
        <section className="py-16 border-t border-gray-50 text-center">
          <h2 className="text-[32px] font-bold text-heading mb-12">Connect with us</h2>
          <div className="flex justify-center items-center gap-12 text-[18px] font-bold text-primary">
            <a href="https://www.facebook.com/boostvisionapps" target="_blank" rel="noopener noreferrer" className="hover:underline">Facebook</a>
            <a href="https://twitter.com/BoostVisio86997" target="_blank" rel="noopener noreferrer" className="hover:underline">Twitter</a>
            <a href="https://www.youtube.com/@boostvision1021" target="_blank" rel="noopener noreferrer" className="hover:underline">YouTube</a>
          </div>
        </section>
      </div>
    </main>
  );
}

const values = [
  {
    title: "Integrity",
    icon: "/images/about-us/integrity.svg",
    description: "We prioritize doing the right thing, even when it's difficult or unpopular, and we take responsibility for the actions and the impact on others."
  },
  {
    title: "Innovation",
    icon: "/images/about-us/innovation.svg",
    description: "We are a highly creative and forward-thinking group who are passionate about generating new and groundbreaking ideas."
  },
  {
    title: "Pragmatic",
    icon: "/images/about-us/pragmatic.svg",
    description: "We work together to identify the most important problems to solve and to develop solutions that are both effective and efficient."
  },
  {
    title: "Self-Motivated",
    icon: "/images/about-us/self-motivated.svg",
    description: "We are individuals that take ownership of our projects. We are able to work without constant supervision and are proactive in identifying and solving problems."
  },
  {
    title: "Collaborative",
    icon: "/images/about-us/collaborative.svg",
    description: "We work together effectively to achieve a common goal. We share knowledge, expertise, and resources, and are committed to working towards a shared vision."
  },
  {
    title: "Make Progress Everyday",
    icon: "/images/about-us/progress.svg",
    description: "We are proactive in seeking out new knowledge and skills, and are always looking for ways to improve our processes and methodologies."
  }
];
