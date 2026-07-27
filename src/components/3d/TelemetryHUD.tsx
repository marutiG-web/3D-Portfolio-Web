import React, { useState } from 'react';
import { Cpu, Maximize2, Minimize2, Radio, Compass } from 'lucide-react';
import { soundFx } from '../../utils/audio';

interface TelemetryData {
  fps: number;
  posX: number;
  posY: number;
  posZ: number;
  rotX: number;
  rotY: number;
  scrollProgress: number;
  activeShape: string;
}

interface TelemetryHUDProps {
  data: TelemetryData | null;
  onOpenStudio: () => void;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({ data, onOpenStudio }) => {
  const [minimized, setMinimized] = useState(false);

  if (!data) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 hidden sm:block">
      <div className="bg-slate-950/80 border border-slate-800/80 backdrop-blur-md rounded-2xl p-3 shadow-2xl text-slate-300 font-mono text-[11px] transition-all">
        {/* Header bar */}
        <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold text-white uppercase tracking-wider text-[10px]">
              WebGL Telemetry
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                soundFx.playClick();
                setMinimized(!minimized);
              }}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
              title={minimized ? 'Expand HUD' : 'Minimize HUD'}
            >
              {minimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Content */}
        {!minimized ? (
          <div className="mt-2.5 space-y-1.5">
            <div className="flex justify-between gap-6">
              <span className="text-slate-500">ENGINE FPS:</span>
              <span className="font-bold text-cyan-400">{data.fps} FPS</span>
            </div>

            <div className="flex justify-between gap-6">
              <span className="text-slate-500">SCROLL PATH:</span>
              <span className="text-purple-400 font-semibold">{data.scrollProgress}%</span>
            </div>

            <div className="flex justify-between gap-6">
              <span className="text-slate-500">VECTOR [X,Y,Z]:</span>
              <span className="text-slate-200">
                {data.posX}, {data.posY}, {data.posZ}
              </span>
            </div>

            <div className="flex justify-between gap-6">
              <span className="text-slate-500">MESH SHAPE:</span>
              <span className="text-emerald-400 uppercase font-semibold">{data.activeShape}</span>
            </div>

            <button
              onClick={() => {
                soundFx.playClick();
                onOpenStudio();
              }}
              className="w-full mt-2 py-1 px-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded text-[10px] font-sans font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <Compass className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} /> Customize 3D Studio
            </button>
          </div>
        ) : (
          <div className="mt-1 flex items-center gap-3">
            <span className="text-cyan-400 font-bold">{data.fps} FPS</span>
            <span className="text-slate-500">|</span>
            <span className="text-purple-400">{data.scrollProgress}% Scroll</span>
          </div>
        )}
      </div>
    </div>
  );
};
