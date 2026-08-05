import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { JsonLd } from '@/components/shared/JsonLd';
import { AnimatedVideoBackground } from '@/components/ui/AnimatedVideoBackground';

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#050507] text-white relative">
      {/* Global Fixed Background Video Animation */}
      <AnimatedVideoBackground isFixed={true} overlayOpacity="bg-black/80" />
      
      <JsonLd />
      <Navbar />
      <main className="flex-grow relative z-10">{children}</main>
      <Footer />
    </div>
  );
}
