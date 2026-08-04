import React from 'react';
import { ReviewsSection } from '@/components/sections/ReviewsSection';

export const metadata = {
  title: 'Client Reviews & Feedback | NOEL VISUALS',
  description: 'Read verified client feedback and Discord community reviews for NOEL VISUALS.',
};

export default function ReviewsPage() {
  return (
    <main className="pt-24 min-h-screen bg-[#070709]">
      <ReviewsSection />
    </main>
  );
}
