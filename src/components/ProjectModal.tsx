import React from 'react';
import { Project } from '../types';
import { X, ExternalLink, Github, CheckCircle2, Layers, Cpu, Activity, Server, FileCode, Zap } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header Image & Title */}
        <div className="relative h-48 sm:h-64 overflow-hidden shrink-0">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

          {/* Close button */}
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/80 text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title overlay */}
          <div className="absolute bottom-4 left-6 right-6">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-500/30">
              {project.category}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-2">
              {project.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
              {project.tagline}
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          {/* Key Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            {project.metrics.map((m, idx) => (
              <div key={idx} className="text-center">
                <span className="text-lg sm:text-2xl font-bold font-mono text-cyan-400 block">
                  {m.value}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block mt-0.5">
                  {m.label}
                </span>
              </div>
            ))}
          </div>

          {/* Problem vs Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-rose-950/10 border border-rose-500/20 space-y-2">
              <h3 className="text-sm font-bold text-rose-300 flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-400" /> Challenge & Problem
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {project.fullDetails.problem}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-950/10 border border-emerald-500/20 space-y-2">
              <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" /> Architectural Solution
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {project.fullDetails.solution}
              </p>
            </div>
          </div>

          {/* Key Features List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" /> Core Engineering Features
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
              {project.fullDetails.keyFeatures.map((feat, idx) => (
                <li key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack Breakdown Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" /> Technology Role Breakdown
            </h3>
            <div className="border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800 text-xs">
              {project.fullDetails.techStackDetails.map((tech, idx) => (
                <div key={idx} className="p-3 bg-slate-950/40 flex justify-between gap-4">
                  <span className="font-bold text-cyan-300 font-mono">{tech.name}</span>
                  <span className="text-slate-400">{tech.role}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Data Stream Code Snippet if present */}
          {project.fullDetails.sampleDataSnippet && (
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <FileCode className="w-4 h-4 text-amber-400" /> Sample API / Data Stream Format
              </h3>
              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto">
                {project.fullDetails.sampleDataSnippet}
              </pre>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundFx.playClick();
                alert('Live demo sandbox active in preview mode!');
              }}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
            >
              <span>Launch Live App</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
