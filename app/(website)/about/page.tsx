import React from 'react';
import { Metadata } from 'next';
import { AboutSection } from '@/components/sections/AboutSection';
import { CommunitySection } from '@/components/sections/CommunitySection';
import { ContactSection } from '@/components/sections/ContactSection';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'About NOEL VISUALS',
  description:
    'Learn about NOEL VISUALS studio ethos, core team, design philosophy, and metrics driving organic channel growth for creators worldwide.',
};

export default function AboutPage() {
  return (
    <div className="pt-28 md:pt-36">
      {/* Page Header */}
      <section className="pb-12 border-b border-white/10">
        <Container size="lg" className="space-y-4 text-center">
          <Badge variant="dot">Agency Ethos & Team</Badge>
          <Heading as="h1" size="xl">
            ABOUT NOEL VISUALS
          </Heading>
          <p className="text-neutral-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            We are a boutique studio of senior editors, 3D artists, and thumbnail strategists obsessed with visual precision and algorithm dominance.
          </p>
        </Container>
      </section>

      <AboutSection />
      <CommunitySection />
      <ContactSection />
    </div>
  );
}
