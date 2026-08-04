'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Gift, Plus, CheckCircle2, Database, Trash2 } from 'lucide-react';
import { GiveawayDocument } from '@/lib/giveaways-db';

export default function AdminGiveawaysPage() {
  const [giveaways, setGiveaways] = useState<GiveawayDocument[]>([]);
  const [title, setTitle] = useState('STUDIO COMMUNITY GIVEAWAY');
  const [prize, setPrize] = useState('FREE 4K VIDEO EDIT + THUMBNAIL PACKAGE');
  const [description, setDescription] = useState('Enter to win a complete professional video edit and custom 3D thumbnail suite for your YouTube channel or brand!');
  const [bannerImage, setBannerImage] = useState('/images/featured_edit_city_nights.jpg');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchGiveaways = () => {
    fetch('/api/giveaways')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setGiveaways(data.data);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchGiveaways();
  }, []);

  const handleAddGiveaway = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg('');

    try {
      const res = await fetch('/api/giveaways', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          prize,
          description,
          bannerImage,
          status: 'active',
          endDate: endDate ? new Date(endDate).toISOString() : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg('New giveaway document inserted into MongoDB noelvisuals.giveaways collection!');
        setTitle('');
        setPrize('');
        fetchGiveaways();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGiveaway = async (id: string) => {
    if (!confirm('Möchtest du dieses Giveaway wirklich von der Website & MongoDB löschen?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/giveaways?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setGiveaways((prev) => prev.filter((g) => (g._id || g.id) !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-amber-400" />
          <h1 className="text-2xl font-extrabold text-white uppercase tracking-tight">
            MONGODB GIVEAWAYS MANAGER
          </h1>
        </div>
        <p className="text-xs font-mono text-neutral-400">
          Syncing directly with MongoDB Atlas (Database: <code className="text-amber-400">noelvisuals</code> / Collection: <code className="text-amber-400">giveaways</code>)
        </p>
      </div>

      {/* Add New Giveaway */}
      <Card variant="glass" className="p-8 border-amber-500/30 space-y-6">
        <h2 className="text-lg font-bold text-white uppercase flex items-center gap-2">
          <Plus className="w-5 h-5 text-amber-400" /> ADD MONGODB GIVEAWAY ({`{ title, prize, description, bannerImage, endDate }`})
        </h2>

        <form onSubmit={handleAddGiveaway} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-neutral-300 block">Giveaway Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 text-white font-bold text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-neutral-300 block">Prize Description *</label>
              <input
                type="text"
                required
                value={prize}
                onChange={(e) => setPrize(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 text-amber-300 font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-neutral-300 block">Banner Image URL</label>
              <input
                type="text"
                value={bannerImage}
                onChange={(e) => setBannerImage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 text-neutral-300 font-mono text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-neutral-300 block">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 text-white font-mono text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-neutral-300 block">Description *</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 text-white text-xs resize-none"
            />
          </div>

          {successMsg && (
            <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 font-mono">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          )}

          <Button
            type="submit"
            variant="glow"
            size="md"
            isLoading={isSubmitting}
            className="bg-amber-400 text-black hover:bg-amber-300 font-bold"
          >
            INSERT GIVEAWAY INTO MONGODB
          </Button>
        </form>
      </Card>

      {/* Live MongoDB Giveaways List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase">
          DOCUMENTS IN COLLECTION noelvisuals.giveaways ({giveaways.length})
        </h2>

        {giveaways.length === 0 ? (
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center text-xs text-neutral-400 font-mono">
            No documents in MongoDB <code className="text-amber-400">noelvisuals.giveaways</code> yet. Fill out the form above to add your first giveaway!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {giveaways.map((g, idx) => {
              const gId = g._id || g.id || String(idx);
              return (
                <Card key={gId} variant="glass" className="p-5 space-y-3 border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white uppercase text-sm">{g.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 uppercase">
                      {g.status}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-amber-300 font-bold">Prize: {g.prize}</div>
                  <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">{g.description}</p>
                  
                  <div className="text-[10px] font-mono text-neutral-400 border-t border-white/5 pt-3 flex items-center justify-between">
                    <span>Entries: {g.participantsCount || 0}</span>
                    <button
                      onClick={() => handleDeleteGiveaway(gId)}
                      disabled={deletingId === gId}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white font-bold text-xs transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{deletingId === gId ? 'LÖSCHEN...' : 'LÖSCHEN'}</span>
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
