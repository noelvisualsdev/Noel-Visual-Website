'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Handshake, ExternalLink, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
  description?: string;
  category?: string;
  threadId?: string;
}

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPartners = () => {
    setIsLoading(true);
    setError('');
    fetch('/api/partners')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setPartners(data.data);
        } else {
          setError(data.message || 'Fehler beim Laden');
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { fetchPartners(); }, []);

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Handshake className="w-5 h-5 text-amber-400" />
          <h1 className="text-2xl font-extrabold text-white uppercase tracking-tight">PARTNER</h1>
        </div>
        <button
          onClick={fetchPartners}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 text-xs font-mono transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          AKTUALISIEREN
        </button>
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-3">
        <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs font-mono text-indigo-200 space-y-1">
          <p className="font-bold text-white">Partner werden automatisch aus Discord geladen</p>
          <p>Forum-Channel ID: <code className="text-amber-400">1534150793261748254</code></p>
          <p>Füge Partner direkt in Discord als neuen Forum-Post hinzu — sie erscheinen dann automatisch auf der Website.</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <div className="text-xs font-mono text-red-200">
            <p className="font-bold">Fehler: {error}</p>
            <p className="text-red-300">Stelle sicher dass DISCORD_BOT_TOKEN gesetzt ist und der Bot Zugriff auf den Forum-Channel hat.</p>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-white/5 animate-pulse border border-white/5" />
          ))}
        </div>
      )}

      {/* Partner List */}
      {!isLoading && !error && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white uppercase">
            PARTNER AUS DISCORD ({partners.length})
          </h2>
          {partners.length === 0 ? (
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center text-xs text-neutral-400 font-mono">
              Noch keine Forum-Posts im Discord-Channel. Erstelle einen neuen Post im Forum-Channel <code className="text-amber-400">1534150793261748254</code>.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {partners.map((partner) => (
                <Card key={partner.id} variant="glass" className="p-4 border-white/10 space-y-3">
                  <div className="flex items-center gap-3">
                    {partner.logoUrl ? (
                      <img
                        src={partner.logoUrl}
                        alt={partner.name}
                        className="w-10 h-10 rounded-lg object-contain bg-white/10 p-1"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white font-extrabold uppercase text-sm">
                        {partner.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-white text-sm">{partner.name}</p>
                      <p className="text-[10px] font-mono text-amber-400">Forum Thread ID: {partner.threadId}</p>
                    </div>
                  </div>
                  {partner.description && (
                    <p className="text-xs text-neutral-400 line-clamp-2">{partner.description}</p>
                  )}
                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    {partner.websiteUrl ? (
                      <a
                        href={partner.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-mono text-indigo-400 flex items-center gap-1 hover:text-indigo-300"
                      >
                        <ExternalLink className="w-3 h-3" /> {partner.websiteUrl.slice(0, 30)}...
                      </a>
                    ) : (
                      <span className="text-[10px] text-neutral-600 font-mono">Keine Website</span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
