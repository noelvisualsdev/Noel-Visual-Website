'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, Server, Key, CheckCircle2, Save, RefreshCw } from 'lucide-react';
import { ADMIN_ROLE_ID } from '@/components/providers/AuthProvider';

export default function AdminDiscordSettingsPage() {
  const [roleId, setRoleId] = useState(ADMIN_ROLE_ID);
  const [savedStatus, setSavedStatus] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-white uppercase tracking-tight">
          DISCORD ROLE & BOT CONFIGURATION
        </h1>
        <p className="text-xs font-mono text-neutral-400">
          Configure Role-Based Access Control (RBAC) settings for studio staff & admins
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card variant="glass" className="p-8 space-y-6 border-amber-500/30">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="w-10 h-10 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase">Required Admin Role ID</h3>
              <p className="text-xs text-neutral-400 font-mono">
                Only users possessing this role ID in your Discord server can access /admin
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="roleId" className="text-xs font-mono uppercase text-neutral-300 block">
                Target Discord Role ID <span className="text-amber-400">*</span>
              </label>
              <input
                id="roleId"
                type="text"
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/60 border border-amber-400/40 text-amber-300 font-mono text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
              <p className="text-[11px] font-mono text-neutral-400">
                Current active role: <code className="text-amber-400 font-bold">{ADMIN_ROLE_ID}</code>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-neutral-300 block">
                  Discord Guild (Server) ID
                </label>
                <input
                  type="text"
                  defaultValue="1098234918234"
                  className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-neutral-300 block">
                  Bot Token (For Guild Member Checks)
                </label>
                <input
                  type="password"
                  defaultValue="MTI5Mzg0NzE5Mjg0NzE5MjM4NA.G9x..."
                  className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-white/10 text-neutral-400 font-mono text-xs focus:outline-none focus:border-white/30"
                />
              </div>
            </div>
          </div>

          {savedStatus && (
            <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 font-mono">
              <CheckCircle2 className="w-4 h-4" />
              <span>Discord Role ID configuration updated successfully!</span>
            </div>
          )}

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <Button
              type="submit"
              variant="glow"
              size="md"
              leftIcon={<Save className="w-4 h-4" />}
              className="bg-amber-400 text-black hover:bg-amber-300 font-bold"
            >
              SAVE CONFIGURATION
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
