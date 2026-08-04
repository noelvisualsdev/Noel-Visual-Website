'use client';

import React, { useState, useEffect } from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { PortfolioCard } from '@/components/shared/PortfolioCard';
import { Button } from '@/components/ui/Button';
import { ArrowRight, FolderKanban } from 'lucide-react';
import { FeaturedShowreelModal } from '@/components/shared/FeaturedShowreelModal';
import { ProjectDocument } from '@/lib/projects-db';

interface WorkSectionProps {
  previewOnly?: boolean;
}

export const WorkSection = ({ previewOnly = false }: WorkSectionProps) => {
  const [projects, setProjects] = useState<ProjectDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  const categories = ['All', 'work', 'Editing', 'Thumbnails', 'VFX', 'Brand Identity'];

  // Fetch live projects from MongoDB Atlas noelvisuals.projects
  useEffect(() => {
    setIsLoading(true);
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setProjects(data.data);
        }
      })
      .catch((err) => console.error('Error fetching projects:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredProjects =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.type === activeCategory || p.category === activeCategory);

  const displayedProjects = previewOnly
    ? filteredProjects.slice(0, 6)
    : filteredProjects;

  return (
    <Section id="work" className="bg-[#070709]">
      <Container size="lg" className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeader
            badge="LIVE PROJECTS"
            title="SELECTED WORKS & VISUAL RESULTS"
            className="mb-0 max-w-2xl"
          />

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs px-4 py-2 rounded-full font-mono uppercase tracking-wider transition-all border ${
                  activeCategory === cat
                    ? 'bg-white text-black border-white font-bold shadow-lg'
                    : 'bg-black/40 text-neutral-400 border-white/10 hover:border-white/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Empty State when zero projects in MongoDB */}
        {displayedProjects.length === 0 && !isLoading && (
          <div className="p-10 rounded-2xl glass-card border border-white/10 text-center space-y-4 max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-neutral-400">
              <FolderKanban className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase">
              NO PROJECTS IN MONGODB YET
            </h3>
            <p className="text-xs text-neutral-400 font-mono">
              Add documents to collection <code className="text-amber-400">noelvisuals.projects</code> via the Admin Panel to display them live here!
            </p>
          </div>
        )}

        {/* Work Grid */}
        {displayedProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedProjects.map((project) => {
              const formattedProj = {
                id: project._id || project.id || '1',
                title: project.title,
                subtitle: project.type ? `TYPE: ${project.type.toUpperCase()}` : 'WORK',
                category: (project.type as any) || 'Editing',
                client: project.clientId ? `Client #${project.clientId.slice(-4)}` : 'Client',
                image: project.images && project.images.length > 0 ? project.images[0] : '/images/featured_edit_city_nights.jpg',
                description: project.description,
                deliverables: ['Graphic Render', 'Source Assets', '4K Master'],
                year: '2026',
              };

              return (
                <PortfolioCard
                  key={formattedProj.id}
                  project={formattedProj}
                  onOpenModal={(proj) => setSelectedProject(proj)}
                />
              );
            })}
          </div>
        )}

        {previewOnly && (
          <div className="text-center pt-6">
            <Button
              href="/work"
              variant="outline"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="border-white/20 hover:border-white/50"
            >
              EXPLORE FULL PORTFOLIO & CASE STUDIES
            </Button>
          </div>
        )}
      </Container>

      {/* Modal for inspect */}
      <FeaturedShowreelModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </Section>
  );
};
