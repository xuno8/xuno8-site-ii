/**
 * Data Schemas — TypeScript interfaces for YAML data file contracts.
 *
 * These types define the shape of content loaded from src/data/*.yaml
 * at build time. Implementation MUST conform to these interfaces.
 *
 * Feature: 001-dual-mode-portfolio
 */

// ---------------------------------------------------------------------------
// Site Configuration (src/data/site.yaml)
// ---------------------------------------------------------------------------

export interface SocialLink {
  /** Platform identifier: "github" | "linkedin" | "twitter" | etc. */
  platform: string;
  /** Full URL to the profile */
  url: string;
  /** Accessible label (defaults to platform name if omitted) */
  label?: string;
}

export interface SiteConfig {
  /** Site owner's full name */
  name: string;
  /** Professional title */
  title: string;
  /** 1–2 sentence introduction for Hero section */
  intro: string;
  /** Relative path to avatar image in src/assets/images/ */
  avatar?: string;
  /** Contact email address */
  email: string;
  /** Social media profiles for footer */
  socialLinks: SocialLink[];
  /** Meta description for SEO / Open Graph */
  seoDescription: string;
  /** Meta keywords */
  seoKeywords?: string[];
}

// ---------------------------------------------------------------------------
// Work Experience (src/data/experience.yaml)
// ---------------------------------------------------------------------------

export interface WorkExperience {
  /** Company or organization name */
  company: string;
  /** Job title / role */
  role: string;
  /** Start date in YYYY-MM format */
  startDate: string;
  /** End date in YYYY-MM format, or "present" for current role */
  endDate: string;
  /** Responsibilities and achievements (supports Markdown) */
  description: string;
  /** Key technologies used in this role */
  technologies?: string[];
}

// ---------------------------------------------------------------------------
// Projects (src/data/projects.yaml)
// ---------------------------------------------------------------------------

export interface Project {
  /** Project name */
  title: string;
  /** Brief description of the project */
  description: string;
  /** Technologies / frameworks used */
  technologies: string[];
  /** URL to live demo */
  demoUrl?: string;
  /** URL to source repository */
  repoUrl?: string;
  /** Whether to highlight this project */
  featured?: boolean;
}

// ---------------------------------------------------------------------------
// Skills (src/data/skills.yaml)
// ---------------------------------------------------------------------------

export interface SkillCategory {
  /** Category name (e.g., "Languages", "Frameworks", "Tools") */
  category: string;
  /** List of skill names in this category */
  skills: string[];
}

// ---------------------------------------------------------------------------
// Photography (src/data/photos.yaml)
// ---------------------------------------------------------------------------

export interface Photograph {
  /** Relative path to source image in src/assets/images/gallery/ */
  src: string;
  /** Descriptive alt text (required for accessibility) */
  alt: string;
  /** Display caption shown in lightbox */
  caption?: string;
  /** Date taken in YYYY-MM-DD format */
  date?: string;
  /** Location where the photo was taken */
  location?: string;
  /** Camera / lens information */
  camera?: string;
  /** Width/height ratio for layout placeholder */
  aspectRatio?: number;
}

// ---------------------------------------------------------------------------
// Runtime State (not persisted in YAML)
// ---------------------------------------------------------------------------

export type Mode = 'developer' | 'photographer';
