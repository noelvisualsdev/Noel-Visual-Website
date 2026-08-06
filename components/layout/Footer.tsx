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
    <footer className="bg-black/90 backdrop-blur-md border-t border-white/15 pt-16 pb-12 text-neutral-200">
      <Container size="lg">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-white/15">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-5">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg overflow-hidden border border-white/30 shadow-md bg-black">
                <img
                  src="/images/logo.png"
                  alt="NOEL VISUALS"
                  className="w-full h-full object-contain p-0.5"
                />
              </div>
              <span className="font-extrabold tracking-widest text-lg text-white uppercase font-orbitron">
                NOEL VISUALS
              </span>
            </Link>
            <p className="text-sm text-neutral-200 max-w-md leading-relaxed">
              {t.footer.tagline}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-white font-bold">
              Navigation
            </h3>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <Link href="/work" className="text-neutral-200 hover:text-white hover:underline transition-colors">
                  Work Showcase
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-neutral-200 hover:text-white hover:underline transition-colors">
                  Services & Pricing
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral-200 hover:text-white hover:underline transition-colors">
                  About & Ethos
                </Link>
              </li>
              <li>
                <Link href="/process" className="text-neutral-200 hover:text-white hover:underline transition-colors">
                  Creative Process
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Contact Info */}
          <div className="md:col-span-4 space-y-5">
            <h3 className="text-xs font-mono uppercase tracking-widest text-white font-bold">
              Kontakt & Rechtliches
            </h3>
            <div>
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="inline-flex items-center gap-2 text-base text-amber-300 font-bold hover:text-amber-200 transition-colors underline underline-offset-4 decoration-amber-400/50"
              >
                {SITE_CONFIG.email}
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

            {/* High Contrast Legal Links */}
            <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-white pt-2">
              <Link href="/impressum" className="text-white hover:text-amber-300 underline underline-offset-4 decoration-amber-400/60 transition-colors">
                Impressum
              </Link>
              <span className="text-neutral-400">•</span>
              <Link href="/privacy" className="text-white hover:text-amber-300 underline underline-offset-4 decoration-amber-400/60 transition-colors">
                Privacy Policy
              </Link>
              <span className="text-neutral-400">•</span>
              <Link href="/terms" className="text-white hover:text-amber-300 underline underline-offset-4 decoration-amber-400/60 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-300 font-mono gap-4">
          <p>© {new Date().getFullYear()} NOEL VISUALS. {t.footer.rights}</p>
          <div className="flex items-center gap-6">
            <span className="text-neutral-400">Designed for High Performance</span>
            <a
              href="#top"
              className="inline-flex items-center gap-1.5 text-white font-bold hover:text-amber-300 transition-colors"
            >
              <span>{t.footer.backToTop}</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};
