import React from 'react';
import { Metadata } from 'next';
import { ContactSection } from '@/components/sections/ContactSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Start a Project & Contact',
  description:
    'Start a project with NOEL VISUALS. Request video editing, thumbnail suites, or brand identity design with 12-hour response SLA.',
};

export default function ContactPage() {
  return (
    <div className="pt-28 md:pt-36">
      {/* Page Header */}
      <section className="pb-12 border-b border-white/10">
        <Container size="lg" className="space-y-4 text-center">
          <Badge variant="dot">Direct Inquiries & Bookings</Badge>
          <Heading as="h1" size="xl">
            START A PROJECT WITH NOEL VISUALS
          </Heading>
          <p className="text-neutral-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Tell us about your project scope, channel metrics, and vision. We will review your brief and send a custom proposal in under 12 hours.
          </p>
        </Container>
      </section>

      <ContactSection />
      <FAQSection />
    </div>
  );
}
