import React from 'react';
import { Metadata } from 'next';
import { PartnersSection } from '@/components/sections/PartnersSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Partner – NOEL VISUALS',
  description: 'Unsere Partner und Kooperationen. Wir arbeiten mit ausgewählten Marken und Studios zusammen.',
};

export default function PartnerPage() {
  return (
    <div className="pt-28 md:pt-36">
      <section className="pb-12 border-b border-white/10">
        <Container size="lg" className="space-y-4 text-center">
          <Badge variant="dot">Kooperationen & Partner</Badge>
          <Heading as="h1" size="xl">
            UNSERE PARTNER
          </Heading>
          <p className="text-neutral-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Wir arbeiten mit ausgewählten Partnern zusammen, die unsere Vision von hochwertigem kreativem Content teilen.
          </p>
        </Container>
      </section>

      <PartnersSection />
      <ContactSection />
    </div>
  );
}
