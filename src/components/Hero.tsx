import React from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ArrowRight, Code, BarChart3, Database, Sparkles, ChevronDown, Compass, Play } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface HeroProps {
  onOpenStudio: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenStudio }) => {
  const scrollToSection = (id: string) => {
    soundFx.playClick();
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-between pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Decorative Hero Top Accent Laser Beam Line */}
      <div className="relative w-full mb-6">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-500/60 via-amber-400/80 via-purple-500/60 to-transparent" />
        <div className="absolute top-0 left-1/4 -translate-y-1/2 w-32 h-[2px] bg-cyan-400 blur-[1px] animate-pulse" />
        <div className="absolute top-0 right-1/4 -translate-y-1/2 w-32 h-[2px] bg-amber-400 blur-[1px] animate-pulse" />
      </div>

      {/* Main Hero Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Headlines & Action Buttons */}
        <div className="lg:col-span-7 flex flex-col items-center sm:items-start space-y-6">
          <div className="relative p-[1px] rounded-full bg-gradient-to-r from-cyan-500/50 via-amber-400/70 to-purple-500/50 shadow-lg shadow-cyan-500/10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950/90 backdrop-blur-xl text-xs font-mono text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-amber-200 to-purple-300 font-bold">
                WEBGL 3D INTERACTIVE SCROLL PORTFOLIO
              </span>
            </div>
          </div>

          {/* Main Display Headline */}
          <div className="space-y-4 max-w-4xl text-center sm:text-left relative">
            {/* Ambient Background Glow Spot behind Headline */}
            <div className="absolute -top-10 -left-10 w-72 h-32 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 -right-10 w-72 h-32 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.08] relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300 drop-shadow-sm">
                Designing the Future
              </span>{' '}
              <span className="text-slate-400 font-light">with</span>
              <br className="hidden sm:inline" />
              <span className="relative inline-block mt-1 sm:mt-2">
                <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-amber-300 via-fuchsia-400 to-purple-400 drop-shadow-[0_0_25px_rgba(34,211,238,0.25)] font-extrabold">
                  Code &amp; Data Intelligence
                </span>
                {/* Luminous Underline Glow Beam */}
                <span className="absolute -bottom-1.5 left-0 w-full h-[3px] rounded-full bg-gradient-to-r from-cyan-400 via-amber-300 to-purple-500 opacity-80 blur-[0.5px]" />
                <span className="absolute -bottom-1.5 left-0 w-full h-[1px] rounded-full bg-amber-300" />
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl pt-2">
              Hi, I&apos;m <strong className="text-white font-semibold">{PERSONAL_INFO.name}</strong> — a{' '}
              <span className="text-cyan-300 font-medium">Full Stack Developer</span> and{' '}
              <span className="text-purple-300 font-medium">Data Analyst</span> crafting interactive 3D web experiences, scalable software architectures, and predictive analytics platforms.
            </p>
          </div>

          {/* Dual Expertise Pill Badges */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <div className="px-4 py-2 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-slate-200 text-xs font-semibold flex items-center gap-2 shadow-lg">
              <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                <Code className="w-4 h-4" />
              </div>
              <span>Full Stack Web Development</span>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-slate-900/90 border border-purple-500/30 text-slate-200 text-xs font-semibold flex items-center gap-2 shadow-lg">
              <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                <BarChart3 className="w-4 h-4" />
              </div>
              <span>Data Analytics & Insights</span>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-slate-900/90 border border-emerald-500/30 text-slate-200 text-xs font-semibold flex items-center gap-2 shadow-lg">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Database className="w-4 h-4" />
              </div>
              <span>Predictive Models & SQL</span>
            </div>
          </div>

          {/* CTA Button Group */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 w-full sm:w-auto">
            <button
              onClick={() => scrollToSection('#projects')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-bold text-sm tracking-wide shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-3 group"
            >
              <span>Explore Featured Work</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => scrollToSection('#datalab')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span>Interactive Data Lab</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                onOpenStudio();
              }}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Launch 3D Controls</span>
            </button>
          </div>
        </div>

        {/* Right Column: Maruti P Ghorpade Profile Picture Showcase Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative group w-full max-w-sm">
            {/* Outer Cyberpunk Ambient Glow Backdrop */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500 via-purple-500 to-indigo-500 opacity-30 group-hover:opacity-75 blur-2xl transition-opacity duration-500" />

            {/* Profile Picture Card */}
            <div className="relative rounded-3xl bg-slate-900/90 border border-slate-700/80 p-5 shadow-2xl backdrop-blur-2xl flex flex-col items-center space-y-4">
              {/* Avatar Frame with Glowing Ring - Aspect 9/16 for Full Portrait Display */}
              <div className="relative w-full max-w-[280px] aspect-[9/16] rounded-2xl overflow-hidden p-1 bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 shadow-2xl shadow-cyan-500/25 group-hover:scale-[1.02] transition-transform duration-300">
                <img
                  src="/portfolio_pic.jpeg?v=4"
                  alt="Maruti P Ghorpade"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.tried) {
                      target.dataset.tried = '1';
                      target.src = '/mypic.jpeg?v=4';
                    }
                  }}
                  className="w-full h-full object-cover bg-slate-950 rounded-xl"
                />
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/90 border border-emerald-500/50 text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>ONLINE</span>
                </div>
              </div>

              {/* Title & Role Info */}
              <div className="text-center space-y-1">
                <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
                  <span>Maruti P Ghorpade</span>
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </h3>
                <p className="text-xs font-mono text-cyan-300">
                  Full Stack Engineer & Data Analyst
                </p>
                <p className="text-[11px] text-slate-400 pt-1 font-medium">
                  Building WebGL 3D apps, React microservices & SQL analytics pipelines.
                </p>
              </div>

              {/* Tech Tags */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2 border-t border-slate-800/80 w-full text-[10px] font-mono text-slate-300">
                <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700">React 18</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700">Three.js</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700">Python</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700">PostgreSQL</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700">TypeScript</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Stats Grid Footer with Glowing Laser Divider Line */}
      <div className="relative mt-16 sm:mt-24 pt-8">
        {/* Layered Laser Beam Divider Line */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/80 via-amber-400/90 via-purple-500/80 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-[2px] bg-gradient-to-r from-cyan-400 via-amber-300 to-purple-400 blur-[1px]" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {PERSONAL_INFO.stats.map((stat, idx) => (
            <div
              key={idx}
              className="relative p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-cyan-500/40 transition-all duration-300 group overflow-hidden"
            >
              {/* Stat Card Top Accent Glow Line */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-cyan-500/0 via-cyan-400/80 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-2xl sm:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-amber-300 to-purple-400 font-mono block">
                {stat.value}
              </span>
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Downward Scroll Indicator */}
      <div className="flex justify-center pt-8">
        <button
          onClick={() => scrollToSection('#about')}
          className="flex flex-col items-center text-slate-400 hover:text-cyan-400 transition-colors group"
          aria-label="Scroll down to about section"
        >
          <span className="text-[10px] uppercase font-mono tracking-widest mb-2 group-hover:translate-y-0.5 transition-transform">
            Scroll to explore 3D motion path
          </span>
          <ChevronDown className="w-5 h-5 animate-bounce text-cyan-400" />
        </button>
      </div>
    </section>
  );
};
