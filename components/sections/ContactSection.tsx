'use client';

import React from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { ContactForm } from '@/components/shared/ContactForm';
import { SITE_CONFIG } from '@/constants/site';
import { Mail, MapPin, Clock, ArrowUpRight } from 'lucide-react';

export const ContactSection = () => {
  return (
    <Section id="contact" className="bg-[#050507] border-t border-white/10">
      <Container size="lg" className="space-y-12">
        <SectionHeader
          badge="GET IN TOUCH"
          title="READY TO ELEVATE YOUR VISUAL BRAND?"
          subtitle="Fill out the project brief below or email us directly. We guarantee a 12-hour response SLA."
          centered
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-extrabold text-white uppercase tracking-tight">
                LET'S BUILD SOMETHING EXTRAORDINARY
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Whether you need a single viral thumbnail, a high-octane video edit, or a full monthly production retainer, our team is ready to deliver.
              </p>
            </div>

            <div className="space-y-6 pt-4 border-t border-white/10">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-white/10 text-white shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase text-neutral-500 block">Direct Inquiry</span>
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="text-base font-bold text-white hover:underline flex items-center gap-1"
                  >
                    {SITE_CONFIG.email}
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-white/10 text-white shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase text-neutral-500 block">Response Time SLA</span>
                  <p className="text-sm font-medium text-white">Under 12 Hours • 7 Days a Week</p>
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
