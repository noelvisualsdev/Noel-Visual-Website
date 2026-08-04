import React from 'react';
import { Hero } from '@/components/sections/Hero';
import { WorkSection } from '@/components/sections/WorkSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { ReviewsSection } from '@/components/sections/ReviewsSection';
import { CommunitySection } from '@/components/sections/CommunitySection';
import { FAQSection } from '@/components/sections/FAQSection';
import { ContactSection } from '@/components/sections/ContactSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <WorkSection previewOnly={true} />
      <ServicesSection previewOnly={true} />
      <AboutSection />
      <ProcessSection />
      <ReviewsSection />
      <CommunitySection />
      <FAQSection />
      <ContactSection />
    </>
  );
}
