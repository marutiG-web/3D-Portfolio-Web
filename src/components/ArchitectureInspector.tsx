import React, { useState } from 'react';
import { Server, Database, Layers, ShieldCheck, Cpu, ArrowDown, Activity, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const ArchitectureInspector: React.FC = () => {
  const [activeNode, setActiveNode] = useState<'client' | 'api' | 'data' | 'infra'>('client');

  const nodes = {
    client: {
      title: 'Frontend & 3D WebGL Layer',
      subtitle: 'React 19 + Three.js + Tailwind CSS + Motion',
      color: 'from-cyan-500 to-blue-600',
      details: [
        'Responsive client-side SPA with standard WebGL viewport rendering.',
        'Optimistic state updates & zero-flicker UI transitions.',
        'Custom Web Audio API synthesizer for interactive audio feedback.',
        'Accessible, mobile-first design system built on Tailwind CSS utility architecture.'
      ]
    },
    api: {
      title: 'API & Gateway Middleware',
      subtitle: 'Express.js & Python FastAPI Microservices',
      color: 'from-purple-500 to-indigo-600',
      colorText: 'text-purple-400',
      details: [
        'Asynchronous event routing with strictly typed Request/Response schemas.',
        'JWT token validation & granular Role-Based Access Control (RBAC).',
        'Redis memory caching layer yielding sub-25ms API response latency.',
        'Rate-limiting middleware protecting against DDoS & API abuse.'
      ]
    },
    data: {
      title: 'Database & ML Pipeline',
      subtitle: 'PostgreSQL + Redis + Python Pandas / Scikit-learn',
      color: 'from-emerald-500 to-teal-600',
      colorText: 'text-emerald-400',
      details: [
        'Normalized relational schema with indexed foreign keys & execution plans.',
        'Real-time statistical aggregation and machine learning inference workers.',
        'Data cleaning & ETL pipelines with automated anomaly flags.',
        'Timeseries logging for sub-second system telemetry.'
      ]
    },
    infra: {
      title: 'Infrastructure & CI/CD',
      subtitle: 'Docker + Google Cloud Run + GitHub Actions',
      color: 'from-amber-500 to-orange-600',
      colorText: 'text-amber-400',
      details: [
        'Multi-stage Docker container builds optimizing production images.',
        'Automated CI/CD workflows running TypeScript linting & unit tests.',
        'Serverless auto-scaling matching active user request traffic.',
        'Container health monitoring with 99.9% uptime SLA target.'
      ]
    }
  };

  return (
    <section id="architecture" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      <div className="slide-right-on-scroll bg-slate-900/70 border border-slate-800/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 shadow-2xl space-y-10">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-widest">
            <Server className="w-3.5 h-3.5 text-cyan-400" /> Full Stack Architecture Inspector
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            End-to-End System Design
          </h2>
          <p className="text-slate-300 text-base">
            How Maruti P Ghorpade constructs production-ready, secure, and data-intensive applications.
          </p>
        </div>

        {/* Visual Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Node Diagram Cards */}
          <div className="lg:col-span-7 space-y-4">
            {(['client', 'api', 'data', 'infra'] as const).map((key) => {
              const item = nodes[key];
              const isActive = activeNode === key;

              return (
                <div key={key}>
                  <div
                    onClick={() => {
                      soundFx.playClick();
                      setActiveNode(key);
                    }}
                    className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between ${
                      isActive
                        ? 'bg-slate-950 border-cyan-400 shadow-xl shadow-cyan-500/10 scale-[1.01]'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-12 rounded-full bg-gradient-to-b ${item.color}`} />
                      <div>
                        <h3 className="text-base font-bold text-white">{item.title}</h3>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{item.subtitle}</p>
                      </div>
                    </div>

                    <span className={`text-xs font-mono font-semibold px-3 py-1 rounded-lg ${
                      isActive ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-500'
                    }`}>
                      {isActive ? 'INSPECTING' : 'CLICK TO VIEW'}
                    </span>
                  </div>

                  {key !== 'infra' && (
                    <div className="flex justify-center my-1.5 text-slate-700">
                      <ArrowDown className="w-4 h-4 animate-bounce" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Node Detail Box */}
          <div className="lg:col-span-5 bg-slate-950/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="space-y-2 pb-4 border-b border-slate-800">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                LAYER SPECIFICATIONS
              </span>
              <h3 className="text-xl font-bold text-white">
                {nodes[activeNode].title}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {nodes[activeNode].subtitle}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase text-slate-500 tracking-wider">
                Key Standards & Implementation Details:
              </h4>
              <ul className="space-y-3 text-xs text-slate-300">
                {nodes[activeNode].details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
