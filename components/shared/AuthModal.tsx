'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, User, Lock, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, Send, LogIn, UserPlus, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/components/providers/AuthProvider';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export const AuthModal = ({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'register' | 'verify'>(defaultMode);
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // OTP Code State
  const [otpCode, setOtpCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { user, loginWithDiscord } = useAuth();

  // Read Discord link data from URL params (returned by link_only OAuth flow)
  const [linkedDiscord, setLinkedDiscord] = useState<{
    id: string; username: string; avatar: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const p = new URLSearchParams(window.location.search);
    if (p.get('discord_linked') === '1') {
      setLinkedDiscord({
        id: p.get('discord_id') || '',
        username: p.get('discord_username') || '',
        avatar: p.get('discord_avatar') || '',
      });
      // Clean URL without reload
      window.history.replaceState({}, '', window.location.pathname);
      // Auto-open register tab
      setMode('register');
    }
  }, []);

  const handleLinkDiscord = () => {
    window.location.href = '/api/auth/discord/login?mode=link_only';
  };

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!data.success) {
        if (data.requiresVerification) {
          setMode('verify');
        }
        setErrorMsg(data.message);
      } else {
        if (data.user) {
          localStorage.setItem('noel_discord_session', JSON.stringify(data.user));
        }
        window.location.reload();
      }
    } catch (err) {
      setErrorMsg('Anmeldung fehlgeschlagen. Bitte versuche es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password,
          // Discord is optional
          discordUserId: linkedDiscord?.id || user?.id || '',
          discordUsername: linkedDiscord?.username || user?.username || '',
          discordAvatar: linkedDiscord?.avatar || user?.avatar || '',
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setErrorMsg(data.message);
      } else {
        setMode('verify');
      }
    } catch (err: any) {
      setErrorMsg('Failed to process registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          code: otpCode,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setErrorMsg(data.message);
      } else {
        window.location.reload();
      }
    } catch (err) {
      setErrorMsg('Verification failed. Please check the 6-digit code sent to your email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-md w-full bg-[#0d0e14] border border-white/20 rounded-2xl p-7 md:p-8 space-y-6 shadow-2xl overflow-hidden"
        >
          {/* Top Ambient Glow */}
          <div className="absolute -top-24 -left-24 w-60 h-60 bg-indigo-500/15 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

          {/* Header Brand Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg overflow-hidden border border-white/20 shadow bg-black flex items-center justify-center">
                <img src="/images/logo.png" alt="NV" className="w-full h-full object-contain p-0.5" />
              </div>
              <div>
                <span className="font-extrabold tracking-widest text-sm text-white uppercase block">
                  NOEL VISUALS
                </span>
                <span className="text-[10px] font-mono text-neutral-400 block">
                  STUDIO ACCOUNT ACCESS
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          {mode !== 'verify' && (
            <div className="p-1 rounded-xl bg-black/80 border border-white/10 flex items-center gap-1 relative z-10">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  mode === 'login'
                    ? 'bg-white text-black shadow-lg font-extrabold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                LOGIN
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`flex-1 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  mode === 'register'
                    ? 'bg-white text-black shadow-lg font-extrabold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                CREATE ACCOUNT
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-950/80 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 font-mono relative z-10">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* LOGIN MODE */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 relative z-10">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-neutral-300 block tracking-wider">
                  Email or Username <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="name@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#13151d] border border-white/10 text-white text-xs focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 transition-all placeholder:text-neutral-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-neutral-300 block tracking-wider">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#13151d] border border-white/10 text-white text-xs focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 transition-all placeholder:text-neutral-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="glow"
                size="lg"
                isLoading={isSubmitting}
                className="w-full justify-center bg-white text-black font-extrabold hover:bg-neutral-200 text-xs tracking-widest shadow-xl py-3"
              >
                LOG IN TO ACCOUNT
              </Button>

              <div className="relative my-5 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <span className="relative px-3 bg-[#0d0e14] text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                  OR CONNECT WITH DISCORD
                </span>
              </div>

              <button
                type="button"
                onClick={() => loginWithDiscord()}
                className="w-full py-3 rounded-xl bg-[#5865F2]/15 border border-[#5865F2]/40 text-[#5865F2] hover:bg-[#5865F2]/25 hover:border-[#5865F2]/70 transition-all font-bold text-xs flex items-center justify-center gap-2.5 tracking-wider shadow-lg"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                <span>LOG IN WITH DISCORD OAUTH</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-xs text-neutral-400 hover:text-white underline font-mono transition-colors"
                >
                  Don't have an account yet? Create one here →
                </button>
              </div>
            </form>
          )}

          {/* CREATE ACCOUNT MODE */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4 relative z-10">
              {/* Discord Link Section */}
              {(linkedDiscord?.id || user?.id) ? (
                <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={linkedDiscord?.avatar || user?.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}
                      alt="Discord"
                      className="w-9 h-9 rounded-full border border-indigo-400/30 object-cover"
                    />
                    <div>
                      <span className="text-xs font-bold text-white uppercase block">
                        DISCORD LINKED: @{linkedDiscord?.username || user?.username || 'User'}
                      </span>
                      <span className="text-[10px] font-mono text-indigo-300 block">
                        ID: {linkedDiscord?.id || user?.id} (Verified ✓)
                      </span>
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleLinkDiscord}
                  className="w-full p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 transition-all font-bold text-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Link2 className="w-3.5 h-3.5" />
                    <span className="font-mono text-[11px] uppercase">OPTIONAL: Link Discord Account</span>
                  </div>
                  <span className="bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded font-mono font-bold">CONNECT</span>
                </button>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-neutral-300 block tracking-wider">Username *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Choose your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#13151d] border border-white/10 text-white text-xs focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 transition-all placeholder:text-neutral-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-neutral-300 block tracking-wider">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#13151d] border border-white/10 text-white text-xs focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 transition-all placeholder:text-neutral-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-neutral-300 block tracking-wider">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#13151d] border border-white/10 text-white text-xs focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 transition-all placeholder:text-neutral-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="glow"
                size="lg"
                isLoading={isSubmitting}
                rightIcon={<Send className="w-4 h-4" />}
                className="w-full justify-center bg-white text-black font-extrabold hover:bg-neutral-200 text-xs tracking-widest shadow-xl py-3"
              >
                REGISTER
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-neutral-400 hover:text-white underline font-mono transition-colors"
                >
                  Already have an account? Log in here →
                </button>
              </div>
            </form>
          )}

          {/* VERIFY CODE MODE */}
          {mode === 'verify' && (
            <form onSubmit={handleVerifyCode} className="space-y-6 relative z-10">
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center mx-auto">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-white uppercase tracking-wider">
                  CHECK YOUR EMAIL INBOX
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  We have sent a 6-digit verification code to <strong className="text-amber-300">{email}</strong>.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-neutral-300 block text-center tracking-wider">
                  ENTER 6-DIGIT VERIFICATION CODE
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full text-center text-2xl tracking-[0.5em] font-mono py-3 rounded-xl bg-black/80 border border-white/20 text-white focus:outline-none focus:border-white"
                />
              </div>

              <Button
                type="submit"
                variant="glow"
                size="lg"
                isLoading={isSubmitting}
                rightIcon={<CheckCircle2 className="w-4 h-4" />}
                className="w-full justify-center bg-white text-black hover:bg-neutral-200 font-extrabold text-xs tracking-widest shadow-xl py-3"
              >
                VERIFY CODE & ACTIVATE ACCOUNT
              </Button>

              <button
                type="button"
                onClick={() => setMode('register')}
                className="w-full text-center text-xs font-mono text-neutral-400 hover:text-white flex items-center justify-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Back to Registration
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
