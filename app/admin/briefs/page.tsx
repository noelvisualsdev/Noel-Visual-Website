import React from 'react';
import { Card } from '@/components/ui/Card';
import { getBriefs } from '@/lib/db';
import { Mail, Ticket } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminBriefsPage() {
  const briefs = await getBriefs();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white uppercase tracking-tight">
            PROJECT BRIEFS & TICKETS (MONGODB)
          </h1>
          <p className="text-xs font-mono text-neutral-400">
            Review live inbound client briefs & tickets submitted to collection <code className="text-amber-400">noelvisuals.tickets</code> ({briefs.length} total)
          </p>
        </div>
      </div>

      {briefs.length === 0 ? (
        <div className="p-10 rounded-2xl glass-card border border-white/10 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-neutral-400">
            <Ticket className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white uppercase">
            NO INBOUND BRIEFS YET
          </h3>
          <p className="text-xs text-neutral-400 font-mono">
            Collection <code className="text-amber-400">noelvisuals.tickets</code> is empty. Submissions from the contact form will appear here live!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {briefs.map((item) => (
            <Card key={item.id || item._id} variant="glass" className="p-6 space-y-4 border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold font-mono text-amber-400">{item.id}</span>
                  <h3 className="text-lg font-bold text-white uppercase">{item.name}</h3>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300">
                    {item.projectType}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-emerald-400 font-bold">{item.budgetRange}</span>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20 font-bold">
                    {item.status}
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
                  <span className="text-white">{item.timeline}</span>
                  <span className="text-neutral-400 block">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block uppercase text-[10px]">Actions</span>
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={`mailto:${item.email}`}
                      className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1"
                    >
                      <Mail className="w-3 h-3" /> Reply Client
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-black/50 border border-white/5 text-xs text-neutral-300 leading-relaxed">
                <span className="font-mono text-neutral-500 uppercase block text-[10px] mb-1">
                  Project Scope Brief:
                </span>
                "{item.message}"
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
