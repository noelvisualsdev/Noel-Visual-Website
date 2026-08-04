'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Database, Plus, CheckCircle2, Trash2, Layers } from 'lucide-react';
import { ServiceDocument } from '@/lib/services-db';

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceDocument[]>([]);
  const [title, setTitle] = useState('New Custom Service');
  const [shortDescription, setShortDescription] = useState('High-quality visual production service.');
  const [fullDescription, setFullDescription] = useState('Detailed breakdown of this new custom service for creators and brands.');
  const [deliverTime, setDeliverTime] = useState('24 - 48 Hours');
  const [iconName, setIconName] = useState('Zap');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchServices = () => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setServices(data.data);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg('');

    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          shortDescription,
          fullDescription,
          deliverTime,
          iconName,
          benefits: ['Priority rendering queue', 'Custom revision rounds', 'Dedicated communication'],
          deliverables: ['High-Res Exports', 'PSD / Source Files'],
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg('New service inserted into MongoDB noelvisuals.services collection!');
        setTitle('');
        setShortDescription('');
        fetchServices();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Möchtest du dieses Service wirklich von der Website & MongoDB löschen?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/services?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setServices((prev) => prev.filter((s) => (s._id || s.id) !== id));
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
            MONGODB SERVICES COLLECTION MANAGER
          </h1>
        </div>
        <p className="text-xs font-mono text-neutral-400">
          Syncing directly with MongoDB Atlas (Database: <code className="text-amber-400">noelvisuals</code> / Collection: <code className="text-amber-400">services</code>)
        </p>
      </div>

      {/* Add New Service Form */}
      <Card variant="glass" className="p-8 border-amber-500/30 space-y-6">
        <h2 className="text-lg font-bold text-white uppercase flex items-center gap-2">
          <Plus className="w-5 h-5 text-amber-400" /> ADD MONGODB SERVICE ({`{ title, shortDescription, deliverTime, iconName }`})
        </h2>

        <form onSubmit={handleAddService} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-neutral-300 block">Service Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 text-white font-bold text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-neutral-300 block">Deliver Time (SLA)</label>
              <input
                type="text"
                required
                value={deliverTime}
                onChange={(e) => setDeliverTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 text-amber-300 font-mono text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-neutral-300 block">Icon Name</label>
              <input
                type="text"
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 text-neutral-300 font-mono text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-neutral-300 block">Short Description *</label>
            <input
              type="text"
              required
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 text-white text-xs font-sans"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-neutral-300 block">Full Description</label>
            <textarea
              rows={2}
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 text-white text-xs resize-none font-sans"
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
            INSERT SERVICE INTO MONGODB
          </Button>
        </form>
      </Card>

      {/* Live Services List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase">
          DOCUMENTS IN COLLECTION noelvisuals.services ({services.length})
        </h2>

        {services.length === 0 ? (
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center text-xs text-neutral-400 font-mono">
            No documents in MongoDB <code className="text-amber-400">noelvisuals.services</code> yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((serv, idx) => {
              const servId = serv._id || serv.id || String(idx);
              return (
                <Card key={servId} variant="glass" className="p-5 space-y-3 border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white uppercase text-sm">{serv.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
                      {serv.deliverTime}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">{serv.shortDescription}</p>

                  <div className="text-[10px] font-mono text-neutral-400 border-t border-white/5 pt-3 flex items-center justify-between">
                    <span>slug: {serv.slug}</span>
                    <button
                      onClick={() => handleDeleteService(servId)}
                      disabled={deletingId === servId}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white font-bold text-xs transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{deletingId === servId ? 'LÖSCHEN...' : 'LÖSCHEN'}</span>
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
