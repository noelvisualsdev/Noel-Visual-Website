'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE_CONFIG } from '@/constants/site';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Menu, X, LogIn, ShieldAlert, LogOut, LayoutDashboard, ShieldCheck, UserPlus, User, Settings, Globe } from 'lucide-react';
import { MobileMenu } from './MobileMenu';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/providers/AuthProvider';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { AuthModal } from '@/components/shared/AuthModal';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, loginWithDiscord, logout } = useAuth();
  const { language, setLanguage } = useLanguage();

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
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group focus:outline-none shrink-0">
            <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-white/20 shadow-md group-hover:scale-105 transition-transform bg-black">
              <img
                src="/images/logo.png"
                alt="NOEL VISUALS"
                className="w-full h-full object-contain p-0.5"
              />
            </div>
            <span className="font-extrabold tracking-wider text-sm md:text-base text-white uppercase font-orbitron whitespace-nowrap">
              NOEL VISUALS
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-xs sm:text-sm font-sans font-medium tracking-normal">
            {SITE_CONFIG.navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    'relative px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap',
                    isActive ? 'text-white font-semibold bg-white/10' : 'text-neutral-300 hover:text-white hover:bg-white/5'
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavUnderline"
                      className="absolute bottom-0 left-2 right-2 h-[2px] bg-white rounded-full"
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
                className="text-amber-300 font-bold hover:text-amber-200 flex items-center gap-1.5 bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-400/40 text-xs font-mono shrink-0 transition-colors"
                title="Admin Dashboard"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Admin Dashboard</span>
              </Link>
            )}
          </nav>

          {/* Action Buttons & Auth */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switcher Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'de' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#12141c] border border-white/15 text-neutral-300 hover:text-white hover:border-white/40 transition-all text-xs font-mono font-bold cursor-pointer"
              title="Switch Language / Sprache wechseln"
            >
              <Globe className="w-3.5 h-3.5 text-neutral-400" />
              <span>{language === 'en' ? 'EN' : 'DE'}</span>
            </button>

            {/* Discord Login Button or User Dropdown */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-white/10 border border-white/20 hover:border-white/40 transition-all text-xs font-mono cursor-pointer"
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
                          {user.isAdmin && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
                              ADMIN
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-neutral-400 truncate">{user.id}</p>
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

                      <Link
                        href="/settings"
                        onClick={() => setAuthDropdownOpen(false)}
                        className="flex items-center gap-2 p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>

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
            className="lg:hidden p-2 text-neutral-300 hover:text-white focus:outline-none rounded-lg bg-white/5 border border-white/10"
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
