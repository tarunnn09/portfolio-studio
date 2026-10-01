import { PortfolioData, TemplatePreset, GeneratedCopy } from '../../types/portfolio';

export function generateStaticHtml(
  data: PortfolioData,
  generatedCopy: GeneratedCopy | null,
  template: TemplatePreset,
  useRawPitch: boolean
): string {
  const finalBio = useRawPitch
    ? data.rawPitch
    : generatedCopy?.bio || data.rawPitch;

  const finalTagline = generatedCopy?.tagline || data.role;

  const experiencesHtml = data.experiences
    .map((exp) => {
      const aiExp = generatedCopy?.experience.find(
        (item) => item.company.toLowerCase() === exp.company.toLowerCase()
      );
      const bullets =
        exp.useRaw || !exp.generatedBullets || exp.generatedBullets.length === 0
          ? aiExp?.bullets || [exp.rawNotes]
          : exp.generatedBullets;

      const bulletsList = bullets
        .map((b) => `<li style="margin-bottom: 4px;">${escapeHtml(b)}</li>`)
        .join('\n            ');

      if (template === 'editorial') {
        return `
        <div class="exp-item">
          <div class="exp-header">
            <div class="exp-title-group">
              <span class="exp-company">${escapeHtml(exp.company)}</span>
              <span class="exp-role">· ${escapeHtml(exp.role)}</span>
            </div>
            <span class="exp-period">${escapeHtml(exp.period)}</span>
          </div>
          <ul class="exp-bullets">
            ${bulletsList}
          </ul>
        </div>`;
      } else if (template === 'minimal') {
        return `
        <article class="exp-item">
          <div class="exp-header">
            <h3 class="exp-company">${escapeHtml(exp.company)} <span class="exp-role">— ${escapeHtml(exp.role)}</span></h3>
            <span class="exp-period">${escapeHtml(exp.period)}</span>
          </div>
          <ul class="exp-bullets">
            ${bulletsList}
          </ul>
        </article>`;
      } else {
        return `
        <div class="exp-item">
          <div class="exp-header">
            <div class="exp-title-group">
              <span class="exp-company">${escapeHtml(exp.company)}</span>
              <span class="exp-role">${escapeHtml(exp.role)}</span>
            </div>
            <span class="exp-period">${escapeHtml(exp.period)}</span>
          </div>
          <ul class="exp-bullets">
            ${bulletsList}
          </ul>
        </div>`;
      }
    })
    .join('\n');

  const stackHtml = data.stack
    .map((s) => {
      if (template === 'terminal') {
        return `<span class="stack-tag">[${escapeHtml(s.toLowerCase())}]</span>`;
      }
      return `<span class="stack-tag">${escapeHtml(s.toLowerCase())}</span>`;
    })
    .join(' ');

  const linksHtml = [
    data.links.github ? `<a href="${data.links.github}" target="_blank" rel="noreferrer">github ↗</a>` : '',
    data.links.linkedin ? `<a href="${data.links.linkedin}" target="_blank" rel="noreferrer">linkedin ↗</a>` : '',
    data.links.website ? `<a href="${data.links.website}" target="_blank" rel="noreferrer">website ↗</a>` : '',
  ]
    .filter(Boolean)
    .join('\n          ');

  const emailHtml = data.links.email
    ? `<a class="email-btn" href="mailto:${data.links.email}">${template === 'terminal' ? 'init contact' : 'Get in touch'}</a>`
    : '';

  if (template === 'editorial') {
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(data.name)} — ${escapeHtml(data.role)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&family=Manrope:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #FAFAF8;
      color: #1A1815;
      font-family: 'Manrope', -apple-system, sans-serif;
      line-height: 1.6;
      padding: 64px 28px;
    }
    .container { max-width: 640px; margin: 0 auto; display: flex; flex-direction: column; gap: 40px; }
    header { display: flex; flex-direction: column; gap: 12px; }
    .header-top { display: flex; justify-content: space-between; align-items: baseline; }
    h1 { font-family: 'Instrument Serif', Georgia, serif; font-size: 44px; font-weight: 400; line-height: 1.1; letter-spacing: -0.02em; color: #1A1815; }
    .location { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #8A8780; text-transform: lowercase; }
    .tagline { font-family: 'Instrument Serif', Georgia, serif; font-style: italic; font-size: 22px; line-height: 1.3; color: #524F49; }
    hr { border: none; height: 1px; background-color: rgba(26, 24, 21, 0.12); margin: 12px 0 4px; }
    .bio-quote { border-left: 2px solid #A9720A; padding-left: 20px; font-size: 16px; line-height: 1.65; color: #2A2723; }
    .section-title { font-family: 'Instrument Serif', Georgia, serif; font-size: 24px; font-weight: 400; color: #1A1815; }
    .timeline { display: flex; flex-direction: column; position: relative; padding-left: 18px; border-left: 1px solid rgba(26, 24, 21, 0.14); }
    .exp-item { position: relative; padding-bottom: 32px; }
    .exp-item:last-child { padding-bottom: 0; }
    .exp-item::before { content: ''; position: absolute; left: -22px; top: 6px; width: 7px; height: 7px; border-radius: 50%; background-color: #1A1815; }
    .exp-item:first-child::before { background-color: #A9720A; }
    .exp-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
    .exp-company { font-size: 15px; font-weight: 600; color: #1A1815; }
    .exp-role { font-size: 13px; color: #6A6760; }
    .exp-period { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #8A8780; }
    .exp-bullets { padding-left: 16px; margin-top: 6px; font-size: 13px; color: #3A3833; line-height: 1.6; }
    .stack-section { display: flex; flex-direction: column; gap: 12px; }
    .stack-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #8A8780; }
    .stack-list { display: flex; flex-wrap: wrap; gap: 8px; }
    .stack-tag { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #3A3833; background-color: rgba(26, 24, 21, 0.05); padding: 2px 8px; border-radius: 2px; }
    footer { display: flex; justify-content: space-between; align-items: center; padding-top: 24px; border-top: 1px solid rgba(26, 24, 21, 0.12); }
    .links-group { display: flex; gap: 16px; align-items: center; }
    .links-group a { color: #1A1815; text-decoration: none; font-size: 13px; }
    .links-group a:hover { text-decoration: underline; text-decoration-color: #A9720A; }
    .email-btn { font-size: 12px; font-weight: 600; color: #FFFFFF; background-color: #A9720A; padding: 6px 14px; border-radius: 3px; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="header-top">
        <h1>${escapeHtml(data.name)}</h1>
        ${data.location ? `<span class="location">${escapeHtml(data.location)}</span>` : ''}
      </div>
      <p class="tagline">${escapeHtml(finalTagline)}</p>
      <hr />
    </header>

    <div class="bio-quote">
      <p>${escapeHtml(finalBio)}</p>
    </div>

    <section>
      <h2 class="section-title">Selected Experience</h2>
      <div class="timeline" style="margin-top: 20px;">
        ${experiencesHtml}
      </div>
    </section>

    ${
      data.stack.length > 0
        ? `
    <section class="stack-section">
      <span class="stack-label">stack:</span>
      <div class="stack-list">
        ${stackHtml}
      </div>
    </section>`
        : ''
    }

    <footer>
      <div class="links-group">
        ${linksHtml}
      </div>
      ${emailHtml}
    </footer>
  </div>
</body>
</html>`;
  } else if (template === 'minimal') {
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(data.name)} — ${escapeHtml(data.role)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Manrope:wght@300;400;600;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #121212;
      color: #F2F1EE;
      font-family: 'Manrope', sans-serif;
      line-height: 1.5;
      padding: 56px 40px;
    }
    .grid-container { max-width: 880px; margin: 0 auto; display: grid; grid-template-columns: 260px 1fr; gap: 56px; align-items: start; }
    aside { position: sticky; top: 56px; display: flex; flex-direction: column; gap: 32px; }
    h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; color: #F2F1EE; }
    .role { font-size: 13px; font-weight: 300; color: #8E8D88; margin-top: 8px; line-height: 1.4; }
    .location { display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: rgba(242, 241, 238, 0.4); margin-top: 4px; }
    .meta-title { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #8E8D88; text-transform: lowercase; margin-bottom: 10px; }
    .stack-list { display: flex; flex-wrap: wrap; gap: 6px; }
    .stack-tag { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #F2F1EE; border: 1px solid rgba(255, 255, 255, 0.16); border-radius: 0; padding: 2px 7px; }
    .links-list { display: flex; flex-direction: column; gap: 6px; }
    .links-list a { color: #F2F1EE; text-decoration: none; font-size: 13px; }
    .links-list a:hover { color: #1F9D6B; }
    .email-link { color: #1F9D6B !important; font-weight: 500; margin-top: 4px; }
    main { display: flex; flex-direction: column; }
    .bio-section { padding-bottom: 36px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); font-size: 17px; font-weight: 400; line-height: 1.6; }
    .exp-section { padding-top: 36px; }
    .exp-item { padding-bottom: 28px; margin-bottom: 28px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
    .exp-item:last-child { border-bottom: none; margin-bottom: 0; }
    .exp-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
    .exp-company { font-size: 15px; font-weight: 700; color: #F2F1EE; }
    .exp-role { font-weight: 300; color: #8E8D88; }
    .exp-period { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #8E8D88; }
    .exp-bullets { padding-left: 16px; margin: 0; font-size: 13px; color: #D4D3CF; line-height: 1.6; }
    @media (max-width: 768px) {
      .grid-container { grid-template-columns: 1fr; gap: 36px; }
      aside { position: static; }
    }
  </style>
</head>
<body>
  <div class="grid-container">
    <aside>
      <div>
        <h1>${escapeHtml(data.name)}</h1>
        <p class="role">${escapeHtml(data.role)}</p>
        ${data.location ? `<span class="location">${escapeHtml(data.location.toLowerCase())}</span>` : ''}
      </div>

      ${
        data.stack.length > 0
          ? `
      <div>
        <div class="meta-title">stack</div>
        <div class="stack-list">${stackHtml}</div>
      </div>`
          : ''
      }

      <div>
        <div class="meta-title">index / links</div>
        <div class="links-list">
          ${linksHtml}
          ${data.links.email ? `<a class="email-link" href="mailto:${data.links.email}">${escapeHtml(data.links.email)}</a>` : ''}
        </div>
      </div>
    </aside>

    <main>
      <section class="bio-section">
        <div class="meta-title">overview</div>
        <p>${escapeHtml(finalBio)}</p>
      </section>

      <section class="exp-section">
        <div class="meta-title">experience</div>
        <div>
          ${experiencesHtml}
        </div>
      </section>
    </main>
  </div>
</body>
</html>`;
  } else {
    // Terminal Template
    const slug = (data.name || 'developer').toLowerCase().replace(/\s+/g, '-');
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(data.name)} — ${escapeHtml(data.role)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Manrope:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #09090B;
      color: #EDEDED;
      font-family: 'Manrope', sans-serif;
      line-height: 1.6;
      padding: 56px 32px;
    }
    .container { max-width: 680px; margin: 0 auto; display: flex; flex-direction: column; gap: 40px; }
    .terminal-card { border: 1px solid rgba(255, 255, 255, 0.1); background-color: #111114; overflow: hidden; }
    .terminal-header { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); background-color: #16161A; }
    .dots { display: flex; gap: 6px; }
    .dot { width: 8px; height: 8px; border-radius: 50%; background-color: #3F3F46; }
    .path { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #71717A; }
    .terminal-body { padding: 24px 20px; display: flex; flex-direction: column; gap: 12px; }
    .prompt { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #71717A; margin-bottom: 2px; }
    .prompt-orange { color: #FF4F00; }
    h1 { font-family: 'JetBrains Mono', monospace; font-size: 28px; font-weight: 600; color: #EDEDED; }
    .cursor { display: inline-block; width: 10px; height: 18px; background-color: #FF4F00; margin-left: 8px; vertical-align: middle; animation: blink 1s step-start infinite; }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
    .role-meta { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #A1A1AA; }
    .ethos-text { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #D4D4D8; }
    .section-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #71717A; text-transform: lowercase; margin-bottom: 10px; }
    .bio-text { font-size: 15px; color: #D4D4D8; line-height: 1.65; }
    .exp-list { display: flex; flex-direction: column; gap: 28px; }
    .exp-item { display: flex; flex-direction: column; gap: 8px; }
    .exp-header { display: flex; justify-content: space-between; align-items: baseline; }
    .exp-title-group { display: flex; align-items: baseline; gap: 10px; }
    .exp-company { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 600; color: #EDEDED; text-transform: uppercase; letter-spacing: 0.04em; }
    .exp-role { font-size: 13px; color: #71717A; }
    .exp-period { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #71717A; }
    .exp-bullets { padding-left: 16px; margin: 0; font-size: 13px; color: #A1A1AA; line-height: 1.6; }
    .stack-tags { display: flex; flex-wrap: wrap; gap: 8px; }
    .stack-tag { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #D4D4D8; background-color: #16161A; border: 1px solid rgba(255, 255, 255, 0.08); padding: 3px 8px; }
    footer { display: flex; justify-content: space-between; align-items: center; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.08); }
    .links-group { display: flex; gap: 16px; align-items: center; }
    .links-group a { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #EDEDED; text-decoration: none; }
    .links-group a:hover { color: #FF4F00; }
    .email-btn { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #FF4F00; border: 1px solid #FF4F00; padding: 4px 10px; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="terminal-card">
      <div class="terminal-header">
        <div class="dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
        <span class="path">~/portfolio/${slug}</span>
      </div>
      <div class="terminal-body">
        <div>
          <div class="prompt prompt-orange">&gt; whoami</div>
          <h1>${escapeHtml(data.name)}<span class="cursor"></span></h1>
        </div>
        <div>
          <div class="prompt">&gt; role --focus</div>
          <p class="role-meta">${escapeHtml(data.role)} ${data.location ? `— ${escapeHtml(data.location)}` : ''}</p>
        </div>
        <div>
          <div class="prompt">&gt; ethos</div>
          <p class="ethos-text">"${escapeHtml(finalTagline)}"</p>
        </div>
      </div>
    </div>

    <section>
      <div class="section-label">summary</div>
      <p class="bio-text">${escapeHtml(finalBio)}</p>
    </section>

    <section>
      <div class="section-label">experience</div>
      <div class="exp-list">
        ${experiencesHtml}
      </div>
    </section>

    ${
      data.stack.length > 0
        ? `
    <section>
      <div class="section-label">stack</div>
      <div class="stack-tags">${stackHtml}</div>
    </section>`
        : ''
    }

    <footer>
      <div class="links-group">
        ${linksHtml}
      </div>
      ${emailHtml}
    </footer>
  </div>
</body>
</html>`;
  }
}

function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
