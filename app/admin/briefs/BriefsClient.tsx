'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Mail, Ticket, CheckCircle2, Clock, Loader2 } from 'lucide-react';

interface Brief {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  projectType: string;
  budgetRange?: string;
  timeline?: string;
  message: string;
  status?: string;
  createdAt: string | Date;
  completedAt?: string | Date;
}

interface BriefsClientProps {
  initialBriefs: Brief[];
}

export default function BriefsClient({ initialBriefs }: BriefsClientProps) {
  const [briefs, setBriefs] = useState<Brief[]>(initialBriefs);
  const [closingId, setClosingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const handleMarkDone = async (brief: Brief) => {
    const ticketId = brief._id?.toString() || brief.id || '';
    setClosingId(ticketId);

    try {
      const res = await fetch('/api/admin/tickets/close', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId,
          clientEmail: brief.email,
          clientName: brief.name,
          projectType: brief.projectType,
        }),
      });

      if (res.ok) {
        setBriefs(prev =>
          prev.map(b =>
            (b._id?.toString() || b.id) === ticketId
              ? { ...b, status: 'done', completedAt: new Date().toISOString() }
              : b
          )
        );
        setSuccessId(ticketId);
        setTimeout(() => setSuccessId(null), 4000);
      } else {
        alert('Failed to mark as done. Please try again.');
      }
    } catch (err) {
      alert('An error occurred. Please try again.');
    } finally {
      setClosingId(null);
    }
  };

  const openBriefs = briefs.filter(b => b.status !== 'done');
  const doneBriefs = briefs.filter(b => b.status === 'done');

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white uppercase tracking-tight">
            PROJECT BRIEFS & TICKETS (MONGODB)
          </h1>
          <p className="text-xs font-mono text-neutral-400">
            Review live inbound client briefs & tickets submitted to collection{' '}
            <code className="text-amber-400">noelvisuals.tickets</code> ({briefs.length} total ·{' '}
            <span className="text-emerald-400">{openBriefs.length} open</span> ·{' '}
            <span className="text-neutral-500">{doneBriefs.length} done</span>)
          </p>
        </div>
      </div>

      {briefs.length === 0 ? (
        <div className="p-10 rounded-2xl glass-card border border-white/10 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-neutral-400">
            <Ticket className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white uppercase">NO INBOUND BRIEFS YET</h3>
          <p className="text-xs text-neutral-400 font-mono">
            Collection <code className="text-amber-400">noelvisuals.tickets</code> is empty.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* OPEN TICKETS */}
          {openBriefs.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-amber-400 uppercase tracking-widest font-mono">
                  OPEN ({openBriefs.length})
                </h2>
              </div>
              {openBriefs.map((item) => {
                const ticketId = item._id?.toString() || item.id || '';
                const isClosing = closingId === ticketId;
                const isSuccess = successId === ticketId;
                return (
                  <Card key={ticketId} variant="glass" className="p-6 space-y-4 border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold font-mono text-amber-400">{item.id || ticketId.slice(-6)}</span>
                        <h3 className="text-lg font-bold text-white uppercase">{item.name}</h3>
                        <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300">
                          {item.projectType}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {item.budgetRange && (
                          <span className="text-xs font-mono text-emerald-400 font-bold">{item.budgetRange}</span>
                        )}
                        <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20 font-bold uppercase">
                          {item.status || 'open'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono text-neutral-300">
                      <div>
                        <span className="text-neutral-500 block uppercase text-[10px]">Contact Email</span>
                        <span className="text-white font-bold">{item.email}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block uppercase text-[10px]">Timeline & Created</span>
                        <span className="text-white">{item.timeline || 'Flexible'}</span>
                        <span className="text-neutral-400 block">
                          {new Date(item.createdAt).toLocaleDateString('de-DE')}
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block uppercase text-[10px]">Actions</span>
                        <div className="flex items-center gap-2 pt-1 flex-wrap">
                          <a
                            href={`mailto:${item.email}`}
                            className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
                          >
                            <Mail className="w-3 h-3" /> Reply Client
                          </a>
                          <button
                            onClick={() => handleMarkDone(item)}
                            disabled={isClosing}
                            className="px-3 py-1.5 rounded bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-500/30 transition-colors flex items-center gap-1.5 text-xs font-bold disabled:opacity-50"
                          >
                            {isClosing ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <CheckCircle2 className="w-3 h-3" />
                            )}
                            {isClosing ? 'Sending...' : 'Mark as Done ✓'}
                          </button>
                        </div>
                        {isSuccess && (
                          <p className="text-[10px] text-emerald-400 font-mono mt-1.5">
                            ✅ Done! Confirmation email sent to client.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-black/50 border border-white/5 text-xs text-neutral-300 leading-relaxed">
                      <span className="font-mono text-neutral-500 uppercase block text-[10px] mb-1">
                        Project Scope Brief:
                      </span>
                      "{item.message}"
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* DONE TICKETS */}
          {doneBriefs.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-widest font-mono">
                  COMPLETED ({doneBriefs.length})
                </h2>
              </div>
              {doneBriefs.map((item) => {
                const ticketId = item._id?.toString() || item.id || '';
                return (
                  <Card key={ticketId} variant="glass" className="p-6 space-y-4 border-emerald-500/10 opacity-60">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-bold font-mono text-neutral-500">{item.id || ticketId.slice(-6)}</span>
                        <h3 className="text-base font-bold text-neutral-400 uppercase line-through">{item.name}</h3>
                        <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-white/5 text-neutral-500">
                          {item.projectType}
                        </span>
                      </div>
                      <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                        ✓ Done
                      </span>
                    </div>
                    <div className="text-xs font-mono text-neutral-500">
                      <span className="uppercase text-[10px] block">Client</span>
                      {item.email}
                      {item.completedAt && (
                        <span className="ml-2 text-emerald-600">
                          · Completed {new Date(item.completedAt).toLocaleDateString('de-DE')}
                        </span>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
