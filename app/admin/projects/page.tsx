'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, CheckCircle2, Database, Trash2, Edit, X, Image as ImageIcon, Film, Upload, HardDrive, Paperclip, Loader2 } from 'lucide-react';
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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // NEW PROJECT MODAL STATE (Matching reference UI)
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

  // Multi-file upload for New Project / Edit Project
  const handleMultiFileUpload = async (files: FileList, targetSetter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setIsUploadingMultiple(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (data.success && data.url) {
          uploadedUrls.push(data.url);
        }
      } catch (err) {
        console.error(err);
      }
    }

    targetSetter((prev) => [...prev, ...uploadedUrls]);
    setIsUploadingMultiple(false);
  };

  // Submit New Project Form
  const handleCreateProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescDe.trim()) return;

    setIsSubmitting(true);
    setSuccessMsg('');

    // Combine German & English descriptions if provided
    let fullDescription = newDescDe.trim();
    if (newDescEn.trim()) {
      fullDescription = `${newDescDe.trim()}\n\n[EN]: ${newDescEn.trim()}`;
    }

    const finalImages = attachedMedia.length > 0 ? attachedMedia : ['/images/featured_edit_city_nights.jpg'];

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          type: newType,
          description: fullDescription,
          images: finalImages,
          videoUrl: newVideoUrl.trim(),
          clientId: '865289707328110662',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Neues Projekt "${newTitle}" mit ${finalImages.length} Medien auf dem Server veröffentlicht!`);
        setIsNewModalOpen(false);
        // Reset modal state
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
    setEditImages(proj.images && proj.images.length > 0 ? proj.images : [proj.image || '/images/featured_edit_city_nights.jpg']);
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
          images: editImages.length > 0 ? editImages : ['/images/featured_edit_city_nights.jpg'],
          videoUrl: editVideoUrl,
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
        setProjects((prev) => prev.filter((p) => (p._id || p.id) !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const removeAttachedItem = (index: number, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Database className="w-7 h-7 text-amber-400" />
            Project & Portfolio Manager
          </h1>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            Verwalte oder erstelle neue Projekte mit unbegrenzten Bildern/Videos (gesichert in MongoDB Atlas & Server-Ordner)
          </p>
        </div>

        {/* Action Button: "+ NEUES PROJEKT ERSTELLEN" */}
        <button
          onClick={() => setIsNewModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#5865f2] hover:bg-[#4752c4] text-white font-bold text-sm shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>NEUES PROJEKT ERSTELLEN</span>
        </button>
      </div>

      {/* Success Notification Banner */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-3 font-mono shadow-xl animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Server Storage Status Banner */}
      <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-3 font-mono shadow-xl">
        <HardDrive className="w-5 h-5 text-amber-400 shrink-0" />
        <div>
          <span className="font-bold block uppercase text-amber-200">Automatische Server-Sicherung Aktiv</span>
          <span className="text-neutral-300 text-[11px]">
            Alle hochgeladenen Medien werden dauerhaft im Server-Ordner <code className="text-amber-300 font-bold">public/uploads/projects/</code> gespeichert und in MongoDB Atlas hinterlegt.
          </span>
        </div>
      </div>

      {/* Live MongoDB Projects Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">
            AKTUELLE PROJEKTE AUF DER WEBSITE ({projects.length})
          </h2>
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Neues Projekt hinzufügen
          </button>
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
              const previewImg = proj.image || proj.images?.[0] || '/images/featured_edit_city_nights.jpg';
              const mediaCount = (proj.images?.length || 1);

              return (
                <Card key={projId} variant="glass" className="p-5 space-y-4 border-white/10 relative overflow-hidden flex flex-col justify-between hover:border-white/30 transition-all">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-black border border-white/15 shrink-0 relative">
                          <img src={previewImg} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white uppercase text-sm leading-tight">{proj.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-mono text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 uppercase">
                              {proj.type}
                            </span>
                            <span className="text-[10px] font-mono text-neutral-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
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

      {/* ========================================================================= */}
      {/* 1. NEUES PROJEKT ERSTELLEN MODAL (MATCHING REFERENCE UI SCREENSHOT)       */}
      {/* ========================================================================= */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#242531] border border-white/10 rounded-2xl p-6 md:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto text-white">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#5865f2]" />
                Neues Projekt / Post Erstellen
              </h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition-colors"
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
                  className="w-full px-4 py-3 rounded-xl bg-[#1b1c24] border border-[#37384b] focus:border-[#5865f2] focus:ring-1 focus:ring-[#5865f2] text-white text-sm outline-none transition-all placeholder:text-neutral-500 font-sans"
                  placeholder="z. B. Peter Pansen — Discord Branding"
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
                  className="w-full px-4 py-3 rounded-xl bg-[#1b1c24] border border-[#37384b] focus:border-[#5865f2] text-white text-sm outline-none transition-all font-sans"
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
                  Inhalt Deutsch <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={newDescDe}
                  onChange={(e) => setNewDescDe(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#1b1c24] border border-[#37384b] focus:border-[#5865f2] focus:ring-1 focus:ring-[#5865f2] text-white text-sm outline-none transition-all resize-none placeholder:text-neutral-500 font-sans leading-relaxed"
                  placeholder="Schreib hier den deutschen Text rein..."
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
                  className="w-full px-4 py-3 rounded-xl bg-[#1b1c24] border border-[#37384b] focus:border-[#5865f2] focus:ring-1 focus:ring-[#5865f2] text-white text-sm outline-none transition-all resize-none placeholder:text-neutral-500 font-sans leading-relaxed"
                  placeholder="Write your English description here..."
                />
              </div>

              {/* Bilder & Medien Anhängen (So viele wie man will) */}
              <div className="space-y-3 pt-1">
                <label className="text-sm font-semibold text-neutral-200 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-[#5865f2]" />
                    <span>Bilder & Medien anhängen (Beliebig viele)</span>
                  </span>
                  <span className="text-xs font-mono text-neutral-400">
                    {attachedMedia.length} {attachedMedia.length === 1 ? 'Datei' : 'Dateien'} ausgewählt
                  </span>
                </label>

                {/* Upload Button */}
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#5865f2]/20 text-[#5865f2] hover:bg-[#5865f2]/30 border border-[#5865f2]/40 text-xs font-bold font-mono cursor-pointer transition-all hover:scale-105 active:scale-95">
                    {isUploadingMultiple ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#5865f2]" />
                    ) : (
                      <Upload className="w-4 h-4 text-[#5865f2]" />
                    )}
                    <span>{isUploadingMultiple ? 'MEDIEN WERDEN HOCHGELADEN...' : '📁 BILDER / VIDEOS VOM PC HOCHLADEN (MEHRFACHAUSWAHL)'}</span>
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

                {/* Video URL Optional Input */}
                <div className="space-y-1 pt-2">
                  <label className="text-xs font-mono text-neutral-400 block">Optional: Direkter Video-Link (.mp4 / .webm)</label>
                  <input
                    type="text"
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1b1c24] border border-[#37384b] text-neutral-300 text-xs font-mono outline-none"
                    placeholder="https://.../video.mp4"
                  />
                </div>

                {/* Live Attached Media Previews Gallery */}
                {attachedMedia.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-mono text-neutral-400 block">Angehängte Medien:</span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-48 overflow-y-auto p-2 bg-[#1b1c24] rounded-xl border border-[#37384b]">
                      {attachedMedia.map((url, idx) => (
                        <div key={idx} className="relative aspect-video rounded-lg overflow-hidden bg-black border border-white/20 group">
                          {/\.(mp4|mov|webm)(\?|$)/i.test(url) ? (
                            <video src={url} className="w-full h-full object-cover" />
                          ) : (
                            <img src={url} alt="" className="w-full h-full object-cover" />
                          )}
                          <button
                            type="button"
                            onClick={() => removeAttachedItem(idx, setAttachedMedia)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold opacity-80 group-hover:opacity-100 transition-opacity"
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

              {/* Modal Buttons (Matching Screenshot) */}
              <div className="pt-4 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#2f303d] hover:bg-[#3b3c4d] text-white font-semibold text-sm transition-colors cursor-pointer"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newTitle.trim() || !newDescDe.trim()}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#5865f2] hover:bg-[#4752c4] text-white font-semibold text-sm transition-all shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Absenden</span>
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
          <div className="bg-[#242531] border border-white/10 rounded-2xl p-6 md:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Edit className="w-5 h-5 text-amber-400" />
                Projekt Bearbeiten & Bilder Verwalten
              </h3>
              <button
                onClick={() => setEditingProject(null)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white"
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
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1b1c24] border border-[#37384b] text-white font-mono text-xs outline-none"
                  >
                    <option value="Editing">🎬 Video Editing</option>
                    <option value="Thumbnails">🖼️ Thumbnail Design</option>
                    <option value="Graphic Design">🎨 Graphic Design</option>
                    <option value="UI/UX Design">💻 UI / UX Design</option>
                    <option value="Discord Server">🎮 Discord Server Setup</option>
                    <option value="Bot">🤖 Discord Bot</option>
                    <option value="work">General</option>
                  </select>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-mono uppercase text-neutral-300 block">Titel *</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1b1c24] border border-[#37384b] text-white font-mono text-xs outline-none"
                  />
                </div>
              </div>

              {/* Multi-file Image Upload for Editing */}
              <div className="space-y-3 pt-1">
                <label className="text-xs font-mono uppercase text-neutral-300 block">
                  Bilder & Medien für dieses Projekt ({editImages.length})
                </label>

                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5865f2]/20 text-[#5865f2] border border-[#5865f2]/40 hover:bg-[#5865f2]/30 text-xs font-mono font-bold cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>📁 BILDER VOM PC HOCHLADEN (MEHRFACHAUSWAHL)</span>
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
                </div>

                {/* Edit Gallery List */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-40 overflow-y-auto p-2 bg-[#1b1c24] rounded-xl border border-[#37384b]">
                  {editImages.map((url, idx) => (
                    <div key={idx} className="relative aspect-video rounded-lg overflow-hidden bg-black border border-white/20 group">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeAttachedItem(idx, setEditImages)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold opacity-80 group-hover:opacity-100"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video URL Input */}
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-neutral-300 flex items-center gap-1.5">
                  <Film className="w-4 h-4 text-amber-400" />
                  <span>🎬 Video URL (mp4 / webm)</span>
                </label>
                <input
                  type="text"
                  value={editVideoUrl}
                  onChange={(e) => setEditVideoUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1b1c24] border border-[#37384b] text-amber-300 font-mono text-xs outline-none"
                  placeholder="https://.../video.mp4"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-neutral-300 block">Beschreibung *</label>
                <textarea
                  rows={4}
                  required
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1b1c24] border border-[#37384b] text-white text-xs resize-none font-sans leading-relaxed outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-5 py-2.5 rounded-xl bg-[#2f303d] hover:bg-[#3b3c4d] text-white text-xs font-semibold"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 rounded-xl bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs font-semibold shadow-lg"
                >
                  {isUpdating ? 'Speichern...' : 'Absenden'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
