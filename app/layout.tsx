import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const archivo = localFont({ src: '../node_modules/@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2', variable: '--font-display', display: 'swap', weight: '100 900' });
const dmSans = localFont({ src: '../node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2', variable: '--font-body', display: 'swap', weight: '100 1000' });
export const metadata: Metadata = {
  title: { absolute: 'SHAWTYSLAYZ' },
  description: 'Cute trousers, matching energy and off-duty fits. Shop SHAWTYSLAYZ with size help, cart and checkout, with delivery across Pakistan.',
  icons: {
    icon: [{ url: '/brand-icon.png', type: 'image/png', sizes: '64x64' }],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  robots: { index: false, follow: false },
  openGraph: {
    title: 'SHAWTYSLAYZ',
    description: 'Cute fits. Matching energy. Shop printed trousers, tops and off-duty fits.',
    images: [{ url: '/images/shawtyslayz/hero-cute-trouser-campaign.webp', width: 1200, height: 1500, alt: 'SHAWTYSLAYZ printed trouser campaign' }],
  },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${archivo.variable} ${dmSans.variable}`}>{children}</body></html>;
}
