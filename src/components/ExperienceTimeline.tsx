import React from 'react';
import { EXPERIENCE_DATA } from '../data/portfolioData';
import { Briefcase, Calendar, MapPin, CheckCircle2, Sparkles } from 'lucide-react';

export const ExperienceTimeline: React.FC = () => {
  return (
    <section id="experience" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      <div className="space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono uppercase tracking-widest">
            <Briefcase className="w-3.5 h-3.5 text-purple-400" /> Career Journey
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Work Experience & Achievements
          </h2>
          <p className="text-slate-300 text-base">
            Track record of driving software performance, building scalable applications, and uncovering actionable data insights.
          </p>
        </div>

        {/* Timeline Items */}
        <div className="relative border-l-2 border-slate-800 ml-4 sm:ml-32 space-y-10 pl-6 sm:pl-10">
          {EXPERIENCE_DATA.map((exp, idx) => (
            <div key={exp.id} className="relative group">
              {/* Glowing Timeline Node Dot */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-5 h-5 rounded-full bg-slate-950 border-2 border-cyan-400 group-hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/50 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
              </div>

              {/* Date Box floating left on desktop */}
              <div className="hidden sm:block absolute -left-36 top-1 text-right w-28 text-xs font-mono text-cyan-400 font-bold">
                {exp.period}
              </div>

              {/* Content Card */}
              <div className="slide-right-on-scroll p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/90 hover:border-slate-700 transition-all backdrop-blur-xl shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                  <div>
                    <span className="sm:hidden text-xs font-mono text-cyan-400 font-bold block mb-1">
                      {exp.period}
                    </span>
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {exp.role}
                    </h3>
                    <p className="text-sm font-semibold text-purple-400 mt-0.5">
                      {exp.company}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300">
                      {exp.type}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-cyan-400" /> {exp.location}
                    </span>
                  </div>
                </div>

                {/* Highlights List */}
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  {exp.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{h}</span>
                    </li>
                  ))}
                </ul>

                {/* Skills used */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {exp.skills.map((s) => (
                    <span key={s} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
