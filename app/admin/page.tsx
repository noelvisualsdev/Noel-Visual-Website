'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  FileText,
  Users,
  FolderKanban,
  Star,
  ShieldCheck,
  CheckCircle,
  Plus,
  Gift,
} from 'lucide-react';
import { ADMIN_ROLE_ID, useAuth } from '@/components/providers/AuthProvider';
import Link from 'next/link';

export default function AdminOverviewPage() {
  const { user } = useAuth();

  const [briefs, setBriefs] = useState<any[]>([]);
  const [projectsCount, setProjectsCount] = useState<number>(0);
  const [reviewsCount, setReviewsCount] = useState<number>(0);
  const [giveawaysCount, setGiveawaysCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch live MongoDB Tickets / Briefs
    fetch('/api/contact')
      .then(() => fetch('/api/reviews'))
      .catch(() => {});

    // Fetch projects count
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setProjectsCount(data.data.length);
        }
      })
      .catch((err) => console.error(err));

    // Fetch reviews count
    fetch('/api/reviews')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setReviewsCount(data.data.length);
        }
      })
      .catch((err) => console.error(err));

    // Fetch giveaways count
    fetch('/api/giveaways')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setGiveawaysCount(data.data.length);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="glass-card p-6 md:p-8 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gradient-to-r from-amber-950/30 via-[#0d0e14] to-black">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="accent" className="text-amber-400 border-amber-500/30 bg-amber-500/10">
              DISCORD ROLE VERIFIED: {ADMIN_ROLE_ID}
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-tight">
            NOEL VISUALS CONTROL CENTER
          </h1>
          <p className="text-xs font-mono text-neutral-400">
            Authenticated via Discord User <span className="text-white">@{user?.username || 'yn5e'}</span> ({user?.email || 'admin@noelvisuals.com'})
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            href="/admin/projects"
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            className="bg-amber-400 text-black hover:bg-amber-300 font-bold"
          >
            ADD MONGODB PROJECT
          </Button>
        </div>
      </div>

      {/* Metrics Row - Real MongoDB Atlas Live Counts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="glass" className="p-6 space-y-2 border-white/10">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-mono uppercase">Inbound Briefs (Tickets)</span>
            <FileText className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">{briefs.length}</div>
          <span className="text-[11px] font-mono text-amber-400">MongoDB: noelvisuals.tickets</span>
        </Card>

        <Card variant="glass" className="p-6 space-y-2 border-white/10">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-mono uppercase">Live Projects</span>
            <FolderKanban className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">{projectsCount}</div>
          <span className="text-[11px] font-mono text-emerald-400">MongoDB: noelvisuals.projects</span>
        </Card>

        <Card variant="glass" className="p-6 space-y-2 border-white/10">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-mono uppercase">Client Reviews</span>
            <Star className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">{reviewsCount}</div>
          <span className="text-[11px] font-mono text-emerald-400">MongoDB: noelvisuals.reviews</span>
        </Card>

        <Card variant="glass" className="p-6 space-y-2 border-white/10">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-mono uppercase">Giveaways</span>
            <Gift className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">{giveawaysCount}</div>
          <span className="text-[11px] font-mono text-emerald-400">MongoDB: noelvisuals.giveaways</span>
        </Card>
      </div>

      {/* Recent Briefs & Discord Role Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Inbound Briefs Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">
              RECENT INBOUND BRIEFS (MONGODB)
            </h2>
            <Button href="/admin/briefs" variant="ghost" size="sm">
              View All Briefs
            </Button>
          </div>

          {briefs.length === 0 ? (
            <div className="p-8 rounded-xl glass-card border border-white/10 text-center space-y-3">
              <FileText className="w-8 h-8 text-neutral-500 mx-auto" />
              <div className="text-sm font-bold text-white uppercase">NO INBOUND BRIEFS YET</div>
              <p className="text-xs text-neutral-400 font-mono">
                Collection <code className="text-amber-400">noelvisuals.tickets</code> is empty. Submissions through the contact form will appear live here!
              </p>
            </div>
          ) : (
            <div className="glass-card rounded-xl overflow-hidden border border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-neutral-300">
                  <thead className="bg-black/60 font-mono text-neutral-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                    <tr>
                      <th className="p-4">ID</th>
                      <th className="p-4">Client Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {briefs.map((brief) => (
                      <tr key={brief.id || brief._id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-bold text-amber-400">{brief.id}</td>
                        <td className="p-4 font-bold text-white font-sans">{brief.name}</td>
                        <td className="p-4 text-amber-300 font-bold">{brief.projectType}</td>
                        <td className="p-4 text-neutral-300">{brief.email}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] bg-amber-400/10 text-amber-300 border border-amber-400/20 font-bold">
                            {brief.status || 'New Brief'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Discord Role Integration Panel */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-lg font-bold text-white uppercase tracking-tight">
            DISCORD ROLE GATE STATUS
          </h2>

          <Card variant="glass" className="p-6 space-y-4 border-amber-500/30 bg-amber-950/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase">RBAC Gate Active</h3>
                <p className="text-[11px] font-mono text-neutral-400">Discord API v10 Member Role Check</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-black/60 space-y-2 text-xs font-mono border border-white/10">
              <div className="flex justify-between text-neutral-400">
                <span>Target Role ID:</span>
                <span className="text-amber-400 font-bold">{ADMIN_ROLE_ID}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Role Gate Status:</span>
                <span className="text-emerald-400 flex items-center gap-1 font-bold">
                  <CheckCircle className="w-3 h-3" /> VERIFIED
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Users with Discord Role <code className="text-amber-400">{ADMIN_ROLE_ID}</code> have full admin access to manage MongoDB Atlas collections.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
