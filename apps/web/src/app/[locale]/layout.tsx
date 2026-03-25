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

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  // Providing all messages to the client side
  const messages = await getMessages();

  // Fetch navigation and global settings for the layout
  let navigation = null;
  let globalSetting = null;

  try {
    navigation = await getNavigation(locale);
  } catch (err) {
    console.error('Navigation fetch error:', err);
  }

  try {
    globalSetting = await getGlobalSetting(locale);
  } catch (err) {
    console.error('Global settings fetch error:', err);
  }

  return (
    <html lang={locale} className={`${roboto.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        {/* Preconnect to Strapi CMS for faster API & media image loading */}
        <link rel="preconnect" href="https://helpful-fun-dead826d03.strapiapp.com" />
        {/* DNS prefetch for deferred analytics scripts */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <AnalyticsWrapper />
        <IntlProvider locale={locale} messages={messages}>
          <Header navigation={navigation as any} globalSetting={globalSetting as any} />
          {children}
          <Footer navigation={navigation as any} globalSetting={globalSetting as any} />
        </IntlProvider>
      </body>
    </html>
  );
}
