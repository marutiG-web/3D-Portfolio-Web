import React from 'react';
import { ResumeData } from '../types';
import { PERSONAL_INFO, SKILLS_DATA, EXPERIENCE_DATA } from '../data/portfolioData';
import { X, Download, Printer, Mail, MapPin, CheckCircle2, FileText } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeData?: ResumeData;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose, resumeData }) => {
  if (!isOpen) return null;

  const info = resumeData?.personalInfo || PERSONAL_INFO;
  const experiences = resumeData?.experiences || EXPERIENCE_DATA;
  const skills = resumeData?.skills || SKILLS_DATA;

  const handlePrint = () => {
    soundFx.playClick();
    window.print();
  };

  const handleDownloadFile = () => {
    soundFx.playSuccess();
    if (info.resumeUrl) {
      const a = document.createElement('a');
      a.href = info.resumeUrl;
      a.download = info.resumeFileName || `${info.name.replace(/\s+/g, '_')}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Top Toolbar */}
        <div className="p-4 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Curriculum Vitae — {info.name}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {info.resumeUrl ? (
              <button
                onClick={handleDownloadFile}
                className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg shadow-cyan-500/20"
              >
                <Download className="w-3.5 h-3.5" /> Download PDF File
              </button>
            ) : null}

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              aria-label="Close CV modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CV Body */}
        <div className="p-6 sm:p-10 space-y-8 overflow-y-auto custom-scrollbar flex-1 text-slate-200 font-sans text-xs sm:text-sm">
          {/* Custom PDF File Banner if attached */}
          {info.resumeUrl && (
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Custom Uploaded Resume Available</h4>
                  <p className="text-[11px] text-cyan-200/80 font-mono">
                    {info.resumeFileName || 'Official_Resume_Document.pdf'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleDownloadFile}
                className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download File</span>
              </button>
            </div>
          )}

          {/* Header section */}
          <div className="border-b border-slate-800 pb-6 space-y-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {info.name}
            </h1>
            <p className="text-cyan-400 font-semibold text-sm">
              {info.title}
            </p>

            <div className="flex flex-wrap gap-4 text-xs text-slate-400 pt-2 font-mono">
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-cyan-400" /> {info.email}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-purple-400" /> {info.location}</span>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="space-y-2">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Professional Summary
            </h2>
            <p className="text-slate-300 leading-relaxed">
              {info.bio}
            </p>
          </div>

          {/* Core Competencies */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
              Core Technical Competencies
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {skills.map((skill) => (
                <div key={skill.name} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-200">{skill.name}</span>
                  <span className="font-mono text-cyan-400 text-[10px]">{skill.level}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Work Experience
            </h2>

            <div className="space-y-4 divide-y divide-slate-800/60">
              {experiences.map((exp) => (
                <div key={exp.id} className="pt-4 first:pt-0 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-white text-base">{exp.role}</h3>
                      <p className="text-xs font-medium text-cyan-400">{exp.company}</p>
                    </div>
                    <span className="text-xs font-mono text-slate-400">{exp.period}</span>
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {exp.highlights.map((h, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};

