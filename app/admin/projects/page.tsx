'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, CheckCircle2, Database, Trash2 } from 'lucide-react';
import { ProjectDocument } from '@/lib/projects-db';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectDocument[]>([]);
  const [type, setType] = useState('work');
  const [clientId, setClientId] = useState('865289707328110662');
  const [title, setTitle] = useState('Discord Logos');
  const [description, setDescription] = useState(
    'Du möchtest deinem Discord-Server einen professionellen und einzigartigen Look verpassen? Wir kreieren dein individuelles Discord-Logo!'
  );
  const [imageUrl, setImageUrl] = useState('/images/featured_edit_brand_identity.jpg');
  const [videoUrl, setVideoUrl] = useState('');
  const [channelId, setChannelId] = useState('1533120649856417924');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchProjects = () => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setProjects(data.data);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg('');

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          clientId,
          title,
          description,
          images: [imageUrl],
          videoUrl,
          channelId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg('New project document inserted into MongoDB noelvisuals.projects collection!');
        setTitle('');
        setDescription('');
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Möchtest du dieses Projekt wirklich von der Website & MongoDB löschen?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) => prev.filter((p) => (p._id || p.id) !== id));
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
            MONGODB PROJECTS COLLECTION MANAGER
          </h1>
        </div>
        <p className="text-xs font-mono text-neutral-400">
          Syncing directly with MongoDB Atlas (Database: <code className="text-amber-400">noelvisuals</code> / Collection: <code className="text-amber-400">projects</code>)
        </p>
      </div>

      {/* Add New Project Document Form */}
      <Card variant="glass" className="p-8 border-amber-500/30 space-y-6">
        <h2 className="text-lg font-bold text-white uppercase flex items-center gap-2">
          <Plus className="w-5 h-5 text-amber-400" /> ADD MONGODB PROJECT ({`{ type, clientId, title, description, images, channelId }`})
        </h2>

        <form onSubmit={handleAddProject} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-neutral-300 block">Project Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 text-white font-bold text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-neutral-300 block">type (e.g. work, Editing)</label>
              <input
                type="text"
                required
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 text-amber-300 font-mono text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-neutral-300 block">clientId</label>
              <input
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 text-neutral-300 font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-neutral-300 block">Image URL (Vorschaubild)</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 text-neutral-300 font-mono text-xs"
                placeholder="/images/... oder https://..."
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-neutral-300 block">🎬 Video URL (direkt, kein YouTube)</label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-amber-500/30 text-amber-300 font-mono text-xs"
                placeholder="https://cdn.example.com/video.mp4"
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
            INSERT PROJECT INTO MONGODB
          </Button>
        </form>
      </Card>

      {/* Live MongoDB Projects */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase">
          DOCUMENTS IN COLLECTION noelvisuals.projects ({projects.length})
        </h2>

        {projects.length === 0 ? (
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center text-xs text-neutral-400 font-mono">
            No documents in MongoDB <code className="text-amber-400">noelvisuals.projects</code> yet. Fill out the form above to add your first project!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj, idx) => {
              const projId = proj._id || proj.id || String(idx);
              return (
                <Card key={projId} variant="glass" className="p-5 space-y-3 border-white/10 relative">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white uppercase text-sm">{proj.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
                      type: {proj.type}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">{proj.description}</p>
                  
                  <div className="text-[10px] font-mono text-neutral-400 border-t border-white/5 pt-3 flex items-center justify-between">
                    <span>clientId: {proj.clientId}</span>
                    <button
                      onClick={() => handleDeleteProject(projId)}
                      disabled={deletingId === projId}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white font-bold text-xs transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{deletingId === projId ? 'LÖSCHEN...' : 'LÖSCHEN'}</span>
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
