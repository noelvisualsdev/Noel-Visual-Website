'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Plus, CheckCircle2, Trash2, Edit, X, Image as ImageIcon, Film, Upload, Paperclip, Loader2, Sparkles } from 'lucide-react';
import { ProjectDocument } from '@/lib/projects-db';

const STUDIO_PRESET_IMAGES = [
  { label: 'City Nights (Editing)', url: '/images/featured_edit_city_nights.jpg' },
  { label: 'Neon Cyber (Gaming)', url: '/images/featured_edit_neon_cyber.jpg' },
  { label: 'Thumbnail Art (3D)', url: '/images/featured_edit_thumbnail_art.jpg' },
  { label: 'Brand Identity', url: '/images/featured_edit_brand_identity.jpg' },
  { label: 'Banner Showcase', url: '/images/og-image.png' },
];

const fallbackImage = '/images/featured_edit_city_nights.jpg';

const normalizeUrl = (url?: string) => {
  if (!url) return fallbackImage;
  let u = url.trim();
  if (u.startsWith('data:')) return u;
  if (u.includes('cdn.discordapp.com/attachments/') || u.includes('media.discordapp.net/attachments/')) {
    return fallbackImage;
  }
  if (!u.startsWith('http://') && !u.startsWith('https://') && !u.startsWith('/')) {
    return '/' + u;
  }
  return u;
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectDocument[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // NEW PROJECT MODAL STATE
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('Editing');
  const [newDescDe, setNewDescDe] = useState('');
  const [newDescEn, setNewDescEn] = useState('');
  const [attachedMedia, setAttachedMedia] = useState<string[]>([]);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [isUploadingMultiple, setIsUploadingMultiple] = useState(false);

  // EDIT MODAL STATE
  const [editingProject, setEditingProject] = useState<ProjectDocument | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editType, setEditType] = useState('work');
  const [editDescription, setEditDescription] = useState('');
  const [editImages, setEditImages] = useState<string[]>([]);
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

  // Multi-file upload for New Project / Edit Project (Instant Base64 preview + Server Upload)
  const handleMultiFileUpload = async (files: FileList, targetSetter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setIsUploadingMultiple(true);
    const newMediaItems: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // 1. Try uploading to server API
      let serverUrl = '';
      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (data.success && data.url) {
          serverUrl = normalizeUrl(data.url);
        }
      } catch (err) {
        console.warn('[Upload] API upload warning, using Base64 fallback:', err);
      }

      if (serverUrl) {
        newMediaItems.push(serverUrl);
      } else {
        // 2. Read as Base64 for 100% guaranteed instant preview
        try {
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          if (base64) {
            newMediaItems.push(base64);
          }
        } catch (e) {
          console.error('[Upload] Base64 reader error:', e);
        }
      }
    }

    targetSetter((prev) => [...prev, ...newMediaItems]);
    setIsUploadingMultiple(false);
  };

  const removeAttachedItem = (index: number, targetSetter: React.Dispatch<React.SetStateAction<string[]>>) => {
    targetSetter((prev) => prev.filter((_, i) => i !== index));
  };

  // Helper to ensure any Base64 preview strings are converted to short server URLs before submitting form
  const ensureUploadedUrls = async (urls: string[]): Promise<string[]> => {
    const processed: string[] = [];
    for (const url of urls) {
      if (url && url.startsWith('data:')) {
        try {
          const res = await fetch('/api/admin/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ base64: url }),
          });
          const data = await res.json();
          if (data.success && data.url) {
            processed.push(normalizeUrl(data.url));
            continue;
          }
        } catch (err) {
          console.error('Base64 pre-upload error:', err);
        }
      }
      processed.push(normalizeUrl(url));
    }
    return processed;
  };

  // Submit New Project Form
  const handleCreateProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescDe.trim()) return;

    setIsSubmitting(true);
    setSuccessMsg('');

    let fullDescription = newDescDe.trim();
    if (newDescEn.trim()) {
      fullDescription = `${newDescDe.trim()}\n\n[EN]: ${newDescEn.trim()}`;
    }

    try {
      const rawImages = attachedMedia.length > 0 ? attachedMedia : [fallbackImage];
      const finalImages = await ensureUploadedUrls(rawImages);
      const finalVideoUrl = newVideoUrl.trim() ? (await ensureUploadedUrls([newVideoUrl.trim()]))[0] : '';

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          type: newType,
          description: fullDescription,
          images: finalImages,
          videoUrl: finalVideoUrl,
          clientId: '865289707328110662',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Neues Projekt "${newTitle}" mit ${finalImages.length} Medien auf dem Server veröffentlicht!`);
        setIsNewModalOpen(false);
        setNewTitle('');
        setNewDescDe('');
        setNewDescEn('');
        setAttachedMedia([]);
        setNewVideoUrl('');
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit Project Handler
  const openEditModal = (proj: ProjectDocument) => {
    setEditingProject(proj);
    setEditTitle(proj.title || '');
    setEditType(proj.type || 'work');
    setEditDescription(proj.description || '');
    setEditImages(proj.images && proj.images.length > 0 ? proj.images.map(normalizeUrl) : [normalizeUrl(proj.image)]);
    setEditVideoUrl(proj.videoUrl ? normalizeUrl(proj.videoUrl) : '');
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setIsUpdating(true);

    try {
      const rawImages = editImages.length > 0 ? editImages : [fallbackImage];
      const finalImages = await ensureUploadedUrls(rawImages);
      const finalVideoUrl = editVideoUrl ? (await ensureUploadedUrls([editVideoUrl]))[0] : '';

      const res = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingProject._id || editingProject.id,
          title: editTitle,
          type: editType,
          description: editDescription,
          images: finalImages,
          videoUrl: finalVideoUrl,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Projekt "${editTitle}" erfolgreich aktualisiert!`);
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
        setSuccessMsg('Projekt erfolgreich gelöscht!');
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header Bar matching Reference UI */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-wider font-orbitron">
            PROJEKTE & MEDIEN VERWALTEN
          </h1>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            MongoDB Collection: <code className="text-white bg-white/10 px-2 py-0.5 rounded">noelvisuals.projects</code>
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="px-6 py-3.5 rounded-xl bg-[#5865f2] hover:bg-[#4752c4] text-white font-extrabold text-xs uppercase tracking-wider font-orbitron shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ NEUES PROJEKT ERSTELLEN</span>
        </button>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Existing Projects List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-300 font-orbitron">
            GESPEICHERTE PROJEKTE ({projects.length})
          </h2>
        </div>

        {projects.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center space-y-3">
            <p className="text-sm text-neutral-400 font-mono">Keine Projekte in der Datenbank vorhanden.</p>
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#5865f2] text-white text-xs font-bold"
            >
              Erstes Projekt Erstellen
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj, idx) => {
              const projId = proj._id || proj.id || String(idx);
              const previewImg = normalizeUrl(proj.image || proj.images?.[0]);
              const mediaCount = (proj.images?.length || 1);

              return (
                <Card key={projId} variant="glass" className="p-5 space-y-4 border-white/10 relative overflow-hidden flex flex-col justify-between hover:border-white/30 transition-all">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-black border border-white/15 shrink-0 relative">
                          <img
                            src={previewImg}
                            alt=""
                            onError={(e) => { e.currentTarget.src = fallbackImage; }}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-white uppercase text-sm leading-tight">{proj.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-mono text-white bg-white/10 px-2 py-0.5 rounded border border-white/20 uppercase font-bold">
                              {proj.type}
                            </span>
                            <span className="text-[10px] font-mono text-neutral-300 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                              📷 {mediaCount} {mediaCount === 1 ? 'Bild' : 'Bilder'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Edit Button */}
                      <button
                        onClick={() => openEditModal(proj)}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1 text-xs font-mono border border-white/20 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5 text-white" />
                        <span>BEARBEITEN</span>
                      </button>
                    </div>

                    <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">{proj.description}</p>
                    
                    {proj.videoUrl && (
                      <div className="text-[10px] font-mono text-white bg-white/10 p-2 rounded border border-white/20 truncate flex items-center gap-1.5 font-bold">
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

      {/* ========================================================================= */}
      {/* 1. NEUES PROJEKT ERSTELLEN MODAL                                          */}
      {/* ========================================================================= */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#181a24] border border-white/20 rounded-3xl p-6 md:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto text-white">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2 font-orbitron">
                <Plus className="w-5 h-5 text-white" />
                Neues Projekt / Post Erstellen
              </h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProjectSubmit} className="space-y-5">
              {/* Titel des Posts * */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-neutral-200 block">
                  Titel des Posts <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:border-white text-white text-sm outline-none transition-all placeholder:text-neutral-500 font-sans"
                  placeholder="z. B. UI/UX Design Showcase"
                />
              </div>

              {/* Kategorie / Type */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-neutral-200 block">
                  Kategorie / Typ <span className="text-red-400">*</span>
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#12131a] border border-white/15 focus:border-white text-white text-sm outline-none transition-all font-sans"
                >
                  <option value="Editing">🎬 Video Editing (YouTube / TikTok / Reels)</option>
                  <option value="Thumbnails">🖼️ Thumbnail Design (3D / High CTR)</option>
                  <option value="Graphic Design">🎨 Graphic Design (Banners, Logos)</option>
                  <option value="UI/UX Design">💻 UI / UX Design</option>
                  <option value="Discord Server">🎮 Discord Server Setup</option>
                  <option value="Bot">🤖 Discord Bot</option>
                  <option value="work">Allgemeines Portfolio</option>
                </select>
              </div>

              {/* Inhalt Deutsch * */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-neutral-200 block">
                  Inhalt / Beschreibung Deutsch <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={newDescDe}
                  onChange={(e) => setNewDescDe(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:border-white text-white text-sm outline-none transition-all resize-none placeholder:text-neutral-500 font-sans leading-relaxed"
                  placeholder="Schreib hier die deutsche Beschreibung rein..."
                />
              </div>

              {/* Inhalt English (optional) */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-neutral-200 block">
                  Inhalt English (optional)
                </label>
                <textarea
                  rows={3}
                  value={newDescEn}
                  onChange={(e) => setNewDescEn(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:border-white text-white text-sm outline-none transition-all resize-none placeholder:text-neutral-500 font-sans leading-relaxed"
                  placeholder="Write your English description here..."
                />
              </div>

              {/* Bilder & Medien Anhängen */}
              <div className="space-y-3 pt-1">
                <label className="text-sm font-semibold text-neutral-200 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-white" />
                    <span>Bilder & Medien anhängen (Vom PC hochladen)</span>
                  </span>
                  <span className="text-xs font-mono text-neutral-400">
                    {attachedMedia.length} {attachedMedia.length === 1 ? 'Datei' : 'Dateien'} ausgewählt
                  </span>
                </label>

                {/* Preset Studio Showcase Selector */}
                <div className="space-y-1.5">
                  <span className="text-xs font-mono text-neutral-400 block">Schnellauswahl Studio-Presets:</span>
                  <div className="flex flex-wrap gap-2">
                    {STUDIO_PRESET_IMAGES.map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => {
                          if (!attachedMedia.includes(preset.url)) {
                            setAttachedMedia((prev) => [...prev, preset.url]);
                          }
                        }}
                        className="text-[11px] font-mono px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors cursor-pointer"
                      >
                        + {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* PC Upload Button */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <label className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold font-mono cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-xl">
                    {isUploadingMultiple ? (
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                    ) : (
                      <Upload className="w-4 h-4 text-black" />
                    )}
                    <span>{isUploadingMultiple ? 'MEDIEN WERDEN HOCHGELADEN...' : '📁 BILDER / VIDEOS VOM PC HOCHLADEN'}</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          handleMultiFileUpload(e.target.files, setAttachedMedia);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Optional Video URL */}
                <div className="space-y-1 pt-2">
                  <label className="text-xs font-mono text-neutral-400 block">Optional: Direkter Video-Link (.mp4 / .webm)</label>
                  <input
                    type="text"
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-mono outline-none"
                    placeholder="https://.../video.mp4"
                  />
                </div>

                {/* Live Attached Media Previews Gallery */}
                {attachedMedia.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-mono text-neutral-300 block font-bold">Angehängte Vorschau-Bilder:</span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-48 overflow-y-auto p-3 bg-black/50 rounded-2xl border border-white/15">
                      {attachedMedia.map((url, idx) => (
                        <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/20 group">
                          {/\.(mp4|mov|webm)(\?|$)/i.test(url) ? (
                            <video src={url} className="w-full h-full object-cover" />
                          ) : (
                            <img
                              src={normalizeUrl(url)}
                              alt=""
                              onError={(e) => { e.currentTarget.src = fallbackImage; }}
                              className="w-full h-full object-cover"
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => removeAttachedItem(idx, setAttachedMedia)}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center text-xs font-bold shadow-lg transition-colors cursor-pointer"
                            title="Entfernen"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newTitle.trim() || !newDescDe.trim()}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-xs uppercase tracking-wider font-orbitron transition-all shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin text-black" />}
                  <span>{isSubmitting ? 'VERÖFFENTLICHEN...' : 'PROJEKT POSTEN'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. PROJEKT BEARBEITEN MODAL                                               */}
      {/* ========================================================================= */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#181a24] border border-white/20 rounded-3xl p-6 md:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2 font-orbitron">
                <Edit className="w-5 h-5 text-white" />
                Projekt Bearbeiten
              </h3>
              <button
                onClick={() => setEditingProject(null)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProject} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-neutral-200 block">Titel des Projekts</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm outline-none focus:border-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-neutral-200 block">Kategorie / Typ</label>
                <select
                  value={editType}
                  onChange={(e) => setEditType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#12131a] border border-white/15 text-white text-sm outline-none focus:border-white font-sans"
                >
                  <option value="Editing">🎬 Video Editing</option>
                  <option value="Thumbnails">🖼️ Thumbnail Design</option>
                  <option value="Graphic Design">🎨 Graphic Design</option>
                  <option value="UI/UX Design">💻 UI / UX Design</option>
                  <option value="Discord Server">🎮 Discord Server Setup</option>
                  <option value="Bot">🤖 Discord Bot</option>
                  <option value="work">Allgemeines Portfolio</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-neutral-200 block">Beschreibung</label>
                <textarea
                  rows={4}
                  required
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm outline-none focus:border-white font-sans resize-none"
                />
              </div>

              {/* Media Gallery in Edit Modal */}
              <div className="space-y-3 pt-1">
                <label className="text-sm font-semibold text-neutral-200 block">Bilder & Medien bearbeiten</label>

                {/* PC Upload Button */}
                <label className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold font-mono cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-xl">
                  {isUploadingMultiple ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <Upload className="w-4 h-4 text-black" />}
                  <span>📁 WEITERE BILDER VOM PC HOCHLADEN</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleMultiFileUpload(e.target.files, setEditImages);
                      }
                    }}
                  />
                </label>

                {editImages.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-48 overflow-y-auto p-3 bg-black/50 rounded-2xl border border-white/15">
                    {editImages.map((url, idx) => (
                      <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/20 group">
                        <img
                          src={normalizeUrl(url)}
                          alt=""
                          onError={(e) => { e.currentTarget.src = fallbackImage; }}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeAttachedItem(idx, setEditImages)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center text-xs font-bold shadow-lg transition-colors cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs cursor-pointer"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-8 py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-xs uppercase tracking-wider font-orbitron transition-all shadow-xl cursor-pointer"
                >
                  {isUpdating ? 'SPEICHERN...' : 'ÄNDERUNGEN SPEICHERN'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
