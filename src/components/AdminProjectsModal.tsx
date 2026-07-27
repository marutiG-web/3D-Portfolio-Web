import React, { useState, useEffect } from 'react';
import { Project, ResumeData, PersonalInfo, ExperienceItem, SongTrack } from '../types';
import {
  X,
  Plus,
  Trash2,
  Edit3,
  Star,
  RotateCcw,
  Check,
  Sparkles,
  Layers,
  Image as ImageIcon,
  ExternalLink,
  ShieldCheck,
  FolderPlus,
  Lock,
  User,
  Eye,
  EyeOff,
  LogOut,
  AlertCircle,
  FileText,
  Music,
  Play,
  Pause,
  Volume2,
  Upload,
  Download,
  Disc,
  Briefcase,
  Mail,
  MapPin,
  Save,
  Radio
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface AdminProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Projects
  projects: Project[];
  onAddProject: (project: Omit<Project, 'id'>) => void;
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  onResetDefaults: () => void;
  // Resume & Profile
  resumeData?: ResumeData;
  onUpdatePersonalInfo?: (info: Partial<PersonalInfo>) => void;
  onAddExperience?: (item: Omit<ExperienceItem, 'id'>) => void;
  onUpdateExperienceItem?: (item: ExperienceItem) => void;
  onDeleteExperience?: (id: string) => void;
  onResetResumeDefaults?: () => void;
  // Music Studio
  musicTracks?: SongTrack[];
  activeTrack?: SongTrack;
  onAddTrack?: (track: Omit<SongTrack, 'id'>) => void;
  onUpdateTrack?: (track: SongTrack) => void;
  onDeleteTrack?: (id: string) => void;
  onSetDefaultTrack?: (id: string) => void;
  onPlayTrack?: (id: string) => void;
  onResetMusicDefaults?: () => void;
}

const PRESET_IMAGES = [
  { label: '3D Telemetry Grid', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Cloud Architecture', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Neural AI Analytics', url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80' },
  { label: 'WebGL Shader Metal', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Microservice Telemetry', url: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Financial Quant Trading', url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80' }
];

export const AdminProjectsModal: React.FC<AdminProjectsModalProps> = ({
  isOpen,
  onClose,
  projects,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onToggleFeatured,
  onResetDefaults,
  resumeData,
  onUpdatePersonalInfo,
  onAddExperience,
  onUpdateExperienceItem,
  onDeleteExperience,
  onResetResumeDefaults,
  musicTracks = [],
  activeTrack,
  onAddTrack,
  onUpdateTrack,
  onDeleteTrack,
  onSetDefaultTrack,
  onPlayTrack,
  onResetMusicDefaults
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('admin_authenticated_v1') === 'true';
    } catch {
      return false;
    }
  });

  // Login Form Credentials State
  const [inputUsername, setInputUsername] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Top Section Switcher: 'projects' | 'resume' | 'music'
  const [adminSection, setAdminSection] = useState<'projects' | 'resume' | 'music'>('projects');

  // --- PROJECTS TAB STATE ---
  const [projectTab, setProjectTab] = useState<'list' | 'form'>('list');
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Project Form State
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState<'fullstack' | 'data' | 'ai' | 'webgl'>('fullstack');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [image, setImage] = useState(PRESET_IMAGES[0].url);
  const [demoUrl, setDemoUrl] = useState('#');
  const [githubUrl, setGithubUrl] = useState('#');
  const [featured, setFeatured] = useState(false);

  // Architecture items
  const [architectureList, setArchitectureList] = useState<string[]>([]);
  const [metricsList, setMetricsList] = useState<{ label: string; value: string }[]>([]);
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [keyFeatures, setKeyFeatures] = useState<string[]>([]);

  // --- RESUME & CV TAB STATE ---
  const [resName, setResName] = useState('');
  const [resTitle, setResTitle] = useState('');
  const [resTagline, setResTagline] = useState('');
  const [resBio, setResBio] = useState('');
  const [resEmail, setResEmail] = useState('');
  const [resLocation, setResLocation] = useState('');
  const [resGithub, setResGithub] = useState('');
  const [resLinkedin, setResLinkedin] = useState('');
  const [resPdfUrl, setResPdfUrl] = useState('');
  const [resPdfFileName, setResPdfFileName] = useState('');
  const [profileSavedNotice, setProfileSavedNotice] = useState(false);

  // Experience Form state inside Resume tab
  const [showExpForm, setShowExpForm] = useState(false);
  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null);
  const [expRole, setExpRole] = useState('');
  const [expCompany, setExpCompany] = useState('');
  const [expPeriod, setExpPeriod] = useState('');
  const [expType, setExpType] = useState<'Full Stack' | 'Data Analyst' | 'Hybrid'>('Full Stack');
  const [expLocation, setExpLocation] = useState('Remote');
  const [expHighlights, setExpHighlights] = useState('');
  const [expSkills, setExpSkills] = useState('');

  // --- MUSIC TAB STATE ---
  const [showSongForm, setShowSongForm] = useState(false);
  const [editingSong, setEditingSong] = useState<SongTrack | null>(null);
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [songGenre, setSongGenre] = useState('Cyberpunk Ambient');
  const [songDuration, setSongDuration] = useState('3:15');
  const [songUrl, setSongUrl] = useState('');
  const [songIsDefault, setSongIsDefault] = useState(false);
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);

  // Sync resume fields when modal opens or resumeData updates
  useEffect(() => {
    if (resumeData?.personalInfo) {
      setResName(resumeData.personalInfo.name || '');
      setResTitle(resumeData.personalInfo.title || '');
      setResTagline(resumeData.personalInfo.tagline || '');
      setResBio(resumeData.personalInfo.bio || '');
      setResEmail(resumeData.personalInfo.email || '');
      setResLocation(resumeData.personalInfo.location || '');
      setResGithub(resumeData.personalInfo.github || '');
      setResLinkedin(resumeData.personalInfo.linkedin || '');
      setResPdfUrl(resumeData.personalInfo.resumeUrl || '');
      setResPdfFileName(resumeData.personalInfo.resumeFileName || '');
    }
  }, [resumeData]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (
      inputUsername.trim() === 'Maruti#2026' &&
      inputPassword === 'Maruti@2026/07/27'
    ) {
      soundFx.playSuccess();
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem('admin_authenticated_v1', 'true');
      } catch (e) {
        console.warn(e);
      }
    } else {
      soundFx.playClick();
      setAuthError('Invalid credentials! Access denied.');
    }
  };

  const handleLogout = () => {
    soundFx.playClick();
    setIsAuthenticated(false);
    setInputPassword('');
    try {
      sessionStorage.removeItem('admin_authenticated_v1');
    } catch (e) {
      console.warn(e);
    }
  };

  // --- PROJECT ACTIONS ---
  const handleOpenFormForCreate = () => {
    soundFx.playClick();
    setEditingProject(null);
    setTitle('');
    setTagline('');
    setCategory('fullstack');
    setDescription('');
    setTagsInput('React, TypeScript, Node.js, Express, Tailwind');
    setImage(PRESET_IMAGES[0].url);
    setDemoUrl('#');
    setGithubUrl('#');
    setFeatured(true);
    setArchitectureList([
      'Frontend: React + Tailwind CSS',
      'API: Node.js Express REST API',
      'Database: PostgreSQL + Prisma'
    ]);
    setMetricsList([
      { label: 'Speed', value: '<15ms' },
      { label: 'Capacity', value: '50k/min' },
      { label: 'Accuracy', value: '99.2%' }
    ]);
    setProblem('System required scalable real-time processing and modular architecture.');
    setSolution('Engineered a full-stack asynchronous web system with low latency APIs.');
    setKeyFeatures(['Interactive web analytics UI', 'Automated security audit logging']);
    setProjectTab('form');
  };

  const handleOpenFormForEdit = (proj: Project) => {
    soundFx.playClick();
    setEditingProject(proj);
    setTitle(proj.title);
    setTagline(proj.tagline);
    setCategory(proj.category);
    setDescription(proj.description);
    setTagsInput(proj.tags.join(', '));
    setImage(proj.image);
    setDemoUrl(proj.demoUrl || '#');
    setGithubUrl(proj.githubUrl || '#');
    setFeatured(proj.featured);
    setArchitectureList(proj.architecture || []);
    setMetricsList(proj.metrics || []);
    setProblem(proj.fullDetails?.problem || '');
    setSolution(proj.fullDetails?.solution || '');
    setKeyFeatures(proj.fullDetails?.keyFeatures || []);
    setProjectTab('form');
  };

  const handleSubmitProjectForm = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playSuccess();

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const projectData = {
      title,
      tagline,
      category,
      description,
      tags: parsedTags.length > 0 ? parsedTags : ['React', 'TypeScript'],
      architecture: architectureList,
      metrics: metricsList,
      image,
      demoUrl,
      githubUrl,
      featured,
      fullDetails: {
        problem: problem || 'Optimization and high scalability requirements.',
        solution: solution || 'Built an end-to-end interactive digital solution.',
        keyFeatures: keyFeatures.length > 0 ? keyFeatures : ['High performance architecture'],
        techStackDetails: [
          { name: 'React & TypeScript', role: 'Type-safe UI component architecture' },
          { name: 'Node.js / Python', role: 'High performance backend microservices' }
        ]
      }
    };

    if (editingProject) {
      onUpdateProject({ ...projectData, id: editingProject.id });
    } else {
      onAddProject(projectData);
    }

    setProjectTab('list');
  };

  // --- RESUME PROFILE SAVE ---
  const handleSaveProfileInfo = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playSuccess();
    if (onUpdatePersonalInfo) {
      onUpdatePersonalInfo({
        name: resName,
        title: resTitle,
        tagline: resTagline,
        bio: resBio,
        email: resEmail,
        location: resLocation,
        github: resGithub,
        linkedin: resLinkedin,
        resumeUrl: resPdfUrl,
        resumeFileName: resPdfFileName
      });
      setProfileSavedNotice(true);
      setTimeout(() => setProfileSavedNotice(false), 3000);
    }
  };

  // --- PDF FILE UPLOAD HANDLER ---
  const handlePdfFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      soundFx.playClick();
      setResPdfFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setResPdfUrl(result);
          soundFx.playSuccess();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // --- EXPERIENCE ITEM ACTIONS ---
  const handleSaveExperience = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playSuccess();

    const highlightsArray = expHighlights
      .split('\n')
      .map((h) => h.trim())
      .filter((h) => h.length > 0);

    const skillsArray = expSkills
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const expData = {
      role: expRole,
      company: expCompany,
      period: expPeriod,
      type: expType,
      location: expLocation,
      highlights: highlightsArray.length > 0 ? highlightsArray : ['Architected modular web microservices.'],
      skills: skillsArray.length > 0 ? skillsArray : ['React', 'TypeScript', 'SQL']
    };

    if (editingExp && onUpdateExperienceItem) {
      onUpdateExperienceItem({ ...expData, id: editingExp.id });
    } else if (onAddExperience) {
      onAddExperience(expData);
    }

    setShowExpForm(false);
    setEditingExp(null);
  };

  // --- MUSIC TRACK ACTIONS ---
  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      soundFx.playClick();
      if (!songTitle) {
        setSongTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setSongUrl(result);
          soundFx.playSuccess();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSong = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playSuccess();

    if (!songUrl) {
      alert('Please upload an audio file or enter an audio URL!');
      return;
    }

    const songData = {
      title: songTitle || 'Untitled Ambient Song',
      artist: songArtist || 'Maruti Portfolio',
      genre: songGenre || 'Cyberpunk Ambient',
      duration: songDuration || '3:30',
      url: songUrl,
      isDefault: songIsDefault
    };

    if (editingSong && onUpdateTrack) {
      onUpdateTrack({ ...songData, id: editingSong.id });
    } else if (onAddTrack) {
      onAddTrack(songData);
    }

    setShowSongForm(false);
    setEditingSong(null);
  };

  const handleTestPlaySong = (track: SongTrack) => {
    if (playingSongId === track.id) {
      soundFx.stopSoundtrack();
      setPlayingSongId(null);
    } else {
      setPlayingSongId(track.id);
      if (onPlayTrack) {
        onPlayTrack(track.id);
      } else {
        soundFx.setTrackUrl(track.url, true);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-950/85 backdrop-blur-2xl overflow-y-auto">
      <div className="relative w-full max-w-5xl my-8 rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header Bar */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 text-cyan-400">
              <ShieldCheck className="w-6 h-6 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white">Admin Control Portal</h2>
                <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-bold uppercase ${
                  isAuthenticated
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                }`}>
                  {isAuthenticated ? 'Authenticated Admin' : 'Security Login Required'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isAuthenticated
                  ? 'Manage portfolio projects, live resume & background music library in real time.'
                  : 'Enter administrator security credentials to unlock permissions.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-mono font-bold transition-all flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" /> Log Out
              </button>
            )}

            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* LOGIN GATE WHEN NOT AUTHENTICATED */}
        {!isAuthenticated ? (
          <div className="p-6 sm:p-10 flex flex-col items-center justify-center space-y-6 max-w-md mx-auto w-full overflow-y-auto py-8">
            <div className="p-4 rounded-3xl bg-slate-950 border border-cyan-500/30 text-cyan-400 shadow-xl shadow-cyan-500/10 animate-pulse">
              <Lock className="w-10 h-10 text-cyan-300" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-xl font-extrabold text-white">Admin Verification Portal</h3>
              <p className="text-xs text-slate-400">
                Authorized access only. Sign in to edit projects, resume details, or background songs.
              </p>
            </div>

            {authError && (
              <div className="w-full p-3 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={inputUsername}
                    onChange={(e) => setInputUsername(e.target.value)}
                    placeholder="Enter admin username"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 text-sm outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={inputPassword}
                    onChange={(e) => setInputPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 text-sm outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 mt-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify & Unlock Admin Panel</span>
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD */
          <>
            {/* Top Navigation Tabs for Admin Sections */}
            <div className="px-6 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-2xl border border-slate-800">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setAdminSection('projects');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    adminSection === 'projects'
                      ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-lg shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-4 h-4" /> Projects Manager ({projects.length})
                </button>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    setAdminSection('resume');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    adminSection === 'resume'
                      ? 'bg-purple-500 text-white font-extrabold shadow-lg shadow-purple-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4" /> Resume & CV Settings
                </button>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    setAdminSection('music');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    adminSection === 'music'
                      ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-lg shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Music className="w-4 h-4" /> Background Songs ({musicTracks.length})
                </button>
              </div>

              {/* Action shortcuts per tab */}
              <div className="flex items-center gap-3">
                {adminSection === 'projects' && (
                  <button
                    onClick={() => {
                      if (confirm('Reset portfolio back to default projects?')) {
                        soundFx.playSuccess();
                        onResetDefaults();
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono transition-all flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" /> Reset Projects
                  </button>
                )}

                {adminSection === 'resume' && (
                  <button
                    onClick={() => {
                      if (confirm('Reset resume profile back to default values?')) {
                        soundFx.playSuccess();
                        if (onResetResumeDefaults) onResetResumeDefaults();
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono transition-all flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" /> Reset Resume
                  </button>
                )}

                {adminSection === 'music' && (
                  <button
                    onClick={() => {
                      if (confirm('Reset songs library back to default audio tracks?')) {
                        soundFx.playSuccess();
                        if (onResetMusicDefaults) onResetMusicDefaults();
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono transition-all flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" /> Reset Songs
                  </button>
                )}
              </div>
            </div>

            {/* Modal Body Container */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">

              {/* ============================================================
                  SECTION 1: PROJECTS MANAGER
              ============================================================ */}
              {adminSection === 'projects' && (
                <div className="space-y-6">
                  {/* Projects Sub Controls */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          soundFx.playClick();
                          setProjectTab('list');
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          projectTab === 'list'
                            ? 'bg-slate-800 text-white border border-slate-700'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        All Projects ({projects.length})
                      </button>
                      <button
                        onClick={handleOpenFormForCreate}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          projectTab === 'form' && !editingProject
                            ? 'bg-cyan-500 text-slate-950 font-bold'
                            : 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Project
                      </button>
                    </div>
                  </div>

                  {projectTab === 'list' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {projects.map((proj) => (
                        <div
                          key={proj.id}
                          className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-4 group"
                        >
                          <div className="flex items-start gap-4">
                            <img
                              src={proj.image}
                              alt={proj.title}
                              className="w-16 h-16 rounded-xl object-cover border border-slate-800 flex-shrink-0"
                            />
                            <div className="space-y-1 flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-[9px] font-mono text-cyan-300 font-bold uppercase">
                                  {proj.category}
                                </span>
                                {proj.featured && (
                                  <span className="px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/40 text-[9px] font-mono text-purple-300 font-bold uppercase flex items-center gap-1">
                                    <Star className="w-2.5 h-2.5 fill-purple-300 text-purple-300" /> Featured
                                  </span>
                                )}
                              </div>
                              <h4 className="text-base font-bold text-white truncate">{proj.title}</h4>
                              <p className="text-xs text-slate-400 line-clamp-1">{proj.tagline}</p>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                            <button
                              onClick={() => onToggleFeatured(proj.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
                                proj.featured
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                              }`}
                            >
                              <Star className={`w-3.5 h-3.5 ${proj.featured ? 'fill-purple-300' : ''}`} />
                              {proj.featured ? 'Featured' : 'Make Featured'}
                            </button>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenFormForEdit(proj)}
                                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                                title="Edit Project"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => {
                                  if (confirm(`Delete project "${proj.title}"?`)) {
                                    soundFx.playClick();
                                    onDeleteProject(proj.id);
                                  }
                                }}
                                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                                title="Delete Project"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* PROJECT FORM */
                    <form onSubmit={handleSubmitProjectForm} className="space-y-6">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-cyan-400" />
                          <span>{editingProject ? 'Edit Project Details' : 'Create New Portfolio Project'}</span>
                        </h3>
                        <button
                          type="button"
                          onClick={() => setProjectTab('list')}
                          className="text-xs font-mono text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Project Title</label>
                          <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Aura Analytics Engine"
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-cyan-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Tagline</label>
                          <input
                            type="text"
                            required
                            value={tagline}
                            onChange={(e) => setTagline(e.target.value)}
                            placeholder="e.g., Real-time streaming analytics dashboard"
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-cyan-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Category</label>
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value as 'fullstack' | 'data' | 'ai' | 'webgl')}
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-cyan-500"
                          >
                            <option value="fullstack">Full Stack Web App</option>
                            <option value="data">Data Analysis & BI</option>
                            <option value="ai">AI / Machine Learning</option>
                            <option value="webgl">WebGL / 3D Graphics</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Tags (Comma Separated)</label>
                          <input
                            type="text"
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                            placeholder="React, TypeScript, Express, PostgreSQL"
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-cyan-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Full Description</label>
                        <textarea
                          rows={3}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Provide overview of architecture, data flow, and user capabilities..."
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Cover Image URL</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-cyan-500"
                          />
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {PRESET_IMAGES.map((p) => (
                            <button
                              key={p.label}
                              type="button"
                              onClick={() => setImage(p.url)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border transition-all ${
                                image === p.url
                                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                              }`}
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="chk-featured"
                          checked={featured}
                          onChange={(e) => setFeatured(e.target.checked)}
                          className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-0"
                        />
                        <label htmlFor="chk-featured" className="text-xs font-bold text-white cursor-pointer">
                          Highlight as Featured Project
                        </label>
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={() => setProjectTab('list')}
                          className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-cyan-500/20"
                        >
                          {editingProject ? 'Save Changes' : 'Publish Project'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* ============================================================
                  SECTION 2: RESUME & CV SETTINGS
              ============================================================ */}
              {adminSection === 'resume' && (
                <div className="space-y-8">
                  {/* Personal Profile Form */}
                  <form onSubmit={handleSaveProfileInfo} className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-purple-400" />
                        <h3 className="text-base font-bold text-white">Personal Profile & CV Master Details</h3>
                      </div>
                      {profileSavedNotice && (
                        <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 animate-pulse">
                          <Check className="w-3.5 h-3.5" /> Profile Saved Successfully!
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={resName}
                          onChange={(e) => setResName(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Professional Job Title</label>
                        <input
                          type="text"
                          required
                          value={resTitle}
                          onChange={(e) => setResTitle(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Direct Email</label>
                        <input
                          type="email"
                          required
                          value={resEmail}
                          onChange={(e) => setResEmail(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Location / Address</label>
                        <input
                          type="text"
                          required
                          value={resLocation}
                          onChange={(e) => setResLocation(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Hero Tagline</label>
                      <input
                        type="text"
                        value={resTagline}
                        onChange={(e) => setResTagline(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Professional Biography / CV Summary</label>
                      <textarea
                        rows={3}
                        value={resBio}
                        onChange={(e) => setResBio(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-purple-500"
                      />
                    </div>

                    {/* PDF Document File Uploader Section */}
                    <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-white flex items-center gap-2">
                          <FileText className="w-4 h-4 text-purple-300" />
                          <span>Custom Resume PDF Attachment</span>
                        </label>
                        {resPdfUrl && (
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                            PDF File Uploaded
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 items-center">
                        <label className="w-full sm:w-auto px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload PDF Resume</span>
                          <input
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handlePdfFileUpload}
                            className="hidden"
                          />
                        </label>

                        <div className="flex-1 w-full">
                          <input
                            type="text"
                            value={resPdfUrl}
                            onChange={(e) => {
                              setResPdfUrl(e.target.value);
                              if (!resPdfFileName) setResPdfFileName('Resume.pdf');
                            }}
                            placeholder="Or paste direct PDF URL (https://...)"
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-purple-500 font-mono"
                          />
                        </div>

                        {resPdfUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              setResPdfUrl('');
                              setResPdfFileName('');
                            }}
                            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs shrink-0"
                            title="Clear attached PDF"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {resPdfFileName && (
                        <p className="text-[11px] font-mono text-slate-400">
                          Active File: <span className="text-purple-300 font-bold">{resPdfFileName}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all"
                      >
                        <Save className="w-4 h-4" /> Save Profile Details
                      </button>
                    </div>
                  </form>

                  {/* Work Experience Items Manager */}
                  <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-emerald-400" />
                        <h3 className="text-base font-bold text-white">Work Experience Items</h3>
                      </div>
                      <button
                        onClick={() => {
                          soundFx.playClick();
                          setEditingExp(null);
                          setExpRole('');
                          setExpCompany('');
                          setExpPeriod('2024 - Present');
                          setExpType('Full Stack');
                          setExpLocation('Remote');
                          setExpHighlights('Led architecture of full-stack React & Node web applications.\nOptimized backend database performance and caching.');
                          setExpSkills('React, Node.js, TypeScript, SQL');
                          setShowExpForm(true);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Experience Item
                      </button>
                    </div>

                    {showExpForm && (
                      <form onSubmit={handleSaveExperience} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono text-emerald-400">
                          {editingExp ? 'Edit Experience Item' : 'New Experience Entry'}
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-mono text-slate-400 mb-1">Job Role Title</label>
                            <input
                              type="text"
                              required
                              value={expRole}
                              onChange={(e) => setExpRole(e.target.value)}
                              placeholder="Senior Software Engineer"
                              className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-emerald-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-slate-400 mb-1">Company / Organization</label>
                            <input
                              type="text"
                              required
                              value={expCompany}
                              onChange={(e) => setExpCompany(e.target.value)}
                              placeholder="Tech Company Inc"
                              className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-emerald-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-slate-400 mb-1">Time Period</label>
                            <input
                              type="text"
                              required
                              value={expPeriod}
                              onChange={(e) => setExpPeriod(e.target.value)}
                              placeholder="2023 - Present"
                              className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-emerald-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-slate-400 mb-1">Location</label>
                            <input
                              type="text"
                              value={expLocation}
                              onChange={(e) => setExpLocation(e.target.value)}
                              placeholder="Remote / Karnataka, India"
                              className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-emerald-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">Key Accomplishments / Highlights (1 per line)</label>
                          <textarea
                            rows={3}
                            value={expHighlights}
                            onChange={(e) => setExpHighlights(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">Skills Used (Comma Separated)</label>
                          <input
                            type="text"
                            value={expSkills}
                            onChange={(e) => setExpSkills(e.target.value)}
                            placeholder="React, TypeScript, SQL, Docker"
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setShowExpForm(false)}
                            className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-extrabold"
                          >
                            Save Entry
                          </button>
                        </div>
                      </form>
                    )}

                    <div className="space-y-3">
                      {resumeData?.experiences.map((exp) => (
                        <div
                          key={exp.id}
                          className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80 flex items-start justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-white">{exp.role}</h4>
                            <p className="text-xs text-cyan-400 font-mono">{exp.company} &bull; {exp.period}</p>
                            <ul className="list-disc list-inside text-[11px] text-slate-400 pt-1 space-y-0.5">
                              {exp.highlights.slice(0, 2).map((h, i) => (
                                <li key={i} className="truncate max-w-lg">{h}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => {
                                soundFx.playClick();
                                setEditingExp(exp);
                                setExpRole(exp.role);
                                setExpCompany(exp.company);
                                setExpPeriod(exp.period);
                                setExpType(exp.type);
                                setExpLocation(exp.location);
                                setExpHighlights(exp.highlights.join('\n'));
                                setExpSkills(exp.skills.join(', '));
                                setShowExpForm(true);
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                if (confirm(`Delete experience entry "${exp.role}"?`)) {
                                  soundFx.playClick();
                                  if (onDeleteExperience) onDeleteExperience(exp.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================
                  SECTION 3: BACKGROUND MUSIC STUDIO
              ============================================================ */}
              {adminSection === 'music' && (
                <div className="space-y-6">
                  {/* Top Music Status Banner */}
                  <div className="p-5 rounded-3xl bg-slate-950/90 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                        <Disc className="w-6 h-6 animate-spin" style={{ animationDuration: '10s' }} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <span>Website Background Music Manager</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono">
                            {musicTracks.length} Songs Loaded
                          </span>
                        </h3>
                        <p className="text-xs text-slate-400">
                          Set default track for visitors or upload custom background audio tracks.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        soundFx.playClick();
                        setEditingSong(null);
                        setSongTitle('');
                        setSongArtist('Maruti Portfolio');
                        setSongGenre('Cyberpunk Ambient');
                        setSongDuration('3:30');
                        setSongUrl('');
                        setSongIsDefault(false);
                        setShowSongForm(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all shrink-0"
                    >
                      <Plus className="w-4 h-4" /> Add New Song
                    </button>
                  </div>

                  {/* Add / Edit Song Form */}
                  {showSongForm && (
                    <form onSubmit={handleSaveSong} className="p-5 rounded-3xl bg-slate-950 border border-emerald-500/40 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono text-emerald-400">
                          {editingSong ? 'Edit Background Song' : 'Upload / Add New Audio Track'}
                        </h4>
                        <button
                          type="button"
                          onClick={() => setShowSongForm(false)}
                          className="text-xs text-slate-400 hover:text-white font-mono"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">Song Title</label>
                          <input
                            type="text"
                            required
                            value={songTitle}
                            onChange={(e) => setSongTitle(e.target.value)}
                            placeholder="e.g., Cyberpunk Ambient Synth"
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">Artist / Composer</label>
                          <input
                            type="text"
                            value={songArtist}
                            onChange={(e) => setSongArtist(e.target.value)}
                            placeholder="Maruti Portfolio"
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">Genre Tag</label>
                          <input
                            type="text"
                            value={songGenre}
                            onChange={(e) => setSongGenre(e.target.value)}
                            placeholder="Ambient / Synthwave / Chillwave"
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">Duration</label>
                          <input
                            type="text"
                            value={songDuration}
                            onChange={(e) => setSongDuration(e.target.value)}
                            placeholder="3:45"
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>

                      {/* Audio File Upload or URL */}
                      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                        <label className="block text-xs font-bold text-white">Audio Source File</label>
                        <div className="flex flex-col sm:flex-row gap-3 items-center">
                          <label className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Audio File (.mp3, .webm)</span>
                            <input
                              type="file"
                              accept="audio/*,.mp3,.webm,.wav,.ogg"
                              onChange={handleAudioFileUpload}
                              className="hidden"
                            />
                          </label>

                          <input
                            type="text"
                            required
                            value={songUrl}
                            onChange={(e) => setSongUrl(e.target.value)}
                            placeholder="Or paste custom audio URL (e.g. /song.webm or https://...)"
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-emerald-500 font-mono"
                          />
                        </div>

                        {/* Quick Presets */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="text-[10px] font-mono text-slate-500 uppercase">Quick Presets:</span>
                          <button
                            type="button"
                            onClick={() => {
                              setSongTitle('Odnogo Ambient Synth');
                              setSongArtist('Maruti Portfolio');
                              setSongGenre('Cyberpunk Ambient');
                              setSongUrl('/song.webm');
                            }}
                            className="px-2 py-1 rounded bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-[10px] font-mono text-slate-300"
                          >
                            Preset 1: Odnogo Ambient
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSongTitle('Cybernetic Horizon');
                              setSongArtist('DeepMind Audio');
                              setSongGenre('Synthwave');
                              setSongUrl('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3');
                            }}
                            className="px-2 py-1 rounded bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-[10px] font-mono text-slate-300"
                          >
                            Preset 2: Synthwave Chill
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSongTitle('Data Stream Odyssey');
                              setSongArtist('Pulse Synth');
                              setSongGenre('Lo-Fi Beats');
                              setSongUrl('https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3');
                            }}
                            className="px-2 py-1 rounded bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-[10px] font-mono text-slate-300"
                          >
                            Preset 3: Lo-Fi Odyssey
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="chk-song-default"
                          checked={songIsDefault}
                          onChange={(e) => setSongIsDefault(e.target.checked)}
                          className="w-4 h-4 rounded bg-slate-900 border-slate-800 text-emerald-500 focus:ring-0"
                        />
                        <label htmlFor="chk-song-default" className="text-xs font-bold text-white cursor-pointer">
                          Set as Default Website Background Music
                        </label>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowSongForm(false)}
                          className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs shadow-md"
                        >
                          Save Song
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Audio Songs List */}
                  <div className="grid grid-cols-1 gap-3">
                    {musicTracks.map((track) => (
                      <div
                        key={track.id}
                        className={`p-4 rounded-2xl bg-slate-950/80 border transition-all flex items-center justify-between gap-4 ${
                          track.isDefault
                            ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                            : 'border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <button
                            onClick={() => handleTestPlaySong(track)}
                            className={`p-3 rounded-xl transition-all shrink-0 ${
                              playingSongId === track.id
                                ? 'bg-emerald-500 text-slate-950 animate-pulse'
                                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-400'
                            }`}
                            title={playingSongId === track.id ? 'Pause Preview' : 'Play Preview'}
                          >
                            {playingSongId === track.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </button>

                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-bold text-white truncate">{track.title}</h4>
                              {track.isDefault && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[9px] font-mono font-bold uppercase flex items-center gap-1">
                                  <Radio className="w-2.5 h-2.5" /> DEFAULT MUSIC
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 font-mono">
                              {track.artist} &bull; <span className="text-cyan-400">{track.genre}</span> &bull; {track.duration}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {!track.isDefault && (
                            <button
                              onClick={() => {
                                soundFx.playSuccess();
                                if (onSetDefaultTrack) onSetDefaultTrack(track.id);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-400 text-xs font-mono transition-all"
                            >
                              Set as Default
                            </button>
                          )}

                          <button
                            onClick={() => {
                              soundFx.playClick();
                              setEditingSong(track);
                              setSongTitle(track.title);
                              setSongArtist(track.artist);
                              setSongGenre(track.genre || 'Cyberpunk');
                              setSongDuration(track.duration || '3:30');
                              setSongUrl(track.url);
                              setSongIsDefault(track.isDefault);
                              setShowSongForm(true);
                            }}
                            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Delete song "${track.title}"?`)) {
                                soundFx.playClick();
                                if (onDeleteTrack) onDeleteTrack(track.id);
                              }
                            }}
                            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
