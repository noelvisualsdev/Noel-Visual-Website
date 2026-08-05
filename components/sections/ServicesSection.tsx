'use client';

import React from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { SERVICES_CATALOG } from '@/constants/services';
import { ServiceCard } from '@/components/shared/ServiceCard';

interface ServicesSectionProps {
  previewOnly?: boolean;
}

export const ServicesSection = ({ previewOnly = false }: ServicesSectionProps) => {
  const servicesToDisplay = previewOnly
    ? SERVICES_CATALOG.slice(0, 3)
    : SERVICES_CATALOG;

  return (
    <Section id="services" className="bg-transparent">
      <Container size="lg" className="space-y-12">
        <SectionHeader
          badge="OUR CORE CAPABILITIES"
          title="VISUAL PRODUCTION & BRAND SYSTEM DISCIPLINES"
          subtitle="Everything creators and growth-focused brands need to command attention in saturated feeds."
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES_CATALOG.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </Container>
    </Section>
  );
};
