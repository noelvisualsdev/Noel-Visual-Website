import React from 'react';
import { Metadata } from 'next';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Our Production Process',
  description:
    'Discover NOEL VISUALS 4-stage creative pipeline: Briefing, Concept Direction, Production Edit, and Polished 4K Delivery.',
};

export default function ProcessPage() {
  return (
    <div className="pt-28 md:pt-36">
      {/* Page Header */}
      <section className="pb-12 border-b border-white/10">
        <Container size="lg" className="space-y-4 text-center">
          <Badge variant="dot">Workflow & Execution</Badge>
          <Heading as="h1" size="xl">
            HOW WE WORK WITH YOU
          </Heading>
          <p className="text-neutral-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Our streamlined 4-stage pipeline is designed to eliminate friction, guarantee rapid 24–48h turnarounds, and maintain supreme quality.
          </p>
        </Container>
      </section>

      <ProcessSection />
      <FAQSection />
      <ContactSection />
    </div>
  );
}
