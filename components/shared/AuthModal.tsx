'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, User, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, RefreshCw, Send } from 'lucide-react';
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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (password && confirmPassword && password !== confirmPassword) {
      setErrorMsg('Die Passwörter stimmen nicht überein.');
      return;
    }

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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="relative max-w-[420px] w-full bg-[#111216] border border-[#22242c] rounded-2xl p-7 shadow-2xl overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors z-20"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Centered Logo & Title Header */}
          <div className="text-center space-y-2 mb-6 pt-1">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-black border border-white/15 p-1 mx-auto mb-1 shadow-md">
              <img src="/images/logo.png" alt="NV" className="w-full h-full object-contain" />
            </div>

            {mode === 'login' && (
              <>
                <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
                <p className="text-xs text-neutral-400">Enter your credentials to sign in to your account.</p>
              </>
            )}

            {mode === 'register' && (
              <>
                <h2 className="text-2xl font-bold text-white tracking-tight">Create Account</h2>
                <p className="text-xs text-neutral-400">Let's get you started with your studio access.</p>
              </>
            )}

            {mode === 'verify' && (
              <>
                <h2 className="text-2xl font-bold text-white tracking-tight">Verify Email</h2>
                <p className="text-xs text-neutral-400">We've sent a 6-digit code to <span className="text-white font-medium">{email}</span></p>
              </>
            )}
          </div>

          {/* Error Message Banner */}
          {errorMsg && (
            <div className="p-3 mb-4 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="Email Address or Username"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#181a20] border border-[#2a2d37] text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-white/40 transition-all"
                />
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#181a20] border border-[#2a2d37] text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-white/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-neutral-200 transition-colors text-xs shadow-lg mt-2 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                ) : (
                  'Sign In'
                )}
              </button>

              <div className="relative my-5 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#22242c]" />
                </div>
                <span className="relative px-3 bg-[#111216] text-[11px] text-neutral-400">
                  or continue with
                </span>
              </div>

              <button
                type="button"
                onClick={() => loginWithDiscord()}
                className="w-full py-2.5 px-4 rounded-xl bg-[#181a20] border border-[#2a2d37] hover:border-white/30 text-white font-medium text-xs flex items-center justify-center gap-2.5 transition-all"
              >
                <svg className="w-4 h-4 fill-current text-[#5865F2]" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                <span>Discord OAuth</span>
              </button>

              <div className="text-center pt-3">
                <p className="text-xs text-neutral-400">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('register'); setErrorMsg(null); }}
                    className="text-white font-semibold hover:underline"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              {/* Optional Discord Link pill */}
              {(linkedDiscord?.id || user?.id) ? (
                <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={linkedDiscord?.avatar || user?.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}
                      alt="Discord"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="text-xs text-white font-medium">
                      Discord Linked: @{linkedDiscord?.username || user?.username || 'User'}
                    </span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleLinkDiscord}
                  className="w-full p-2.5 rounded-xl bg-[#181a20] border border-[#2a2d37] hover:border-indigo-500/50 text-neutral-300 font-medium text-xs flex items-center justify-between transition-all"
                >
                  <span className="text-neutral-400">Optional: Link Discord Account</span>
                  <span className="text-indigo-400 font-semibold text-[11px]">Connect →</span>
                </button>
              )}

              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="Full Name / Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#181a20] border border-[#2a2d37] text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-white/40 transition-all"
                />
              </div>

              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#181a20] border border-[#2a2d37] text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-white/40 transition-all"
                />
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#181a20] border border-[#2a2d37] text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-white/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#181a20] border border-[#2a2d37] text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-white/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center gap-2 pt-1 pb-1">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#181a20] border-[#2a2d37] accent-white cursor-pointer"
                />
                <label htmlFor="agreeTerms" className="text-xs text-neutral-400 cursor-pointer">
                  I agree to the <span className="text-white font-medium">Terms & Conditions</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !agreeTerms}
                className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-neutral-200 disabled:opacity-50 transition-colors text-xs shadow-lg flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                ) : (
                  'Create Account'
                )}
              </button>

              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#22242c]" />
                </div>
                <span className="relative px-3 bg-[#111216] text-[11px] text-neutral-400">
                  or continue with
                </span>
              </div>

              <button
                type="button"
                onClick={() => loginWithDiscord()}
                className="w-full py-2.5 px-4 rounded-xl bg-[#181a20] border border-[#2a2d37] hover:border-white/30 text-white font-medium text-xs flex items-center justify-center gap-2.5 transition-all"
              >
                <svg className="w-4 h-4 fill-current text-[#5865F2]" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                <span>Discord</span>
              </button>

              <div className="text-center pt-3">
                <p className="text-xs text-neutral-400">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setErrorMsg(null); }}
                    className="text-white font-semibold hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* VERIFY CODE MODE */}
          {mode === 'verify' && (
            <form onSubmit={handleVerifyCode} className="space-y-5">
              <div className="space-y-2">
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full text-center text-2xl tracking-[0.5em] font-mono py-3 rounded-xl bg-[#181a20] border border-[#2a2d37] text-white focus:outline-none focus:border-white/50"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-neutral-200 transition-colors text-xs shadow-lg flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                ) : (
                  'Verify Code'
                )}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrorMsg(null); }}
                  className="text-xs text-neutral-400 hover:text-white font-mono transition-colors"
                >
                  ← Back to Registration
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
