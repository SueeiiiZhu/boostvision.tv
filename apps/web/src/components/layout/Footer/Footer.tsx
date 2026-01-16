import Link from "next/link";
import Image from "next/image";

const screenMirroringLinks = [
  { name: "TV Cast for Chromecast", href: "/app/tv-cast-for-chromecast" },
  { name: "Smart TV Cast", href: "/app/universal-tv-cast" },
  { name: "Screen Mirroring App", href: "/app/screen-mirroring" },
  { name: "Miracast App: Screen Cast", href: "/app/miracast" },
  { name: "Screen Mirroring for Samsung TV", href: "/app/screen-mirroring-samsung-tv" },
  { name: "Screen Mirroring App for Roku", href: "/app/screen-mirroring-for-roku" },
  { name: "LG TV Screen Mirroring App", href: "/app/lg-tv-screen-mirroring" },
  { name: "Firestick Screen Mirroring App", href: "/app/screen-mirroring-firestick" },
  { name: "Hisense TV Screen Mirroring App", href: "/app/hisense-tv-screen-mirroring" },
  { name: "TCL TV Screen Mirroring App", href: "/app/tcl-tv-screen-mirroring" },
];

const tvRemoteLinks = [
  { name: "Remote for Fire TV", href: "/app/fire-tv-remote" },
  { name: "Remote for LG TV", href: "/app/lg-tv-remote" },
  { name: "Remote for Roku TV", href: "/app/roku-tv-remote" },
  { name: "Remote for Samsung TV", href: "/app/samsung-tv-remote" },
  { name: "Universal TV Remote", href: "/app/universal-tv-remote" },
  { name: "Remote for Sony TV", href: "/app/sony-tv-remote" },
  { name: "Remote for Vizio TV", href: "/app/vizio-tv-remote" },
  { name: "Remote for Apple TV", href: "/app/apple-tv-remote" },
  { name: "Hisense TV Remote", href: "/app/hisense-tv-remote" },
  { name: "Insignia TV Remote", href: "/app/insignia-tv-remote" },
];

const resourceLinks = [
  { name: "Knowledge Base", href: "/blog" },
  { name: "TV Remote", href: "/blog?category=tv-remote" },
  { name: "Screen Mirroring", href: "/blog?category=screen-mirroring" },
  { name: "Manual", href: "/blog?category=manual" },
];

const supportLinks = [
  { name: "How to", href: "/tutorial" },
  { name: "F.A.Q.", href: "/faq" },
  { name: "Term of Use", href: "/terms-of-use" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Contact us", href: "/contact-us" },
  { name: "About us", href: "/about-us" },
];

export function Footer() {
  return (
    <footer className="footer-gradient pt-20 pb-10 text-white font-sans">
      <div className="container-custom">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Logo & Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="mb-8 block">
              <Image
                src="/logo-white.svg"
                alt="BoostVision Logo"
                width={180}
                height={45}
                className="h-[45px] w-auto"
              />
            </Link>
            <p className="text-[14px] text-white/60 leading-relaxed">
              &copy; {new Date().getFullYear()} BoostVision. <br />
              All rights reserved.
            </p>
          </div>

          {/* Screen Mirroring Column */}
          <div>
            <h4 className="mb-8 text-[18px] font-bold font-heading text-white">Screen Mirroring Apps</h4>
            <ul className="flex flex-col gap-3">
              {screenMirroringLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[14px] text-white/60 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* TV Remote Column */}
          <div>
            <h4 className="mb-8 text-[18px] font-bold font-heading text-white">TV Remote Apps</h4>
            <ul className="flex flex-col gap-3">
              {tvRemoteLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[14px] text-white/60 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="mb-8 text-[18px] font-bold font-heading text-white">Resources</h4>
            <ul className="flex flex-col gap-3">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[14px] text-white/60 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Social */}
          <div>
            <h4 className="mb-8 text-[18px] font-bold font-heading text-white">Support</h4>
            <ul className="flex flex-col gap-3 mb-10">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[14px] text-white/60 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-4">
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <Image src="/icons/youtube.svg" alt="Youtube" width={20} height={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <Image src="/icons/twitter.svg" alt="Twitter" width={20} height={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <Image src="/icons/facebook.svg" alt="Facebook" width={20} height={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-20 border-t border-white/10 pt-10 text-center">
          <p className="text-[12px] text-white/40">
            Apple, App Store, iPhone, iPad, AirPlay and Apple TV are trademarks of Apple Inc.<br />
            Google Play, Android and Chromecast are trademarks of Google LLC.
          </p>
        </div>
      </div>
    </footer>
  );
}
