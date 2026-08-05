'use client';

import React, { useRef, useState } from 'react';
import { Project } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Volume2, VolumeX, Eye, TrendingUp, CheckCircle, ArrowRight, Film } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

interface FeaturedShowreelModalProps {
  project: any | null;
  onClose: () => void;
}

export const FeaturedShowreelModal = ({
  project,
  onClose,
}: FeaturedShowreelModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5); // Start at 50% volume
  const [imgError, setImgError] = useState(false);

  if (!project) return null;

  const deliverablesList = Array.isArray(project.deliverables) && project.deliverables.length > 0
    ? project.deliverables
    : ['4K Master Export', 'Custom Color Grade', 'PSD Source Files', 'High CTR Render'];

  const rawImage = project.image || project.images?.[0] || '';
  const isVideo = (url: string) =>
    Boolean(url && /\.(mp4|mov|webm|avi|mkv)(\?|$)/i.test(url.toLowerCase()));

  const effectiveVideoUrl = project.videoUrl || project.video || (isVideo(rawImage) ? rawImage : null);
  const fallbackImage = '/images/featured_edit_city_nights.jpg';
  const posterImage = (rawImage && !isVideo(rawImage) && !imgError) ? rawImage : fallbackImage;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const val = parseFloat(e.target.value);
    videoRef.current.volume = val;
    videoRef.current.muted = val === 0;
    setVolume(val);
    setIsMuted(val === 0);
  };

  const handleVideoLoad = () => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl bg-[#0c0d12] border border-white/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* Header Bar */}
          <div className="p-4 px-6 border-b border-white/10 flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-300">
                {effectiveVideoUrl ? '▶ VIDEO PLAYBACK' : 'FEATURED SHOWREEL'} • {project.category || project.type || 'WORK'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto p-6 md:p-8 space-y-6">
            {/* Video or Image Preview */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-white/15 bg-black group">
              {effectiveVideoUrl ? (
                <>
                  <video
                    ref={videoRef}
                    src={effectiveVideoUrl}
                    className="w-full h-full object-cover"
                    playsInline
                    onEnded={() => setIsPlaying(false)}
                    onLoadedMetadata={handleVideoLoad}
                    poster={posterImage}
                  />
                  {/* Video Controls Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 z-20">
                    <div className="flex items-center gap-3">
                      {/* Play/Pause */}
                      <button
                        onClick={togglePlay}
                        className="w-10 h-10 rounded-full bg-white/90 text-black flex items-center justify-center hover:scale-110 transition-transform shadow-lg shrink-0"
                      >
                        {isPlaying
                          ? <Pause className="w-4 h-4 fill-black" />
                          : <Play className="w-4 h-4 fill-black translate-x-0.5" />
                        }
                      </button>

                      {/* Mute toggle */}
                      <button
                        onClick={toggleMute}
                        className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40 transition-colors shrink-0"
                      >
                        {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>

                      {/* Volume Slider */}
                      <div className="flex items-center gap-2 flex-1 max-w-[140px]">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="w-full h-1 rounded-full accent-white cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, white ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) ${(isMuted ? 0 : volume) * 100}%)`
                          }}
                        />
                        <span className="text-[10px] font-mono text-white/60 w-6 text-right shrink-0">
                          {Math.round((isMuted ? 0 : volume) * 100)}
                        </span>
                      </div>

                      <span className="text-[10px] font-mono text-white/50 ml-auto flex items-center gap-1 shrink-0">
                        <Film className="w-3 h-3" /> VIDEO
                      </span>
                    </div>
                  </div>
                  {/* Big play button when not playing */}
                  {!isPlaying && (
                    <div
                      className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
                      onClick={togglePlay}
                    >
                      <div className="w-20 h-20 rounded-full bg-white/90 text-black flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 fill-black translate-x-1" />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <img
                    src={posterImage}
                    alt=""
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.endsWith(fallbackImage)) {
                        target.src = fallbackImage;
                      }
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                </>
              )}
            </div>

            {/* Project Details */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-3xl font-extrabold text-white tracking-tight uppercase">
                    {project.title}
                  </h2>
                  <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest mt-1">
                    {project.subtitle || project.type || 'CINEMATIC WORK'} • CLIENT: {project.client || 'Verified Creator'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {project.views && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-white/10 text-white border border-white/15">
                      <Eye className="w-3.5 h-3.5" />
                      {project.views}
                    </span>
                  )}
                  {project.ctrIncrease && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {project.ctrIncrease}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-neutral-300 leading-relaxed">
                {project.description}
              </p>

              {/* Deliverables Grid */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                  Project Scope & Deliverables
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {deliverablesList.map((item: string) => (
                    <div
                      key={item}
                      className="p-3 rounded-lg bg-white/5 border border-white/5 text-xs text-neutral-200 flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 flex items-center justify-end gap-4 border-t border-white/10">
              <Button variant="ghost" size="sm" onClick={onClose}>
                Close Preview
              </Button>
              <Button
                href="/contact"
                variant="glow"
                size="sm"
                rightIcon={<ArrowRight className="w-4 h-4 text-black" />}
                onClick={onClose}
                className="bg-white text-black font-extrabold"
              >
                REQUEST SIMILAR PROJECT
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
