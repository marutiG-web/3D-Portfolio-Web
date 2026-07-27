import React from 'react';
import { Hero } from './Hero';
import { ParallaxSection } from './ParallaxSection';
import { AboutSection } from './AboutSection';
import { TechStackSection } from './TechStackSection';
import { ProjectsSection } from './ProjectsSection';
import { DataAnalystWorkbench } from './DataAnalystWorkbench';
import { ArchitectureInspector } from './ArchitectureInspector';
import { ExperienceTimeline } from './ExperienceTimeline';
import { ContactSection } from './ContactSection';
import { Project } from '../types';

interface PortfolioSectionsProps {
  projects: Project[];
  onOpenStudio: () => void;
  onOpenAdmin: () => void;
  isLoopCopy?: boolean;
}

export const PortfolioSections: React.FC<PortfolioSectionsProps> = ({
  projects,
  onOpenStudio,
  onOpenAdmin,
  isLoopCopy = false
}) => {
  return (
    <div className="space-y-20 py-8">
      {/* Section 1: Hero */}
      <div className="w-full max-w-7xl mx-auto">
        <Hero onOpenStudio={onOpenStudio} />
      </div>

      {/* Section 1.5: High-Performance Parallax Section */}
      <ParallaxSection />

      {/* Section 2: About */}
      <div className="w-full max-w-7xl mx-auto lg:pl-0 lg:pr-12">
        <AboutSection />
      </div>

      {/* Section 3: Tech Stack */}
      <div className="w-full max-w-7xl mx-auto lg:pl-12 lg:pr-0">
        <TechStackSection />
      </div>

      {/* Section 4: Projects */}
      <div className="w-full max-w-7xl mx-auto lg:pl-0 lg:pr-12">
        <ProjectsSection projects={projects} onOpenAdmin={onOpenAdmin} />
      </div>

      {/* Section 5: Data Analyst Workbench */}
      <div className="w-full max-w-7xl mx-auto lg:pl-12 lg:pr-0">
        <DataAnalystWorkbench />
      </div>

      {/* Section 6: Architecture Inspector */}
      <div className="w-full max-w-7xl mx-auto lg:pl-0 lg:pr-12">
        <ArchitectureInspector />
      </div>

      {/* Section 7: Experience */}
      <div className="w-full max-w-7xl mx-auto lg:pl-12 lg:pr-0">
        <ExperienceTimeline />
      </div>

      {/* Section 8: Contact */}
      <div className="w-full max-w-7xl mx-auto">
        <ContactSection />
      </div>
    </div>
  );
};
