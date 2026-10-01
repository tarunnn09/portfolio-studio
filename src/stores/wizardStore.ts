import { create } from 'zustand';
import { PortfolioData, TemplatePreset, ViewportMode, DisplayMode, ExperienceItem, SocialLinks } from '../types/portfolio';

const INITIAL_EXPERIENCES: ExperienceItem[] = [
  {
    id: 'exp-1',
    company: 'Linear',
    role: 'Staff Systems Engineer',
    period: '2023 — Present',
    rawNotes: 'rebuilt client sync engine in rust/wasm, reduced cold launch time from 2.4s to 480ms across desktop apps. cut memory footprint 35%. maintained 99.99% sync reliability during 4x daus surge.',
    generatedBullets: [
      'Engineered offline-first sync engine in Rust/WASM, decreasing desktop cold launch latency from 2.4s to 480ms.',
      'Reduced memory footprint 35% while sustaining 99.99% sync uptime across 4x surge in daily active users.',
    ],
    useRaw: false,
  },
  {
    id: 'exp-2',
    company: 'Vercel',
    role: 'Senior Infrastructure Engineer',
    period: '2021 — 2023',
    rawNotes: 'designed routing layer for edge middleware. rewrote go-based proxy to handle 120k rps at p99 < 8ms. automated canary verification to eliminate multi-tenant deployment regressions.',
    generatedBullets: [
      'Architected edge middleware routing proxy in Go, serving 120k requests/sec at sub-8ms p99 latency.',
      'Designed automated canary verification pipelines, removing multi-tenant deployment regressions.',
    ],
    useRaw: false,
  },
];

const INITIAL_DATA: PortfolioData = {
  name: 'Elena Rostova',
  role: 'Systems & Distributed Infrastructure Engineer',
  location: 'San Francisco, CA',
  rawPitch: 'I spend my days making distributed systems fast, predictable, and resilient under harsh failure modes. Built edge proxies, consensus engines, and local-first desktop runtimes.',
  experiences: INITIAL_EXPERIENCES,
  stack: ['Rust', 'Go', 'TypeScript', 'WASM', 'Distributed Systems', 'Raft', 'eBPF', 'React'],
  links: {
    github: 'https://github.com/erostova',
    linkedin: 'https://linkedin.com/in/elena-rostova',
    email: 'elena@rostova.systems',
    website: 'https://rostova.systems',
  },
};

interface WizardState {
  currentStep: number;
  direction: 1 | -1;
  data: PortfolioData;
  template: TemplatePreset;
  viewport: ViewportMode;
  displayMode: DisplayMode;
  useRawPitch: boolean;

  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateBasics: (fields: Partial<Pick<PortfolioData, 'name' | 'role' | 'location' | 'rawPitch'>>) => void;
  addExperience: () => void;
  updateExperience: (id: string, fields: Partial<ExperienceItem>) => void;
  removeExperience: (id: string) => void;
  reorderExperience: (fromIndex: number, toIndex: number) => void;
  toggleExperienceUseRaw: (id: string) => void;
  setExperienceBullets: (company: string, bullets: string[]) => void;
  addStackTag: (tag: string) => void;
  removeStackTag: (tag: string) => void;
  updateLinks: (links: Partial<SocialLinks>) => void;
  setTemplate: (template: TemplatePreset) => void;
  setViewport: (viewport: ViewportMode) => void;
  setDisplayMode: (mode: DisplayMode) => void;
  toggleUseRawPitch: () => void;
  loadSampleData: () => void;
  clearData: () => void;
}

export const useWizardStore = create<WizardState>((set) => ({
  currentStep: 1,
  direction: 1,
  data: INITIAL_DATA,
  template: 'editorial',
  viewport: 'desktop',
  displayMode: 'generated',
  useRawPitch: false,

  setStep: (step: number) =>
    set((state) => ({
      currentStep: step,
      direction: step >= state.currentStep ? 1 : -1,
    })),

  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, 4),
      direction: 1,
    })),

  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1),
      direction: -1,
    })),

  updateBasics: (fields) =>
    set((state) => ({
      data: { ...state.data, ...fields },
    })),

  addExperience: () =>
    set((state) => ({
      data: {
        ...state.data,
        experiences: [
          ...state.data.experiences,
          {
            id: `exp-${Date.now()}`,
            company: '',
            role: '',
            period: '',
            rawNotes: '',
            generatedBullets: [],
            useRaw: false,
          },
        ],
      },
    })),

  updateExperience: (id, fields) =>
    set((state) => ({
      data: {
        ...state.data,
        experiences: state.data.experiences.map((item) =>
          item.id === id ? { ...item, ...fields } : item
        ),
      },
    })),

  removeExperience: (id) =>
    set((state) => ({
      data: {
        ...state.data,
        experiences: state.data.experiences.filter((item) => item.id !== id),
      },
    })),

  reorderExperience: (fromIndex, toIndex) =>
    set((state) => {
      const items = [...state.data.experiences];
      if (toIndex < 0 || toIndex >= items.length) return state;
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      return {
        data: { ...state.data, experiences: items },
      };
    }),

  toggleExperienceUseRaw: (id) =>
    set((state) => ({
      data: {
        ...state.data,
        experiences: state.data.experiences.map((item) =>
          item.id === id ? { ...item, useRaw: !item.useRaw } : item
        ),
      },
    })),

  setExperienceBullets: (company, bullets) =>
    set((state) => ({
      data: {
        ...state.data,
        experiences: state.data.experiences.map((item) =>
          item.company.toLowerCase().trim() === company.toLowerCase().trim()
            ? { ...item, generatedBullets: bullets, useRaw: false }
            : item
        ),
      },
    })),

  addStackTag: (tag) =>
    set((state) => {
      const trimmed = tag.trim();
      if (!trimmed || state.data.stack.includes(trimmed)) return state;
      return {
        data: { ...state.data, stack: [...state.data.stack, trimmed] },
      };
    }),

  removeStackTag: (tag) =>
    set((state) => ({
      data: {
        ...state.data,
        stack: state.data.stack.filter((t) => t !== tag),
      },
    })),

  updateLinks: (links) =>
    set((state) => ({
      data: {
        ...state.data,
        links: { ...state.data.links, ...links },
      },
    })),

  setTemplate: (template) => set({ template }),
  setViewport: (viewport) => set({ viewport }),
  setDisplayMode: (displayMode) => set({ displayMode }),
  toggleUseRawPitch: () => set((state) => ({ useRawPitch: !state.useRawPitch })),

  loadSampleData: () => set({ data: INITIAL_DATA, useRawPitch: false }),

  clearData: () =>
    set({
      data: {
        name: '',
        role: '',
        location: '',
        rawPitch: '',
        experiences: [],
        stack: [],
        links: {},
      },
    }),
}));
