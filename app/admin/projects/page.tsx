'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, CheckCircle2, Database, Trash2, Edit, X, Image as ImageIcon, Film, Upload, HardDrive } from 'lucide-react';
import { ProjectDocument } from '@/lib/projects-db';

const STUDIO_PRESET_IMAGES = [
  { label: 'City Nights (Editing)', url: '/images/featured_edit_city_nights.jpg' },
  { label: 'Neon Cyber (Gaming)', url: '/images/featured_edit_neon_cyber.jpg' },
  { label: 'Thumbnail Art', url: '/images/featured_edit_thumbnail_art.jpg' },
  { label: 'Brand Identity', url: '/images/featured_edit_brand_identity.jpg' },
  { label: 'Banner Showcase', url: '/images/og-image.png' },
];

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectDocument[]>([]);
  const [type, setType] = useState('work');
  const [clientId, setClientId] = useState('865289707328110662');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('/images/featured_edit_brand_identity.jpg');
  const [videoUrl, setVideoUrl] = useState('');
  const [channelId, setChannelId] = useState('1533120649856417924');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Edit Modal State
  const [editingProject, setEditingProject] = useState<ProjectDocument | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editType, setEditType] = useState('work');
  const [editDescription, setEditDescription] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editVideoUrl, setEditVideoUrl] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

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

  const handleFileUpload = async (file: File, targetSetter: (url: string) => void) => {
    setIsUploading(true);
    setSuccessMsg('');
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        targetSetter(data.url);
        setSuccessMsg(`Datei "${file.name}" wurde dauerhaft unter ${data.url} auf dem Server gespeichert!`);
      } else {
        alert(data.message || 'Upload fehlgeschlagen');
      }
    } catch (err) {
      console.error(err);
      alert('Upload-Fehler');
    } finally {
      setIsUploading(false);
    }
  };

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
        setSuccessMsg('Neues Projekt erfolgreich in MongoDB gespeichert & Medien gesichert!');
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

  const openEditModal = (proj: ProjectDocument) => {
    setEditingProject(proj);
    setEditTitle(proj.title || '');
    setEditType(proj.type || 'work');
    setEditDescription(proj.description || '');
    setEditImage(proj.image || proj.images?.[0] || '');
    setEditVideoUrl(proj.videoUrl || '');
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setIsUpdating(true);

    try {
      const res = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingProject._id || editingProject.id,
          title: editTitle,
          type: editType,
          description: editDescription,
          image: editImage,
          images: [editImage],
          videoUrl: editVideoUrl,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Projekt "${editTitle}" erfolgreich auf dem Server gesichert!`);
        setEditingProject(null);
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
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
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Database className="w-7 h-7 text-amber-400" />
            Project & Storage Management
          </h1>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            Projekte verwalten & Bilder/Videos dauerhaft im Server-Ordner <code className="text-amber-400">/public/uploads/projects/</code> speichern
          </p>
        </div>
      </div>

      {/* Storage Folder Info Banner */}
      <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-3 font-mono shadow-xl">
        <HardDrive className="w-5 h-5 text-amber-400 shrink-0" />
        <div>
          <span className="font-bold block uppercase text-amber-200">Dauerhafte Server-Speicherung Aktiv</span>
          <span className="text-neutral-300 text-[11px]">
            Alle hochgeladenen oder neu eingefügten Medien-Dateien werden automatisch im Server-Ordner <code className="text-amber-300 font-bold">public/uploads/projects/</code> abgelegt. Sie bleiben dadurch für immer online!
          </span>
        </div>
      </div>

      {/* Insert New Project Form */}
      <Card variant="glass" className="p-6 space-y-6 border-white/10">
        <h2 className="text-lg font-bold text-white uppercase flex items-center gap-2">
          <Plus className="w-5 h-5 text-amber-400" />
          Neues Projekt zur Website Hinzufügen
        </h2>

        <form onSubmit={handleAddProject} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-neutral-300 block">Kategorie / Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 text-white font-mono text-xs"
              >
                <option value="work">work (General)</option>
                <option value="Editing">Editing (Video)</option>
                <option value="Thumbnails">Thumbnails (3D)</option>
                <option value="Graphic Design">Graphic Design</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Bot">Bot (Discord)</option>
              </select>
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-mono uppercase text-neutral-300 block">Projekt Titel *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 text-white font-mono text-xs"
                placeholder="z.B. YouTube Video Edit oder Custom Thumbnail"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-neutral-300 block">Bild-URL oder Datei hochladen</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 text-neutral-300 font-mono text-xs"
                placeholder="/images/... oder https://... oder Upload nutzen"
              />
              
              {/* Direct File Upload Button */}
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-400/10 text-amber-300 border border-amber-400/30 hover:bg-amber-400/20 text-xs font-mono font-bold cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? 'WIRD HOCHGELADEN...' : '📁 BILD/VIDEO VOM PC HOCHLADEN'}</span>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFileUpload(f, setImageUrl);
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-neutral-300 block">🎬 Video URL (mp4/webm)</label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-amber-500/30 text-amber-300 font-mono text-xs"
                placeholder="https://.../video.mp4 oder Upload nutzen"
              />

              {/* Direct Video File Upload Button */}
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 text-xs font-mono font-bold cursor-pointer transition-colors">
                  <Film className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isUploading ? 'WIRD HOCHGELADEN...' : '🎬 VIDEO-DATEI VOM PC HOCHLADEN'}</span>
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFileUpload(f, setVideoUrl);
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-neutral-300 block">Beschreibung *</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 text-white text-xs resize-none font-sans"
              placeholder="Kurze Projektbeschreibung eingeben..."
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
            PROJEKT IN MONGODB & SERVER-ORDNER SPEICHERN
          </Button>
        </form>
      </Card>

      {/* Live MongoDB Projects Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase">
          LIVE PROJEKTE IN DER DATENBANK ({projects.length})
        </h2>

        {projects.length === 0 ? (
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center text-xs text-neutral-400 font-mono">
            Keine Projekte in der Datenbank. Füge oben dein erstes Projekt hinzu!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj, idx) => {
              const projId = proj._id || proj.id || String(idx);
              const previewImg = proj.image || proj.images?.[0] || '/images/featured_edit_city_nights.jpg';

              return (
                <Card key={projId} variant="glass" className="p-5 space-y-4 border-white/10 relative overflow-hidden flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-black border border-white/15 shrink-0 relative">
                          <img src={previewImg} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white uppercase text-sm">{proj.title}</h3>
                          <span className="text-[10px] font-mono text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 uppercase">
                            {proj.type}
                          </span>
                        </div>
                      </div>

                      {/* Edit Button */}
                      <button
                        onClick={() => openEditModal(proj)}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1 text-xs font-mono border border-white/20 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5 text-amber-400" />
                        <span>BEARBEITEN</span>
                      </button>
                    </div>

                    <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">{proj.description}</p>
                    
                    {proj.videoUrl && (
                      <div className="text-[10px] font-mono text-amber-400 bg-amber-950/40 p-2 rounded border border-amber-500/20 truncate flex items-center gap-1.5">
                        <Film className="w-3 h-3 shrink-0" />
                        <span className="truncate">{proj.videoUrl}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-[10px] font-mono text-neutral-400 border-t border-white/5 pt-3 flex items-center justify-between">
                    <span className="truncate max-w-[220px]">Pfad: {previewImg}</span>
                    <button
                      onClick={() => handleDeleteProject(projId)}
                      disabled={deletingId === projId}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white font-bold text-xs transition-colors cursor-pointer"
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

      {/* EDIT PROJECT MODAL */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0e0e12] border border-white/20 rounded-2xl p-6 md:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white uppercase flex items-center gap-2">
                <Edit className="w-5 h-5 text-amber-400" />
                Projekt & Bild Bearbeiten
              </h3>
              <button
                onClick={() => setEditingProject(null)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProject} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-neutral-300 block">Kategorie / Type</label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 text-white font-mono text-xs"
                  >
                    <option value="work">work (General)</option>
                    <option value="Editing">Editing (Video)</option>
                    <option value="Thumbnails">Thumbnails (3D)</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Bot">Bot (Discord)</option>
                  </select>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-mono uppercase text-neutral-300 block">Titel *</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 text-white font-mono text-xs"
                  />
                </div>
              </div>

              {/* Image Input, File Upload & Studio Presets */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-neutral-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <span>Neues Bild hochladen oder Pfad wählen</span>
                  </span>
                </label>
                <input
                  type="text"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 text-white font-mono text-xs"
                  placeholder="https://... oder /images/... oder /uploads/..."
                />
                
                {/* Upload Button in Modal */}
                <div className="flex items-center gap-2 pt-1">
                  <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-400/10 text-amber-300 border border-amber-400/30 hover:bg-amber-400/20 text-xs font-mono font-bold cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? 'WIRD HOCHGELADEN...' : '📁 NEUES BILD VOM PC HOCHLADEN'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFileUpload(f, setEditImage);
                      }}
                    />
                  </label>
                </div>

                {/* Presets */}
                <div className="space-y-1 pt-2">
                  <span className="text-[10px] font-mono text-neutral-400 block">Oder Studio-Vorlage wählen:</span>
                  <div className="flex flex-wrap gap-2">
                    {STUDIO_PRESET_IMAGES.map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setEditImage(preset.url)}
                        className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/15 text-[10px] font-mono text-neutral-300 border border-white/10 transition-colors"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Video URL Input & Video Upload */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-neutral-300 flex items-center gap-1.5">
                  <Film className="w-4 h-4 text-amber-400" />
                  <span>🎬 Video-Datei hochladen oder URL angeben</span>
                </label>
                <input
                  type="text"
                  value={editVideoUrl}
                  onChange={(e) => setEditVideoUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-amber-500/30 text-amber-300 font-mono text-xs"
                  placeholder="https://.../video.mp4 oder Upload nutzen"
                />

                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 text-xs font-mono font-bold cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isUploading ? 'WIRD HOCHGELADEN...' : '🎬 NEUES VIDEO VOM PC HOCHLADEN'}</span>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFileUpload(f, setEditVideoUrl);
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-neutral-300 block">Beschreibung *</label>
                <textarea
                  rows={3}
                  required
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 text-white text-xs resize-none font-sans"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <Button type="button" variant="ghost" size="sm" onClick={() => setEditingProject(null)}>
                  Abbrechen
                </Button>
                <Button
                  type="submit"
                  variant="glow"
                  size="sm"
                  isLoading={isUpdating}
                  className="bg-amber-400 text-black font-extrabold hover:bg-amber-300"
                >
                  SPEICHERN & PERMANENT SICHERN
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
