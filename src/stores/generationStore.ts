import { create } from 'zustand';
import { GeneratedCopy, LLMConfig } from '../types/portfolio';

const STORAGE_KEY_API_KEY = 'portfolio_studio_anthropic_key';
const STORAGE_KEY_MODEL = 'portfolio_studio_anthropic_model';

const initialApiKey = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_API_KEY) || '' : '';
const initialModel = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_MODEL) || 'claude-3-5-haiku-latest' : 'claude-3-5-haiku-latest';

interface GenerationState {
  status: 'idle' | 'generating' | 'success' | 'error';
  lastGeneratedCopy: GeneratedCopy | null;
  error: string | null;
  retryCount: number;
  flashingFields: string[];
  llmConfig: LLMConfig;

  setConfig: (config: Partial<LLMConfig>) => void;
  setGenerating: () => void;
  setSuccess: (copy: GeneratedCopy, modifiedFieldKeys?: string[]) => void;
  setError: (error: string) => void;
  clearFlash: () => void;
  reset: () => void;
}

export const useGenerationStore = create<GenerationState>((set) => ({
  status: 'idle',
  lastGeneratedCopy: {
    tagline: 'Engineering low-latency distributed primitives with deterministic uptime.',
    bio: 'I build resilient distributed infrastructure and local-first execution runtimes. My focus is on making latency predictable and edge systems reliable under extreme load.',
    experience: [
      {
        company: 'Linear',
        bullets: [
          'Engineered offline-first sync engine in Rust/WASM, decreasing desktop cold launch latency from 2.4s to 480ms.',
          'Reduced memory footprint 35% while sustaining 99.99% sync uptime across 4x surge in daily active users.',
        ],
      },
      {
        company: 'Vercel',
        bullets: [
          'Architected edge middleware routing proxy in Go, serving 120k requests/sec at sub-8ms p99 latency.',
          'Designed automated canary verification pipelines, removing multi-tenant deployment regressions.',
        ],
      },
    ],
  },
  error: null,
  retryCount: 0,
  flashingFields: [],
  llmConfig: {
    apiKey: initialApiKey,
    model: initialModel,
    useOfflineFallback: !initialApiKey,
  },

  setConfig: (config) =>
    set((state) => {
      const updated = { ...state.llmConfig, ...config };
      if (typeof window !== 'undefined') {
        if (config.apiKey !== undefined) localStorage.setItem(STORAGE_KEY_API_KEY, config.apiKey);
        if (config.model !== undefined) localStorage.setItem(STORAGE_KEY_MODEL, config.model);
      }
      return { llmConfig: updated };
    }),

  setGenerating: () =>
    set({
      status: 'generating',
      error: null,
    }),

  setSuccess: (copy, modifiedFieldKeys = ['tagline', 'bio', 'experience']) =>
    set({
      status: 'success',
      lastGeneratedCopy: copy,
      error: null,
      flashingFields: modifiedFieldKeys,
      retryCount: 0,
    }),

  setError: (error) =>
    set((state) => ({
      status: 'error',
      error,
      retryCount: state.retryCount + 1,
    })),

  clearFlash: () => set({ flashingFields: [] }),

  reset: () =>
    set({
      status: 'idle',
      error: null,
      flashingFields: [],
    }),
}));
