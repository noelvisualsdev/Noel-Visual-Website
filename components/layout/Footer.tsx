'use client';

import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SITE_CONFIG } from '@/constants/site';
import { Button } from '@/components/ui/Button';
import { ArrowUpRight, ArrowUp } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';

export const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-[#050507] border-t border-white/10 pt-16 pb-12 text-neutral-400">
      <Container size="lg">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/20 shadow-md bg-black">
                <img
                  src="/images/logo.png"
                  alt="NOEL VISUALS"
                  className="w-full h-full object-contain p-0.5"
                />
              </div>
              <span className="font-extrabold tracking-widest text-lg text-white uppercase">
                NOEL VISUALS
              </span>
            </Link>
            <p className="text-sm text-neutral-400 max-w-md leading-relaxed">
              {t.footer.tagline}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-white">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/work" className="hover:text-white transition-colors">
                  Work Showcase
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Services & Pricing
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About & Ethos
                </Link>
              </li>
              <li>
                <Link href="/process" className="hover:text-white transition-colors">
                  Creative Process
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
   
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Info */}
          <div className="md:col-span-4 space-y-4">
            <div className="pt-2 space-y-2">
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="inline-flex items-center gap-2 text-sm text-white font-medium hover:underline"
              >
                {SITE_CONFIG.email}
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs">
              <Link href="/impressum" className="hover:text-white underline">
                Impressum
              </Link>
              <span>•</span>
              <Link href="/privacy" className="hover:text-white underline">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-white underline">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} NOEL VISUALS. {t.footer.rights}</p>
          <div className="flex items-center gap-6">
            <span>Designed & Engineered for High Performance</span>
            <a
              href="#top"
              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors"
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
