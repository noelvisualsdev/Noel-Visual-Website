'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE_CONFIG } from '@/constants/site';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Globe, Share2, Video, LogIn, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/providers/AuthProvider';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const pathname = usePathname();
  const { user, isAuthenticated, loginWithDiscord, logout } = useAuth();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="fixed inset-0 z-40 bg-[#070709]/95 backdrop-blur-2xl pt-24 px-6 pb-10 flex flex-col justify-between md:hidden overflow-y-auto"
        >
          <div className="space-y-6">
            <div className="text-xs font-mono tracking-widest text-neutral-500 uppercase pb-2 border-b border-white/10 flex items-center justify-between">
              <span>Navigation</span>
              {user?.isAdmin && (
                <span className="text-amber-400 flex items-center gap-1 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" /> ADMIN VERIFIED
                </span>
              )}
            </div>

            <nav className="flex flex-col space-y-4">
              {SITE_CONFIG.navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={onClose}
                    className={cn(
                      'text-2xl font-bold uppercase tracking-wider transition-colors flex items-center justify-between py-1',
                      isActive ? 'text-white' : 'text-neutral-400 hover:text-white'
                    )}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </Link>
                );
              })}

              {user?.isAdmin && (
                <Link
                  href="/admin"
                  onClick={onClose}
                  className="text-xl font-extrabold uppercase tracking-wider text-amber-400 flex items-center justify-between py-2 border-t border-amber-500/20 pt-4"
                >
                  <span className="flex items-center gap-2">
                    <LayoutDashboard className="w-5 h-5" /> ADMIN DASHBOARD
                  </span>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                </Link>
              )}
            </nav>
          </div>

          <div className="space-y-4 pt-8 border-t border-white/10">
            {!isAuthenticated ? (
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  loginWithDiscord();
                  onClose();
                }}
                leftIcon={<LogIn className="w-4 h-4 text-indigo-400" />}
                className="w-full justify-center border-indigo-500/30 bg-indigo-500/10 text-indigo-200"
              >
                DISCORD LOGIN
              </Button>
            ) : (
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={user?.avatar || ''} alt={user?.username || 'User'} className="w-8 h-8 rounded-full" />
                  <div>
                    <span className="text-xs font-bold text-white block">{user?.username}</span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {user?.isAdmin ? 'Role 1533100816783638729 Verified' : 'Member'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="text-xs text-neutral-400 hover:text-white underline"
                >
                  Sign Out
                </button>
              </div>
            )}


            <div className="flex items-center justify-between text-neutral-400 text-xs pt-4">
              <span>{SITE_CONFIG.location}</span>
              <div className="flex items-center gap-4">
                <a
                  href={SITE_CONFIG.socials.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white"
                >
                  <Globe className="w-4 h-4" />
                </a>
                <a
                  href={SITE_CONFIG.socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white"
                >
                  <Share2 className="w-4 h-4" />
                </a>
                <a
                  href={SITE_CONFIG.socials.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white"
                >
                  <Video className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
