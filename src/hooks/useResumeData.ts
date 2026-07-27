import { useState, useEffect } from 'react';
import { ResumeData, PersonalInfo, ExperienceItem, Skill } from '../types';
import { PERSONAL_INFO, EXPERIENCE_DATA, SKILLS_DATA } from '../data/portfolioData';

const RESUME_STORAGE_KEY = 'portfolio_resume_data_v1';

export const DEFAULT_RESUME_DATA: ResumeData = {
  personalInfo: {
    ...PERSONAL_INFO,
    resumeUrl: '',
    resumeFileName: ''
  },
  experiences: EXPERIENCE_DATA,
  skills: SKILLS_DATA
};

export function useResumeData() {
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    try {
      const stored = localStorage.getItem(RESUME_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.personalInfo && Array.isArray(parsed.experiences)) {
          return {
            personalInfo: { ...DEFAULT_RESUME_DATA.personalInfo, ...parsed.personalInfo },
            experiences: parsed.experiences || EXPERIENCE_DATA,
            skills: parsed.skills || SKILLS_DATA
          };
        }
      }
    } catch (err) {
      console.warn('Failed to load resume data from localStorage:', err);
    }
    return DEFAULT_RESUME_DATA;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(resumeData));
    } catch (err) {
      console.warn('Failed to save resume data to localStorage:', err);
    }
  }, [resumeData]);

  const updatePersonalInfo = (info: Partial<PersonalInfo>) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        ...info
      }
    }));
  };

  const updateExperiences = (experiences: ExperienceItem[]) => {
    setResumeData((prev) => ({
      ...prev,
      experiences
    }));
  };

  const addExperience = (newExp: Omit<ExperienceItem, 'id'>) => {
    const id = `exp-${Date.now()}`;
    const item: ExperienceItem = { ...newExp, id };
    setResumeData((prev) => ({
      ...prev,
      experiences: [item, ...prev.experiences]
    }));
  };

  const updateExperienceItem = (updated: ExperienceItem) => {
    setResumeData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) => (exp.id === updated.id ? updated : exp))
    }));
  };

  const deleteExperience = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((exp) => exp.id !== id)
    }));
  };

  const resetResumeToDefaults = () => {
    setResumeData(DEFAULT_RESUME_DATA);
    try {
      localStorage.removeItem(RESUME_STORAGE_KEY);
    } catch (err) {
      console.warn(err);
    }
  };

  return {
    resumeData,
    personalInfo: resumeData.personalInfo,
    experiences: resumeData.experiences,
    skills: resumeData.skills,
    updatePersonalInfo,
    updateExperiences,
    addExperience,
    updateExperienceItem,
    deleteExperience,
    resetResumeToDefaults
  };
}
