'use client';

import React from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { TESTIMONIALS } from '@/constants/testimonials';
import { Card } from '@/components/ui/Card';
import { Quote, MessageSquare, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const CommunitySection = () => {
  return (
    <Section id="reviews" className="bg-[#090a0d] border-t border-white/5">
      <Container size="lg" className="space-y-16">
        <SectionHeader
          badge="CLIENT REVIEWS & PROOF"
          title="WHAT TOP CREATORS & BRANDS SAY"
          subtitle="Real channel growth, CTR surges, and client satisfaction metrics."
          centered
        />

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item) => (
            <Card key={item.id} variant="glass" className="p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <Quote className="w-8 h-8 text-neutral-500" />
                <p className="text-sm text-neutral-200 leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase">{item.author}</h4>
                  <p className="text-xs text-neutral-400 font-mono">{item.company}</p>
                </div>
                {item.viewsCount && (
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-white/10 text-neutral-300 border border-white/15">
                    {item.viewsCount}
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Community & Discord Banner */}
        <div className="glass-card p-8 md:p-12 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-neutral-900 via-[#0d0e14] to-black">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400">
              <Users className="w-4 h-4" />
              <span>JOIN 10,000+ CREATORS & EDITORS</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight uppercase">
              NOEL CREATIVE DISCORD & SHADER VAULT
            </h3>
            <p className="text-sm text-neutral-400 max-w-xl">
              Get access to our free editing presets, sound effect packs, thumbnail critique sessions, and live masterclasses.
            </p>
          </div>

          <Button
            href="https://discord.gg/noelvisuals"
            variant="outline"
            size="lg"
            className="shrink-0 border-white/30 hover:border-white"
          >
            JOIN DISCORD COMMUNITY
          </Button>
        </div>
      </Container>
    </Section>
  );
};
