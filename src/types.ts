export type SkillCategory = 'all' | 'fullstack' | 'data' | 'database' | 'cloud';

export interface Skill {
  name: string;
  category: SkillCategory;
  level: number; // 0-100
  iconName: string;
  description: string;
  yearsOfExp: number;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: 'fullstack' | 'data' | 'ai' | 'webgl';
  tags: string[];
  description: string;
  architecture: string[];
  metrics: { label: string; value: string }[];
  image: string;
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  fullDetails: {
    problem: string;
    solution: string;
    keyFeatures: string[];
    techStackDetails: { name: string; role: string }[];
    sampleDataSnippet?: string;
  };
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  type: 'Full Stack' | 'Data Analyst' | 'Hybrid';
  location: string;
  highlights: string[];
  skills: string[];
}

export interface WebGLSettings {
  meshType: 'sphere' | 'chrome' | 'torus' | 'crystal';
  colorPreset: 'cyber' | 'gold' | 'emerald' | 'cosmos';
  wireframe: boolean;
  spinSpeed: number;
  particleDensity: number;
  bloomGlow: boolean;
  trailEnabled: boolean;
}

export interface DatasetOption {
  id: string;
  name: string;
  description: string;
  columns: string[];
  data: Array<Record<string, number | string>>;
  insights: string[];
}

export interface SongTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  isDefault: boolean;
  genre?: string;
  duration?: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  email: string;
  github: string;
  linkedin: string;
  location: string;
  availability: string;
  resumeUrl?: string;
  resumeFileName?: string;
  stats?: { label: string; value: string }[];
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experiences: ExperienceItem[];
  skills: Skill[];
}

