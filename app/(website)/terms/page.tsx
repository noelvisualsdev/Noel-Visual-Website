import React from 'react';
import { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'NOEL VISUALS terms of service and commercial client agreements.',
};

export default function TermsPage() {
  return (
    <div className="pt-28 md:pt-36 pb-24">
      <Container size="md" className="space-y-8 text-neutral-300 leading-relaxed">
        <div className="space-y-4 border-b border-white/10 pb-8">
          <Badge variant="dot">Legal Agreements</Badge>
          <Heading as="h1" size="xl">
            TERMS OF SERVICE
          </Heading>
          <p className="text-xs font-mono text-neutral-500">
            Last Updated: August 2026
          </p>
        </div>

        <div className="space-y-6 text-sm">
          <h2 className="text-lg font-bold text-white uppercase">1. Creative Services Agreement</h2>
          <p>
            By commissioning NOEL VISUALS for video editing, thumbnail design, or branding services, you agree to the scope, deliverables, and revision terms outlined in your project proposal.
          </p>

          <h2 className="text-lg font-bold text-white uppercase">2. Intellectual Property Rights</h2>
          <p>
            Upon full payment for completed services, NOEL VISUALS transfers full commercial usage rights for final exported assets to the client. NOEL VISUALS retains the right to display final works in studio portfolio showcases and showreels unless an explicit NDA is requested prior to project kick-off.
          </p>

          <h2 className="text-lg font-bold text-white uppercase">3. Turnaround SLA & Revisions</h2>
          <p>
            Standard turnarounds (12-24h for thumbnails, 24-48h for video edits) begin once all required raw assets, project briefs, and deposit payments are received. Each project includes two rounds of revisions.
          </p>
        </div>
      </Container>
    </div>
  );
}
