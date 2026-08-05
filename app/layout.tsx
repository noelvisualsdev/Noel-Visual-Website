import React from 'react';
import { Metadata } from 'next';
import '@/app/globals.css';
import { SITE_CONFIG } from '@/constants/site';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { LanguageProvider } from '@/components/providers/LanguageProvider';

export const metadata: Metadata = {
  metadataBase: new URL('https://noelvisuals.com'),
  title: {
    default: `${SITE_CONFIG.name} — Premium Video Editing, Thumbnails & Brand Design`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    'Video Editing Agency',
    'High CTR Thumbnails',
    '3D Motion Design',
    'Content Creator Agency',
    'YouTube Editor',
    'Noel Visuals',
    'Brand Identity Design',
  ],
  authors: [{ name: 'NOEL VISUALS Team' }],
  creator: 'NOEL VISUALS',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_CONFIG.url,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: 'https://noelvisuals.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NOEL VISUALS — Bringing Ideas to Life',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: ['https://noelvisuals.com/og-image.png'],
    creator: '@noelvisuals',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#070709] text-white antialiased selection:bg-white selection:text-black">
        <AuthProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
