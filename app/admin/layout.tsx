'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth, ADMIN_ROLE_ID } from '@/components/providers/AuthProvider';
import {
  LayoutDashboard,
  FileText,
  ShieldCheck,
  LogOut,
  ArrowLeft,
  Lock,
  Users,
  FolderKanban,
  Gift,
  KeyRound,
  Layers,
  Handshake,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, loginWithDiscord, logout } = useAuth();
  const pathname = usePathname();

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070709] text-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#5865f2] text-white font-extrabold flex items-center justify-center mx-auto shadow-xl animate-pulse font-orbitron text-lg">
            NV
          </div>
          <p className="text-xs font-mono tracking-widest text-neutral-400">
            VERIFYING DISCORD STAFF ROLE...
          </p>
        </div>
      </div>
    );
  }

  // Access Gate Screen if Not Logged In or Missing Admin Role 1533100816783638729
  if (!isAuthenticated || !user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#070709] font-sans">
        <div className="max-w-lg w-full bg-[#0d0e14]/90 backdrop-blur-xl p-8 rounded-3xl border border-amber-500/30 space-y-6 text-center shadow-2xl relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-white uppercase tracking-wider font-orbitron">
              ADMIN DASHBOARD PROTECTED
            </h1>
            <p className="text-xs font-mono text-amber-400 uppercase tracking-widest">
              DISCORD STAFF ROLE REQUIRED
            </p>
            <p className="text-sm text-neutral-300 leading-relaxed pt-2">
              Der Zugriff auf das Admin-Dashboard ist ausschließlich für verifizierte Discord Staff-Accounts reserviert.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left space-y-2 text-xs">
            <span className="font-mono text-neutral-400 uppercase block">Aktuelle Sitzung:</span>
            {user ? (
              <div className="flex items-center justify-between text-neutral-200 font-mono">
                <span>User: @{user.username}</span>
                <span className="text-red-400 font-bold">Rolle Fehlt</span>
              </div>
            ) : (
              <p className="text-neutral-400">Keine aktive Discord-Sitzung gefunden.</p>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => loginWithDiscord()}
              className="w-full py-3.5 px-6 rounded-xl bg-[#5865f2] hover:bg-[#4752c4] text-white font-extrabold text-xs uppercase tracking-wider font-orbitron shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>MIT DISCORD ANMELDEN (STAFF ROLE)</span>
            </button>
            <Link
              href="/"
              className="w-full py-3 px-6 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 border border-white/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Zurück zur Website</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const sidebarLinks = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Projects & Media', href: '/admin/projects', icon: FolderKanban },
    { label: 'Client Briefs & Tickets', href: '/admin/briefs', icon: FileText },
    { label: 'Customer Reviews', href: '/admin/reviews', icon: Users },
    { label: 'Customers & Leads', href: '/admin/customers', icon: Users },
    { label: 'Giveaways', href: '/admin/giveaways', icon: Gift },
    { label: 'Services & Pricing', href: '/admin/services', icon: Layers },
    { label: 'Partner Network', href: '/admin/partners', icon: Handshake },
    { label: 'Discord Setup', href: '/admin/discord', icon: ShieldCheck },
  ];

  // Admin Verified Dashboard Shell
  return (
    <div className="min-h-screen flex bg-[#070709] text-white font-sans">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-white/10 p-5 flex flex-col justify-between hidden md:flex bg-[#0b0c10] shrink-0">
        <div className="space-y-6">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 px-2 py-2 group">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/20 bg-black group-hover:border-amber-400 transition-colors shrink-0">
              <img
                src="/images/logo.png"
                alt="NOEL VISUALS"
                className="w-full h-full object-contain p-0.5"
              />
            </div>
            <div>
              <span className="font-extrabold tracking-wider text-xs text-white uppercase block font-orbitron">
                NOEL VISUALS
              </span>
              <span className="text-[10px] font-mono text-amber-400 block uppercase font-bold flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                STUDIO ADMIN
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-xs">
            {sidebarLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all',
                    isActive
                      ? 'bg-[#5865f2]/20 text-white font-bold border border-[#5865f2]/40 shadow-lg shadow-[#5865f2]/10'
                      : 'text-neutral-300 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon className={cn('w-4 h-4', isActive ? 'text-[#5865f2]' : 'text-neutral-400')} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card at Sidebar Bottom */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src={user.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}
                alt=""
                className="w-7 h-7 rounded-full object-cover shrink-0"
              />
              <div className="truncate">
                <span className="font-bold text-white text-xs block truncate font-mono">
                  @{user.username}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 font-bold">
                  <ShieldCheck className="w-3 h-3" /> Staff Verified
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-neutral-400 hover:text-white hover:bg-red-500/10 border border-transparent hover:border-red-500/20 text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span>Abmelden</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 border-b border-white/10 px-6 flex items-center justify-between bg-[#0b0c10]/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-neutral-300">
              DISCORD STAFF VERIFIED
            </span>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-semibold transition-all hover:scale-105 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span>Zur Live Website</span>
          </Link>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-6 md:p-8 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
