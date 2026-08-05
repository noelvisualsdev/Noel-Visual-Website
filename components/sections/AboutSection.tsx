'use client';

import React from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card } from '@/components/ui/Card';
import { ShieldCheck, Award, Sparkles, Users } from 'lucide-react';

export const AboutSection = () => {
  return (
    <Section id="about" className="bg-transparent border-t border-white/5">
      <Container size="lg" className="space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <SectionHeader
              badge="WHO WE ARE"
              title="WE TURN IDEAS INTO VIDEOS THAT STAY IN PEOPLE'S MINDS."
              subtitle="NOEL VISUALS is a creative studio specializing in high-quality video editing and visual brand communication. We do not simply cut footage — we transform it into dynamic stories that capture attention and present your brand professionally."
              className="mb-0"
            />

            <p className="text-sm text-neutral-300 leading-relaxed">
              From social media clips to long-form content, we combine precise
              editing, sound design, motion graphics, and a strong sense of
              rhythm. We work directly, transparently, and reliably — from the
              first briefing to the final export.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-2xl font-black font-mono text-white">
                  150M+
                </div>

                <div className="text-xs text-neutral-400 font-mono">
                  Organic Views Generated
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-2xl font-black font-mono text-white">
                  20+
                </div>

                <div className="text-xs text-neutral-400 font-mono">
                  Creators and Brands Served
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card variant="glass" className="p-6 space-y-3">
              <Award className="w-8 h-8 text-white" />

              <h3 className="text-base font-bold text-white uppercase">
                Precise Editing
              </h3>

              <p className="text-xs text-neutral-400 leading-relaxed">
                Every cut, transition, and detail is carefully refined for
                maximum impact and quality.
              </p>
            </Card>

            <Card variant="glass" className="p-6 space-y-3">
              <Sparkles className="w-8 h-8 text-white" />

              <h3 className="text-base font-bold text-white uppercase">
                Story and Retention
              </h3>

              <p className="text-xs text-neutral-400 leading-relaxed">
                Clear storytelling, strong pacing, and dynamic visuals keep
                your audience engaged.
              </p>
            </Card>

            <Card variant="glass" className="p-6 space-y-3">
              <Users className="w-8 h-8 text-white" />

              <h3 className="text-base font-bold text-white uppercase">
                Direct Collaboration
              </h3>

              <p className="text-xs text-neutral-400 leading-relaxed">
                No unnecessary middlemen. You work directly with your editor
                and receive fast, clear communication.
              </p>
            </Card>

            <Card variant="glass" className="p-6 space-y-3">
              <ShieldCheck className="w-8 h-8 text-white" />

              <h3 className="text-base font-bold text-white uppercase">
                Reliable Delivery
              </h3>

              <p className="text-xs text-neutral-400 leading-relaxed">
                Structured workflows, transparent deadlines, and on-time
                delivery of your content.
              </p>
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  );
};