import React, { useState } from 'react';
import { Scene3D } from './components/3d/Scene3D';
import { StudioControls } from './components/3d/StudioControls';
import { Navbar } from './components/Navbar';
import { ResumeModal } from './components/ResumeModal';
import { AdminProjectsModal } from './components/AdminProjectsModal';
import { PortfolioSections } from './components/PortfolioSections';
import { InfiniteLoopHUD } from './components/InfiniteLoopHUD';
import { CursorParticleTrail } from './components/CursorParticleTrail';
import { WebGLSettings } from './types';
import { PERSONAL_INFO } from './data/portfolioData';
import { ArrowUp, Infinity as InfinityIcon } from 'lucide-react';
import { soundFx } from './utils/audio';
import { useScrollSlide } from './hooks/useScrollSlide';
import { useProjects } from './hooks/useProjects';
import { useResumeData } from './hooks/useResumeData';
import { useBackgroundMusic } from './hooks/useBackgroundMusic';
import { useInfiniteLoop } from './hooks/useInfiniteLoop';

const DEFAULT_SETTINGS: WebGLSettings = {
  meshType: 'chrome',
  colorPreset: 'cyber',
  wireframe: false,
  spinSpeed: 1.0,
  particleDensity: 1.0,
  bloomGlow: true,
  trailEnabled: true
};

export default function App() {
  const [webglSettings, setWebglSettings] = useState<WebGLSettings>(DEFAULT_SETTINGS);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Local Project Management Engine
  const {
    projects,
    addProject,
    updateProject,
    deleteProject,
    toggleFeatured,
    resetToDefaults
  } = useProjects();

  // Resume Data Management
  const {
    resumeData,
    updatePersonalInfo,
    addExperience,
    updateExperienceItem,
    deleteExperience,
    resetResumeToDefaults
  } = useResumeData();

  // Background Music Management
  const {
    tracks: musicTracks,
    activeTrack,
    addTrack,
    updateTrack,
    deleteTrack,
    setDefaultTrack,
    playTrack,
    resetMusicToDefaults
  } = useBackgroundMusic();

  // Endless Infinite Page Scroll Loop Engine
  const {
    set1Ref,
    isLoopEnabled,
    toggleLoop,
    loopCount,
    setHeight,
    scrollProgress,
    teleportToTop
  } = useInfiniteLoop();

  // Enable smooth card slide-right animation on scroll
  useScrollSlide();

  const handleScrollToTop = () => {
    soundFx.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#050711] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Subtle Golden Cursor Particle Trail */}
      <CursorParticleTrail />

      {/* Dynamic 3D WebGL Canvas Layer */}
      <Scene3D
        settings={webglSettings}
      />

      {/* Studio Controls Drawer */}
      <StudioControls
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
        settings={webglSettings}
        onUpdateSettings={setWebglSettings}
        onReset={() => setWebglSettings(DEFAULT_SETTINGS)}
      />

      {/* Resume Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        resumeData={resumeData}
      />

      {/* Admin Project & Site Settings Modal */}
      <AdminProjectsModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        projects={projects}
        onAddProject={addProject}
        onUpdateProject={updateProject}
        onDeleteProject={deleteProject}
        onToggleFeatured={toggleFeatured}
        onResetDefaults={resetToDefaults}
        resumeData={resumeData}
        onUpdatePersonalInfo={updatePersonalInfo}
        onAddExperience={addExperience}
        onUpdateExperienceItem={updateExperienceItem}
        onDeleteExperience={deleteExperience}
        onResetResumeDefaults={resetResumeToDefaults}
        musicTracks={musicTracks}
        activeTrack={activeTrack}
        onAddTrack={addTrack}
        onUpdateTrack={updateTrack}
        onDeleteTrack={deleteTrack}
        onSetDefaultTrack={setDefaultTrack}
        onPlayTrack={playTrack}
        onResetMusicDefaults={resetMusicToDefaults}
      />

      {/* Navigation Bar */}
      <Navbar
        onOpenStudio={() => setIsStudioOpen(true)}
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        activeTrack={activeTrack}
        musicTracks={musicTracks}
        onSelectTrack={playTrack}
      />

      {/* Primary Portfolio Sections (Loop Cycle Set 1) */}
      <main ref={set1Ref} className="relative z-10">
        <PortfolioSections
          projects={projects}
          onOpenStudio={() => setIsStudioOpen(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
      </main>

      {/* Duplicate Portfolio Sections for Seamless Endless Loop (Set 2) */}
      {isLoopEnabled && (
        <div className="relative z-10">
          {/* Seamless Loop Transition Indicator Banner */}
          <div className="w-full py-4 bg-gradient-to-r from-cyan-500/10 via-purple-500/15 to-cyan-500/10 border-y border-cyan-500/30 text-center flex items-center justify-center gap-3 text-xs font-mono text-cyan-300">
            <InfinityIcon className="w-4 h-4 animate-spin text-cyan-400" style={{ animationDuration: '6s' }} />
            <span className="font-bold tracking-wide">ENDLESS LOOP REPEAT — SEAMLESS PAGE WRAP-AROUND</span>
            <InfinityIcon className="w-4 h-4 animate-spin text-purple-400" style={{ animationDuration: '6s' }} />
          </div>

          <PortfolioSections
            projects={projects}
            onOpenStudio={() => setIsStudioOpen(true)}
            onOpenAdmin={() => setIsAdminOpen(true)}
            isLoopCopy={true}
          />
        </div>
      )}

      {/* Floating HUD Telemetry Overlay for Endless Loop */}
      <InfiniteLoopHUD
        isLoopEnabled={isLoopEnabled}
        onToggleLoop={toggleLoop}
        loopCount={loopCount}
        scrollProgress={scrollProgress}
        setHeight={setHeight}
        onTeleportTop={teleportToTop}
      />

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/90 py-12 px-4 sm:px-6 lg:px-8 mt-24">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left space-y-1">
            <span className="font-extrabold tracking-tight text-white text-base block">
              {PERSONAL_INFO.name}
            </span>
            <p className="text-xs text-slate-500 font-mono">
              Full Stack Developer & Data Analyst &copy; {new Date().getFullYear()} Maruti P Ghorpade. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleScrollToTop}
              className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-all shadow-lg flex items-center gap-2 text-xs font-mono"
            >
              <ArrowUp className="w-4 h-4 text-cyan-400" /> Back to Top
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
