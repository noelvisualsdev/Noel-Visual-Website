'use client';

import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SITE_CONFIG } from '@/constants/site';
import { ArrowUpRight, ArrowUp } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';

export const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-[#0a0b0f] border-t border-white/20 pt-16 pb-12 text-white relative z-20">
      <Container size="lg">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-white/20">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-5">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/40 shadow-lg bg-black shrink-0">
                <img
                  src="/images/logo.png"
                  alt="NOEL VISUALS"
                  className="w-full h-full object-contain p-0.5"
                />
              </div>
              <span className="font-extrabold tracking-widest text-xl text-white uppercase font-orbitron">
                NOEL VISUALS
              </span>
            </Link>
            <p className="text-sm md:text-base text-neutral-200 max-w-md leading-relaxed font-sans">
              {t.footer.tagline}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-orbitron border-b border-white/10 pb-2">
              NAVIGATION
            </h3>
            <ul className="space-y-3 text-sm font-medium font-sans">
              <li>
                <Link href="/work" className="text-neutral-200 hover:text-amber-300 hover:underline transition-colors block py-0.5">
                  Work Showcase
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-neutral-200 hover:text-amber-300 hover:underline transition-colors block py-0.5">
                  Services & Pricing
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral-200 hover:text-amber-300 hover:underline transition-colors block py-0.5">
                  About & Ethos
                </Link>
              </li>
              <li>
                <Link href="/process" className="text-neutral-200 hover:text-amber-300 hover:underline transition-colors block py-0.5">
                  Creative Process
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Contact Info */}
          <div className="md:col-span-4 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-orbitron border-b border-white/10 pb-2">
              KONTAKT & RECHTLICHES
            </h3>
            <div>
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="inline-flex items-center gap-2 text-base md:text-lg text-amber-300 font-extrabold hover:text-amber-200 transition-colors underline underline-offset-4 decoration-amber-400"
              >
                {SITE_CONFIG.email}
                <ArrowUpRight className="w-5 h-5 text-amber-400" />
              </a>
            </div>

            {/* Ultra High Contrast Legal Links */}
            <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-white pt-2">
              <Link href="/impressum" className="text-white hover:text-amber-300 underline underline-offset-4 decoration-amber-400 transition-colors bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
                Impressum
              </Link>
              <Link href="/privacy" className="text-white hover:text-amber-300 underline underline-offset-4 decoration-amber-400 transition-colors bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-white hover:text-amber-300 underline underline-offset-4 decoration-amber-400 transition-colors bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-300 font-mono gap-4">
          <p>© {new Date().getFullYear()} NOEL VISUALS. {t.footer.rights}</p>
          <div className="flex items-center gap-6">
            <span className="text-neutral-300">Designed for High Performance</span>
            <a
              href="#top"
              className="inline-flex items-center gap-1.5 text-white font-bold hover:text-amber-300 transition-colors bg-white/10 px-3 py-1 rounded-full border border-white/20"
            >
              <span>{t.footer.backToTop}</span>
              <ArrowUp className="w-3.5 h-3.5 text-amber-400" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};
