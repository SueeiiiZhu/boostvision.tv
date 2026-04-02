import type { Metadata } from "next";
import { Roboto, Poppins } from "next/font/google";
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getNavigation } from "@/lib/strapi/api/navigation";
import { getGlobalSetting } from "@/lib/strapi/api/global";
import { IntlProvider } from "@/components/providers/IntlProvider";
import { Header, Footer } from "@/components/layout";
import { AnalyticsWrapper } from "@/components/analytics";
import type { GlobalSetting, Navigation } from "@/types/strapi";
import "../globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
  display: "swap", // Prevent FOIT and reduce reflow
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "900"],
  variable: "--font-heading",
  display: "swap", // Prevent FOIT and reduce reflow
});

export const metadata: Metadata = {
  title: "BoostVision - Screen Mirroring & TV Remote Apps",
  description: "Mirror the screen of your iPhone, iPad, Android phone & tablet directly to your Smart TV. Try our professional remote control apps.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Locale = (typeof routing.locales)[number];

function isLocale(locale: string): locale is Locale {
  return routing.locales.includes(locale as Locale);
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  // Fetch messages, navigation, and global settings all in parallel
  const [messages, navigation, globalSetting] = await Promise.all([
    getMessages(),
    getNavigation(locale).catch((err) => {
      console.error('Navigation fetch error:', err);
      return null;
    }),
    getGlobalSetting(locale).catch((err) => {
      console.error('Global settings fetch error:', err);
      return null;
    }),
  ]);

  return (
    <html lang={locale} className={`${roboto.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        {/* Preconnect to Strapi CMS for faster API & media image loading */}
        <link rel="preconnect" href="https://helpful-fun-dead826d03.strapiapp.com" />
        {/* DNS prefetch for deferred analytics scripts */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
        {/* DNS prefetch for Google AdSense */}
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <AnalyticsWrapper />
        <IntlProvider locale={locale} messages={messages}>
          <Header navigation={navigation} globalSetting={globalSetting} />
          {children}
          <Footer navigation={navigation} globalSetting={globalSetting} />
        </IntlProvider>
      </body>
    </html>
  );
}
