import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Navigation, GlobalSetting } from "@/types/strapi";

interface FooterProps {
  navigation: Navigation | null;
  globalSetting: GlobalSetting | null;
}

export function Footer({ navigation, globalSetting }: FooterProps) {
  const footerColumns = navigation?.footerColumns || [];
  const bottomMenu = navigation?.bottomMenu || [];
  const socialLinks = globalSetting?.socialLinks || [];

  return (
    <footer className="footer-gradient pt-20 pb-10 text-white font-sans">
      <div className="container-custom lg:max-w-[1320px]">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:[grid-template-columns:minmax(220px,1.1fr)_repeat(4,minmax(180px,1fr))]">
          {/* Logo & Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="mb-8 flex justify-center lg:justify-start">
              <Image
                src={globalSetting?.footerLogo?.url || "/logo-white.svg"}
                alt={globalSetting?.siteName || "BoostVision"}
                width={180}
                height={45}
                className="h-[34px] md:h-[45px] w-auto"
              />
            </Link>
            <p className="text-[14px] text-white/60 leading-relaxed mb-8 text-center lg:text-left">
              &copy; {new Date().getFullYear()} {globalSetting?.siteName || "BoostVision"}. <br />
              All rights reserved.
            </p>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="mx-auto flex w-fit items-center justify-center gap-4 lg:mx-0 lg:w-auto lg:justify-start">
                {socialLinks.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <Image
                      src={`/icons/${social.platform}.svg`}
                      alt={social.platform}
                      width={20}
                      height={20}
                    />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Dynamic Menus from Strapi */}
          {footerColumns.map((column) => (
            <div key={column.id}>
              <p className="mb-8 text-[18px] font-bold font-heading text-white">{column.title}</p>
              <ul className="flex flex-col gap-3">
                {column.links?.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-white/60 hover:text-white transition-colors flex items-center gap-2"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Line Area */}
        <div className="mt-20 border-t border-white/10 pt-10">
          {/* Centered Bottom Menu Links */}
          {bottomMenu.length > 0 && (
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 mb-10">
              {bottomMenu.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className="text-[16px] font-medium text-white/80 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          )}

          {/* Trademark Disclaimer */}
          {globalSetting?.trademarkDisclaimer && (
            <p className="text-[12px] text-white/40 text-center mb-6 leading-relaxed max-w-[1000px] mx-auto">
              {globalSetting.trademarkDisclaimer}
            </p>
          )}

          {/* Copyright/Footer Text */}
          {globalSetting?.footerText && (
            <p className="text-[12px] text-white/20 text-center uppercase tracking-widest">
              {globalSetting.footerText}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
