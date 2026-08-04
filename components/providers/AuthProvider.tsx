'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SessionProvider, useSession, signOut } from 'next-auth/react';
import { X, ExternalLink, Key, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export const ADMIN_ROLE_ID =
  process.env.NEXT_PUBLIC_DISCORD_ADMIN_ROLE_ID || '1533100816783638729';

const OWNER_DISCORD_ID = '1208827674185957447';

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

  const nextAuthUser: DiscordUser | null = isNextAuthAuthenticated && session?.user
    ? {
        id: (session.user as any).id || (session.user as any).sub || `discord-${Date.now()}`,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        username: (session.user as any).username || session.user.name || 'Discord User',
        globalName: session.user.name || 'Discord User',
        avatar:
          (session.user as any).avatar ||
          session.user.image ||
          'https://cdn.discordapp.com/embed/avatars/0.png',
        roles: (session.user as any).roles || [],
        isAdmin: (session.user as any).isAdmin ?? ((session.user as any).id === OWNER_DISCORD_ID),
      }
    : null;

  const user = nextAuthUser || localUser;

  const loginWithDiscord = () => {
    window.location.href = '/api/auth/discord/login';
  };

  const handleInstantConnect = () => {
    const mockDiscordAdmin: DiscordUser = {
      id: OWNER_DISCORD_ID,
      username: 'yn5e',
      globalName: 'yn5e (Studio Admin)',
      avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
      email: 'contact.noelvisuals@gmail.com',
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
              Check DISCORD_CLIENT_SECRET & Redirect URI in Discord Developer Portal
            </p>
          </div>
          <button onClick={() => setUrlError(null)} className="ml-2 hover:text-white">✕</button>
        </div>
      )}
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
