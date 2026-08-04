import React from 'react';
import { Metadata } from 'next';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Services & Pricing',
  description:
    'Explore NOEL VISUALS core services: Cinematic Video Editing, High CTR Thumbnails, Graphic Design, and Fast 24-48h Turnaround packages.',
};

export default function ServicesPage() {
  return (
    <div className="pt-28 md:pt-36">
      {/* Page Header */}
      <section className="pb-12 border-b border-white/10">
        <Container size="lg" className="space-y-4 text-center">
          <Badge variant="dot">Capabilities & Packages</Badge>
          <Heading as="h1" size="xl">
            OUR CREATIVE SERVICES
          </Heading>
          <p className="text-neutral-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Scalable visual production packages tailored for ambitious creators, esports teams, and digital media brands.
          </p>
        </Container>
      </section>

      <ServicesSection previewOnly={false} />
      <FAQSection />
      <ContactSection />
    </div>
  );
}
