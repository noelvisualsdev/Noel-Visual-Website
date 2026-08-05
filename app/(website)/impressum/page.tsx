import React from 'react';
import { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Badge } from '@/components/ui/Badge';
import { Mail, Phone, MapPin, User, Building } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Impressum – NOEL VISUALS',
  description: 'Rechtliche Informationen und Impressum von NOEL VISUALS.',
};

export default function ImpressumPage() {
  return (
    <div className="pt-28 md:pt-36 pb-24">
      <Container size="md" className="space-y-8 text-neutral-300 leading-relaxed">
        <div className="space-y-4 border-b border-white/10 pb-8">
          <Badge variant="dot">Rechtliche Hinweise</Badge>
          <Heading as="h1" size="xl">
            IMPRESSUM
          </Heading>
          <p className="text-xs font-mono text-neutral-400">
            Angaben gemäß den gesetzlichen Informationspflichten.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          {/* Unternehmungsangaben */}
          <div className="p-6 rounded-2xl bg-[#0e0e11] border border-[#1f1f24] space-y-4 shadow-xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <Building className="w-5 h-5 text-white" />
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                Unternehmensangaben
              </h2>
            </div>
            
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs font-mono text-neutral-400 block uppercase">Unternehmen</span>
                <span className="font-extrabold text-white text-base">NOEL VISUALS</span>
              </div>

              <div>
                <span className="text-xs font-mono text-neutral-400 block uppercase">Inhaber</span>
                <span className="text-neutral-200 flex items-center gap-2">
                  <User className="w-4 h-4 text-neutral-400" />
                  Noel Nesensohn
                </span>
              </div>

              <div>
                <span className="text-xs font-mono text-neutral-400 block uppercase">Adresse</span>
                <div className="text-neutral-200 flex items-start gap-2 pt-0.5">
                  <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                  <div>
                    <p>Gmeigässi 2</p>
                    <p>3942 Niedergesteln</p>
                    <p className="text-white font-medium">Schweiz</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kontaktdaten */}
          <div className="p-6 rounded-2xl bg-[#0e0e11] border border-[#1f1f24] space-y-4 shadow-xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <Mail className="w-5 h-5 text-white" />
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                Kontakt
              </h2>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <span className="text-xs font-mono text-neutral-400 block uppercase">E-Mail-Adresse</span>
                <a
                  href="mailto:contact.noelvisuals@gmail.com"
                  className="text-white hover:underline flex items-center gap-2 pt-1 font-mono text-xs sm:text-sm"
                >
                  <Mail className="w-4 h-4 text-neutral-400" />
                  contact.noelvisuals@gmail.com
                </a>
              </div>

              <div>
                <span className="text-xs font-mono text-neutral-400 block uppercase">Telefon</span>
                <a
                  href="tel:+41782234135"
                  className="text-white hover:underline flex items-center gap-2 pt-1 font-mono text-xs sm:text-sm"
                >
                  <Phone className="w-4 h-4 text-neutral-400" />
                  +41 78 223 41 35
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Haftungsausschluss / Disclaimer */}
        <div className="p-6 rounded-2xl bg-[#0e0e11] border border-[#1f1f24] space-y-3 text-xs text-neutral-400 leading-relaxed shadow-xl mt-6">
          <h3 className="text-xs font-mono text-white uppercase tracking-wider font-bold">Haftungsausschluss</h3>
          <p>
            Die Inhalte dieser Website werden mit größtmöglicher Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der bereitgestellten Inhalte übernimmt NOEL VISUALS jedoch keine Gewähr.
          </p>
        </div>

      </Container>
    </div>
  );
}
