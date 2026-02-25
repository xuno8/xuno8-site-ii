import type {
  SiteConfig,
  WorkExperience,
  Project,
  SkillCategory,
  Photograph,
  GearItem,
} from '@/types';
import siteData from '@data/site.yaml';
import experienceData from '@data/experience.yaml';
import projectsData from '@data/projects.yaml';
import skillsData from '@data/skills.yaml';
import photosData from '@data/photos.yaml';
import gearData from '@data/gear.yaml';

export function loadSiteConfig(): SiteConfig {
  return siteData as SiteConfig;
}

export function loadExperience(): WorkExperience[] {
  return experienceData as WorkExperience[];
}

export function loadProjects(): Project[] {
  return projectsData as Project[];
}

export function loadSkills(): SkillCategory[] {
  return skillsData as SkillCategory[];
}

export function loadPhotos(): Photograph[] {
  return photosData as Photograph[];
}

export function loadGear(): GearItem[] {
  return gearData as GearItem[];
}
