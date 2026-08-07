'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { ShieldAlert, LogIn, Lock, Wrench, ShieldCheck, LogOut, Loader2, Sparkles, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedVideoBackground } from '@/components/ui/AnimatedVideoBackground';

export function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading: authLoading, loginWithDiscord, logout } = useAuth();
  const [maintenanceActive, setMaintenanceActive] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [forcePreview, setForcePreview] = useState(false);

  useEffect(() => {
    fetch('/api/admin/maintenance')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && typeof data.maintenanceMode === 'boolean') {
          setMaintenanceActive(data.maintenanceMode);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsChecking(false));
  }, [pathname]);

  // Always allow /admin or API routes or auth callbacks to prevent lockout
  if (pathname.startsWith('/admin') || pathname.startsWith('/api') || pathname.startsWith('/auth')) {
    return <>{children}</>;
  }

  // If maintenance mode is disabled AND no force preview, show website
  if (!isChecking && !maintenanceActive && !forcePreview) {
    return <>{children}</>;
  }

  // If user is Staff and forcePreview is false, allow bypass with Top Staff Maintenance Banner
  if (!forcePreview && isAuthenticated && user?.isAdmin) {
    return (
      <>
        {/* Top Staff Maintenance Indicator Banner (Positioned cleanly at the very top) */}
        <div className="bg-[#0e0f18] border-b border-white/20 text-white text-xs font-mono font-bold py-2.5 px-4 flex items-center justify-between shadow-2xl relative z-[60]">
          <div className="flex items-center gap-2 mx-auto text-center truncate">
            <ShieldCheck className="w-4 h-4 text-white shrink-0" />
            <span className="truncate">MAINTENANCE MODE AKTIV — Staff Freischaltung (@{user.username})</span>
          </div>
          <button
            onClick={() => setForcePreview(true)}
            className="px-3 py-1 rounded-lg bg-white text-black hover:bg-neutral-200 font-extrabold text-[10px] uppercase transition-all cursor-pointer shrink-0 ml-2 shadow-md flex items-center gap-1"
            title="Wartungs-Screen als Vorschau anzeigen"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Vorschau-Screen</span>
          </button>
        </div>

        {children}
      </>
    );
  }

  // Show loading spinner while checking status
  if (isChecking || authLoading) {
    return (
      <div className="min-h-screen bg-[#070709] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  // RENDER MAINTENANCE SCREEN FOR VISITORS & PREVIEW MODE
  return (
    <div className="min-h-screen bg-[#070709] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background topography animation */}
      <AnimatedVideoBackground isFixed={true} overlayOpacity="bg-black/80" />

      {/* Exit preview button if staff testing preview */}
      {forcePreview && (
        <button
          onClick={() => setForcePreview(false)}
          className="fixed top-6 right-6 z-[70] px-4 py-2.5 rounded-2xl bg-white text-black font-extrabold text-xs font-orbitron border border-white shadow-2xl flex items-center gap-2 cursor-pointer hover:scale-105 transition-all"
        >
          <Eye className="w-4 h-4" />
          <span>VORSCHAU BEENDEN (ZURÜCK ZUR WEBSITE)</span>
        </button>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full bg-[#0d0e14]/90 backdrop-blur-xl border border-white/15 rounded-3xl p-8 md:p-10 space-y-8 text-center shadow-2xl relative z-10"
      >
        {/* Pulsing Wrench & Shield Icon */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center relative shadow-lg">
          <Wrench className="w-10 h-10 text-white animate-pulse" />
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-black border border-white flex items-center justify-center">
            <Lock className="w-3.5 h-3.5 text-white" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-mono font-bold uppercase tracking-widest inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Wartungsarbeiten Aktiv
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-wider font-orbitron">
            WEBSITE IN MAINTENANCE
          </h1>
          <p className="text-sm text-neutral-300 leading-relaxed max-w-md mx-auto font-sans">
            Wir führen derzeit wichtige Updates und neue Feature-Integrationen durch. Die Website ist in Kürze wieder öffentlich verfügbar!
          </p>
        </div>

        {/* Discord OAuth Bypass Notice */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-xs text-left font-sans">
          <div className="flex items-center gap-2 font-bold text-white uppercase tracking-wider font-orbitron text-xs">
            <ShieldCheck className="w-4 h-4 text-white" />
            <span>Staff / Team Login Bypass</span>
          </div>
          <p className="text-neutral-300 leading-relaxed">
            Bist du ein Team-Mitglied mit der <strong className="text-white">Discord Staff Rolle</strong>? Melde dich per Discord OAuth an, um die Website freizuschalten.
          </p>
        </div>

        {/* Auth Error Notice for logged-in non-staff user */}
        {isAuthenticated && user && !user.isAdmin && (
          <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs space-y-2 text-left font-mono">
            <div className="flex items-center gap-2 font-bold text-red-200">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>ZUGRIFF VERWEIGERT (Keine Staff Rolle)</span>
            </div>
            <p>
              Du bist eingeloggt als <strong className="text-white">@{user.username}</strong>, jedoch besitzt dein Discord-Account keine Staff-Berechtigung.
            </p>
            <button
              onClick={() => logout()}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-white font-bold border border-red-500/40 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Abmelden / Account wechseln</span>
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 space-y-3">
          {!isAuthenticated && (
            <button
              onClick={() => loginWithDiscord()}
              className="w-full py-4 px-6 rounded-2xl bg-[#5865f2] hover:bg-[#4752c4] text-white font-extrabold text-sm uppercase tracking-wider font-orbitron shadow-xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <LogIn className="w-5 h-5" />
              <span>MIT DISCORD ANMELDEN (STAFF BYPASS)</span>
            </button>
          )}

          <p className="text-[11px] font-mono text-neutral-400">
            © {new Date().getFullYear()} NOEL VISUALS — Official Studio Portal
          </p>
        </div>
      </motion.div>
    </div>
  );
}
