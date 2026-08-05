'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2, CheckCircle2, Handshake, ExternalLink } from 'lucide-react';

interface Partner {
  id?: string;
  _id?: string;
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
  description?: string;
  category?: string;
}

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Partner');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchPartners = () => {
    fetch('/api/partners')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) setPartners(data.data);
      });
  };

  useEffect(() => { fetchPartners(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg('');
    try {
      const res = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, logoUrl, websiteUrl, description, category }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Partner hinzugefügt!');
        setName(''); setLogoUrl(''); setWebsiteUrl(''); setDescription('');
        fetchPartners();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Partner wirklich löschen?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/partners?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) setPartners((prev) => prev.filter((p) => (p._id || p.id) !== id));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center gap-2">
        <Handshake className="w-5 h-5 text-amber-400" />
        <h1 className="text-2xl font-extrabold text-white uppercase tracking-tight">PARTNER VERWALTEN</h1>
      </div>

      {/* Add Form */}
      <Card variant="glass" className="p-8 border-amber-500/30 space-y-6">
        <h2 className="text-lg font-bold text-white uppercase flex items-center gap-2">
          <Plus className="w-5 h-5 text-amber-400" /> NEUEN PARTNER HINZUFÜGEN
        </h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-neutral-300 block">Name *</label>
              <input required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 text-white font-bold text-xs"
                placeholder="Partner Name" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-neutral-300 block">Kategorie</label>
              <input value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 text-amber-300 font-mono text-xs"
                placeholder="z.B. Technology, Media, Creative" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-neutral-300 block">Logo URL (optional)</label>
              <input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 text-neutral-300 font-mono text-xs"
                placeholder="https://partner.com/logo.png" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-neutral-300 block">Website URL (optional)</label>
              <input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 text-neutral-300 font-mono text-xs"
                placeholder="https://partner.com" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-neutral-300 block">Beschreibung (optional)</label>
            <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 text-white text-xs resize-none"
              placeholder="Kurze Beschreibung der Partnerschaft..." />
          </div>

          {successMsg && (
            <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 font-mono">
              <CheckCircle2 className="w-4 h-4" /> {successMsg}
            </div>
          )}

          <Button type="submit" variant="glow" size="md" isLoading={isSubmitting}
            className="bg-amber-400 text-black hover:bg-amber-300 font-bold">
            PARTNER HINZUFÜGEN
          </Button>
        </form>
      </Card>

      {/* Partner List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase">ALLE PARTNER ({partners.length})</h2>
        {partners.length === 0 ? (
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center text-xs text-neutral-400 font-mono">
            Noch keine Partner eingetragen.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {partners.map((partner, idx) => {
              const pid = partner._id || partner.id || String(idx);
              return (
                <Card key={pid} variant="glass" className="p-4 border-white/10 space-y-3">
                  <div className="flex items-center gap-3">
                    {partner.logoUrl ? (
                      <img src={partner.logoUrl} alt={partner.name}
                        className="w-10 h-10 rounded-lg object-contain bg-white/10 p-1" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white font-extrabold uppercase">
                        {partner.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-white text-sm">{partner.name}</p>
                      <p className="text-[10px] font-mono text-amber-400">{partner.category}</p>
                    </div>
                  </div>
                  {partner.description && (
                    <p className="text-xs text-neutral-400 line-clamp-2">{partner.description}</p>
                  )}
                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    {partner.websiteUrl ? (
                      <a href={partner.websiteUrl} target="_blank" rel="noopener noreferrer"
                        className="text-[10px] font-mono text-indigo-400 flex items-center gap-1 hover:text-indigo-300">
                        <ExternalLink className="w-3 h-3" /> Website
                      </a>
                    ) : <span />}
                    <button onClick={() => handleDelete(pid)} disabled={deletingId === pid}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white font-bold text-[10px] transition-colors">
                      <Trash2 className="w-3 h-3" />
                      {deletingId === pid ? 'LÖSCHEN...' : 'LÖSCHEN'}
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
