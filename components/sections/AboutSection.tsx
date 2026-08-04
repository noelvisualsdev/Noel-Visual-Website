'use client';

import React from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { SITE_CONFIG } from '@/constants/site';
import { Card } from '@/components/ui/Card';
import { ShieldCheck, Award, Sparkles, Users } from 'lucide-react';

export const AboutSection = () => {
  return (
    <Section id="about" className="bg-[#090a0d] border-t border-white/5">
      <Container size="lg" className="space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <SectionHeader
              badge="WHO WE ARE"
              title="CRAFTING SCROLL-STOPPING VISUAL IDENTITIES"
              subtitle="NOEL VISUALS is a boutique digital production studio specializing in high-converting video editing, thumbnail engineering, and brand systems for world-class creators."
              className="mb-0"
            />
            <p className="text-sm text-neutral-300 leading-relaxed">
              In an era dominated by fleeting attention spans, plain content gets scrolled past. We fuse high-speed editing techniques, 3D typography, custom soundscapes, and color science to ensure every frame holds attention.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-2xl font-black font-mono text-white">450M+</div>
                <div className="text-xs text-neutral-400 font-mono">Organic Views Generated</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-2xl font-black font-mono text-white">120+</div>
                <div className="text-xs text-neutral-400 font-mono">Creators & Brands Served</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card variant="glass" className="p-6 space-y-3">
              <Award className="w-8 h-8 text-white" />
              <h3 className="text-base font-bold text-white uppercase">Obsessive Quality</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Zero compromises on frame pacing, color grading, or audio loudness standards.
              </p>
            </Card>

            <Card variant="glass" className="p-6 space-y-3">
              <Sparkles className="w-8 h-8 text-white" />
              <h3 className="text-base font-bold text-white uppercase">CTR Science</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Every thumbnail layout is engineered based on eye-tracking heatmaps and CTR data.
              </p>
            </Card>

            <Card variant="glass" className="p-6 space-y-3">
              <Users className="w-8 h-8 text-white" />
              <h3 className="text-base font-bold text-white uppercase">Dedicated Team</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Direct access to senior editors, motion designers, and thumbnail artists.
              </p>
            </Card>

            <Card variant="glass" className="p-6 space-y-3">
              <ShieldCheck className="w-8 h-8 text-white" />
              <h3 className="text-base font-bold text-white uppercase">24-48h Guarantee</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Rapid turnaround with guaranteed release schedule reliability.
              </p>
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  );
};
