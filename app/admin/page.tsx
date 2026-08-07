'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import {
  FileText,
  Users,
  FolderKanban,
  Star,
  ShieldCheck,
  Plus,
  Gift,
  Wrench,
  Sparkles,
  ArrowRight,
  Save,
  Check,
  Megaphone,
} from 'lucide-react';
import { ADMIN_ROLE_ID, useAuth } from '@/components/providers/AuthProvider';
import Link from 'next/link';

export default function AdminOverviewPage() {
  const { user } = useAuth();

  const [briefsCount, setBriefsCount] = useState<number>(0);
  const [projectsCount, setProjectsCount] = useState<number>(0);
  const [reviewsCount, setReviewsCount] = useState<number>(0);
  const [giveawaysCount, setGiveawaysCount] = useState<number>(0);

  // Maintenance State
  const [maintenanceActive, setMaintenanceActive] = useState(false);
  const [isTogglingMaintenance, setIsTogglingMaintenance] = useState(false);

  // Announcement Banner State
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementEnabled, setAnnouncementEnabled] = useState(true);
  const [isSavingAnnouncement, setIsSavingAnnouncement] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');

  useEffect(() => {
    // 1. Fetch Maintenance & Announcement Settings
    fetch('/api/admin/maintenance')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (typeof data.maintenanceMode === 'boolean') {
            setMaintenanceActive(data.maintenanceMode);
          }
          if (typeof data.announcementText === 'string') {
            setAnnouncementText(data.announcementText);
          }
          if (typeof data.announcementEnabled === 'boolean') {
            setAnnouncementEnabled(data.announcementEnabled);
          }
        }
      })
      .catch((err) => console.error(err));

    // 2. Fetch projects count
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setProjectsCount(data.data.length);
        }
      })
      .catch((err) => console.error(err));

    // Fetch reviews count
    fetch('/api/reviews')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setReviewsCount(data.data.length);
        }
      })
      .catch((err) => console.error(err));

    // Fetch giveaways count
    fetch('/api/giveaways')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setGiveawaysCount(data.data.length);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const toggleMaintenanceMode = async () => {
    const nextState = !maintenanceActive;
    setIsTogglingMaintenance(true);
    try {
      const res = await fetch('/api/admin/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: nextState }),
      });
      const data = await res.json();
      if (data.success && typeof data.maintenanceMode === 'boolean') {
        setMaintenanceActive(data.maintenanceMode);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTogglingMaintenance(false);
    }
  };

  const saveAnnouncementSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingAnnouncement(true);
    setSaveSuccessMessage('');
    try {
      const res = await fetch('/api/admin/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          announcementText: announcementText,
          announcementEnabled: announcementEnabled,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAnnouncementText(data.announcementText);
        setAnnouncementEnabled(data.announcementEnabled);
        setSaveSuccessMessage('Top-Banner Einstellungen gespeichert!');
        setTimeout(() => setSaveSuccessMessage(''), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingAnnouncement(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#121424] via-[#0d0e18] to-[#08090f] border border-white/12 p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5865f2]/15 border border-[#5865f2]/30 text-[#5865f2] text-xs font-mono font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>DISCORD STAFF VERIFIED (ROLE {ADMIN_ROLE_ID})</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide font-orbitron uppercase">
              STUDIO CONTROL CENTER
            </h1>
            <p className="text-sm text-neutral-300">
              Willkommen zurück, <strong className="text-white font-mono">@{user?.username || 'Admin'}</strong>! Hier hast du die volle Kontrolle über Projekte, Banner, Wartungsmodus & Datenbanken.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/admin/projects"
              className="px-5 py-3 rounded-2xl bg-[#5865f2] hover:bg-[#4752c4] text-white font-bold text-xs uppercase tracking-wider font-orbitron shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>NEUES PROJEKT</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Control Panels Grid: Maintenance + Announcement Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Maintenance Mode Control Switch Card */}
        <div className={`p-6 rounded-3xl border shadow-2xl flex flex-col justify-between gap-6 transition-all ${
          maintenanceActive 
            ? 'bg-gradient-to-r from-red-950/40 via-[#180d12] to-[#0d0e14] border-red-500/40 shadow-red-950/20' 
            : 'bg-gradient-to-r from-emerald-950/40 via-[#0d1812] to-[#0d0e14] border-emerald-500/40 shadow-emerald-950/20'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 shadow-lg ${
                maintenanceActive 
                  ? 'bg-red-500/20 border-red-500/50 text-red-400' 
                  : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
              }`}>
                <Wrench className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="font-extrabold text-white text-base font-orbitron tracking-wide uppercase block">
                  Wartungsmodus (Maintenance)
                </span>
                <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border uppercase inline-block mt-1 ${
                  maintenanceActive
                    ? 'bg-red-500/20 text-red-300 border-red-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {maintenanceActive ? '🔴 AKTIV (NUR STAFF)' : '🟢 LIVE (ÖFFENTLICH)'}
                </span>
              </div>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              {maintenanceActive
                ? 'Die Website zeigt Besuchern aktuell den Wartungs-Screen. Nur angemeldete Discord Staff-Mitglieder dürfen zugreifen.'
                : 'Die Website ist aktuell öffentlich live und für alle Besucher voll zugänglich.'}
            </p>
          </div>

          <button
            onClick={toggleMaintenanceMode}
            disabled={isTogglingMaintenance}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider font-orbitron shadow-2xl transition-all cursor-pointer hover:scale-105 active:scale-95 ${
              maintenanceActive
                ? 'bg-emerald-500 hover:bg-emerald-400 text-black'
                : 'bg-red-500 hover:bg-red-400 text-white'
            }`}
          >
            {isTogglingMaintenance
              ? 'SPEICHERN...'
              : maintenanceActive
              ? '🟢 WARTUNGSMODUS AUSSCHALTEN (LIVE SCHALTEN)'
              : '🔴 WARTUNGSMODUS EINSCHALTEN'}
          </button>
        </div>

        {/* Top Announcement Banner Control Card */}
        <div className="p-6 rounded-3xl bg-[#0d0e15]/90 border border-white/15 shadow-2xl flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center shrink-0">
                  <Megaphone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="font-extrabold text-white text-base font-orbitron tracking-wide uppercase block">
                    Top Announcement Banner
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400 block">
                    Ankündigungstext ganz oben auf der Website
                  </span>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => {
                  const nextState = !announcementEnabled;
                  setAnnouncementEnabled(nextState);
                  saveAnnouncementSettings(undefined);
                }}
                className={`px-3 py-1.5 rounded-full border text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                  announcementEnabled
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-white/5 text-neutral-400 border-white/10'
                }`}
              >
                {announcementEnabled ? '🟢 BANNER AN' : '⚪ BANNER AUS'}
              </button>
            </div>

            <form onSubmit={saveAnnouncementSettings} className="space-y-3">
              <div>
                <label className="text-xs font-mono text-neutral-400 block mb-1.5 uppercase font-bold">
                  Banner Text (z.B. Sale & Rabatt Aktionen)
                </label>
                <input
                  type="text"
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder="🎉 20% SALE AUF ALLE EDITING PAKETE! CODE: NOEL20"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-neutral-500 text-xs font-sans focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                {saveSuccessMessage ? (
                  <span className="text-xs text-emerald-400 font-mono flex items-center gap-1 font-bold">
                    <Check className="w-3.5 h-3.5" /> {saveSuccessMessage}
                  </span>
                ) : (
                  <span className="text-[11px] text-neutral-500 font-mono">
                    Wird Besuchern oben über der Navbar angezeigt.
                  </span>
                )}

                <button
                  type="submit"
                  disabled={isSavingAnnouncement}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-xs uppercase tracking-wider font-orbitron transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingAnnouncement ? 'SPEICHERN...' : 'SPEICHERN'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Analytics / Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/projects">
          <Card variant="glass" className="p-6 space-y-3 border-white/10 hover:border-white/40 transition-all group">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-semibold uppercase text-neutral-400 font-sans">Portfolio Projects</span>
              <div className="p-2 rounded-xl bg-white/10 border border-white/15 text-white">
                <FolderKanban className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white font-sans">{projectsCount}</div>
            <p className="text-xs text-neutral-400 flex items-center justify-between">
              <span>In MongoDB Atlas</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white transition-colors" />
            </p>
          </Card>
        </Link>

        <Link href="/admin/briefs">
          <Card variant="glass" className="p-6 space-y-3 border-white/10 hover:border-white/40 transition-all group">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-semibold uppercase text-neutral-400 font-sans">Tickets & Briefs</span>
              <div className="p-2 rounded-xl bg-white/10 border border-white/15 text-white">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white font-sans">{briefsCount}</div>
            <p className="text-xs text-neutral-400 flex items-center justify-between">
              <span>Formular-Anfragen</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white transition-colors" />
            </p>
          </Card>
        </Link>

        <Link href="/admin/reviews">
          <Card variant="glass" className="p-6 space-y-3 border-white/10 hover:border-white/40 transition-all group">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-semibold uppercase text-neutral-400 font-sans">Kunden-Reviews</span>
              <div className="p-2 rounded-xl bg-white/10 border border-white/15 text-white">
                <Star className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white font-sans">{reviewsCount}</div>
            <p className="text-xs text-neutral-400 flex items-center justify-between">
              <span>Gespeicherte Reviews</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white transition-colors" />
            </p>
          </Card>
        </Link>

        <Link href="/admin/giveaways">
          <Card variant="glass" className="p-6 space-y-3 border-white/10 hover:border-white/40 transition-all group">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-semibold uppercase text-neutral-400 font-sans">Giveaways</span>
              <div className="p-2 rounded-xl bg-white/10 border border-white/15 text-white">
                <Gift className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white font-sans">{giveawaysCount}</div>
            <p className="text-xs text-neutral-400 flex items-center justify-between">
              <span>Aktive Contests</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white transition-colors" />
            </p>
          </Card>
        </Link>
      </div>

      {/* Quick Access Management Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-300 font-orbitron">
          SCHNELL-ZUGRIFF VERWALTUNG
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link href="/admin/projects" className="group">
            <Card variant="glass" className="p-6 space-y-3 border-white/10 group-hover:border-white/40 transition-all">
              <div className="flex items-center justify-between">
                <FolderKanban className="w-6 h-6 text-white" />
                <Plus className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-white font-orbitron uppercase text-sm">Projekte & Medien</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">Neue Projekte mit Bildern & Videos vom PC oder Discord hinzufügen.</p>
            </Card>
          </Link>

          <Link href="/admin/discord" className="group">
            <Card variant="glass" className="p-6 space-y-3 border-white/10 group-hover:border-white/40 transition-all">
              <div className="flex items-center justify-between">
                <ShieldCheck className="w-6 h-6 text-white" />
                <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-white font-orbitron uppercase text-sm">Discord Bot Status</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">Rollen-Überprüfung & Discord OAuth Berechtigungen verwalten.</p>
            </Card>
          </Link>

          <Link href="/admin/giveaways" className="group">
            <Card variant="glass" className="p-6 space-y-3 border-white/10 group-hover:border-white/40 transition-all">
              <div className="flex items-center justify-between">
                <Gift className="w-6 h-6 text-white" />
                <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-white font-orbitron uppercase text-sm">Giveaways</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">Community Giveaways verwalten und Gewinner auslosen.</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
