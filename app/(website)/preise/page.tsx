'use client';

import React, { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  Film, 
  Image as ImageIcon, 
  Palette, 
  Layout, 
  Package, 
  MessageSquare, 
  Bot, 
  Check, 
  Plus, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles,
  Zap
} from 'lucide-react';

export default function PreisePage() {
  const [currency, setCurrency] = useState<'chf' | 'eur'>('chf');

  // Video Editing Items
  const videoEditingItems = [
    { title: 'Short Form Edit (15–60 Sek.)', chf: 'ab CHF 30', eur: 'ab 30,00 €', desc: 'Hochdynamischer Cut für TikTok, Shorts & Reels mit Subtiteln' },
    { title: 'TikTok / Reel Premium', chf: 'ab CHF 60', eur: 'ab 60,00 €', desc: 'Sound Design, Motion Graphics & maximale Retention' },
    { title: 'YouTube Video (5–10 Min.)', chf: 'ab CHF 80', eur: 'ab 80,00 €', desc: 'Professioneller Schnitt, Pacing & Color Grading' },
    { title: 'YouTube Video (10–20 Min.)', chf: 'ab CHF 150', eur: 'ab 150,00 €', desc: 'Umfangreiches Storytelling & High-Level Editing' },
    { title: 'Gaming Edit', chf: 'ab CHF 100', eur: 'ab 100,00 €', desc: 'Highlights, Effekte, SFX & schnelle Sequenzen' },
    { title: 'Cinematic Edit', chf: 'ab CHF 200', eur: 'ab 200,00 €', desc: 'Highend Look, VFX, Musiksynchronisation & Grading' },
  ];

  // Thumbnail Items
  const thumbnailItems = [
    { title: 'Standard Thumbnail', chf: 'ab CHF 20', eur: 'ab 20,00 €', desc: 'Sauberer Cut-out, klarer Fokus & auffälliger Text' },
    { title: 'Premium Thumbnail', chf: 'ab CHF 35', eur: 'ab 35,00 €', desc: 'Licht- & Farbanpassungen, Effekte & hoher Kontrast' },
    { title: 'High CTR Thumbnail', chf: 'ab CHF 50', eur: 'ab 50,00 €', desc: 'Komplexes 3D/Composite Design für maximale Klickrate' },
  ];

  // Graphic Design Items
  const graphicItems = [
    { title: 'Banner Design', chf: 'ab CHF 40', eur: 'ab 40,00 €', desc: 'Individuelles Header-Design für Social Media' },
    { title: 'YouTube Banner', chf: 'ab CHF 40', eur: 'ab 40,00 €', desc: 'Optimiert für TV, Desktop & Mobile' },
    { title: 'Twitch Banner', chf: 'ab CHF 40', eur: 'ab 40,00 €', desc: 'Passend zum Kanaldesign & Stream' },
    { title: 'Stream Overlay', chf: 'ab CHF 60', eur: 'ab 60,00 €', desc: 'Facecam, Screens & Alerts' },
    { title: 'Social Media Post', chf: 'ab CHF 20', eur: 'ab 20,00 €', desc: 'Einzelne Grafik oder Template für Instagram / X' },
  ];

  // UI/UX Items
  const uiuxItems = [
    { title: 'Landing Page UI', chf: 'ab CHF 120', eur: 'ab 120,00 €', desc: 'Modernes Layout im Figma/Web-Format' },
    { title: 'Dashboard UI', chf: 'ab CHF 200', eur: 'ab 200,00 €', desc: 'Komplexe App- & Admin-Oberflächen' },
    { title: 'Mobile App Screen (per Screen)', chf: 'ab CHF 40', eur: 'ab 40,00 €', desc: 'Mobile Screen Design im Dark Mode' },
    { title: 'Website Redesign', chf: 'ab CHF 300', eur: 'ab 300,00 €', desc: 'Komplette Überarbeitung deines Online-Auftritts' },
  ];

  // Creator Bundles
  const creatorPackages = [
    {
      title: 'Starter Paket',
      chf: 'ab CHF 250 / Monat',
      eur: 'ab 250,00 € / Monat',
      deliverables: ['4x Short Form Edits', '2x High CTR Thumbnails', 'Priorisierter Support', '2 Korrekturrunden pro Content'],
      badge: 'Für Einsteiger'
    },
    {
      title: 'Creator Paket',
      chf: 'ab CHF 500 / Monat',
      eur: 'ab 500,00 € / Monat',
      deliverables: ['8x Short Form Edits', '4x High CTR Thumbnails', 'Express Fertigstellung', 'Unbegrenzte kleine Anpassungen'],
      badge: 'Sehr Beliebt',
      featured: true
    }
  ];

  // Discord Setup Tiers
  const discordTiers = [
    {
      name: 'SMALL',
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20',
      badgeColor: 'bg-emerald-500 text-black',
      chf: '25 CHF',
      eur: '23,00 €',
      target: 'Für kleine Communitys, Freundesgruppen oder private Projekte.',
      features: [
        'Bis zu 10 Text- & Sprachkanäle',
        'Bis zu 5 Rollen',
        'Einfache Kanalstruktur & Grundberechtigungen',
        'Willkommens- & Regelkanal',
        'Passende Emojis & Kanalnamen',
        '1 Korrekturrunde'
      ]
    },
    {
      name: 'MEDIUM',
      color: 'border-blue-500/40 text-blue-400 bg-blue-950/20',
      badgeColor: 'bg-blue-500 text-white',
      chf: '50 CHF',
      eur: '47,00 €',
      target: 'Für Content Creator, Gaming-Communitys & kleinere Marken.',
      features: [
        'Bis zu 25 Text- & Sprachkanäle',
        'Bis zu 10 Rollen',
        'Professionelle Serverstruktur & individuelle Berechtigungen',
        'Support- & Ticketbereiche (ohne Bot)',
        'Info-, Regel- & Ankündigungskanäle',
        'Community-, Gaming- oder Projektbereiche',
        '2 Korrekturrunden'
      ],
      popular: true
    },
    {
      name: 'LARGE',
      color: 'border-amber-500/40 text-amber-400 bg-amber-950/20',
      badgeColor: 'bg-amber-400 text-black',
      chf: '90 CHF',
      eur: '85,00 €',
      target: 'Für größere Communitys, Unternehmen & professionelle Projekte.',
      features: [
        'Bis zu 50 Text- & Sprachkanäle',
        'Bis zu 20 Rollen',
        'Vollständig individuelle Serverstruktur',
        'Erweiterte Rollen- & Kanalberechtigungen',
        'Private Team- & Moderationsbereiche',
        'Bewerbungs-, Support- & Partnerbereiche',
        'Sicherheits- & Moderationseinstellungen',
        '3 Korrekturrunden'
      ]
    },
    {
      name: 'CUSTOM',
      color: 'border-red-500/40 text-red-400 bg-red-950/20',
      badgeColor: 'bg-red-500 text-white',
      chf: 'ab 120 CHF',
      eur: 'ab 113,00 €',
      target: 'Für besonders große oder komplexe Server.',
      features: [
        'Preis wird individuell berechnet',
        'Unbegrenzte Kanäle & Rollen nach Bedarf',
        'Sonderfunktionen & maßgeschneiderte Systeme',
        'Einfach Ticket öffnen & Wünsche schildern!'
      ]
    }
  ];

  // Discord Addons
  const discordAddons = [
    { title: '+5 Kanäle', chf: '+5 CHF', eur: '+5,00 €' },
    { title: '+5 Rollen', chf: '+5 CHF', eur: '+5,00 €' },
    { title: 'Server-Überarbeitung', chf: 'ab 20 CHF', eur: 'ab 19,00 €' },
    { title: 'Rollen- & Berechtigungsüberarbeitung', chf: 'ab 15 CHF', eur: 'ab 14,00 €' },
    { title: 'Individuelle Server-Vorlage', chf: 'ab 15 CHF', eur: 'ab 14,00 €' },
    { title: 'Express-Fertigstellung', chf: '+20 CHF', eur: '+19,00 €' },
  ];

  // Discord Bot
  const discordBotTiers = [
    { title: 'Einfacher Bot (Begrüßung, Auto-Rolle)', price: 'ab 5€ / 5 CHF' },
    { title: 'Ticket-System, Moderation, Logging', price: 'ab 20€ / 20 CHF' },
    { title: 'Komplex (Dashboard, Datenbank, API)', price: 'ab 50€ / 50 CHF' },
    { title: 'Vollständiger Custom Bot', price: 'bis 100€ / 100 CHF' },
  ];

  return (
    <div className="pt-28 md:pt-36 pb-24 bg-[#050505] text-white">
      <Container size="lg" className="space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge variant="dot">TRANSPARENTE PREISE</Badge>
          <Heading as="h1" size="xl">
            PREISÜBERSICHT & SERVICES
          </Heading>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
            Faire Preise für High-End Content, Discord Setups & Custom Bots. Alle Angebote in CHF & EUR.
          </p>

          {/* Currency Switcher */}
          <div className="inline-flex items-center p-1 rounded-xl bg-[#0e0e11] border border-[#1f1f24] gap-1 pt-1 mt-4">
            <button
              onClick={() => setCurrency('chf')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                currency === 'chf'
                  ? 'bg-white text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              🇨🇭 CHF (Schweiz)
            </button>
            <button
              onClick={() => setCurrency('eur')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                currency === 'eur'
                  ? 'bg-white text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              🇪🇺 EUR (€)
            </button>
          </div>
        </div>

        {/* 🎬 Video Editing */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-white">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">🎬 Video Editing</h2>
              <p className="text-xs text-neutral-400">High-Retention Cuts für Shorts, YouTube & Cinematic Projekten</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videoEditingItems.map((item) => (
              <div key={item.title} className="p-5 rounded-2xl bg-[#0e0e11] border border-[#1f1f24] space-y-2 hover:border-white/20 transition-all">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase">{item.title}</h3>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-white/10 text-white border border-white/10">
                    {currency === 'chf' ? item.chf : item.eur}
                  </span>
                </div>
                <p className="text-xs text-neutral-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 🖼️ Thumbnail Design */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-white">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">🖼️ Thumbnail Design</h2>
              <p className="text-xs text-neutral-400">Klickstarke Vorschaubilder für YouTube & Creator</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {thumbnailItems.map((item) => (
              <div key={item.title} className="p-5 rounded-2xl bg-[#0e0e11] border border-[#1f1f24] space-y-2 hover:border-white/20 transition-all">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase">{item.title}</h3>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-white/10 text-white border border-white/10">
                    {currency === 'chf' ? item.chf : item.eur}
                  </span>
                </div>
                <p className="text-xs text-neutral-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 🎨 Grafik- & Social Media Design */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-white">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">🎨 Grafik- & Social Media Design</h2>
              <p className="text-xs text-neutral-400">Banner, Overlays & Social Media Assets</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {graphicItems.map((item) => (
              <div key={item.title} className="p-5 rounded-2xl bg-[#0e0e11] border border-[#1f1f24] space-y-2 hover:border-white/20 transition-all">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase">{item.title}</h3>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-white/10 text-white border border-white/10">
                    {currency === 'chf' ? item.chf : item.eur}
                  </span>
                </div>
                <p className="text-xs text-neutral-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 💻 UI / UX Design */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-white">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">💻 UI / UX Design</h2>
              <p className="text-xs text-neutral-400">Website, Dashboard & Mobile Oberflächen</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {uiuxItems.map((item) => (
              <div key={item.title} className="p-5 rounded-2xl bg-[#0e0e11] border border-[#1f1f24] space-y-2 hover:border-white/20 transition-all">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-white uppercase">{item.title}</h3>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {currency === 'chf' ? item.chf : item.eur}
                  </span>
                </div>
                <p className="text-xs text-neutral-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 📦 Monatliche Creator Pakete */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-white">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">📦 Monatliche Creator Pakete</h2>
              <p className="text-xs text-neutral-400">Rundumberreuung für konsistenten Content-Output</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {creatorPackages.map((pkg) => (
              <div 
                key={pkg.title} 
                className={`p-6 rounded-2xl bg-[#0e0e11] border space-y-4 relative ${
                  pkg.featured ? 'border-white/40 shadow-2xl bg-[#121216]' : 'border-[#1f1f24]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-white">
                    {pkg.badge}
                  </span>
                  <span className="text-sm font-mono font-extrabold text-amber-400">
                    {currency === 'chf' ? pkg.chf : pkg.eur}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-white uppercase">{pkg.title}</h3>
                <ul className="space-y-2 border-t border-white/10 pt-4">
                  {pkg.deliverables.map((del) => (
                    <li key={del} className="flex items-center gap-2.5 text-xs text-neutral-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{del}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 🖥️ Discord Server Setup */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-white">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">🖥️ Discord Server Setup</h2>
              <p className="text-xs text-neutral-400">Professionelle Server-Einrichtung für Communitys, Creator & Marken</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {discordTiers.map((tier) => (
              <div 
                key={tier.name} 
                className={`p-6 rounded-2xl bg-[#0e0e11] border ${tier.color} space-y-4 flex flex-col justify-between`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full ${tier.badgeColor}`}>
                      {tier.name}
                    </span>
                    <span className="text-base font-extrabold font-mono text-white">
                      {currency === 'chf' ? tier.chf : tier.eur}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed min-h-[40px]">{tier.target}</p>
                  <ul className="space-y-2 border-t border-white/10 pt-3 text-xs">
                    {tier.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2 text-neutral-300">
                        <Check className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Zusatzleistungen */}
          <div className="p-6 rounded-2xl bg-[#0e0e11] border border-[#1f1f24] space-y-4">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-400" /> ➕ Zusatzleistungen (Discord)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {discordAddons.map((add) => (
                <div key={add.title} className="p-3 rounded-xl bg-black/50 border border-white/5 space-y-1">
                  <span className="text-[11px] font-medium text-neutral-300 block">{add.title}</span>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {currency === 'chf' ? add.chf : add.eur}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-neutral-500 flex items-center gap-1.5 pt-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Discord-Bots, Bot-Programmierung, kostenpflichtige Emojis, Grafiken & Server-Boosts sind nicht im Preis enthalten.</span>
            </p>
          </div>
        </section>

        {/* 🤖 Discord Bot */}
        <section className="p-8 rounded-2xl bg-[#0e0e11] border border-[#1f1f24] space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">🤖 Custom Discord Bot</h2>
              <p className="text-xs text-neutral-400">5,00€ – 100,00€ • Preis je nach Aufwand & Features</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {discordBotTiers.map((b) => (
              <div key={b.title} className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                <span className="text-xs font-bold text-white block">{b.title}</span>
                <span className="text-xs font-mono font-bold text-emerald-400 block">{b.price}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center">
            <Button
              href="/contact"
              variant="glow"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4 text-black" />}
              className="bg-white text-black font-extrabold hover:bg-neutral-200 text-xs tracking-widest px-8"
            >
              PROJEKT ANFRAGEN / TICKET ÖFFNEN
            </Button>
          </div>
        </section>

      </Container>
    </div>
  );
}
