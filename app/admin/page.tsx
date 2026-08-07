'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import {
  FileText,
  Users,
  FolderKanban,
  Star,
  ShieldCheck,
  CheckCircle,
  Plus,
  Gift,
  Wrench,
  Sparkles,
  ArrowRight,
  ShieldAlert,
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

  useEffect(() => {
    // 1. Fetch Maintenance Mode Status
    fetch('/api/admin/maintenance')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && typeof data.maintenanceMode === 'boolean') {
          setMaintenanceActive(data.maintenanceMode);
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
              Willkommen zurück, <strong className="text-white font-mono">@{user?.username || 'Admin'}</strong>! Hier hast du die volle Kontrolle über Projekte, Wartungsmodus & Datenbanken.
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

      {/* Maintenance Mode Control Switch Card */}
      <div className={`p-6 rounded-3xl border shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all ${
        maintenanceActive 
          ? 'bg-gradient-to-r from-red-950/40 via-[#180d12] to-[#0d0e14] border-red-500/40 shadow-red-950/20' 
          : 'bg-gradient-to-r from-emerald-950/40 via-[#0d1812] to-[#0d0e14] border-emerald-500/40 shadow-emerald-950/20'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shrink-0 shadow-lg ${
            maintenanceActive 
              ? 'bg-red-500/20 border-red-500/50 text-red-400' 
              : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
          }`}>
            <Wrench className="w-7 h-7 animate-pulse" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <span className="font-extrabold text-white text-base font-orbitron tracking-wide uppercase">
                Wartungsmodus (Maintenance Mode)
              </span>
              <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border uppercase ${
                maintenanceActive
                  ? 'bg-red-500/20 text-red-300 border-red-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}>
                {maintenanceActive ? '🔴 WARTUNG AKTIV (NUR STAFF)' : '🟢 WEBSITE LIVE (ÖFFENTLICH)'}
              </span>
            </div>
            <p className="text-xs text-neutral-300 max-w-xl leading-relaxed">
              {maintenanceActive
                ? 'Die Website zeigt Besuchern aktuell den Wartungs-Screen. Nur angemeldete Discord Staff-Mitglieder dürfen zugreifen.'
                : 'Die Website ist aktuell öffentlich live und für alle Besucher voll zugänglich.'}
            </p>
          </div>
        </div>

        <button
          onClick={toggleMaintenanceMode}
          disabled={isTogglingMaintenance}
          className={`px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider font-orbitron shadow-2xl transition-all cursor-pointer shrink-0 hover:scale-105 active:scale-95 ${
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

      {/* Analytics / Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/projects">
          <Card variant="glass" className="p-6 space-y-3 border-white/10 hover:border-[#5865f2]/50 transition-all group">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-semibold uppercase text-neutral-400 font-sans">Portfolio Projects</span>
              <div className="p-2 rounded-xl bg-[#5865f2]/15 border border-[#5865f2]/30 text-[#5865f2]">
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
          <Card variant="glass" className="p-6 space-y-3 border-white/10 hover:border-amber-400/50 transition-all group">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-semibold uppercase text-neutral-400 font-sans">Tickets & Briefs</span>
              <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
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
          <Card variant="glass" className="p-6 space-y-3 border-white/10 hover:border-emerald-400/50 transition-all group">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-semibold uppercase text-neutral-400 font-sans">Kunden-Reviews</span>
              <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
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
          <Card variant="glass" className="p-6 space-y-3 border-white/10 hover:border-purple-400/50 transition-all group">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-semibold uppercase text-neutral-400 font-sans">Giveaways</span>
              <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
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
            <Card variant="glass" className="p-6 space-y-3 border-white/10 group-hover:border-[#5865f2]/50 transition-all">
              <div className="flex items-center justify-between">
                <FolderKanban className="w-6 h-6 text-[#5865f2]" />
                <Plus className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-white font-orbitron uppercase text-sm">Projekte & Medien</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">Neue Projekte mit Bildern & Videos vom PC oder Discord hinzufügen.</p>
            </Card>
          </Link>

          <Link href="/admin/discord" className="group">
            <Card variant="glass" className="p-6 space-y-3 border-white/10 group-hover:border-amber-400/50 transition-all">
              <div className="flex items-center justify-between">
                <ShieldCheck className="w-6 h-6 text-amber-400" />
                <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-white font-orbitron uppercase text-sm">Discord Bot Status</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">Rollen-Überprüfung & Discord OAuth Berechtigungen verwalten.</p>
            </Card>
          </Link>

          <Link href="/admin/giveaways" className="group">
            <Card variant="glass" className="p-6 space-y-3 border-white/10 group-hover:border-purple-400/50 transition-all">
              <div className="flex items-center justify-between">
                <Gift className="w-6 h-6 text-purple-400" />
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
