import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Sliders, FileText, Menu, X, Sparkles, Radio, ShieldCheck, ChevronDown } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { SongTrack } from '../types';

interface NavbarProps {
  onOpenStudio: () => void;
  onOpenResume: () => void;
  onOpenAdmin: () => void;
  activeTrack?: SongTrack;
  musicTracks?: SongTrack[];
  onSelectTrack?: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenStudio,
  onOpenResume,
  onOpenAdmin,
  activeTrack,
  musicTracks = [],
  onSelectTrack
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSoundtrackOn, setIsSoundtrackOn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTrackSelector, setShowTrackSelector] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleAudioFX = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
    if (!muted) soundFx.playClick();
  };

  const toggleAmbientSoundtrack = () => {
    soundFx.playClick();
    const playing = soundFx.toggleSoundtrack();
    setIsSoundtrackOn(playing);
  };


  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Data Lab', href: '#datalab' },
    { label: 'Architecture', href: '#architecture' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' }
  ];

  const handleNavClick = (href: string) => {
    soundFx.playClick();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 py-3 shadow-xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Name with Maruti Profile Picture Avatar */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#hero');
          }}
          className="group flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 via-indigo-500 to-purple-600 p-[1.5px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform overflow-hidden shrink-0">
            <img
              src="src/assets/images/portfolio_pic.jpeg?v=4"
              alt="Maruti P Ghorpade"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.tried) {
                  target.dataset.tried = '1';
                  target.src = '/mypic.jpeg?v=4';
                }
              }}
              className="w-full h-full object-cover rounded-[14px]"
            />
          </div>
          <div>
            <span className="font-extrabold tracking-tight text-white text-base sm:text-lg block group-hover:text-cyan-400 transition-colors">
              Maruti P Ghorpade
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block -mt-1">
              Full Stack & Data
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/80 backdrop-blur-md">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              className="px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-full transition-all"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Quick Controls Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Togglable Ambient Soundtrack Button with Track Switcher */}
          <div className="relative">
            <div className="flex items-center">
              <button
                onClick={toggleAmbientSoundtrack}
                className={`px-3 py-2 rounded-xl text-xs font-semibold font-mono border transition-all flex items-center gap-2 ${
                  isSoundtrackOn
                    ? 'bg-purple-500/20 border-purple-500/60 text-purple-300 shadow-lg shadow-purple-500/20 animate-pulse'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
                title="Toggle Background Music"
              >
                <Music className={`w-3.5 h-3.5 ${isSoundtrackOn ? 'text-purple-400 animate-spin' : 'text-slate-500'}`} style={{ animationDuration: '8s' }} />
                <span className="truncate max-w-[120px]">
                  {isSoundtrackOn ? (activeTrack?.title || 'Music Playing') : 'Ambient Music'}
                </span>
              </button>

              {musicTracks.length > 1 && (
                <button
                  onClick={() => setShowTrackSelector(!showTrackSelector)}
                  className="p-2 -ml-1 text-slate-400 hover:text-white transition-colors"
                  title="Choose Background Song"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Song Selector Dropdown */}
            {showTrackSelector && musicTracks.length > 0 && (
              <div className="absolute top-full mt-2 right-0 w-64 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
                <div className="px-3 py-1 text-[10px] font-mono uppercase text-slate-500 font-bold">
                  Select Background Music
                </div>
                {musicTracks.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      soundFx.playClick();
                      if (onSelectTrack) onSelectTrack(t.id);
                      setIsSoundtrackOn(true);
                      setShowTrackSelector(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-between transition-colors ${
                      activeTrack?.id === t.id
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
                        : 'text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <p className="truncate text-xs font-bold text-white">{t.title}</p>
                      <p className="text-[10px] text-slate-400">{t.artist}</p>
                    </div>
                    {t.isDefault && (
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded shrink-0">
                        DEF
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>


          {/* Sound FX Mute Toggle */}
          <button
            onClick={toggleAudioFX}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-slate-700 transition-all"
            title={isMuted ? 'Unmute Audio FX' : 'Mute Audio FX'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Admin Panel Button */}
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenAdmin();
            }}
            className="px-3.5 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400 text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 shadow-lg shadow-purple-500/10"
            title="Admin Panel: Manage Projects (Add, Edit, Delete)"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Admin</span>
          </button>

          {/* 3D Studio Drawer Button */}
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenStudio();
            }}
            className="px-3.5 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 text-xs font-semibold tracking-wide transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/10"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>3D Studio</span>
          </button>

          {/* Resume Modal */}
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenResume();
            }}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white text-xs font-bold tracking-wide transition-all shadow-md flex items-center gap-2"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Resume / CV</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => {
            soundFx.playClick();
            setMobileMenuOpen(!mobileMenuOpen);
          }}
          className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 border-b border-slate-800 backdrop-blur-2xl px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="px-4 py-2.5 text-left text-sm font-medium text-slate-300 hover:text-cyan-400 bg-slate-900/60 rounded-xl border border-slate-800/80"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2.5">
            <button
              onClick={toggleAmbientSoundtrack}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border ${
                isSoundtrackOn
                  ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                  : 'bg-slate-900 text-slate-300 border-slate-800'
              }`}
            >
              <Music className="w-4 h-4" />
              <span>{isSoundtrackOn ? 'Ambient Soundtrack: Playing' : 'Enable Ambient Soundtrack'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setMobileMenuOpen(false);
                  onOpenStudio();
                }}
                className="flex-1 py-2.5 px-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Sliders className="w-4 h-4" /> 3D Studio
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setMobileMenuOpen(false);
                  onOpenResume();
                }}
                className="flex-1 py-2.5 px-3 bg-purple-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20"
              >
                <FileText className="w-4 h-4" /> View Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
