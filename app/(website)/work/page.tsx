import React from 'react';
import { Metadata } from 'next';
import { WorkSection } from '@/components/sections/WorkSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Work Showcase & Case Studies',
  description:
    'Discover NOEL VISUALS portfolio of high-octane edits, viral thumbnails, 3D motion graphics, and luxury brand design case studies.',
};

export default function WorkPage() {
  return (
    <div className="pt-28 md:pt-36">
      {/* Page Header */}
      <section className="pb-12 border-b border-white/10">
        <Container size="lg" className="space-y-4 text-center">
          <Badge variant="dot">Case Studies & Showcase</Badge>
          <Heading as="h1" size="xl">
            SELECTED CREATIVE WORKS
          </Heading>
          <p className="text-neutral-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            A curated showcase of video edits, thumbnail suites, and 3D visual identities engineered for max retention and high CTR.
          </p>
        </Container>
      </section>

      <WorkSection previewOnly={false} />
      <ContactSection />
    </div>
  );
}
