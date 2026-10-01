import JSZip from 'jszip';
import { PortfolioData, TemplatePreset, GeneratedCopy } from '../../types/portfolio';

export async function generateReactViteProjectZip(
  data: PortfolioData,
  generatedCopy: GeneratedCopy | null,
  template: TemplatePreset,
  useRawPitch: boolean
): Promise<Blob> {
  const zip = new JSZip();

  const finalBio = useRawPitch
    ? data.rawPitch
    : generatedCopy?.bio || data.rawPitch;

  const finalTagline = generatedCopy?.tagline || data.role;

  const finalExperiences = data.experiences.map((exp) => {
    const aiExp = generatedCopy?.experience.find(
      (item) => item.company.toLowerCase() === exp.company.toLowerCase()
    );
    return {
      company: exp.company,
      role: exp.role,
      period: exp.period,
      bullets:
        exp.useRaw || !exp.generatedBullets || exp.generatedBullets.length === 0
          ? aiExp?.bullets || [exp.rawNotes]
          : exp.generatedBullets,
    };
  });

  // 1. package.json
  const packageJson = {
    name: `portfolio-${(data.name || 'developer').toLowerCase().replace(/\s+/g, '-')}`,
    private: true,
    version: '1.0.0',
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'tsc && vite build',
      preview: 'vite preview',
    },
    dependencies: {
      react: '^18.3.1',
      'react-dom': '^18.3.1',
      'lucide-react': '^0.453.0',
    },
    devDependencies: {
      '@types/react': '^18.3.11',
      '@types/react-dom': '^18.3.1',
      '@vitejs/plugin-react': '^4.3.2',
      typescript: '^5.6.3',
      vite: '^5.4.9',
    },
  };
  zip.file('package.json', JSON.stringify(packageJson, null, 2));

  // 2. vite.config.ts
  const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
`;
  zip.file('vite.config.ts', viteConfig);

  // 3. tsconfig.json
  const tsConfig = `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": false,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true
  },
  "include": ["src"]
}
`;
  zip.file('tsconfig.json', tsConfig);

  // 4. index.html
  const fontsHtml =
    template === 'editorial'
      ? `<link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&family=Manrope:wght@400;500;600&display=swap" rel="stylesheet">`
      : template === 'minimal'
      ? `<link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Manrope:wght@300;400;600;700;800&display=swap" rel="stylesheet">`
      : `<link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Manrope:wght@400;500;600&display=swap" rel="stylesheet">`;

  const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${data.name || 'Portfolio'} — ${data.role || 'Software Engineer'}</title>
    ${fontsHtml}
    <style>
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html, body, #root { height: 100%; width: 100%; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
  zip.file('index.html', indexHtml);

  // 5. src/portfolio.config.ts (Typed configuration with user data baked in)
  const portfolioConfig = `export interface PortfolioConfig {
  name: string;
  role: string;
  location: string;
  tagline: string;
  bio: string;
  experiences: Array<{
    company: string;
    role: string;
    period: string;
    bullets: string[];
  }>;
  stack: string[];
  links: {
    github?: string;
    linkedin?: string;
    email?: string;
    website?: string;
  };
}

export const portfolioConfig: PortfolioConfig = ${JSON.stringify(
    {
      name: data.name,
      role: data.role,
      location: data.location,
      tagline: finalTagline,
      bio: finalBio,
      experiences: finalExperiences,
      stack: data.stack,
      links: data.links,
    },
    null,
    2
  )};
`;
  zip.file('src/portfolio.config.ts', portfolioConfig);

  // 6. src/main.tsx
  const mainTsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;
  zip.file('src/main.tsx', mainTsx);

  // 7. Template Component (ONLY the selected template code is exported!)
  let templateCode = '';
  if (template === 'editorial') {
    templateCode = `import React from 'react';
import { portfolioConfig } from './portfolio.config';
import { ArrowUpRight } from 'lucide-react';

export default function App() {
  const { name, role, location, tagline, bio, experiences, stack, links } = portfolioConfig;

  return (
    <div style={{
      backgroundColor: '#FAFAF8',
      color: '#1A1815',
      minHeight: '100vh',
      padding: '64px 28px',
      fontFamily: "'Manrope', sans-serif",
      lineHeight: 1.6,
    }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
        <header style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h1 style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: '44px',
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: '#1A1815',
              margin: 0,
            }}>
              {name}
            </h1>
            {location && (
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#8A8780', textTransform: 'lowercase' }}>
                {location}
              </span>
            )}
          </div>
          <p style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontSize: '22px', lineHeight: 1.3, color: '#524F49', margin: 0 }}>
            {tagline}
          </p>
          <hr style={{ border: 'none', height: '1px', backgroundColor: 'rgba(26, 24, 21, 0.12)', margin: '12px 0 4px' }} />
        </header>

        <section style={{ borderLeft: '2px solid #A9720A', paddingLeft: '20px', margin: '0 0 8px 0' }}>
          <p style={{ fontSize: '16px', lineHeight: 1.65, color: '#2A2723', margin: 0 }}>
            {bio}
          </p>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: '24px', fontWeight: 400, color: '#1A1815', margin: 0 }}>
            Selected Experience
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', paddingLeft: '18px', borderLeft: '1px solid rgba(26, 24, 21, 0.14)' }}>
            {experiences.map((exp, idx) => (
              <div key={idx} style={{ position: 'relative', paddingBottom: idx === experiences.length - 1 ? 0 : '32px' }}>
                <span style={{ position: 'absolute', left: '-22px', top: '6px', width: '7px', height: '7px', borderRadius: '50%', backgroundColor: idx === 0 ? '#A9720A' : '#1A1815' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: '#1A1815' }}>{exp.company}</span>
                    <span style={{ fontSize: '13px', color: '#6A6760' }}>· {exp.role}</span>
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#8A8780' }}>{exp.period}</span>
                </div>
                <ul style={{ paddingLeft: '16px', margin: '6px 0 0', fontSize: '13px', color: '#3A3833', lineHeight: 1.6 }}>
                  {exp.bullets.map((b, bIdx) => (
                    <li key={bIdx} style={{ marginBottom: '4px' }}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {stack.length > 0 && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#8A8780', textTransform: 'lowercase' }}>
              stack:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {stack.map((tech) => (
                <span key={tech} style={{ display: 'inline-block', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#3A3833', backgroundColor: 'rgba(26, 24, 21, 0.05)', padding: '2px 8px', borderRadius: '2px' }}>
                  {tech.toLowerCase()}
                </span>
              ))}
            </div>
          </section>
        )}

        <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', borderTop: '1px solid rgba(26, 24, 21, 0.12)' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {links.github && <a href={links.github} target="_blank" rel="noreferrer" style={{ color: '#1A1815', textDecoration: 'none', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}><span>github</span><ArrowUpRight size={12} color="#A9720A" /></a>}
            {links.linkedin && <a href={links.linkedin} target="_blank" rel="noreferrer" style={{ color: '#1A1815', textDecoration: 'none', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}><span>linkedin</span><ArrowUpRight size={12} color="#A9720A" /></a>}
            {links.website && <a href={links.website} target="_blank" rel="noreferrer" style={{ color: '#1A1815', textDecoration: 'none', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}><span>website</span><ArrowUpRight size={12} color="#A9720A" /></a>}
          </div>
          {links.email && (
            <a href={\`mailto:\${links.email}\`} style={{ fontFamily: "'Manrope', sans-serif", fontSize: '12px', fontWeight: 600, color: '#FFFFFF', backgroundColor: '#A9720A', padding: '6px 14px', borderRadius: '3px', textDecoration: 'none' }}>
              Get in touch
            </a>
          )}
        </footer>
      </div>
    </div>
  );
}
`;
  } else if (template === 'minimal') {
    templateCode = `import React from 'react';
import { portfolioConfig } from './portfolio.config';
import { ArrowUpRight } from 'lucide-react';

export default function App() {
  const { name, role, location, bio, experiences, stack, links } = portfolioConfig;

  return (
    <div style={{
      backgroundColor: '#121212',
      color: '#F2F1EE',
      minHeight: '100vh',
      padding: '56px 40px',
      fontFamily: "'Manrope', sans-serif",
      lineHeight: 1.5,
    }}>
      <div style={{ maxWidth: '880px', margin: '0 auto', display: 'grid', gridTemplateColumns: '260px 1fr', gap: '56px', alignItems: 'start' }}>
        <aside style={{ position: 'sticky', top: '56px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#F2F1EE', margin: 0 }}>
              {name}
            </h1>
            <p style={{ fontSize: '13px', fontWeight: 300, color: '#8E8D88', marginTop: '8px', lineHeight: 1.4 }}>
              {role}
            </p>
            {location && (
              <span style={{ display: 'inline-block', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'rgba(242, 241, 238, 0.4)', marginTop: '4px' }}>
                {location.toLowerCase()}
              </span>
            )}
          </div>

          {stack.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#8E8D88', textTransform: 'lowercase' }}>
                stack
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {stack.map((tech) => (
                  <span key={tech} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#F2F1EE', border: '1px solid rgba(255, 255, 255, 0.16)', borderRadius: 0, padding: '2px 7px' }}>
                    {tech.toLowerCase()}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#8E8D88', textTransform: 'lowercase' }}>
              index / links
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {links.github && <a href={links.github} target="_blank" rel="noreferrer" style={{ color: '#F2F1EE', textDecoration: 'none', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}><span>github</span><ArrowUpRight size={12} color="#1F9D6B" /></a>}
              {links.linkedin && <a href={links.linkedin} target="_blank" rel="noreferrer" style={{ color: '#F2F1EE', textDecoration: 'none', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}><span>linkedin</span><ArrowUpRight size={12} color="#1F9D6B" /></a>}
              {links.website && <a href={links.website} target="_blank" rel="noreferrer" style={{ color: '#F2F1EE', textDecoration: 'none', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}><span>website</span><ArrowUpRight size={12} color="#1F9D6B" /></a>}
              {links.email && <a href={\`mailto:\${links.email}\`} style={{ color: '#1F9D6B', textDecoration: 'none', fontSize: '13px', fontWeight: 500, marginTop: '4px' }}>{links.email}</a>}
            </div>
          </div>
        </aside>

        <main style={{ display: 'flex', flexDirection: 'column' }}>
          <section style={{ paddingBottom: '36px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <span style={{ display: 'block', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#8E8D88', marginBottom: '16px' }}>overview</span>
            <p style={{ fontSize: '17px', fontWeight: 400, lineHeight: 1.6, color: '#F2F1EE', margin: 0 }}>{bio}</p>
          </section>

          <section style={{ paddingTop: '36px' }}>
            <span style={{ display: 'block', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#8E8D88', marginBottom: '24px' }}>experience</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {experiences.map((exp, idx) => (
                <article key={idx} style={{ paddingBottom: '28px', marginBottom: idx === experiences.length - 1 ? 0 : '28px', borderBottom: idx === experiences.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#F2F1EE', margin: 0 }}>
                      {exp.company} <span style={{ fontWeight: 300, color: '#8E8D88' }}>— {exp.role}</span>
                    </h3>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#8E8D88' }}>{exp.period}</span>
                  </div>
                  <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '13px', color: '#D4D3CF', lineHeight: 1.6 }}>
                    {exp.bullets.map((b, bIdx) => (
                      <li key={bIdx} style={{ marginBottom: '4px' }}>{b}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
`;
  } else {
    templateCode = `import React from 'react';
import { portfolioConfig } from './portfolio.config';
import { ArrowUpRight } from 'lucide-react';

export default function App() {
  const { name, role, location, tagline, bio, experiences, stack, links } = portfolioConfig;
  const slug = (name || 'developer').toLowerCase().replace(/\\s+/g, '-');

  return (
    <div style={{
      backgroundColor: '#09090B',
      color: '#EDEDED',
      minHeight: '100vh',
      padding: '56px 32px',
      fontFamily: "'Manrope', sans-serif",
      lineHeight: 1.6,
    }}>
      <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
        <div style={{ border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 0, backgroundColor: '#111114', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', backgroundColor: '#16161A' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3F3F46' }} />
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3F3F46' }} />
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3F3F46' }} />
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#71717A' }}>~/portfolio/{slug}</span>
          </div>
          <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#FF4F00', marginBottom: '4px' }}>&gt; whoami</div>
              <h1 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '28px', fontWeight: 600, color: '#EDEDED', margin: 0 }}>
                {name}
              </h1>
            </div>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#71717A', marginBottom: '2px' }}>&gt; role --focus</div>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: '#A1A1AA', margin: 0 }}>
                {role} {location && <span style={{ color: '#71717A' }}> — {location}</span>}
              </p>
            </div>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#71717A', marginBottom: '2px' }}>&gt; ethos</div>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#D4D4D8', margin: 0 }}>"{tagline}"</p>
            </div>
          </div>
        </div>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#71717A', textTransform: 'lowercase' }}>summary</span>
          <p style={{ fontSize: '15px', color: '#D4D4D8', lineHeight: 1.65, margin: 0 }}>{bio}</p>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#71717A', textTransform: 'lowercase' }}>experience</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {experiences.map((exp, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: 600, color: '#EDEDED', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{exp.company}</span>
                    <span style={{ fontSize: '13px', color: '#71717A' }}>{exp.role}</span>
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#71717A' }}>{exp.period}</span>
                </div>
                <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '13px', color: '#A1A1AA', lineHeight: 1.6 }}>
                  {exp.bullets.map((b, bIdx) => (
                    <li key={bIdx} style={{ marginBottom: '4px' }}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {stack.length > 0 && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#71717A', textTransform: 'lowercase' }}>stack</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {stack.map((tech) => (
                <span key={tech} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#D4D4D8', backgroundColor: '#16161A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 0, padding: '3px 8px' }}>
                  [{tech.toLowerCase()}]
                </span>
              ))}
            </div>
          </section>
        )}

        <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {links.github && <a href={links.github} target="_blank" rel="noreferrer" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#EDEDED', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}><span>github</span><ArrowUpRight size={12} color="#FF4F00" /></a>}
            {links.linkedin && <a href={links.linkedin} target="_blank" rel="noreferrer" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#EDEDED', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}><span>linkedin</span><ArrowUpRight size={12} color="#FF4F00" /></a>}
            {links.website && <a href={links.website} target="_blank" rel="noreferrer" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#EDEDED', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}><span>website</span><ArrowUpRight size={12} color="#FF4F00" /></a>}
          </div>
          {links.email && <a href={\`mailto:\${links.email}\`} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#FF4F00', border: '1px solid #FF4F00', padding: '4px 10px', textDecoration: 'none' }}>init contact</a>}
        </footer>
      </div>
    </div>
  );
}
`;
  }
  zip.file('src/App.tsx', templateCode);

  // 8. README.md
  const readmeContent = `# ${data.name || 'Developer'} — Portfolio

Personal portfolio built with React 18, Vite, and TypeScript.
Generated by **Portfolio Studio**.

## Quick Start (Two-Command Setup)

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

- \`src/portfolio.config.ts\`: Your typed portfolio data. Edit content directly here anytime!
- \`src/App.tsx\`: Self-contained layout for the **${template}** template.
- Zero extra template baggage — contains only the components and styles for your chosen design.

## 1-Click Deployment

### Deploy to Vercel
\`\`\`bash
npx vercel
\`\`\`

### Deploy to Netlify
\`\`\`bash
npx netlify deploy --prod
\`\`\`
`;
  zip.file('README.md', readmeContent);

  return zip.generateAsync({ type: 'blob' });
}
