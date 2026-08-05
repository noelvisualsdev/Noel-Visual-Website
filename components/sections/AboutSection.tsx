'use client';

import React from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card } from '@/components/ui/Card';
import { ShieldCheck, Award, Sparkles, Users } from 'lucide-react';

export const AboutSection = () => {
  return (
    <Section id="about" className="bg-[#090a0d] border-t border-white/5">
      <Container size="lg" className="space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <SectionHeader
              badge="WER WIR SIND"
              title="WIR VERWANDELN IDEEN IN VIDEOS, DIE IM KOPF BLEIBEN."
              subtitle="NOEL VISUALS ist ein kreatives Studio für hochwertiges Video Editing und visuelle Markenkommunikation. Wir schneiden nicht einfach nur Material – wir formen daraus dynamische Geschichten, die Aufmerksamkeit gewinnen und deine Marke professionell präsentieren."
              className="mb-0"
            />

            <p className="text-sm text-neutral-300 leading-relaxed">
              Von Social-Media-Clips bis zu längeren Formaten verbinden wir
              präzisen Schnitt, Sound Design, Motion Graphics und ein sicheres
              Gespür für Rhythmus. Dabei arbeiten wir direkt, transparent und
              zuverlässig – vom ersten Briefing bis zum finalen Export.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-2xl font-black font-mono text-white">
                  150 Mio.+
                </div>

                <div className="text-xs text-neutral-400 font-mono">
                  Organische Aufrufe generiert
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-2xl font-black font-mono text-white">
                  20+
                </div>

                <div className="text-xs text-neutral-400 font-mono">
                  Kreative und Marken betreut
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card variant="glass" className="p-6 space-y-3">
              <Award className="w-8 h-8 text-white" />

              <h3 className="text-base font-bold text-white uppercase">
                Präzises Editing
              </h3>

              <p className="text-xs text-neutral-400 leading-relaxed">
                Jeder Schnitt, jeder Übergang und jedes Detail wird gezielt auf
                Wirkung und Qualität abgestimmt.
              </p>
            </Card>

            <Card variant="glass" className="p-6 space-y-3">
              <Sparkles className="w-8 h-8 text-white" />

              <h3 className="text-base font-bold text-white uppercase">
                Story &amp; Retention
              </h3>

              <p className="text-xs text-neutral-400 leading-relaxed">
                Durch klares Storytelling, starkes Timing und dynamische
                Bildsprache halten wir die Aufmerksamkeit deiner Zuschauer.
              </p>
            </Card>

            <Card variant="glass" className="p-6 space-y-3">
              <Users className="w-8 h-8 text-white" />

              <h3 className="text-base font-bold text-white uppercase">
                Direkte Zusammenarbeit
              </h3>

              <p className="text-xs text-neutral-400 leading-relaxed">
                Keine unnötigen Umwege: Du arbeitest direkt mit deinem Editor
                und erhältst schnelle, klare Kommunikation.
              </p>
            </Card>

            <Card variant="glass" className="p-6 space-y-3">
              <ShieldCheck className="w-8 h-8 text-white" />

              <h3 className="text-base font-bold text-white uppercase">
                Zuverlässige Umsetzung
              </h3>

              <p className="text-xs text-neutral-400 leading-relaxed">
                Strukturierte Abläufe, transparente Deadlines und eine
                termingerechte Lieferung deiner Inhalte.
              </p>
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  );
};