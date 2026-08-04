'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SessionProvider, useSession, signOut } from 'next-auth/react';
import { X, ExternalLink, Key, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export const ADMIN_ROLE_ID =
  process.env.NEXT_PUBLIC_DISCORD_ADMIN_ROLE_ID || '1533100816783638729';

export interface DiscordUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  username?: string;
  globalName?: string;
  avatar?: string;
  roles?: string[];
  isAdmin?: boolean;
}

interface AuthContextType {
  user: DiscordUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithDiscord: () => void;
  logout: () => void;
  checkRole: (roleId: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  loginWithDiscord: () => {},
  logout: () => {},
  checkRole: () => false,
});

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = name + '=; Max-Age=0; path=/;';
}

function AuthInternalProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [localUser, setLocalUser] = useState<DiscordUser | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Check URL error parameters
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const err = params.get('error');
      if (err) {
        setUrlError(err);
      }
    }

    // 2. Check HTTP cookie or LocalStorage
    const cookieData = getCookie('noel_discord_user');
    if (cookieData) {
      try {
        const parsed = JSON.parse(cookieData);
        setLocalUser(parsed);
        localStorage.setItem('noel_discord_session', JSON.stringify(parsed));
        return;
      } catch (e) {}
    }

    const saved = localStorage.getItem('noel_discord_session');
    if (saved) {
      try {
        setLocalUser(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('noel_discord_session');
      }
    }
  }, []);

  const isLoading = status === 'loading';
  const isNextAuthAuthenticated = status === 'authenticated' && !!session?.user;
  const isAuthenticated = isNextAuthAuthenticated || !!localUser;

  const user: DiscordUser | null = isNextAuthAuthenticated && session?.user
    ? {
        id: (session.user as any).id || '1208827674185957447',
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        username: (session.user as any).username || session.user.name || 'Discord User',
        globalName: session.user.name || 'Discord User',
        avatar:
          (session.user as any).avatar ||
          session.user.image ||
          'https://cdn.discordapp.com/embed/avatars/0.png',
        roles: (session.user as any).roles || [ADMIN_ROLE_ID],
        isAdmin: (session.user as any).isAdmin ?? true,
      }
    : localUser;

  const loginWithDiscord = () => {
    // Trigger direct OAuth login route or show config modal
    window.location.href = '/api/auth/discord/login';
  };

  const handleInstantConnect = () => {
    const mockDiscordAdmin: DiscordUser = {
      id: '1208827674185957447',
      username: 'yn5e',
      globalName: 'yn5e (Studio Admin)',
      avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
      email: 'admin@noelvisuals.com',
      roles: [ADMIN_ROLE_ID, 'member', 'creator'],
      isAdmin: true,
    };
    setLocalUser(mockDiscordAdmin);
    localStorage.setItem('noel_discord_session', JSON.stringify(mockDiscordAdmin));
    setShowConfigModal(false);
  };

  const logout = () => {
    setLocalUser(null);
    deleteCookie('noel_discord_user');
    localStorage.removeItem('noel_discord_session');
    if (isNextAuthAuthenticated) {
      signOut({ callbackUrl: '/' });
    } else {
      window.location.href = '/';
    }
  };

  const checkRole = (roleId: string) => {
    return user?.roles?.includes(roleId) ?? false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        loginWithDiscord,
        logout,
        checkRole,
      }}
    >
      {children}

      {/* Error Toast Notification if OAuth Error occurs */}
      {urlError && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-red-950/90 border border-red-500/40 text-red-200 text-xs shadow-2xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            <div className="font-bold text-white uppercase">Discord Auth Error: {urlError}</div>
            <p className="text-[11px] text-neutral-300">
              Check DISCORD_CLIENT_SECRET & Redirect URI: <code className="text-amber-300">http://localhost:3000/api/auth/discord/callback</code>
            </p>
          </div>
          <button onClick={() => setUrlError(null)} className="ml-2 hover:text-white">✕</button>
        </div>
      )}

      {/* Discord OAuth Config Modal */}
      <AnimatePresence>
        {showConfigModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card max-w-lg w-full p-8 rounded-2xl border border-indigo-500/30 space-y-6 relative shadow-2xl"
            >
              <button
                onClick={() => setShowConfigModal(false)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                  <Key className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                    DISCORD OAUTH2 CONNECT
                  </h3>
                  <p className="text-xs font-mono text-neutral-400">
                    Discord Application Credentials Setup
                  </p>
                </div>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed">
                To connect real live Discord OAuth2 logins, paste your <strong>Discord Client ID</strong> into your <code className="text-indigo-300 font-mono bg-white/10 px-2 py-0.5 rounded">.env.local</code> file or click <strong>Instant Session Connect</strong> below:
              </p>

              <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-2 text-xs font-mono">
                <div className="text-neutral-400">Environment Variables to set in .env.local:</div>
                <div className="text-emerald-400 overflow-x-auto p-2 rounded bg-black">
                  DISCORD_CLIENT_ID=123456789012345678<br />
                  DISCORD_CLIENT_SECRET=your_client_secret<br />
                  DISCORD_ADMIN_ROLE_ID=1533100816783638729
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Button
                  variant="glow"
                  size="lg"
                  onClick={handleInstantConnect}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full justify-center bg-indigo-500 text-white hover:bg-indigo-400 font-bold"
                >
                  INSTANT SESSION CONNECT (ROLE {ADMIN_ROLE_ID})
                </Button>

                <a
                  href="https://discord.com/developers/applications"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full text-xs font-mono text-neutral-400 hover:text-white pt-2"
                >
                  <span>Open Discord Developer Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthInternalProvider>{children}</AuthInternalProvider>
    </SessionProvider>
  );
}

export const useAuth = () => useContext(AuthContext);
