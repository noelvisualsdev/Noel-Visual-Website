'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Project } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ArrowUpRight, Play, Eye, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface PortfolioCardProps {
  project: Project;
  onOpenModal?: (project: Project) => void;
}

export const PortfolioCard = ({ project, onOpenModal }: PortfolioCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      variant="glass"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onOpenModal && onOpenModal(project)}
      className="group cursor-pointer p-0 overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500 flex flex-col justify-between"
    >
      {/* Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-neutral-900">
        <Image
          src={project.image}
          alt={project.title}
          fill
          unoptimized={project.image?.startsWith('http')}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          priority={project.featured}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e12] via-transparent to-transparent opacity-80" />

        {/* Category & Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
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
        <div className="absolute top-4 right-4 flex items-center gap-2">
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

        {/* Play Icon Hover Indicator */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs"
        >
          <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-2xl">
            <Play className="w-6 h-6 fill-black translate-x-0.5" />
          </div>
        </motion.div>
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
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/50 group-hover:bg-white/10 transition-all">
            <ArrowUpRight className="w-4 h-4 text-white" />
          </div>
        </div>

        <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        {/* Deliverables tags */}
        <div className="pt-2 flex flex-wrap gap-1.5 border-t border-white/5">
          {project.deliverables.slice(0, 3).map((item) => (
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
