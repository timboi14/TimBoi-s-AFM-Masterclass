import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://timboi14masterclass.vercel.app'),
  title: {
    default: "TimBoi's Academy · ACCA AFM Pass Engine",
    template: '%s · TimBoi\'s Academy',
  },
  description: 'Match-day energy. Examiner traps, technique, and the four habits that pass AFM.',
  openGraph: {
    type: 'website',
    siteName: "TimBoi's Academy",
    images: ['/og-cover.svg'],
  },
  twitter: { card: 'summary_large_image', images: ['/og-cover.svg'] },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/icons/apple-touch-icon.png',
  },
  manifest: '/manifest.webmanifest',
  themeColor: '#0a0f1e',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body className="bg-bg text-text font-body antialiased">{children}</body>
    </html>
  );
}
