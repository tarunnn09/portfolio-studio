import { PortfolioData } from '../../types/portfolio';

export const SYSTEM_PROMPT = `You are a senior technical copywriter who writes plain, confident, specific developer portfolio copy.
You never use hype words: "passionate", "rockstar", "ninja", "synergy", "leverage" (as a verb), "cutting-edge", "results-driven".
You never invent a metric that isn't present or clearly implied in the raw notes provided.

Given the raw input JSON below, return ONLY a raw JSON object — no markdown code fences, no prose before or after — with exactly these keys:

- "tagline": a single sentence, under 12 words
- "bio": 2-3 sentences, first person, grounded specifically in the raw pitch
- "experience": an array in the same order as the input, each item shaped
  {"company": string, "bullets": [2-3 short impact-oriented strings]}`;

export const RETRY_REMINDER_PROMPT = `Your previous output could not be parsed as valid JSON or was missing required keys.
Return ONLY valid JSON matching this exact structure:
{
  "tagline": "string under 12 words",
  "bio": "2-3 sentences in first person",
  "experience": [
    { "company": "string", "bullets": ["string", "string"] }
  ]
}
DO NOT wrap in markdown code blocks. DO NOT output any text before or after the JSON.`;

export function serializePortfolioInput(data: PortfolioData): string {
  const payload = {
    name: data.name,
    role: data.role,
    location: data.location,
    pitch: data.rawPitch,
    experiences: data.experiences.map((exp) => ({
      company: exp.company,
      role: exp.role,
      period: exp.period,
      rawNotes: exp.rawNotes,
    })),
    stack: data.stack,
  };

  return JSON.stringify(payload, null, 2);
}
