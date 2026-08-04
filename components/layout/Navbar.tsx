'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE_CONFIG } from '@/constants/site';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Menu, X, LogIn, ShieldAlert, LogOut, LayoutDashboard, ShieldCheck, UserPlus, User } from 'lucide-react';
import { MobileMenu } from './MobileMenu';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/providers/AuthProvider';
import { AuthModal } from '@/components/shared/AuthModal';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, loginWithDiscord, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 md:py-5',
          scrolled ? 'glass-nav py-3 md:py-4 shadow-2xl' : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-white/20 shadow-md group-hover:scale-105 transition-transform bg-black">
              <img
                src="/images/logo.png"
                alt="NOEL VISUALS"
                className="w-full h-full object-contain p-0.5"
              />
            </div>
            <span className="font-extrabold tracking-widest text-sm md:text-base text-white uppercase font-sans">
              NOEL VISUALS
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-widest uppercase">
            {SITE_CONFIG.navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    'relative py-1 transition-colors hover:text-white',
                    isActive ? 'text-white' : 'text-neutral-400'
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            {/* Admin link if role verified */}
            {user?.isAdmin && (
              <Link
                href="/admin"
                className="text-amber-400 font-bold hover:text-amber-300 flex items-center gap-1.5 bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/30"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                ADMIN DASHBOARD
              </Link>
            )}
          </nav>

          {/* Action Buttons & Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Discord Login Button or User Dropdown */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-white/10 border border-white/20 hover:border-white/40 transition-all text-xs font-mono"
                >
                  <img
                    src={user.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}
                    alt={user.username || 'User'}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-white font-semibold">@{user.username || 'User'}</span>
                  {user.isAdmin && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </button>

                <AnimatePresence>
                  {authDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-64 p-3 rounded-xl bg-[#0c0d12] border border-white/20 shadow-2xl space-y-3 z-50 text-xs"
                    >
                      <div className="p-2.5 rounded-lg bg-white/5 space-y-1">
                        <div className="font-bold text-white flex items-center justify-between">
                          <span>@{user.username || 'User'}</span>
                          <span className="text-[10px] font-mono text-emerald-400">Verifiziert ✓</span>
                        </div>
                        {user.email && (
                          <p className="text-[10px] font-mono text-neutral-400 truncate">
                            {user.email}
                          </p>
                        )}

                        {/* Role status */}
                        <div className="pt-2 flex items-center gap-1.5 text-[10px] font-mono">
                          {user.isAdmin ? (
                            <span className="text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              <ShieldCheck className="w-3 h-3 text-amber-400" />
                              Staff / Admin Status Verifiziert
                            </span>
                          ) : (
                            <span className="text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              <User className="w-3 h-3 text-emerald-400" />
                              Kunden-Account Verifiziert
                            </span>
                          )}
                        </div>
                      </div>

                      {user.isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setAuthDropdownOpen(false)}
                          className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 font-bold hover:bg-amber-400/20 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>OPEN ADMIN DASHBOARD</span>
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          setAuthDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Abmelden</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="glow"
                  size="sm"
                  onClick={() => {
                    setAuthModalOpen(true);
                  }}
                  leftIcon={<LogIn className="w-3.5 h-3.5 text-black" />}
                  className="bg-white text-black font-bold text-xs tracking-widest hover:bg-neutral-200"
                >
                  LOGIN
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-300 hover:text-white focus:outline-none rounded-lg bg-white/5 border border-white/10"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Auth Modal for Email + Password + Discord Linking + 6-Digit OTP */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
};
