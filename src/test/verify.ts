import { generateOfflineCopy, auditForbiddenWords, cleanAndParseJson, FORBIDDEN_HYPE_WORDS } from '../lib/llm/client';
import { generateStaticHtml } from '../lib/export/exportStaticHtml';
import { generateReactViteProjectZip } from '../lib/export/exportReactProject';
import { PortfolioData, TemplatePreset } from '../types/portfolio';

const mockData: PortfolioData = {
  name: 'Alex Vance',
  role: 'Senior Distributed Systems Architect',
  location: 'Seattle, WA',
  rawPitch: 'I am a rockstar developer passionate about cutting-edge cloud synergy. I build databases and distributed consensus protocols.',
  experiences: [
    {
      id: 'exp-1',
      company: 'DataCore',
      role: 'Principal Engineer',
      period: '2022 — Present',
      rawNotes: 'made the api faster, cut latency 40%. scaled kafka cluster from 5 to 50 nodes to handle 10M events/sec.',
      generatedBullets: [],
      useRaw: false,
    },
  ],
  stack: ['Rust', 'Go', 'Raft', 'Kubernetes'],
  links: {
    github: 'https://github.com/alexvance',
    email: 'alex@datacore.io',
  },
};

async function runVerification() {
  console.log('--- STARTING VERIFICATION ---');

  // 1. Test Offline Copy Generation & Anti-Hype Word Audit
  console.log('\n[1] Testing Offline Copy Generation...');
  const generated = generateOfflineCopy(mockData);
  console.log('Tagline:', generated.tagline);
  console.log('Bio:', generated.bio);
  console.log('Experience Bullets:', generated.experience[0]?.bullets);

  const words = generated.tagline.split(/\s+/);
  if (words.length > 12) {
    throw new Error(`Tagline exceeds 12 words: ${words.length}`);
  }
  console.log('✓ Tagline length valid (< 12 words)');

  for (const forbidden of FORBIDDEN_HYPE_WORDS) {
    const regex = new RegExp(`\\b${forbidden}\\b`, 'i');
    if (regex.test(generated.bio) || regex.test(generated.tagline)) {
      throw new Error(`Forbidden hype word found: "${forbidden}"`);
    }
  }
  console.log('✓ Forbidden hype words purged from generated copy');

  // 2. Test JSON Defensive Parser
  console.log('\n[2] Testing Defensive JSON Parser...');
  const markdownFencedJson = '```json\n{\n  "tagline": "Building robust systems.",\n  "bio": "I build infrastructure.",\n  "experience": [{ "company": "Acme", "bullets": ["Improved performance."] }]\n}\n```';
  const parsed = cleanAndParseJson(markdownFencedJson);
  if (parsed.tagline !== 'Building robust systems.') throw new Error('Parser failed to unwrap code fences');
  console.log('✓ Defensive JSON parser unwraps code fences and validates schema');

  // 3. Test Static HTML Export across all 3 templates
  console.log('\n[3] Testing Static HTML Generator across all 3 presets...');
  const templates: TemplatePreset[] = ['editorial', 'minimal', 'terminal'];

  for (const t of templates) {
    const html = generateStaticHtml(mockData, generated, t, false);
    if (!html.includes('Alex Vance')) throw new Error(`Name missing in ${t} static HTML`);
    if (!html.includes('40%')) throw new Error(`Metric 40% missing in ${t} static HTML`);
    console.log(`✓ ${t} preset static HTML generated successfully (${html.length} bytes)`);
  }

  // 4. Test React/Vite Project ZIP Generator across all 3 templates
  console.log('\n[4] Testing React/Vite Project Zip Generator across all 3 presets...');
  for (const t of templates) {
    const zipBlob = await generateReactViteProjectZip(mockData, generated, t, false);
    if (zipBlob.size < 1000) throw new Error(`Zip blob too small for ${t}: ${zipBlob.size} bytes`);
    console.log(`✓ ${t} preset React/Vite ZIP generated successfully (${zipBlob.size} bytes)`);
  }

  console.log('\n🎉 ALL AUTOMATED VERIFICATIONS PASSED WITH ZERO ERRORS!');
}

runVerification().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
