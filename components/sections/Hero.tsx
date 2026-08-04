'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import {
  ArrowRight,
  Play,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Image as ImageIcon,
  PencilRuler,
  Zap,
  Star,
  Globe,
  Flame,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FeaturedShowreelModal } from '@/components/shared/FeaturedShowreelModal';
import { ProjectDocument } from '@/lib/projects-db';
import { AnimatedVideoBackground } from '@/components/ui/AnimatedVideoBackground';

const FALLBACK_HERO_PROJECT: ProjectDocument = {
  id: 'city-nights',
  title: 'CITY NIGHTS',
  type: 'Editing',
  description: 'High-octane, atmospheric edit combining rain-soaked urban street culture, custom sound design, and razor-sharp color grading.',
  images: ['/images/featured_edit_city_nights.jpg'],
  subtitle: 'CINEMATIC EDIT FOR LIFESTYLE BRAND',
};

export const Hero = () => {
  const [projects, setProjects] = useState<ProjectDocument[]>([FALLBACK_HERO_PROJECT]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeModalProject, setActiveModalProject] = useState<any | null>(null);

  // Fetch live projects from MongoDB Atlas noelvisuals.projects
  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setProjects(data.data);
        }
      })
      .catch((err) => console.warn('Using default hero project:', err));
  }, []);

  const activeProject = projects[currentIndex] || projects[0];
  const projectImage = activeProject.images && activeProject.images.length > 0
    ? activeProject.images[0]
    : '/images/featured_edit_city_nights.jpg';

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-[#070709] min-h-[92vh] flex flex-col justify-center">
      {/* YouTube Animated Background Video (Muted, Auto-looping) */}
      <AnimatedVideoBackground videoId="9vntypeV5QU" overlayOpacity="bg-black/65" />

      <Container size="lg" className="relative z-10 space-y-16">
        {/* Main Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-5 space-y-8">
            {/* Eyebrow Pill */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
            </motion.div>

            {/* Giant Title */}
            <div className="space-y-1">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.02] font-sans drop-shadow-2xl">
                Editing.
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-amber-300">
                  Thumbnails.
                </span>
                <br />
                Design.
              </h1>
            </div>

            {/* Paragraph */}
            <p className="text-sm md:text-base text-neutral-300 max-w-md leading-relaxed backdrop-blur-sm">
              NOEL VISUALS delivers high-impact video edits, 3D thumbnails, and visual brand identities that command attention in saturated feeds and drive real audience growth.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                href="/work"
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="shadow-2xl bg-white text-black font-bold hover:bg-neutral-200"
              >
                VIEW PORTFOLIO
              </Button>
              <Button
                href="/contact"
                variant="outline"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="border-white/30 hover:border-white/70 backdrop-blur-md bg-black/40 text-white font-bold"
              >
                START A PROJECT
              </Button>
            </div>

            {/* Social Proof Bar */}
            <div className="pt-6 border-t border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400 tracking-wider uppercase">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>TRUSTED BY TOP CREATORS & BRANDS</span>
              </div>

              {/* Brand Icons Row */}
              <div className="flex items-center gap-6 text-neutral-400">
                <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer font-bold text-sm">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> 4.9/5 RATING
                </div>
                <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-xs font-mono">
                  <Globe className="w-4 h-4 text-indigo-400" /> GLOBAL CLIENTS
                </div>
                <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-xs font-mono">
                  <Flame className="w-4 h-4 text-amber-500" /> HIGH CTR
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Featured Card Showcase */}
          <div className="lg:col-span-7">
            <div className="relative">
              {/* Glass Frame Wrapper with Floor Reflection */}
              <div className="glass-card rounded-2xl p-2 sm:p-3 relative z-10 border border-white/20 shadow-2xl overflow-hidden group backdrop-blur-xl bg-black/60">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeProject._id || activeProject.id || currentIndex}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4 }}
                    className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-xl overflow-hidden bg-black"
                  >
                    {/* Background Artwork */}
                    <Image
                      src={projectImage}
                      alt={activeProject.title}
                      fill
                      priority
                      unoptimized={projectImage?.startsWith('http')}
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />

                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    {/* Top Watermark Icon */}
                    <div className="absolute top-4 right-4 z-20">
                      <div className="w-10 h-10 rounded-lg bg-black/70 backdrop-blur-md border border-white/30 overflow-hidden shadow-xl">
                        <img
                          src="/images/logo.png"
                          alt="NV Logo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Card Inner Content */}
                    <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between z-20">
                      {/* Middle Title Block */}
                      <div className="space-y-1">
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white uppercase drop-shadow-md">
                          {activeProject.title}
                        </h2>
                        <p className="text-xs sm:text-sm font-mono text-neutral-300 uppercase tracking-widest pt-1">
                          {activeProject.description.slice(0, 75)}...
                        </p>
                      </div>

                      {/* Bottom Controls Row */}
                      <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/10">
                        {/* Play Showreel Button */}
                        <button
                          onClick={() => setActiveModalProject({
                            title: activeProject.title,
                            subtitle: activeProject.type,
                            category: activeProject.type,
                            image: projectImage,
                            description: activeProject.description,
                          })}
                          className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/30 hover:border-white/70 text-white text-xs font-mono tracking-widest uppercase transition-all group/btn hover:bg-white/20"
                        >
                          <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center group-hover/btn:scale-110 transition-transform">
                            <Play className="w-3.5 h-3.5 fill-black translate-x-0.5" />
                          </div>
                          <span>WATCH PROJECT</span>
                        </button>

                        {/* Pagination Counter & Navigation */}
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-neutral-300">
                            {currentIndex + 1} / {projects.length}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={handlePrev}
                              className="p-2 rounded-md bg-black/70 border border-white/20 text-neutral-300 hover:text-white hover:border-white/50 transition-colors"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleNext}
                              className="p-2 rounded-md bg-black/70 border border-white/20 text-neutral-300 hover:text-white hover:border-white/50 transition-colors"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Reflection Floor Glow */}
              <div className="w-full h-8 bg-gradient-to-b from-white/15 to-transparent blur-md -mt-2 rounded-b-2xl pointer-events-none opacity-40" />
            </div>
          </div>
        </div>

        {/* Bottom Feature Bar (4 columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-12 border-t border-white/10">
          <div className="glass-card p-6 rounded-xl flex items-start gap-4 hover:border-white/30 transition-all backdrop-blur-md bg-black/40">
            <div className="p-3 rounded-lg bg-white/10 border border-white/10 text-white shrink-0">
              <Clapperboard className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                VIDEO EDITING
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Cinematic edits that tell your story with impact.
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-xl flex items-start gap-4 hover:border-white/30 transition-all backdrop-blur-md bg-black/40">
            <div className="p-3 rounded-lg bg-white/10 border border-white/10 text-white shrink-0">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                THUMBNAIL DESIGN
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                High CTR thumbnails that get more clicks.
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-xl flex items-start gap-4 hover:border-white/30 transition-all backdrop-blur-md bg-black/40">
            <div className="p-3 rounded-lg bg-white/10 border border-white/10 text-white shrink-0">
              <PencilRuler className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                GRAPHIC DESIGN
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Clean, modern visuals that build your brand.
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-xl flex items-start gap-4 hover:border-white/30 transition-all backdrop-blur-md bg-black/40">
            <div className="p-3 rounded-lg bg-white/10 border border-white/10 text-white shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                FAST TURNAROUND
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Quality work, on time. Every time.
              </p>
            </div>
          </div>
        </div>
      </Container>

      {/* Showreel Modal */}
      <FeaturedShowreelModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />
    </section>
  );
};
