import { useState, useEffect } from 'react';
import { Project } from '../types';
import { PROJECTS_DATA } from '../data/portfolioData';

const STORAGE_KEY = 'portfolio_projects_data_v1';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to load projects from localStorage:', err);
    }
    return PROJECTS_DATA;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (err) {
      console.warn('Failed to save projects to localStorage:', err);
    }
  }, [projects]);

  // Add new project
  const addProject = (newProject: Omit<Project, 'id'> & { id?: string }) => {
    const id = newProject.id || `proj-${Date.now()}`;
    const projectWithId: Project = { ...newProject, id };
    setProjects((prev) => [projectWithId, ...prev]);
    return projectWithId;
  };

  // Update existing project
  const updateProject = (updatedProject: Project) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
  };

  // Delete project
  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  // Toggle featured status
  const toggleFeatured = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
    );
  };

  // Reset to initial default projects
  const resetToDefaults = () => {
    setProjects(PROJECTS_DATA);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn(err);
    }
  };

  return {
    projects,
    addProject,
    updateProject,
    deleteProject,
    toggleFeatured,
    resetToDefaults
  };
}
