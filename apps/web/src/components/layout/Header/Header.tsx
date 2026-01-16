"use client";

import { useState, useEffect } from "react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useTranslations, useLocale } from 'next-intl';
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SearchInput } from "./SearchInput";

const screenMirroringApps = [
  { name: "TV Cast for Chromecast", href: "/app/tv-cast-for-chromecast" },
  { name: "Smart TV Cast", href: "/app/universal-tv-cast" },
  { name: "Screen Mirroring App", href: "/app/screen-mirroring" },
  { name: "Miracast App: Screen Cast", href: "/app/miracast" },
  { name: "Screen Mirroring for Samsung TV", href: "/app/screen-mirroring-samsung-tv" },
];

const tvRemoteApps = [
  { name: "Remote for Fire TV", href: "/app/fire-tv-remote" },
  { name: "Remote for LG TV", href: "/app/lg-tv-remote" },
  { name: "Remote for Roku TV", href: "/app/roku-tv-remote" },
  { name: "Remote for Samsung TV", href: "/app/samsung-tv-remote" },
  { name: "Universal TV Remote", href: "/app/universal-tv-remote" },
];

const supportLinks = [
  { name: "How to", href: "/tutorial" },
  { name: "F.A.Q.", href: "/faq" },
];

export function Header() {
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'pt', name: 'Português' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ja', name: '日本語' },
  ];

  const handleLangChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setIsLangOpen(false);
  };

  return (
    <header 
      className={cn(
        "sticky top-0 z-[100] h-[98px] w-full transition-all duration-300",
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-md h-[80px]" : "bg-white"
      )}
    >
      <nav className="container-custom flex h-full items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="BoostVision Logo"
            width={180}
            height={45}
            className="h-[45px] w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 lg:flex h-full">
          {/* Screen Mirroring Dropdown */}
          <div 
            className="group relative h-full flex items-center"
            onMouseEnter={() => setActiveDropdown("mirroring")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="nav-link flex items-center gap-1">
              {t('screenMirroring')}
              <svg className="h-3 w-3 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className={cn(
              "absolute top-[100%] left-[-20px] w-[260px] bg-white shadow-xl rounded-b-2xl border-t-2 border-primary py-4 transition-all duration-200 opacity-0 invisible translate-y-2",
              activeDropdown === "mirroring" && "opacity-100 visible translate-y-0"
            )}>
              {screenMirroringApps.map((app) => (
                <Link 
                  key={app.name} 
                  href={app.href}
                  className="block px-6 py-3 text-[15px] font-medium text-heading hover:bg-section-bg hover:text-primary transition-colors"
                >
                  {app.name}
                </Link>
              ))}
              <div className="mt-2 border-t border-gray-50 px-6 pt-2">
                <Link href="/app" className="text-[14px] font-bold text-primary hover:underline">{t('viewAll')}</Link>
              </div>
            </div>
          </div>

          {/* TV Remote Dropdown */}
          <div 
            className="group relative h-full flex items-center"
            onMouseEnter={() => setActiveDropdown("remote")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="nav-link flex items-center gap-1">
              {t('tvRemote')}
              <svg className="h-3 w-3 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className={cn(
              "absolute top-[100%] left-[-20px] w-[260px] bg-white shadow-xl rounded-b-2xl border-t-2 border-primary py-4 transition-all duration-200 opacity-0 invisible translate-y-2",
              activeDropdown === "remote" && "opacity-100 visible translate-y-0"
            )}>
              {tvRemoteApps.map((app) => (
                <Link 
                  key={app.name} 
                  href={app.href}
                  className="block px-6 py-3 text-[15px] font-medium text-heading hover:bg-section-bg hover:text-primary transition-colors"
                >
                  {app.name}
                </Link>
              ))}
              <div className="mt-2 border-t border-gray-50 px-6 pt-2">
                <Link href="/app" className="text-[14px] font-bold text-primary hover:underline">{t('viewAll')}</Link>
              </div>
            </div>
          </div>

          <Link href="/blog" className="nav-link">{t('blog')}</Link>

          {/* Support Dropdown */}
          <div 
            className="group relative h-full flex items-center"
            onMouseEnter={() => setActiveDropdown("support")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="nav-link flex items-center gap-1">
              {t('support')}
              <svg className="h-3 w-3 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className={cn(
              "absolute top-[100%] left-[-20px] w-[200px] bg-white shadow-xl rounded-b-2xl border-t-2 border-primary py-4 transition-all duration-200 opacity-0 invisible translate-y-2",
              activeDropdown === "support" && "opacity-100 visible translate-y-0"
            )}>
              {supportLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="block px-6 py-3 text-[15px] font-medium text-heading hover:bg-section-bg hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Language & CTA */}
          <div className="ml-4 flex items-center gap-4">
            <SearchInput />
            
            {/* Language Switcher */}
            <div className="relative">
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 text-[16px] font-bold text-heading hover:text-primary transition-colors uppercase"
              >
                {locale}
                <svg className={cn("h-4 w-4 transition-transform", isLangOpen && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isLangOpen && (
                <div className="absolute top-full right-0 mt-2 w-[150px] bg-white shadow-xl rounded-xl border border-gray-100 py-2 animate-fade-in">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLangChange(lang.code)}
                      className={cn(
                        "w-full text-left px-4 py-2 text-[14px] font-medium hover:bg-section-bg transition-colors",
                        locale === lang.code ? "text-primary font-bold" : "text-heading"
                      )}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link href="/app" className="btn-try-free">
              {t('tryForFree')}
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-heading lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-[98px] z-[99] w-full bg-white overflow-y-auto pb-10 lg:hidden animate-fade-in">
          <div className="flex flex-col p-6 gap-2">
            {/* Mobile Search */}
            <div className="mb-6">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const q = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value;
                  if (q.trim()) {
                    window.location.href = `/search?q=${encodeURIComponent(q.trim())}`;
                    setIsMenuOpen(false);
                  }
                }}
                className="relative flex items-center"
              >
                <input
                  name="q"
                  type="text"
                  placeholder="Search..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-4 pr-12 text-[16px] font-medium text-heading focus:outline-none"
                />
                <button 
                  type="submit"
                  className="absolute right-2 h-10 w-10 text-muted flex items-center justify-center"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>

            {/* Language Switcher Mobile */}
            <div className="mb-6">
               <p className="text-[12px] font-bold uppercase tracking-widest text-muted mb-3">Language</p>
               <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLangChange(lang.code)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-[14px] font-bold border transition-all",
                        locale === lang.code 
                          ? "bg-primary border-primary text-white" 
                          : "bg-gray-50 border-gray-100 text-heading"
                      )}
                    >
                      {lang.code.toUpperCase()}
                    </button>
                  ))}
               </div>
            </div>

            <div className="mb-4">
              <p className="text-[14px] font-bold uppercase tracking-wider text-muted mb-4">{t('screenMirroring')}</p>
              <div className="grid grid-cols-1 gap-1 pl-2 border-l-2 border-gray-100">
                {screenMirroringApps.map(app => (
                  <Link key={app.name} href={app.href} className="py-2 text-[16px] font-medium text-heading" onClick={() => setIsMenuOpen(false)}>{app.name}</Link>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-[14px] font-bold uppercase tracking-wider text-muted mb-4">{t('tvRemote')}</p>
              <div className="grid grid-cols-1 gap-1 pl-2 border-l-2 border-gray-100">
                {tvRemoteApps.map(app => (
                  <Link key={app.name} href={app.href} className="py-2 text-[16px] font-medium text-heading" onClick={() => setIsMenuOpen(false)}>{app.name}</Link>
                ))}
              </div>
            </div>

            <Link href="/blog" className="py-4 text-[18px] font-bold text-heading border-b border-gray-50" onClick={() => setIsMenuOpen(false)}>{t('blog')}</Link>
            
            <div className="mb-8">
              <p className="text-[14px] font-bold uppercase tracking-wider text-muted py-4">{t('support')}</p>
              <div className="grid grid-cols-1 gap-1 pl-2 border-l-2 border-gray-100">
                {supportLinks.map(link => (
                  <Link key={link.name} href={link.href} className="py-2 text-[16px] font-medium text-heading" onClick={() => setIsMenuOpen(false)}>{link.name}</Link>
                ))}
              </div>
            </div>

            <Link href="/app" className="btn-gradient w-full text-center" onClick={() => setIsMenuOpen(false)}>
              {t('tryForFree')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
