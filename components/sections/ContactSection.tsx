'use client';

import React from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { ContactForm } from '@/components/shared/ContactForm';
import { SITE_CONFIG } from '@/constants/site';
import { Mail, Clock, ArrowUpRight, Phone } from 'lucide-react';

export const ContactSection = () => {
  return (
    <Section id="contact" className="bg-transparent py-20 relative">
      <Container size="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Text Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tight font-orbitron">
                LET'S BUILD SOMETHING EXTRAORDINARY
              </h2>
              <p className="text-sm md:text-base text-neutral-300 leading-relaxed font-sans">
                Whether you need a single viral thumbnail, a high-octane video edit, or a full monthly production retainer, our team is ready to deliver.
              </p>
            </div>

            <div className="space-y-6 pt-4 border-t border-white/10">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white/10 text-white shrink-0">
                  <Mail className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase text-neutral-400 block font-semibold">Direct Email Inquiry</span>
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="text-base font-bold text-white hover:text-amber-300 hover:underline flex items-center gap-1.5 transition-colors"
                  >
                    {SITE_CONFIG.email}
                    <ArrowUpRight className="w-4 h-4 text-amber-400" />
                  </a>
                </div>
              </div>

              {/* Phone & WhatsApp Block */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white/10 text-white shrink-0">
                  <Phone className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase text-neutral-400 block font-semibold">Direct Phone / WhatsApp</span>
                  <a
                    href="tel:+41782234135"
                    className="text-base font-bold text-white hover:text-amber-300 hover:underline flex items-center gap-1.5 transition-colors"
                  >
                    +41 78 223 41 35
                    <ArrowUpRight className="w-4 h-4 text-amber-400" />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white/10 text-white shrink-0">
                  <Clock className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase text-neutral-400 block font-semibold">Response Time SLA</span>
                  <p className="text-sm font-bold text-white">Under 12 Hours • 7 Days a Week</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </Container>
    </Section>
  );
};
