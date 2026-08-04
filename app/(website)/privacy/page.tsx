import React from 'react';
import { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'NOEL VISUALS privacy policy and data protection commitments.',
};

export default function PrivacyPage() {
  return (
    <div className="pt-28 md:pt-36 pb-24">
      <Container size="md" className="space-y-8 text-neutral-300 leading-relaxed">
        <div className="space-y-4 border-b border-white/10 pb-8">
          <Badge variant="dot">Legal & Compliance</Badge>
          <Heading as="h1" size="xl">
            PRIVACY POLICY
          </Heading>
          <p className="text-xs font-mono text-neutral-500">
            Last Updated: August 2026
          </p>
        </div>

        <div className="space-y-6 text-sm">
          <h2 className="text-lg font-bold text-white uppercase">1. Information We Collect</h2>
          <p>
            When you submit a project brief or contact form on NOEL VISUALS (noelvisuals.com), we collect information including your name, email address, project type, budget preferences, and channel URLs.
          </p>

          <h2 className="text-lg font-bold text-white uppercase">2. How We Use Your Data</h2>
          <p>
            Your information is strictly used to communicate with you regarding your creative project inquiries, deliver customized quotes, and coordinate production assets. We never sell or transfer personal data to third-party marketers.
          </p>

          <h2 className="text-lg font-bold text-white uppercase">3. Media Asset Security</h2>
          <p>
            Raw video footage, project storyboards, raw thumbnail renders, and brand files uploaded to our cloud storage or frame platforms are protected under commercial non-disclosure guidelines.
          </p>

          <h2 className="text-lg font-bold text-white uppercase">4. Contact Us</h2>
          <p>
            If you have questions regarding this Privacy Policy, please email us at <strong>contact.noelvisuals@gmail.com</strong>.
          </p>
        </div>
      </Container>
    </div>
  );
}
