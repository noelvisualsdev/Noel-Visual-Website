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
import { useLanguage } from '@/components/providers/LanguageProvider';
import { cn } from '@/lib/utils';

const FALLBACK_HERO_PROJECT: ProjectDocument = {
  id: 'city-nights',
  title: 'CITY NIGHTS',
  type: 'Editing',
  description: 'High-octane, atmospheric edit combining rain-soaked urban street culture, custom sound design, and razor-sharp color grading.',
  images: ['/images/featured_edit_city_nights.jpg'],
  subtitle: 'CINEMATIC EDIT FOR LIFESTYLE BRAND',
};

export const Hero = () => {
  const { t } = useLanguage();
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

  const [heroImgError, setHeroImgError] = useState(false);

  const activeProject = projects[currentIndex] || projects[0];
  const allUrls = activeProject.images || [];
  const rawImage = allUrls[0] || '';

  const isVideo = (url: string) =>
    Boolean(url && /\.(mp4|mov|webm|avi|mkv)(\?|$)/i.test(url.toLowerCase()));

  const showVideo = isVideo(rawImage) || isVideo(activeProject.videoUrl || '');
  const videoSrc = isVideo(rawImage) ? rawImage : (activeProject.videoUrl || '');
  const fallbackImage = '/images/featured_edit_city_nights.jpg';
  const displayImage = heroImgError ? fallbackImage : (rawImage || fallbackImage);

  const handleNext = () => {
    setHeroImgError(false);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    setHeroImgError(false);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-transparent min-h-[92vh] flex flex-col justify-center">

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
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-wider text-white leading-[1.1] font-orbitron drop-shadow-2xl">
                {t.hero.title1}
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-amber-300">
                  {t.hero.title2}
                </span>
                <br />
                {t.hero.title3}
              </h1>
            </div>

            {/* Paragraph */}
            <p className="text-sm md:text-base text-neutral-300 max-w-md leading-relaxed backdrop-blur-sm">
              {t.hero.subtitle}
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
                {t.hero.viewPortfolio}
              </Button>
              <Button
                href="/contact"
                variant="outline"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="border-white/30 hover:border-white/70 backdrop-blur-md bg-black/40 text-white font-bold"
              >
                {t.hero.startProject}
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
                    {/* Background Artwork or Video */}
                    {showVideo ? (
                      <video
                        src={videoSrc}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                    ) : (
                      <Image
                        src={displayImage}
                        alt={activeProject.title || 'Project'}
                        fill
                        priority
                        unoptimized={displayImage.startsWith('http')}
                        onError={() => setHeroImgError(true)}
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                    )}

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
                    <div className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col justify-between z-20 pointer-events-none">
                      {/* Top Category Badge */}
                      <div className="flex items-center justify-between pointer-events-auto">
                        <span className="text-[10px] font-mono uppercase tracking-widest bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white border border-white/20">
                          {activeProject.type || activeProject.category || 'FEATURED WORK'}
                        </span>
                      </div>

                      {/* Middle Title Block */}
                      <div className="space-y-1 my-auto pointer-events-auto">
                        <h2 className={cn(
                          "font-extrabold tracking-tight text-white uppercase drop-shadow-lg line-clamp-2 leading-tight",
                          (activeProject.title || '').length > 35
                            ? "text-lg sm:text-xl md:text-2xl lg:text-3xl"
                            : (activeProject.title || '').length > 20
                            ? "text-xl sm:text-2xl md:text-3xl lg:text-4xl"
                            : "text-2xl sm:text-4xl md:text-5xl"
                        )}>
                          {activeProject.title}
                        </h2>
                        <p className="text-xs sm:text-sm font-mono text-neutral-300 uppercase tracking-widest pt-1 line-clamp-2">
                          {activeProject.description || ''}
                        </p>
                      </div>

                      {/* Bottom Controls Row */}
                      <div className="flex items-center justify-between gap-4 pt-3 border-t border-white/10 pointer-events-auto z-30">
                        {/* Play Showreel Button */}
                        <button
                          onClick={() => {
                            const allUrls = activeProject.images || [];
                            const detectedVideo = activeProject.videoUrl || allUrls.find(u => /\.(mp4|mov|webm|avi|mkv)(\?|$)/i.test(u)) || (activeProject as any).video || undefined;
                            const thumbnail = allUrls.find(u => !/\.(mp4|mov|webm|avi|mkv)(\?|$)/i.test(u)) || allUrls[0] || '/images/featured_edit_city_nights.jpg';

                            setActiveModalProject({
                              ...activeProject,
                              title: activeProject.title,
                              subtitle: activeProject.subtitle || activeProject.type,
                              category: activeProject.type,
                              image: thumbnail,
                              images: activeProject.images,
                              videoUrl: detectedVideo,
                              description: activeProject.description,
                            });
                          }}
                          className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/30 hover:border-white/70 text-white text-xs font-mono tracking-widest uppercase transition-all group/btn hover:bg-white/20 cursor-pointer"
                        >
                          <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center group-hover/btn:scale-110 transition-transform">
                            <Play className="w-3.5 h-3.5 fill-black translate-x-0.5" />
                          </div>
                          <span>{t.hero.watchProject}</span>
                        </button>

                        {/* Pagination Counter & Navigation */}
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-neutral-300">
                            {currentIndex + 1} / {projects.length}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={handlePrev}
                              className="p-2 rounded-md bg-black/80 border border-white/20 text-neutral-300 hover:text-white hover:border-white/50 transition-colors cursor-pointer hover:scale-105 active:scale-95"
                              title="Previous Project"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleNext}
                              className="p-2 rounded-md bg-black/80 border border-white/20 text-neutral-300 hover:text-white hover:border-white/50 transition-colors cursor-pointer hover:scale-105 active:scale-95"
                              title="Next Project"
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

        {/* Bottom Feature Bar (4 columns) with scroll build-up animations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-12 border-t border-white/10">
          {[
            { icon: Clapperboard, title: 'VIDEO EDITING', desc: 'Cinematic edits that tell your story with impact.' },
            { icon: ImageIcon, title: 'THUMBNAIL DESIGN', desc: 'High CTR thumbnails that get more clicks.' },
            { icon: PencilRuler, title: 'GRAPHIC DESIGN', desc: 'Clean, modern visuals that build your brand.' },
            { icon: Zap, title: 'FAST TURNAROUND', desc: 'Quality work, on time. Every time.' },
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.12, ease: [0.215, 0.61, 0.355, 1] }}
                className="glass-card p-6 rounded-2xl flex items-start gap-4 hover:border-white/30 transition-all backdrop-blur-md bg-black/40 hover:-translate-y-1 hover:shadow-2xl group"
              >
                <div className="p-3 rounded-xl bg-white/10 border border-white/10 text-white shrink-0 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-amber-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-orbitron">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
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
