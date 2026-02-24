export interface SocialLink {
  platform: string;
  url: string;
  label?: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  intro: string;
  avatar?: string;
  email: string;
  socialLinks: SocialLink[];
  seoDescription: string;
  seoKeywords?: string[];
}

export interface WorkExperience {
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate: string;
  description: string | string[];
  technologies?: string[];
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  demoUrl?: string;
  repoUrl?: string;
  featured?: boolean;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface Photograph {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  date?: string;
  location?: string;
  camera?: string;
}

export type Mode = 'developer' | 'photographer';
