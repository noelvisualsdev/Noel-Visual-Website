'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Project } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ArrowUpRight, Play, Eye, TrendingUp, Film } from 'lucide-react';

interface PortfolioCardProps {
  project: Project;
  onOpenModal?: (project: Project) => void;
}

export const PortfolioCard = ({ project, onOpenModal }: PortfolioCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const fallbackImage = '/images/featured_edit_city_nights.jpg';

  const normalizeUrl = (url?: string) => {
    if (!url) return fallbackImage;
    let u = url.trim();
    if (u.includes('cdn.discordapp.com/attachments/') || u.includes('media.discordapp.net/attachments/')) {
      return fallbackImage;
    }
    if (!u.startsWith('http://') && !u.startsWith('https://') && !u.startsWith('/')) {
      return '/' + u;
    }
    return u;
  };

  const rawImage = normalizeUrl(project.image || project.images?.[0]);
  const isVideo = (url: string) =>
    Boolean(url && /\.(mp4|mov|webm|avi|mkv)(\?|$)/i.test(url.toLowerCase()));

  const showVideoPreview = isVideo(rawImage) || isVideo(project.videoUrl || '');
  const videoPreviewSrc = isVideo(rawImage) ? rawImage : (project.videoUrl || '');
  const displayImage = imgError ? fallbackImage : (rawImage || fallbackImage);

  return (
    <Card
      variant="glass"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onOpenModal && onOpenModal(project)}
      className="group cursor-pointer p-0 overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500 flex flex-col justify-between"
    >
      {/* Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-neutral-900">
        {showVideoPreview && !videoError ? (
          <video
            src={videoPreviewSrc}
            muted
            loop
            playsInline
            autoPlay
            onError={() => setVideoError(true)}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <img
            src={displayImage}
            alt=""
            onError={(e) => {
              setImgError(true);
              e.currentTarget.src = fallbackImage;
            }}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e12] via-transparent to-transparent opacity-80 pointer-events-none" />

        {/* Category & Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
          <Badge variant="solid" className="text-[10px] py-0.5 px-2.5">
            {project.category}
          </Badge>
          {project.duration && (
            <Badge variant="accent" className="text-[10px] py-0.5 px-2">
              {project.duration}
            </Badge>
          )}
        </div>

        {/* Metric Overlay */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          {project.views && (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-neutral-300 border border-white/10">
              <Eye className="w-3 h-3 text-neutral-400" />
              {project.views}
            </span>
          )}
          {project.ctrIncrease && (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono bg-emerald-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-emerald-400 border border-emerald-500/30 font-semibold">
              <TrendingUp className="w-3 h-3" />
              {project.ctrIncrease}
            </span>
          )}
        </div>

        {/* Play Button — only shown when project has a video */}
        {(project.videoUrl || showVideoPreview) && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="w-14 h-14 rounded-full bg-white/90 text-black flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 fill-black translate-x-0.5" />
            </div>
            <span className="absolute bottom-3 right-3 text-[10px] font-mono text-white/70 bg-black/60 px-2 py-0.5 rounded flex items-center gap-1">
              <Film className="w-3 h-3" /> VIDEO
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-neutral-200 transition-colors uppercase">
              {project.title}
            </h3>
            <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest mt-1">
              {project.subtitle}
            </p>
          </div>
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/50 group-hover:bg-white/10 transition-all shrink-0">
            <ArrowUpRight className="w-4 h-4 text-white" />
          </div>
        </div>

        <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        {/* Deliverables tags */}
        <div className="pt-2 flex flex-wrap gap-1.5 border-t border-white/5">
          {Array.isArray(project.deliverables) && project.deliverables.slice(0, 3).map((item) => (
            <span
              key={item}
              className="text-[10px] text-neutral-400 bg-white/5 px-2 py-0.5 rounded border border-white/5"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
};
