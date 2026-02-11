import type { Metadata } from "next";

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/boostvision-favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/boostvision-favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/boostvision-favicon-270x270.png', sizes: '270x270', type: 'image/png' }
    ],
    apple: [
      { url: '/boostvision-favicon-180x180.png', sizes: '180x180', type: 'image/png' }
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
