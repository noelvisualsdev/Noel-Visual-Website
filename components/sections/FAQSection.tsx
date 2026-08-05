'use client';

import React from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { FAQ_ITEMS } from '@/constants/faq';
import { Accordion } from '@/components/ui/Accordion';

export const FAQSection = () => {
  const accordionItems = FAQ_ITEMS.map((item, idx) => ({
    id: `faq-${idx}`,
    title: item.question,
    content: item.answer,
  }));

  return (
    <Section id="faq" className="bg-transparent">
      <Container size="md" className="space-y-12">
        <SectionHeader
          badge="FREQUENTLY ASKED QUESTIONS"
          title="EVERYTHING YOU NEED TO KNOW"
          subtitle="Clear answers on production workflow, pricing, licensing, and turnarounds."
          centered
        />

        <Accordion items={accordionItems} />
      </Container>
    </Section>
  );
};
