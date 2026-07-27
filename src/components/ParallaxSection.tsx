import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Layers, Cpu, Compass, ArrowDown, Activity } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface ParallaxSectionProps {
  onExploreClick?: () => void;
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({ onExploreClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const lastScrollYRef = useRef<number>(0);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(0.4);
  const [currentOffsetY, setCurrentOffsetY] = useState<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    const bgElement = bgRef.current;
    if (!container || !bgElement) return;

    let ticking = false;

    const updateParallax = () => {
      if (!container || !bgElement) return;

      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate relative scroll position when container is visible in viewport
      if (rect.top <= viewportHeight && rect.bottom >= 0) {
        // Distance from top of container to top of viewport
        const scrollDistance = window.scrollY - (container.offsetTop || 0);
        
        // Calculate translateY for background layer based on speed multiplier
        // Move slower than standard scroll (e.g. 0.4x speed)
        const bgTranslateY = scrollDistance * speedMultiplier;
        
        // Apply high-performance hardware accelerated GPU transform
        bgElement.style.transform = `translate3d(0px, ${bgTranslateY.toFixed(2)}px, 0px)`;
        
        setCurrentOffsetY(Math.round(bgTranslateY));
      }

      ticking = false;
    };

    const onScroll = () => {
      lastScrollYRef.current = window.scrollY;
      if (!ticking) {
        animFrameIdRef.current = window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    // Initial positioning check
    updateParallax();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (animFrameIdRef.current !== null) {
        window.cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [speedMultiplier]);

  return (
    <section
      id="parallax-demo"
      ref={containerRef}
      className="parallax-container relative w-full h-[100vh] min-h-[650px] overflow-hidden flex items-center justify-center my-12 border-y border-slate-800/80 bg-slate-950"
      style={{
        perspective: '1000px'
      }}
    >
      {/* 
        =========================================================
        1. BACKGROUND IMAGE LAYER (.parallax-bg)
        - Hardware Accelerated translate3d()
        - will-change: transform hint for browser compositor
        - Slower scroll speed relative to foreground
        =========================================================
      */}
      <div
        ref={bgRef}
        className="parallax-bg absolute -top-[25%] left-0 w-full h-[150%] pointer-events-none z-0"
        style={{
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)',
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.15) 0%, rgba(168, 85, 247, 0.12) 40%, rgba(5, 7, 17, 0.95) 80%), url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.5) contrast(1.2) hue-rotate(180deg)',
          opacity: 0.85
        }}
      >
        {/* Decorative Grid Overlay Pattern inside Background */}
        <div 
          className="w-full h-full opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(0, 240, 255, 0.3) 1px, transparent 1px)`,
            backgroundSize: '36px 36px'
          }}
        />
      </div>

      {/* Ambient Gradient Shadows */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050711] via-transparent to-[#050711] z-1 pointer-events-none" />

      {/* 
        =========================================================
        2. FOREGROUND CONTENT LAYER (.parallax-content)
        - Scrolls at standard 1.0x page speed
        - High contrast, interactive glass cards & typography
        =========================================================
      */}
      <div className="parallax-content relative z-10 w-full max-w-5xl px-4 sm:px-6 lg:px-8 mx-auto text-center space-y-8">
        {/* Top Feature Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-cyan-500/40 backdrop-blur-xl text-xs font-mono text-cyan-300 shadow-2xl">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>HYPERSPACE GRAVITY & PARALLAX ENGINE</span>
        </div>

        {/* Headline */}
        <div className="space-y-4">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Seamless Depth & <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400">
              Hardware-Accelerated Parallax
            </span>
          </h2>

          <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base leading-relaxed">
            Experience 60FPS ultra-smooth layer separation. The background layer (<code className="text-cyan-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 font-mono text-xs">.parallax-bg</code>) moves at a decoupled speed using GPU-promoted <code className="text-purple-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 font-mono text-xs">translate3d()</code> matrix coordinates.
          </p>
        </div>

        {/* Live Parallax Telemetry & Speed Controls Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span>BG SPEED RATIO</span>
              <Layers className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-cyan-300 font-mono">
              {(speedMultiplier * 100).toFixed(0)}% <span className="text-xs text-slate-500 font-normal">of page speed</span>
            </div>
            <div className="mt-3 flex gap-1">
              {[0.2, 0.4, 0.6].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    soundFx.playClick();
                    setSpeedMultiplier(s);
                  }}
                  className={`px-2 py-1 text-[10px] font-mono rounded-lg transition-all ${
                    speedMultiplier === s
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span>GPU TRANSLATE Y</span>
              <Activity className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-300 font-mono">
              {currentOffsetY}px
            </div>
            <span className="text-[11px] text-slate-400 mt-2 font-mono">
              will-change: transform
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span>RENDERING ENGINE</span>
              <Cpu className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-lg font-bold text-emerald-400 font-mono">
              rAF Loop
            </div>
            <span className="text-[11px] text-slate-400 mt-2 font-mono">
              Hardware Layer Promoted
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={() => {
              soundFx.playClick();
              if (onExploreClick) onExploreClick();
              const nextEl = document.querySelector('#projects');
              if (nextEl) nextEl.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-bold text-sm tracking-wide shadow-xl shadow-cyan-500/20 transition-all flex items-center gap-2 group"
          >
            <span>Scroll Down to See Parallax Shift</span>
            <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform text-slate-950" />
          </button>
        </div>
      </div>
    </section>
  );
};
