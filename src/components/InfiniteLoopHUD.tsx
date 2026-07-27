import React, { useState } from 'react';
import { Infinity as InfinityIcon, Repeat, ArrowUp, Sparkles, Activity, Layers, Zap, ChevronUp, ChevronDown } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface InfiniteLoopHUDProps {
  isLoopEnabled: boolean;
  onToggleLoop: () => void;
  loopCount: number;
  scrollProgress: number;
  setHeight: number;
  onTeleportTop: () => void;
}

export const InfiniteLoopHUD: React.FC<InfiniteLoopHUDProps> = ({
  isLoopEnabled,
  onToggleLoop,
  loopCount,
  scrollProgress,
  setHeight,
  onTeleportTop
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 font-mono">
      {/* Expanded Control Box */}
      {isExpanded && (
        <div className="w-72 p-4 rounded-3xl bg-slate-950/90 border border-cyan-500/40 backdrop-blur-2xl shadow-2xl shadow-cyan-500/10 text-slate-100 space-y-3.5 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <InfinityIcon className="w-4 h-4 animate-spin" style={{ animationDuration: '10s' }} />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white">ENDLESS LOOP ENGINE</h4>
                <p className="text-[10px] text-slate-400">Seamless Page Wrap-around</p>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Telemetry Stats Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <span className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                <Repeat className="w-3 h-3 text-cyan-400" /> Loop Cycle
              </span>
              <span className="text-base font-bold text-cyan-300 mt-1">
                #{loopCount} <span className="text-[10px] text-slate-400 font-normal">Active</span>
              </span>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <span className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                <Activity className="w-3 h-3 text-purple-400" /> Cycle %
              </span>
              <span className="text-base font-bold text-purple-300 mt-1">
                {scrollProgress}%
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Section Top</span>
              <span>Wrap Point ({Math.round(setHeight)}px)</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-500 transition-all duration-150"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="pt-1 flex flex-col gap-2">
            <button
              onClick={() => {
                soundFx.playClick();
                onToggleLoop();
              }}
              className={`w-full py-2 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                isLoopEnabled
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{isLoopEnabled ? 'Loop Mode: ACTIVE (Infinity)' : 'Loop Mode: OFF (Standard)'}</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                onTeleportTop();
              }}
              className="w-full py-2 px-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>Teleport to Top</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Pill Toggle Button */}
      {!isExpanded && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundFx.playClick();
              setIsExpanded(true);
            }}
            className="px-4 py-2.5 rounded-full bg-slate-950/90 border border-cyan-500/50 hover:border-cyan-400 text-white backdrop-blur-xl shadow-2xl shadow-cyan-500/20 transition-all flex items-center gap-2 group hover:scale-105"
            title="Open Endless Page Loop Controls"
          >
            <div className="relative">
              <InfinityIcon className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <span className="text-xs font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-300">
              Endless Loop #{loopCount} ({scrollProgress}%)
            </span>
            <ChevronUp className="w-3.5 h-3.5 text-slate-400 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
};
