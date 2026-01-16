import type { Metadata } from "next";
import { Roboto, Poppins } from "next/font/google";
import "./globals.css";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} ${poppins.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
