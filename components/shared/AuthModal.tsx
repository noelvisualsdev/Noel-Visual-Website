'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, User, Lock, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, Send, LogIn, UserPlus, Link2, Sparkles } from 'lucide-react';
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
      window.history.replaceState({}, '', window.location.pathname);
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
        body: JSON.stringify({ loginEmail, loginPassword }),
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
      setErrorMsg('Registrierung fehlgeschlagen.');
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
      setErrorMsg('Verifizierung fehlgeschlagen. Bitte prüfe den 6-stelligen Code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative max-w-md w-full bg-[#0a0b10] border border-white/15 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl overflow-hidden"
          style={{
            backgroundImage: 'radial-gradient(ellipse at top left, rgba(88, 101, 242, 0.08) 0%, transparent 60%), radial-gradient(ellipse at bottom right, rgba(251, 191, 36, 0.05) 0%, transparent 60%)'
          }}
        >
          {/* Header Brand Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/20 bg-black flex items-center justify-center shadow-inner">
                <img src="/images/logo.png" alt="NV" className="w-full h-full object-contain p-1" />
              </div>
              <div>
                <span className="font-extrabold tracking-widest text-sm text-white uppercase block font-sans">
                  NOEL VISUALS
                </span>
                <span className="text-[10px] font-mono text-neutral-400 block tracking-wider">
                  STUDIO ACCOUNT ACCESS
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          {mode !== 'verify' && (
            <div className="p-1 rounded-xl bg-black/60 border border-white/10 flex items-center gap-1">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(null); }}
                className={`flex-1 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  mode === 'login'
                    ? 'bg-white text-black shadow-md font-extrabold'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                LOGIN
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMsg(null); }}
                className={`flex-1 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  mode === 'register'
                    ? 'bg-white text-black shadow-md font-extrabold'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                KONTO ERSTELLEN
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs flex items-center gap-2.5 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* LOGIN MODE */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-neutral-300 block tracking-wider">
                  E-Mail oder Benutzername <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="name@beispiel.com oder Benutzername"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#12141d] border border-white/10 text-white text-xs focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/40 transition-all placeholder:text-neutral-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-neutral-300 block tracking-wider">
                  Passwort <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#12141d] border border-white/10 text-white text-xs focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/40 transition-all placeholder:text-neutral-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="glow"
                size="lg"
                isLoading={isSubmitting}
                className="w-full justify-center bg-white text-black font-extrabold hover:bg-neutral-200 text-xs tracking-widest shadow-xl py-3 mt-2"
              >
                ANMELDEN
              </Button>

              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <span className="relative px-3 bg-[#0a0b10] text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                  ODER MIT DISCORD
                </span>
              </div>

              <button
                type="button"
                onClick={() => loginWithDiscord()}
                className="w-full py-3 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-xs flex items-center justify-center gap-2.5 tracking-wider shadow-lg transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                <span>MIT DISCORD ANMELDEN</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrorMsg(null); }}
                  className="text-xs text-neutral-400 hover:text-white font-mono transition-colors"
                >
                  Noch kein Konto? Hier eines erstellen →
                </button>
              </div>
            </form>
          )}

          {/* CREATE ACCOUNT MODE */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Discord Link Section */}
              {(linkedDiscord?.id || user?.id) ? (
                <div className="p-3.5 rounded-xl bg-indigo-950/50 border border-indigo-500/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={linkedDiscord?.avatar || user?.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}
                      alt="Discord"
                      className="w-9 h-9 rounded-full border border-indigo-400/40 object-cover"
                    />
                    <div>
                      <span className="text-xs font-bold text-white uppercase block">
                        DISCORD VERKNÜPFT: @{linkedDiscord?.username || user?.username || 'User'}
                      </span>
                      <span className="text-[10px] font-mono text-indigo-300 block">
                        ID: {linkedDiscord?.id || user?.id} (Verifiziert ✓)
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
                    <span className="font-mono text-[11px] uppercase">OPTIONAL: Discord Verknüpfen</span>
                  </div>
                  <span className="bg-indigo-500 text-white text-[10px] px-2.5 py-1 rounded-md font-mono font-bold">VERBINDEN</span>
                </button>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-neutral-300 block tracking-wider">Benutzername *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Wähle deinen Benutzernamen"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#12141d] border border-white/10 text-white text-xs focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/40 transition-all placeholder:text-neutral-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-neutral-300 block tracking-wider">E-Mail-Adresse *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="name@beispiel.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#12141d] border border-white/10 text-white text-xs focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/40 transition-all placeholder:text-neutral-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-neutral-300 block tracking-wider">Passwort *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#12141d] border border-white/10 text-white text-xs focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/40 transition-all placeholder:text-neutral-500"
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
                REGISTRIEREN
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMsg(null); }}
                  className="text-xs text-neutral-400 hover:text-white font-mono transition-colors"
                >
                  Bereits ein Konto? Hier anmelden →
                </button>
              </div>
            </form>
          )}

          {/* VERIFY CODE MODE */}
          {mode === 'verify' && (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center mx-auto">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-white uppercase tracking-wider">
                  POSTFACH PRÜFEN
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  Wir haben einen 6-stelligen Code an <strong className="text-amber-300">{email}</strong> gesendet.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase text-neutral-300 block text-center tracking-wider">
                  6-STELLIGEN CODE EINGEBEN
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
                KONTO VERIFIZIEREN & AKTIVIEREN
              </Button>

              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMsg(null); }}
                className="w-full text-center text-xs font-mono text-neutral-400 hover:text-white flex items-center justify-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Zurück zur Registrierung
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
