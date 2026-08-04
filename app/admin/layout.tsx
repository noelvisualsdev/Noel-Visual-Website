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
  Settings,
  FolderKanban,
  Gift,
  KeyRound,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, loginWithDiscord, logout } = useAuth();
  const pathname = usePathname();

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070709] text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-black font-black flex items-center justify-center mx-auto animate-spin">
            NV
          </div>
          <p className="text-xs font-mono tracking-widest text-neutral-400">
            VERIFYING DISCORD ROLE {ADMIN_ROLE_ID}...
          </p>
        </div>
      </div>
    );
  }

  // Access Gate Screen if Not Logged In or Missing Admin Role 1533100816783638729
  if (!isAuthenticated || !user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#070709]">
        <div className="max-w-lg w-full glass-card p-8 rounded-2xl border border-amber-500/30 space-y-6 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-white uppercase tracking-tight">
              ADMIN DASHBOARD PROTECTED
            </h1>
            <p className="text-xs font-mono text-amber-400 uppercase tracking-widest">
              ROLE ID REQUIRED: {ADMIN_ROLE_ID}
            </p>
            <p className="text-sm text-neutral-400 leading-relaxed pt-2">
              Access to the NOEL VISUALS studio admin panel is strictly restricted to Discord accounts verified with role <code className="text-white font-mono bg-white/10 px-2 py-0.5 rounded">{ADMIN_ROLE_ID}</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-left space-y-2 text-xs">
            <span className="font-mono text-neutral-400 uppercase block">Current Session:</span>
            {user ? (
              <div className="flex items-center justify-between text-neutral-200 font-mono">
                <span>User: {user.username}</span>
                <span className="text-red-400">Role Missing</span>
              </div>
            ) : (
              <p className="text-neutral-400">No active Discord session found.</p>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <Button
              variant="glow"
              size="lg"
              onClick={() => loginWithDiscord()}
              className="w-full justify-center bg-amber-400 text-black hover:bg-amber-300 shadow-amber-400/20"
            >
              LOGIN WITH DISCORD (ROLE {ADMIN_ROLE_ID})
            </Button>
            <Button
              href="/"
              variant="outline"
              size="md"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              className="w-full justify-center border-white/20"
            >
              Return to Website
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Admin Verified Dashboard Shell
  return (
    <div className="min-h-screen flex bg-[#070709] text-white">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-white/10 p-6 flex flex-col justify-between hidden md:flex bg-[#0a0b0e]">
        <div className="space-y-8">
          <Link href="/" className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/20 bg-black">
              <img
                src="/images/logo.png"
                alt="NOEL VISUALS"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="font-extrabold tracking-widest text-xs text-white uppercase block">
                NOEL VISUALS
              </span>
              <span className="text-[9px] font-mono text-amber-400 block uppercase">
                ADMIN PANEL
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-xs font-mono uppercase tracking-wider">
            <Link
              href="/admin"
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors',
                pathname === '/admin'
                  ? 'bg-amber-400/10 text-amber-300 font-bold border border-amber-400/30'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              )}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </Link>

            <Link
              href="/admin/briefs"
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors',
                pathname === '/admin/briefs'
                  ? 'bg-amber-400/10 text-amber-300 font-bold border border-amber-400/30'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              )}
            >
              <FileText className="w-4 h-4" />
              <span>Project Briefs</span>
            </Link>

            <Link
              href="/admin/reviews"
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors',
                pathname === '/admin/reviews'
                  ? 'bg-amber-400/10 text-amber-300 font-bold border border-amber-400/30'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Users className="w-4 h-4" />
              <span>MongoDB Reviews</span>
            </Link>

            <Link
              href="/admin/projects"
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors',
                pathname === '/admin/projects'
                  ? 'bg-amber-400/10 text-amber-300 font-bold border border-amber-400/30'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              )}
            >
              <FolderKanban className="w-4 h-4" />
              <span>MongoDB Projects</span>
            </Link>

            <Link
              href="/admin/customers"
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors',
                pathname === '/admin/customers'
                  ? 'bg-amber-400/10 text-amber-300 font-bold border border-amber-400/30'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Users className="w-4 h-4" />
              <span>MongoDB Customers</span>
            </Link>

            <Link
              href="/admin/giveaways"
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors',
                pathname === '/admin/giveaways'
                  ? 'bg-amber-400/10 text-amber-300 font-bold border border-amber-400/30'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Gift className="w-4 h-4" />
              <span>MongoDB Giveaways</span>
            </Link>

            <Link
              href="/admin/sessions"
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors',
                pathname === '/admin/sessions'
                  ? 'bg-amber-400/10 text-amber-300 font-bold border border-amber-400/30'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              )}
            >
              <KeyRound className="w-4 h-4" />
              <span>MongoDB Sessions</span>
            </Link>

            <Link
              href="/admin/services"
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors',
                pathname === '/admin/services'
                  ? 'bg-amber-400/10 text-amber-300 font-bold border border-amber-400/30'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Layers className="w-4 h-4" />
              <span>MongoDB Services</span>
            </Link>

            <Link
              href="/admin/discord"
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors',
                pathname === '/admin/discord'
                  ? 'bg-amber-400/10 text-amber-300 font-bold border border-amber-400/30'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Settings className="w-4 h-4" />
              <span>Discord Role Setup</span>
            </Link>
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="space-y-4 pt-6 border-t border-white/10">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.username}
              className="w-8 h-8 rounded-full border border-amber-400/50"
            />
            <div className="space-y-0.5 overflow-hidden">
              <span className="text-xs font-bold text-white block truncate">
                {user.username}
              </span>
              <span className="text-[9px] font-mono text-amber-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Role Verified
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-xs font-mono text-neutral-400 hover:text-white hover:bg-white/5 border border-white/5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-white/10 px-6 flex items-center justify-between bg-[#08090c]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-mono text-neutral-300 uppercase tracking-widest">
              DISCORD ROLE <code className="text-amber-400">{ADMIN_ROLE_ID}</code> VERIFIED
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button href="/" variant="outline" size="sm" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
              VIEW LIVE WEBSITE
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 md:p-10 flex-grow overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
