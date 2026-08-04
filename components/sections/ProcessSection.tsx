'use client';

import React from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { PROCESS_STEPS } from '@/constants/process';
import { ProcessStep } from '@/components/shared/ProcessStep';

export const ProcessSection = () => {
  return (
    <Section id="process" className="bg-[#070709]">
      <Container size="lg" className="space-y-12">
        <SectionHeader
          badge="OUR METHODOLOGY"
          title="THE 4-STAGE VISUAL PRODUCTION PIPELINE"
          subtitle="From initial brief ingestion to final 4K master delivery in 24–48 hours."
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROCESS_STEPS.map((step, idx) => (
            <ProcessStep
              key={step.step}
              step={step}
              isLast={idx === PROCESS_STEPS.length - 1}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
};
