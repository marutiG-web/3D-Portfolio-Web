import React, { useState } from 'react';
import { SKILLS_DATA } from '../data/portfolioData';
import { SkillCategory, Skill } from '../types';
import { Code, Database, Cloud, BarChart2, Layers, Cpu, Compass } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const TechStackSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<SkillCategory>('all');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const categories: { id: SkillCategory; label: string }[] = [
    { id: 'all', label: 'All Skills' },
    { id: 'fullstack', label: 'Full Stack Web' },
    { id: 'data', label: 'Data Analytics & ML' },
    { id: 'database', label: 'Databases & Storage' },
    { id: 'cloud', label: 'Cloud & DevOps' }
  ];

  const filteredSkills = activeCategory === 'all'
    ? SKILLS_DATA
    : SKILLS_DATA.filter((s) => s.category === activeCategory);

  return (
    <section id="skills" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      <div className="space-y-12">
        {/* Section Title */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-widest">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Technology & Competencies
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Tech Stack & Skill Matrix
          </h2>
          <p className="text-slate-300 text-base">
            Mastery across full-stack engineering frameworks, statistical data pipelines, and cloud databases.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                soundFx.playClick();
                setActiveCategory(cat.id);
              }}
              className={`px-5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Skill Grid with Scroll Slide-Right Animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill, index) => (
            <div
              key={skill.name}
              style={{ transitionDelay: `${(index % 3) * 100}ms` }}
              onClick={() => {
                soundFx.playClick();
                setSelectedSkill(skill);
              }}
              className={`slide-right-on-scroll p-6 rounded-3xl bg-slate-900/70 border transition-all duration-300 hover:-translate-y-1 cursor-pointer group backdrop-blur-xl ${
                selectedSkill?.name === skill.name
                  ? 'border-cyan-400 bg-slate-900 shadow-xl shadow-cyan-500/10'
                  : 'border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {skill.name}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mt-0.5">
                    {skill.yearsOfExp} Years Experience
                  </span>
                </div>
                <span className="text-sm font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                  {skill.level}%
                </span>
              </div>

              <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                {skill.description}
              </p>

              {/* Progress Bar */}
              <div className="mt-4 w-full h-2 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-teal-400 to-purple-500 transition-all duration-700"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Capability Radar / Matrix Visualizer */}
        <div className="slide-right-on-scroll mt-16 bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-purple-400" /> Interactive Skill Radar Matrix
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Visualizing technical coverage across Full Stack Engineering, Data Science, Databases, and DevOps.
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* SVG Radar Chart */}
            <div className="flex justify-center p-4">
              <svg className="w-full max-w-md h-72 sm:h-80" viewBox="0 0 400 400">
                {/* Background Concentric Circles */}
                <circle cx="200" cy="200" r="150" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="200" cy="200" r="100" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="200" cy="200" r="50" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />

                {/* Axes Lines */}
                <line x1="200" y1="50" x2="200" y2="350" stroke="#334155" strokeWidth="1.5" />
                <line x1="50" y1="200" x2="350" y2="200" stroke="#334155" strokeWidth="1.5" />

                {/* Skill Radar Area */}
                <polygon
                  points="200,70 330,180 280,310 110,310 70,180"
                  fill="rgba(6, 182, 212, 0.25)"
                  stroke="#06b6d4"
                  strokeWidth="2.5"
                />

                {/* Nodes */}
                <circle cx="200" cy="70" r="5" fill="#38bdf8" />
                <text x="200" y="42" fill="#38bdf8" fontSize="12" textAnchor="middle" fontWeight="bold">Full Stack (95%)</text>

                <circle cx="330" cy="180" r="5" fill="#a855f7" />
                <text x="345" y="185" fill="#a855f7" fontSize="12" textAnchor="start" fontWeight="bold">Data Science (90%)</text>

                <circle cx="280" cy="310" r="5" fill="#10b981" />
                <text x="290" y="330" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">Databases (92%)</text>

                <circle cx="110" cy="310" r="5" fill="#f59e0b" />
                <text x="100" y="330" fill="#f59e0b" fontSize="12" textAnchor="middle" fontWeight="bold">Cloud/DevOps (88%)</text>

                <circle cx="70" cy="180" r="5" fill="#6366f1" />
                <text x="55" y="185" fill="#6366f1" fontSize="12" textAnchor="end" fontWeight="bold">3D WebGL (85%)</text>
              </svg>
            </div>

            {/* Matrix Details */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-xs font-mono font-bold text-cyan-400 block uppercase">Frontend Architecture</span>
                <p className="text-xs text-slate-300 mt-1">
                  Expertise in React 18, TypeScript, Tailwind CSS, Vite, Framer Motion, and Three.js/WebGL custom shaders.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-xs font-mono font-bold text-purple-400 block uppercase">Data Analysis & Predictive AI</span>
                <p className="text-xs text-slate-300 mt-1">
                  Python, Pandas, NumPy, Scikit-learn, PyTorch, SQL data modeling, and Recharts interactive visualizers.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-xs font-mono font-bold text-emerald-400 block uppercase">Backend & Cloud Storage</span>
                <p className="text-xs text-slate-300 mt-1">
                  Node.js, Express, PostgreSQL, MongoDB, Redis caching, Docker containerization, and REST/GraphQL APIs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
