import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const archivo = localFont({ src: '../node_modules/@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2', variable: '--font-display', display: 'swap', weight: '100 900' });
const dmSans = localFont({ src: '../node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2', variable: '--font-body', display: 'swap', weight: '100 1000' });
export const metadata: Metadata = {
  metadataBase: new URL("https://shawtyslayz.vercel.app"),
  title: "ShawtySlayz — Fashion E-commerce Website",
  description:
    "A premium fashion e-commerce experience built with Next.js, React, and TypeScript.",

  openGraph: {
    title: "ShawtySlayz — Fashion E-commerce Website",
    description:
      "A premium fashion e-commerce experience featuring product browsing, cart functionality, and branded editorial content.",
    url: "https://shawtyslayz.vercel.app/",
    siteName: "ShawtySlayz",
    images: [
      {
        url: "/social-preview.png",
        width: 1200,
        height: 630,
        alt: "ShawtySlayz fashion e-commerce website",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ShawtySlayz — Fashion E-commerce Website",
    description:
      "Premium fashion e-commerce experience built with Next.js, React, and TypeScript.",
    images: ["/social-preview.png"],
  },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${archivo.variable} ${dmSans.variable}`}>{children}</body></html>;
}
