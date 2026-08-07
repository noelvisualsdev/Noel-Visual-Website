'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
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
  Lock,
} from 'lucide-react';
import { ADMIN_ROLE_ID, useAuth } from '@/components/providers/AuthProvider';
import Link from 'next/link';

export default function AdminOverviewPage() {
  const { user } = useAuth();

  const [briefs, setBriefs] = useState<any[]>([]);
  const [projectsCount, setProjectsCount] = useState<number>(0);
  const [reviewsCount, setReviewsCount] = useState<number>(0);
  const [giveawaysCount, setGiveawaysCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

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
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
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
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="glass-card p-6 md:p-8 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gradient-to-r from-amber-950/30 via-[#0d0e14] to-black">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="accent" className="text-amber-400 border-amber-500/30 bg-amber-500/10">
              DISCORD ROLE VERIFIED: {ADMIN_ROLE_ID}
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-tight font-orbitron">
            NOEL VISUALS CONTROL CENTER
          </h1>
          <p className="text-xs font-mono text-neutral-400">
            Angemeldet als: <span className="text-white font-bold">@{user?.username || 'Admin'}</span>
          </p>
        </div>
      </div>

      {/* Maintenance Mode Control Switch Card */}
      <Card variant="glass" className="p-6 border-white/20 bg-[#12141d] rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${
            maintenanceActive 
              ? 'bg-red-500/10 border-red-500/40 text-red-400' 
              : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
          }`}>
            <Wrench className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base font-orbitron uppercase">
                Wartungsmodus (Maintenance Mode)
              </span>
              <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border uppercase ${
                maintenanceActive
                  ? 'bg-red-500/20 text-red-300 border-red-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}>
                {maintenanceActive ? '🔴 AKTIV (NUR STAFF BERECHTIGT)' : '🟢 LIVE (ÖFFENTLICH)'}
              </span>
            </div>
            <p className="text-xs text-neutral-300">
              {maintenanceActive
                ? 'Die Website zeigt Besuchern aktuell den Wartungs-Screen. Nur angemeldete Discord Staff-Mitglieder dürfen zugreifen.'
                : 'Die Website ist aktuell live und für alle Besucher öffentlich zugänglich.'}
            </p>
          </div>
        </div>

        <button
          onClick={toggleMaintenanceMode}
          disabled={isTogglingMaintenance}
          className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider font-orbitron shadow-xl transition-all cursor-pointer shrink-0 ${
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
      </Card>

      {/* Analytics / Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="glass" className="p-5 space-y-2 border-white/10">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-mono uppercase">Tickets & Briefs</span>
            <FileText className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-orbitron">{briefs.length}</div>
          <p className="text-[11px] text-neutral-400 font-mono">Formular-Anfragen</p>
        </Card>

        <Card variant="glass" className="p-5 space-y-2 border-white/10">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-mono uppercase">Portfolio Projects</span>
            <FolderKanban className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-orbitron">{projectsCount}</div>
          <p className="text-[11px] text-neutral-400 font-mono">In MongoDB Atlas</p>
        </Card>

        <Card variant="glass" className="p-5 space-y-2 border-white/10">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-mono uppercase">Kunden-Reviews</span>
            <Star className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-orbitron">{reviewsCount}</div>
          <p className="text-[11px] text-neutral-400 font-mono">Gespeicherte Reviews</p>
        </Card>

        <Card variant="glass" className="p-5 space-y-2 border-white/10">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-mono uppercase">Giveaways</span>
            <Gift className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-orbitron">{giveawaysCount}</div>
          <p className="text-[11px] text-neutral-400 font-mono">Aktive Giveaways</p>
        </Card>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Link href="/admin/projects" className="group">
          <Card variant="glass" className="p-6 space-y-3 border-white/10 group-hover:border-amber-400/40 transition-colors">
            <div className="flex items-center justify-between">
              <FolderKanban className="w-6 h-6 text-amber-400" />
              <Plus className="w-4 h-4 text-neutral-400 group-hover:text-white" />
            </div>
            <h3 className="font-bold text-white font-orbitron uppercase text-sm">Projekte Verwalten</h3>
            <p className="text-xs text-neutral-400">Neue Projekte mit Bildern & Videos hinzufügen or bearbeiten.</p>
          </Card>
        </Link>

        <Link href="/admin/discord" className="group">
          <Card variant="glass" className="p-6 space-y-3 border-white/10 group-hover:border-amber-400/40 transition-colors">
            <div className="flex items-center justify-between">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
              <Plus className="w-4 h-4 text-neutral-400 group-hover:text-white" />
            </div>
            <h3 className="font-bold text-white font-orbitron uppercase text-sm">Discord Bot Status</h3>
            <p className="text-xs text-neutral-400">Rollen-Überprüfung & Discord OAuth Einstellungen verwalten.</p>
          </Card>
        </Link>

        <Link href="/admin/giveaways" className="group">
          <Card variant="glass" className="p-6 space-y-3 border-white/10 group-hover:border-amber-400/40 transition-colors">
            <div className="flex items-center justify-between">
              <Gift className="w-6 h-6 text-amber-400" />
              <Plus className="w-4 h-4 text-neutral-400 group-hover:text-white" />
            </div>
            <h3 className="font-bold text-white font-orbitron uppercase text-sm">Giveaways</h3>
            <p className="text-xs text-neutral-400">Community Giveaways verwalten und Auslosungen steuern.</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
