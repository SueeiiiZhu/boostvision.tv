import type { Metadata } from "next";
import { Roboto, Poppins } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getNavigation } from "@/lib/strapi/api/navigation";
import { getGlobalSetting } from "@/lib/strapi/api/global";
import { Header, Footer } from "@/components/layout";
import { GoogleAnalytics } from "@/components/analytics";
import "../globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "900"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "BoostVision - Screen Mirroring & TV Remote Apps",
  description: "Mirror the screen of your iPhone, iPad, Android phone & tablet directly to your Smart TV. Try our professional remote control apps.",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/cropped-1766643131-boostvision-favicon-192x192.png', sizes: '192x192', type: 'image/png' }
    ],
    apple: [
      { url: '/cropped-1766643131-boostvision-favicon-180x180.png', sizes: '180x180', type: 'image/png' }
    ],
  },
};

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
      <body className="antialiased" suppressHydrationWarning>
        <GoogleAnalytics />
        <NextIntlClientProvider messages={messages}>
          <Header navigation={navigation as any} globalSetting={globalSetting as any} />
          {children}
          <Footer navigation={navigation as any} globalSetting={globalSetting as any} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
