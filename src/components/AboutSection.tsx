import React, { useState } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { Code2, LineChart, Cpu, CheckCircle2, Zap, Database, Server, Sparkles } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const AboutSection: React.FC = () => {
  const [lensMode, setLensMode] = useState<'fullstack' | 'data'>('fullstack');

  return (
    <section id="about" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      <div className="slide-right-on-scroll bg-slate-900/60 border border-slate-800/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Dual-Core Expertise
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              About Maruti P Ghorpade
            </h2>
          </div>

          {/* Lens Switcher */}
          <div className="flex items-center bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => {
                soundFx.playClick();
                setLensMode('fullstack');
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                lensMode === 'fullstack'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-4 h-4" /> Full Stack Developer
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setLensMode('data');
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                lensMode === 'data'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LineChart className="w-4 h-4" /> Data Analyst
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10 items-center">
          {/* Bio Text */}
          <div className="lg:col-span-7 space-y-6">
            <p className="text-lg text-slate-200 font-normal leading-relaxed">
              {PERSONAL_INFO.bio}
            </p>

            {lensMode === 'fullstack' ? (
              <div className="space-y-4 bg-cyan-950/20 border border-cyan-500/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-cyan-300 flex items-center gap-2">
                  <Server className="w-5 h-5 text-cyan-400" /> As a Full Stack Software Engineer:
                </h3>
                <ul className="space-y-2.5 text-sm text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>Architect robust web applications using React, Next.js, Node.js, and TypeScript.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>Create interactive 3D WebGL scenes using Three.js with custom shader effects.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>Design performant REST & GraphQL APIs backed by PostgreSQL, Redis, and MongoDB.</span>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="space-y-4 bg-purple-950/20 border border-purple-500/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-purple-300 flex items-center gap-2">
                  <Database className="w-5 h-5 text-purple-400" /> As a Data Analyst & Insights Specialist:
                </h3>
                <ul className="space-y-2.5 text-sm text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>Extract, wrangle, and clean complex multi-source datasets with Python Pandas & SQL.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>Build executive dashboards in Tableau, Power BI, and interactive D3.js/Recharts.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>Apply machine learning regression and classification to solve predictive business tasks.</span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Visual Cards & Profile Card */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-4">
            {/* Maruti Profile Portrait Card */}
            <div className="slide-right-on-scroll p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 shadow-xl flex items-center gap-4">
              <div className="w-24 sm:w-28 aspect-[9/16] rounded-xl overflow-hidden p-[1px] bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 shrink-0 shadow-md">
                <img
                  src="/portfolio_pic.jpeg?v=4"
                  alt="Maruti P Ghorpade"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.tried) {
                      target.dataset.tried = '1';
                      target.src = 'src/assets/images/portfolio_pic.jpeg?';
                    }
                  }}
                  className="w-full h-full object-cover bg-slate-950 rounded-[11px]"
                />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                  <span>Maruti P Ghorpade</span>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                </h4>
                <p className="text-xs font-mono text-cyan-300">Software Engineer & Data Specialist</p>
                <p className="text-[11px] text-slate-400">Karnataka, India</p>
              </div>
            </div>

            <div className="slide-right-on-scroll p-6 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Engineering Philosophy</span>
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-sm font-semibold text-white">
                &ldquo;Combining aesthetic pixel precision with rigorous analytical thinking.&rdquo;
              </p>
              <p className="text-xs text-slate-400">
                Building products where intuitive user interface meets real-time data streaming and bulletproof security.
              </p>
            </div>

            <div className="slide-right-on-scroll p-6 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Location & Availability</span>
                <Cpu className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-sm font-bold text-slate-200">
                {PERSONAL_INFO.location}
              </p>
              <p className="text-xs text-emerald-400 font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                {PERSONAL_INFO.availability}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
