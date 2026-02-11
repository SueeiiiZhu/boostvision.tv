import type { Metadata } from "next";

export const metadata: Metadata = {
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
