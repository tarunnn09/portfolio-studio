import { PortfolioData, GeneratedCopy, LLMConfig } from '../../types/portfolio';
import { SYSTEM_PROMPT, RETRY_REMINDER_PROMPT, serializePortfolioInput } from './prompts';

export const FORBIDDEN_HYPE_WORDS = [
  'passionate',
  'rockstar',
  'ninja',
  'synergy',
  'leverage',
  'cutting-edge',
  'results-driven',
  'game-changer',
  'visionary',
  'dynamic',
];

/**
 * Audit and purge any forbidden buzzwords from the generated copy.
 */
export function auditForbiddenWords(copy: GeneratedCopy): { cleaned: GeneratedCopy; flaggedWords: string[] } {
  const flagged = new Set<string>();

  const sanitizeText = (text: string): string => {
    let result = text;
    for (const word of FORBIDDEN_HYPE_WORDS) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      if (regex.test(result)) {
        flagged.add(word);
        result = result.replace(regex, (match) => {
          if (match.toLowerCase() === 'leverage') return 'utilize';
          if (match.toLowerCase() === 'cutting-edge') return 'modern';
          if (match.toLowerCase() === 'results-driven') return 'impact-focused';
          return '';
        });
      }
    }
    return result.replace(/\s{2,}/g, ' ').trim();
  };

  const cleaned: GeneratedCopy = {
    tagline: sanitizeText(copy.tagline),
    bio: sanitizeText(copy.bio),
    experience: copy.experience.map((exp) => ({
      company: exp.company,
      bullets: exp.bullets.map((b) => sanitizeText(b)),
    })),
  };

  return { cleaned, flaggedWords: Array.from(flagged) };
}

/**
 * Defensive parser that strips markdown code blocks and validates schema.
 */
export function cleanAndParseJson(rawResponse: string): GeneratedCopy {
  let cleaned = rawResponse.trim();

  // Strip code blocks like ```json ... ``` or ``` ... ```
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
  cleaned = cleaned.replace(/\s*```$/i, '');
  cleaned = cleaned.trim();

  // Find first { and last }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  const parsed = JSON.parse(cleaned);

  if (typeof parsed.tagline !== 'string' || !parsed.tagline.trim()) {
    throw new Error('Missing or invalid "tagline" in LLM response.');
  }

  if (typeof parsed.bio !== 'string' || !parsed.bio.trim()) {
    throw new Error('Missing or invalid "bio" in LLM response.');
  }

  if (!Array.isArray(parsed.experience)) {
    throw new Error('Missing or invalid "experience" array in LLM response.');
  }

  const validatedExperience = parsed.experience.map((item: any, idx: number) => {
    return {
      company: typeof item.company === 'string' ? item.company : `Role ${idx + 1}`,
      bullets: Array.isArray(item.bullets)
        ? item.bullets.filter((b: any) => typeof b === 'string' && b.trim().length > 0)
        : [],
    };
  });

  return {
    tagline: parsed.tagline.trim(),
    bio: parsed.bio.trim(),
    experience: validatedExperience,
  };
}

/**
 * Offline Smart Fallback Engine:
 * Generates crisp, impact-first copy following the exact PRD guidelines without external network access.
 */
export function generateOfflineCopy(data: PortfolioData): GeneratedCopy {
  // Extract key verbs and metrics from raw notes
  const role = data.role.trim() || 'Software Engineer';
  const rawPitch = data.rawPitch.trim();

  // Generate crisp tagline under 12 words
  let tagline = `Building resilient, high-performance systems and developer tooling.`;
  if (role) {
    tagline = `${role} focused on high-throughput systems and reliable architecture.`;
  }
  // Enforce under 12 words
  const words = tagline.split(/\s+/);
  if (words.length > 11) {
    tagline = words.slice(0, 10).join(' ') + '.';
  }

  // Generate 2-3 sentence grounded first-person bio
  let bio = '';
  if (rawPitch) {
    const sentences = rawPitch.split(/(?<=[.!?])\s+/).filter(Boolean);
    if (sentences.length >= 2) {
      bio = sentences.slice(0, 3).join(' ');
    } else {
      bio = `${rawPitch} My focus is on turning complex architectural challenges into fast, maintainable software.`;
    }
  } else {
    bio = `I am a ${role} with experience designing performant, production-grade applications. I focus on measurable outcomes, technical depth, and clean system boundaries.`;
  }

  // Generate impact bullets for each experience entry
  const experience = data.experiences.map((exp) => {
    const raw = exp.rawNotes.trim();
    if (!raw) {
      return {
        company: exp.company || 'Company',
        bullets: [
          `Engineered core services and user-facing features for ${exp.role || 'engineering team'}.`,
          `Improved delivery velocity while maintaining high code quality and test coverage.`,
        ],
      };
    }

    // Split raw notes by line breaks, semicolons, or commas
    const rawChunks = raw
      .split(/\n|;|\.\s+/)
      .map((c) => c.trim().replace(/^[-•*]\s*/, ''))
      .filter((c) => c.length > 5);

    const bullets: string[] = [];

    for (const chunk of rawChunks) {
      if (bullets.length >= 3) break;

      // Capitalize first character and ensure terminal period
      let bullet = chunk.charAt(0).toUpperCase() + chunk.slice(1);
      if (!bullet.endsWith('.')) bullet += '.';

      // Sharpen common passive phrases
      bullet = bullet
        .replace(/\bmade the api faster\b/gi, 'optimized API endpoints to reduce query latency')
        .replace(/\bhelped with\b/gi, 'collaborated on')
        .replace(/\bworked on\b/gi, 'engineered')
        .replace(/\bfixed bugs\b/gi, 'resolved critical production stability issues')
        .replace(/\bdeployed to prod\b/gi, 'automated production deployment workflows');

      bullets.push(bullet);
    }

    if (bullets.length === 0) {
      bullets.push(`Led engineering initiatives for ${exp.company}, delivering critical product milestones.`);
    }

    return {
      company: exp.company || 'Company',
      bullets,
    };
  });

  const rawCopy: GeneratedCopy = { tagline, bio, experience };
  const { cleaned } = auditForbiddenWords(rawCopy);
  return cleaned;
}

/**
 * Main copy generation dispatcher: calls Anthropic Claude or falls back to offline engine.
 */
export async function generatePortfolioCopy(
  data: PortfolioData,
  config: LLMConfig
): Promise<GeneratedCopy> {
  const apiKey = config.apiKey?.trim();

  // If user explicitly chose offline fallback or no key is configured, use offline engine
  if (config.useOfflineFallback || !apiKey) {
    // Simulate brief 300ms calculation delay for realistic feel
    await new Promise((r) => setTimeout(r, 300));
    return generateOfflineCopy(data);
  }

  const userPrompt = serializePortfolioInput(data);
  const activeModel = config.model || 'claude-3-5-haiku-latest';

  // Determine endpoint: check if Vite dev proxy is reachable, else direct browser fetch
  const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  const endpoint = isLocalhost ? '/api/anthropic/messages' : 'https://api.anthropic.com/v1/messages';

  const makeRequest = async (promptContent: string) => {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'anthropic-dangerous-direct-browser-access': 'true',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: activeModel,
        max_tokens: 1200,
        temperature: 0.2,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: promptContent }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      let errorJson: any = null;
      try {
        errorJson = JSON.parse(errText);
      } catch {
        // non-json error
      }

      const msg = errorJson?.error?.message || errText || `HTTP ${response.status}`;

      if (response.status === 404 || msg.toLowerCase().includes('model')) {
        throw new Error(
          `Anthropic API Error (Model Not Found or Retired): "${activeModel}". Please check the model ID in settings (e.g. claude-3-5-haiku-latest or claude-3-7-sonnet-latest) or switch to Offline Engine.`
        );
      }
      if (response.status === 401) {
        throw new Error('Invalid Anthropic API Key. Please verify your key in settings.');
      }
      throw new Error(`Anthropic API Error (${response.status}): ${msg}`);
    }

    const dataJson = await response.json();
    const textContent =
      dataJson?.content?.find((c: any) => c.type === 'text')?.text ||
      (typeof dataJson?.content === 'string' ? dataJson.content : '');

    if (!textContent) {
      throw new Error('Empty response received from Claude API.');
    }

    return textContent;
  };

  try {
    const rawResult = await makeRequest(userPrompt);
    try {
      const parsed = cleanAndParseJson(rawResult);
      const { cleaned } = auditForbiddenWords(parsed);
      return cleaned;
    } catch (parseError) {
      // Retry once with stricter reminder
      const retryResult = await makeRequest(`${userPrompt}\n\n${RETRY_REMINDER_PROMPT}`);
      const retryParsed = cleanAndParseJson(retryResult);
      const { cleaned } = auditForbiddenWords(retryParsed);
      return cleaned;
    }
  } catch (err: any) {
    console.warn('Claude API request failed; user can review error or use offline fallback:', err);
    throw err;
  }
}
