export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  rawNotes: string;
  generatedBullets?: string[];
  useRaw?: boolean; // field-level revert flag
}

export interface GeneratedCopy {
  tagline: string;
  bio: string;
  experience: Array<{
    company: string;
    bullets: string[];
  }>;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  email?: string;
  website?: string;
}

export interface PortfolioData {
  name: string;
  role: string;
  location: string;
  rawPitch: string;
  experiences: ExperienceItem[];
  stack: string[];
  links: SocialLinks;
}

export type TemplatePreset = 'editorial' | 'minimal' | 'terminal';
export type ViewportMode = 'desktop' | 'mobile';
export type DisplayMode = 'generated' | 'raw' | 'diff';

export interface LLMConfig {
  apiKey: string;
  model: string;
  useOfflineFallback: boolean;
}
