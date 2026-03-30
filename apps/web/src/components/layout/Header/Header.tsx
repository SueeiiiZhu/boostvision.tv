"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SearchInput } from "./SearchInput";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Navigation, GlobalSetting } from "@/types/strapi";

interface HeaderProps {
  navigation: Navigation | null;
  globalSetting: GlobalSetting | null;
}

export function Header({ navigation, globalSetting }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(98);
  const headerRef = useRef<HTMLElement>(null);
  const t = useTranslations('Navigation');
  const pathname = usePathname();

  useEffect(() => {
    const updateHeaderHeight = () => {
      const nextHeight = headerRef.current?.offsetHeight;
      if (nextHeight) {
        setHeaderHeight((prev) => (prev === nextHeight ? prev : nextHeight));
      }
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      updateHeaderHeight();
    };
    updateHeaderHeight();
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateHeaderHeight);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Prevent background scroll while mobile menu is open
  useEffect(() => {
    if (!isMenuOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMenuOpen]);

  // Close mobile menu when switching to desktop breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const headerMenu = navigation?.headerMenu || [];
  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-[100] h-[98px] w-full transition-all duration-300",
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-md h-[80px]" : "bg-white"
      )}
    >
      <nav className="container-custom flex h-full items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src={globalSetting?.logo?.url || "/logo.svg"}
            alt={globalSetting?.siteName || "BoostVision Logo"}
            width={180}
            height={45}
            className="h-[20px] w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 lg:flex h-full">
          {headerMenu.map((item) => (
            <div
              key={item.id}
              className="group relative h-full flex items-center"
              onMouseEnter={() => item.links?.length > 0 && setActiveDropdown(item.id)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              {item.href ? (
                <Link href={item.href} className="nav-link flex items-center gap-1">
                  {item.name}
                  {item.links?.length > 0 && (
                    <svg className="h-3 w-3 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>
              ) : (
                <button
                  className="nav-link flex items-center gap-1"
                  aria-label={`${item.name} menu`}
                  aria-expanded={activeDropdown === item.id}
                >
                  {item.name}
                  {item.links?.length > 0 && (
                    <svg className="h-3 w-3 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
              )}

              {item.links?.length > 0 && (
                <div className={cn(
                  "absolute top-[100%] left-[-20px] w-[260px] bg-white shadow-xl rounded-b-2xl border-t-2 border-primary py-4 transition-all duration-200 opacity-0 invisible translate-y-2",
                  activeDropdown === item.id && "opacity-100 visible translate-y-0"
                )}>
                  {item.links.map((link) => (
                    <Link
                      key={link.id}
                      href={link.href}
                      className="block px-6 py-3 text-[15px] font-medium text-heading hover:bg-section-bg hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Language & CTA */}
          <div className="ml-4 flex items-center gap-4">
            <Suspense fallback={null}>
              <SearchInput />
            </Suspense>

            {/* Language switcher temporarily disabled until i18n is fully configured */}
            {/* <div className="group relative">
              <button
                className="flex items-center gap-1 text-[16px] font-bold text-heading hover:text-primary transition-colors uppercase"
                aria-label={`Change language, current: ${locale}`}
              >
                {locale}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute right-0 top-full hidden w-32 bg-white shadow-lg rounded-xl py-2 group-hover:block border border-gray-100 animate-fade-in">
                {['en', 'pt', 'es', 'fr', 'de', 'ja'].map((l) => (
                  <Link
                    key={l}
                    href={pathname}
                    locale={l as any}
                    className={cn(
                      "block px-4 py-2 text-[14px] font-bold hover:bg-gray-50 uppercase",
                      locale === l ? "text-primary" : "text-heading"
                    )}
                  >
                    {l}
                  </Link>
                ))}
              </div>
            </div> */}

            <Link href={globalSetting?.tryForFreeLink || "/app"} className="btn-try-free">
              {globalSetting?.tryForFreeText || t('tryForFree')}
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-heading lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
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
        <div
          className="fixed inset-x-0 z-[99] w-full overflow-y-auto bg-white pb-10 lg:hidden animate-fade-in"
          style={{
            top: `${headerHeight}px`,
            height: `calc(100dvh - ${headerHeight}px)`,
          }}
        >
          <div className="flex flex-col p-6 gap-2">
            {/* Mobile Search */}
            <div className="mb-6">
              <Suspense fallback={null}>
                <SearchInput isMobile onSearch={() => setIsMenuOpen(false)} />
              </Suspense>
            </div>

            {/* Quick Actions */}
            <div className="mb-6 grid grid-cols-2 gap-3">
              <Link
                href="/app?tab=screen-mirroring"
                className="flex flex-col items-center gap-2 rounded-2xl bg-section-bg p-4 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <Image src="/icons/mirror-tab.svg" alt="" width={24} height={24} />
                <span className="text-[13px] font-bold text-heading">Screen Mirroring</span>
              </Link>
              <Link
                href="/app?tab=tv-remote"
                className="flex flex-col items-center gap-2 rounded-2xl bg-section-bg p-4 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <Image src="/icons/remote-tab.svg" alt="" width={24} height={24} />
                <span className="text-[13px] font-bold text-heading">TV Remote</span>
              </Link>
            </div>

            {headerMenu.map((item) => (
              <div key={item.id} className="mb-4">
                {item.links?.length > 0 ? (
                  <>
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="mb-4 block text-[14px] font-bold uppercase tracking-wider text-primary"
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <p className="mb-4 text-[14px] font-bold uppercase tracking-wider text-muted">{item.name}</p>
                    )}
                    <div className="grid grid-cols-1 gap-1 pl-2 border-l-2 border-gray-100">
                      {item.links.map(link => (
                        <Link
                          key={link.id}
                          href={link.href}
                          className="py-2 text-[16px] font-medium text-heading"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href || "#"}
                    className="py-4 text-[18px] font-bold text-heading border-b border-gray-50 block"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}

            <Link href={globalSetting?.tryForFreeLink || "/app"} className="btn-gradient w-full text-center mt-6">
              {globalSetting?.tryForFreeText || t('tryForFree')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
