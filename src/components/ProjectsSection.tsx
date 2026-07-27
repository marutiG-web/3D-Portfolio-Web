import React, { useState } from 'react';
import { PROJECTS_DATA } from '../data/portfolioData';
import { ProjectModal } from './ProjectModal';
import { InteractiveCard3D } from './3d/InteractiveCard3D';
import { Project } from '../types';
import { ExternalLink, Layers, ArrowUpRight, Filter, Sparkles, Activity, ShieldCheck, Plus } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface ProjectsSectionProps {
  projects?: Project[];
  onOpenAdmin?: () => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects = PROJECTS_DATA, onOpenAdmin }) => {
  const [filter, setFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'fullstack', label: 'Full Stack Apps' },
    { id: 'data', label: 'Data Analytics' },
    { id: 'ai', label: 'AI & ML Models' },
    { id: 'webgl', label: '3D WebGL' }
  ];

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      <div className="space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Interactive 3D Portfolio Showcase
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight flex flex-wrap items-center gap-3">
              <span>Featured Projects & Systems</span>
            </h2>
            <p className="text-slate-300 text-base mt-2">
              Explore full-stack web applications, 3D WebGL cards with interactive viewport lighting, and predictive analytics dashboards.
            </p>
          </div>

          {/* Controls: Filter Pills & Admin Button */}
          <div className="flex flex-wrap items-center gap-3">
            {onOpenAdmin && (
              <button
                onClick={() => {
                  soundFx.playClick();
                  onOpenAdmin();
                }}
                className="px-4 py-2 rounded-2xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 font-bold text-xs transition-all flex items-center gap-2 shadow-lg shadow-purple-500/10"
              >
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Admin Project Manager</span>
              </button>
            )}

            <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    soundFx.playClick();
                    setFilter(cat.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    filter === cat.id
                      ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-lg shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Project Grid with Interactive Three.js 3D Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <InteractiveCard3D
              key={project.id}
              category={project.category}
              image={project.image}
              title={project.title}
              onClick={() => {
                soundFx.playClick();
                setSelectedProject(project);
              }}
              className="slide-right-on-scroll"
            >
              {/* Featured Star Badge */}
              {project.featured && (
                <div className="absolute top-3 right-3 z-20">
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-[10px] font-mono font-bold text-purple-300 uppercase tracking-wider backdrop-blur-md shadow-lg">
                    ★ Featured
                  </span>
                </div>
              )}

              {/* Card Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                    <span>{project.title}</span>
                    <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Metrics Highlights */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                  {project.metrics.slice(0, 3).map((m, idx) => (
                    <div key={idx} className="text-center">
                      <span className="text-xs font-mono font-extrabold text-cyan-400 block">
                        {m.value}
                      </span>
                      <span className="text-[9px] text-slate-400 uppercase tracking-wider block mt-0.5 truncate">
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-slate-950/90 border border-slate-800 text-[10px] font-mono text-slate-300 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer CTA */}
              <div className="p-4 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    soundFx.playClick();
                    setSelectedProject(project);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-cyan-500/10 border border-slate-700 hover:border-cyan-500/50 text-slate-200 hover:text-cyan-300 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <Layers className="w-3.5 h-3.5 text-cyan-400" /> Inspect Deep Architecture
                </button>
              </div>
            </InteractiveCard3D>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
