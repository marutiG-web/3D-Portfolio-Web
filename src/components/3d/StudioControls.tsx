import React from 'react';
import { WebGLSettings } from '../../types';
import { Settings2, X, RotateCcw, Sparkles, Activity, Eye, Zap, Sliders } from 'lucide-react';
import { soundFx } from '../../utils/audio';

interface StudioControlsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: WebGLSettings;
  onUpdateSettings: (newSettings: WebGLSettings) => void;
  onReset: () => void;
}

export const StudioControls: React.FC<StudioControlsProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onReset
}) => {
  if (!isOpen) return null;

  const handleMeshChange = (type: WebGLSettings['meshType']) => {
    soundFx.play3DShift();
    onUpdateSettings({ ...settings, meshType: type });
  };

  const handlePresetChange = (preset: WebGLSettings['colorPreset']) => {
    soundFx.play3DShift();
    onUpdateSettings({ ...settings, colorPreset: preset });
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-slate-950/90 backdrop-blur-2xl border-l border-cyan-500/20 text-slate-100 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400 animate-pulse" />
            <h3 className="font-semibold text-lg tracking-wide text-white">3D Studio Controls</h3>
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            aria-label="Close controls"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Form */}
        <div className="mt-6 space-y-6">
          {/* Geometry Selector */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 block flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> 3D Mesh Geometry
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'sphere', label: 'Gradient Sphere' },
                { id: 'chrome', label: 'Chrome Object' },
                { id: 'torus', label: 'Torus Data Knot' },
                { id: 'crystal', label: 'Crystal Lattice' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMeshChange(item.id as WebGLSettings['meshType'])}
                  className={`px-3 py-2.5 text-xs font-medium rounded-xl border text-left transition-all flex items-center justify-between ${
                    settings.meshType === item.id
                      ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span>{item.label}</span>
                  {settings.meshType === item.id && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />}
                </button>
              ))}
            </div>
          </div>

          {/* Color Presets */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 block flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-purple-400" /> Atmospheric Aura
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'cyber', label: 'Cyberpunk', color: 'from-cyan-500 to-purple-600' },
                { id: 'gold', label: 'Liquid Gold', color: 'from-amber-400 to-orange-600' },
                { id: 'emerald', label: 'Matrix Mint', color: 'from-emerald-400 to-teal-600' },
                { id: 'cosmos', label: 'Deep Nebula', color: 'from-purple-500 to-indigo-700' }
              ].map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetChange(preset.id as WebGLSettings['colorPreset'])}
                  className={`p-2.5 text-xs font-medium rounded-xl border flex items-center gap-2.5 transition-all ${
                    settings.colorPreset === preset.id
                      ? 'bg-slate-800 border-purple-400 text-white shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full bg-gradient-to-tr ${preset.color}`} />
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sliders & Switches */}
          <div className="space-y-4 pt-2 border-t border-slate-800/80">
            {/* Spin Speed */}
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-300 mb-2">
                <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-cyan-400" /> Rotation Speed</span>
                <span className="text-cyan-400 font-mono">{settings.spinSpeed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.1"
                value={settings.spinSpeed}
                onChange={(e) => onUpdateSettings({ ...settings, spinSpeed: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Particle Density */}
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-300 mb-2">
                <span>Particle Density</span>
                <span className="text-purple-400 font-mono">{Math.round(settings.particleDensity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.0"
                step="0.1"
                value={settings.particleDensity}
                onChange={(e) => onUpdateSettings({ ...settings, particleDensity: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
            </div>

            {/* Wireframe Toggle */}
            <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
              <span className="text-xs font-medium text-slate-300 flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-cyan-400" /> Wireframe Hologram Mode
              </span>
              <button
                onClick={() => {
                  soundFx.playClick();
                  onUpdateSettings({ ...settings, wireframe: !settings.wireframe });
                }}
                className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors ${
                  settings.wireframe ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${
                    settings.wireframe ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Trail Toggle */}
            <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
              <span className="text-xs font-medium text-slate-300">Scroll Motion Trail</span>
              <button
                onClick={() => {
                  soundFx.playClick();
                  onUpdateSettings({ ...settings, trailEnabled: !settings.trailEnabled });
                }}
                className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors ${
                  settings.trailEnabled ? 'bg-purple-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${
                    settings.trailEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Bloom Glow Toggle */}
            <div className="flex items-center justify-between py-2">
              <span className="text-xs font-medium text-slate-300">High Emissive Glow</span>
              <button
                onClick={() => {
                  soundFx.playClick();
                  onUpdateSettings({ ...settings, bloomGlow: !settings.bloomGlow });
                }}
                className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors ${
                  settings.bloomGlow ? 'bg-emerald-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${
                    settings.bloomGlow ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Reset */}
      <div className="pt-6 border-t border-slate-800">
        <button
          onClick={() => {
            soundFx.playClick();
            onReset();
          }}
          className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset WebGL Scene
        </button>
      </div>
    </div>
  );
};
