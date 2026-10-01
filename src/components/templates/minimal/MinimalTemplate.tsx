import React from 'react';
import { PortfolioData, DisplayMode, GeneratedCopy } from '../../../types/portfolio';
import { ArrowUpRight } from 'lucide-react';

interface MinimalTemplateProps {
  data: PortfolioData;
  generatedCopy: GeneratedCopy | null;
  displayMode: DisplayMode;
  useRawPitch?: boolean;
  flashingFields?: string[];
}

export const MinimalTemplate: React.FC<MinimalTemplateProps> = ({
  data,
  generatedCopy,
  displayMode,
  useRawPitch,
  flashingFields = [],
}) => {
  const showRaw = displayMode === 'raw';

  const bio = showRaw || useRawPitch
    ? data.rawPitch || 'Write your pitch to see it formatted here.'
    : generatedCopy?.bio || data.rawPitch || 'Write your pitch to see it formatted here.';

  return (
    <div
      className="minimal-template-root"
      style={{
        backgroundColor: '#121212',
        color: '#F2F1EE',
        minHeight: '100%',
        padding: '56px 40px',
        fontFamily: "'Manrope', sans-serif",
        lineHeight: 1.5,
      }}
    >
      <div
        style={{
          maxWidth: '880px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: '56px',
          alignItems: 'start',
        }}
      >
        {/* Left Rail (Fixed Swiss Identity) */}
        <aside
          style={{
            position: 'sticky',
            top: '56px',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
          }}
        >
          {/* Identity */}
          <div>
            <h1
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: '28px',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: '#F2F1EE',
                margin: 0,
              }}
            >
              {data.name || 'Your Name'}
            </h1>

            <p
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: '13px',
                fontWeight: 300,
                color: '#8E8D88',
                marginTop: '8px',
                lineHeight: 1.4,
              }}
            >
              {data.role}
            </p>

            {data.location && (
              <span
                style={{
                  display: 'inline-block',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '11px',
                  color: 'rgba(242, 241, 238, 0.4)',
                  marginTop: '4px',
                }}
              >
                {data.location.toLowerCase()}
              </span>
            )}
          </div>

          {/* Outlined Stack Tags */}
          {data.stack.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '11px',
                  fontWeight: 400,
                  color: '#8E8D88',
                  textTransform: 'lowercase',
                }}
              >
                stack
              </span>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {data.stack.map((tech) => (
                  <span
                    key={tech}
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '11px',
                      color: '#F2F1EE',
                      border: '1px solid rgba(255, 255, 255, 0.16)',
                      borderRadius: 0, // Strict Swiss radius 0
                      padding: '2px 7px',
                    }}
                  >
                    {tech.toLowerCase()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                fontWeight: 400,
                color: '#8E8D88',
                textTransform: 'lowercase',
              }}
            >
              index / links
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {data.links.github && (
                <a
                  href={data.links.github}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: '#F2F1EE',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: 400,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>github</span>
                  <ArrowUpRight size={12} color="#1F9D6B" />
                </a>
              )}
              {data.links.linkedin && (
                <a
                  href={data.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: '#F2F1EE',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: 400,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>linkedin</span>
                  <ArrowUpRight size={12} color="#1F9D6B" />
                </a>
              )}
              {data.links.website && (
                <a
                  href={data.links.website}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: '#F2F1EE',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: 400,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>website</span>
                  <ArrowUpRight size={12} color="#1F9D6B" />
                </a>
              )}
              {data.links.email && (
                <a
                  href={`mailto:${data.links.email}`}
                  style={{
                    color: '#1F9D6B',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: 500,
                    marginTop: '4px',
                  }}
                >
                  {data.links.email}
                </a>
              )}
            </div>
          </div>
        </aside>

        {/* Right Column (Content Flow separated by Hairlines) */}
        <main style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Bio Section */}
          <section
            className={flashingFields.includes('bio') ? 'animate-flash' : ''}
            style={{
              paddingBottom: '36px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <span
              style={{
                display: 'block',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                color: '#8E8D88',
                marginBottom: '16px',
              }}
            >
              overview
            </span>

            <p
              style={{
                fontSize: '17px',
                fontWeight: 400,
                lineHeight: 1.6,
                color: '#F2F1EE',
                margin: 0,
              }}
            >
              {bio}
            </p>
          </section>

          {/* Experience Section */}
          <section style={{ paddingTop: '36px' }}>
            <span
              style={{
                display: 'block',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                color: '#8E8D88',
                marginBottom: '24px',
              }}
            >
              experience
            </span>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {data.experiences.map((exp, idx) => {
                const aiExp = generatedCopy?.experience.find(
                  (item) => item.company.toLowerCase() === exp.company.toLowerCase()
                );
                const useRawNotes = showRaw || exp.useRaw;

                return (
                  <article
                    key={exp.id}
                    style={{
                      paddingBottom: '28px',
                      marginBottom: idx === data.experiences.length - 1 ? 0 : '28px',
                      borderBottom:
                        idx === data.experiences.length - 1
                          ? 'none'
                          : '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        marginBottom: '8px',
                      }}
                    >
                      <h3
                        style={{
                          fontSize: '15px',
                          fontWeight: 700,
                          color: '#F2F1EE',
                          margin: 0,
                        }}
                      >
                        {exp.company}{' '}
                        <span style={{ fontWeight: 300, color: '#8E8D88' }}>— {exp.role}</span>
                      </h3>

                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '11px',
                          color: '#8E8D88',
                        }}
                      >
                        {exp.period}
                      </span>
                    </div>

                    <div
                      className={flashingFields.includes('experience') ? 'animate-flash' : ''}
                      style={{ marginTop: '8px' }}
                    >
                      {useRawNotes ? (
                        <p style={{ fontSize: '13px', color: '#8E8D88', margin: 0, whiteSpace: 'pre-line' }}>
                          {exp.rawNotes}
                        </p>
                      ) : (
                        <ul
                          style={{
                            paddingLeft: '16px',
                            margin: 0,
                            fontSize: '13px',
                            color: '#D4D3CF',
                            lineHeight: 1.6,
                          }}
                        >
                          {(exp.generatedBullets && exp.generatedBullets.length > 0
                            ? exp.generatedBullets
                            : aiExp?.bullets || [exp.rawNotes || 'Engineered core services.']
                          ).map((bullet, bIdx) => (
                            <li key={bIdx} style={{ marginBottom: '4px' }}>
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default MinimalTemplate;
