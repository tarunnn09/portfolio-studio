import React from 'react';
import { PortfolioData, DisplayMode, GeneratedCopy } from '../../../types/portfolio';
import { ArrowUpRight } from 'lucide-react';

interface TerminalTemplateProps {
  data: PortfolioData;
  generatedCopy: GeneratedCopy | null;
  displayMode: DisplayMode;
  useRawPitch?: boolean;
  flashingFields?: string[];
}

export const TerminalTemplate: React.FC<TerminalTemplateProps> = ({
  data,
  generatedCopy,
  displayMode,
  useRawPitch,
  flashingFields = [],
}) => {
  const showRaw = displayMode === 'raw';

  const tagline = showRaw
    ? data.role
    : generatedCopy?.tagline || data.role;

  const bio = showRaw || useRawPitch
    ? data.rawPitch || 'Write your pitch to see it formatted here.'
    : generatedCopy?.bio || data.rawPitch || 'Write your pitch to see it formatted here.';

  const slug = (data.name || 'developer').toLowerCase().replace(/\s+/g, '-');

  return (
    <div
      className="terminal-template-root"
      style={{
        backgroundColor: '#09090B',
        color: '#EDEDED',
        minHeight: '100%',
        padding: '56px 32px',
        fontFamily: "'Manrope', sans-serif",
        lineHeight: 1.6,
      }}
    >
      <div
        style={{
          maxWidth: '680px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '40px',
        }}
      >
        {/* Signature Move: Terminal Window Hero Card (One deliberate reference) */}
        <div
          style={{
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 0,
            backgroundColor: '#111114',
            overflow: 'hidden',
          }}
        >
          {/* Muted Traffic Lights & Path Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              backgroundColor: '#16161A',
            }}
          >
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3F3F46' }} />
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3F3F46' }} />
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3F3F46' }} />
            </div>

            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                color: '#71717A',
              }}
            >
              ~/portfolio/{slug}
            </span>
          </div>

          {/* Terminal Content Body */}
          <div
            style={{
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '12px',
                  color: '#FF4F00', // International orange prompt
                  marginBottom: '4px',
                }}
              >
                &gt; whoami
              </div>
              <h1
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '28px',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  color: '#EDEDED',
                  margin: 0,
                }}
              >
                {data.name || 'Developer'}
                <span
                  style={{
                    display: 'inline-block',
                    width: '10px',
                    height: '18px',
                    backgroundColor: '#FF4F00',
                    marginLeft: '8px',
                    verticalAlign: 'middle',
                    animation: 'blinkCursor 1s step-start infinite',
                  }}
                />
              </h1>
            </div>

            <div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '12px',
                  color: '#71717A',
                  marginBottom: '2px',
                }}
              >
                &gt; role --focus
              </div>
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '13px',
                  color: '#A1A1AA',
                  margin: 0,
                }}
              >
                {data.role}
                {data.location && <span style={{ color: '#71717A' }}> — {data.location}</span>}
              </p>
            </div>

            <div className={flashingFields.includes('tagline') ? 'animate-flash' : ''}>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '12px',
                  color: '#71717A',
                  marginBottom: '2px',
                }}
              >
                &gt; ethos
              </div>
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '12px',
                  color: '#D4D4D8',
                  margin: 0,
                }}
              >
                "{tagline}"
              </p>
            </div>
          </div>
        </div>

        {/* Quiet Plain-Text Body Below Hero (Restraint: Sans for comfortable reading) */}
        <section
          className={flashingFields.includes('bio') ? 'animate-flash' : ''}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              color: '#71717A',
              textTransform: 'lowercase',
            }}
          >
            summary
          </span>

          <p
            style={{
              fontSize: '15px',
              color: '#D4D4D8',
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            {bio}
          </p>
        </section>

        {/* Experience Section */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              color: '#71717A',
              textTransform: 'lowercase',
            }}
          >
            experience
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {data.experiences.map((exp) => {
              const aiExp = generatedCopy?.experience.find(
                (item) => item.company.toLowerCase() === exp.company.toLowerCase()
              );
              const useRawNotes = showRaw || exp.useRaw;

              return (
                <div key={exp.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '13px',
                          fontWeight: 600,
                          color: '#EDEDED',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {exp.company}
                      </span>
                      <span style={{ fontSize: '13px', color: '#71717A' }}>{exp.role}</span>
                    </div>

                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '11px',
                        color: '#71717A',
                      }}
                    >
                      {exp.period}
                    </span>
                  </div>

                  <div className={flashingFields.includes('experience') ? 'animate-flash' : ''}>
                    {useRawNotes ? (
                      <p
                        style={{
                          fontSize: '13px',
                          color: '#71717A',
                          margin: 0,
                          whiteSpace: 'pre-line',
                        }}
                      >
                        {exp.rawNotes}
                      </p>
                    ) : (
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '13px',
                          color: '#A1A1AA',
                          lineHeight: 1.6,
                        }}
                      >
                        {(exp.generatedBullets && exp.generatedBullets.length > 0
                          ? exp.generatedBullets
                          : aiExp?.bullets || [exp.rawNotes || 'Engineered core systems.']
                        ).map((bullet, bIdx) => (
                          <li key={bIdx} style={{ marginBottom: '4px' }}>
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Stack Tags */}
        {data.stack.length > 0 && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                color: '#71717A',
                textTransform: 'lowercase',
              }}
            >
              stack
            </span>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {data.stack.map((tech) => (
                <span
                  key={tech}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '11px',
                    color: '#D4D4D8',
                    backgroundColor: '#16161A',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 0,
                    padding: '3px 8px',
                  }}
                >
                  [{tech.toLowerCase()}]
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Links & Terminal Prompt Footer */}
        <footer
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {data.links.github && (
              <a
                href={data.links.github}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '12px',
                  color: '#EDEDED',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>github</span>
                <ArrowUpRight size={12} color="#FF4F00" />
              </a>
            )}
            {data.links.linkedin && (
              <a
                href={data.links.linkedin}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '12px',
                  color: '#EDEDED',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>linkedin</span>
                <ArrowUpRight size={12} color="#FF4F00" />
              </a>
            )}
            {data.links.website && (
              <a
                href={data.links.website}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '12px',
                  color: '#EDEDED',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>website</span>
                <ArrowUpRight size={12} color="#FF4F00" />
              </a>
            )}
          </div>

          {data.links.email && (
            <a
              href={`mailto:${data.links.email}`}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                color: '#FF4F00',
                border: '1px solid #FF4F00',
                padding: '4px 10px',
                textDecoration: 'none',
              }}
            >
              init contact
            </a>
          )}
        </footer>
      </div>
    </div>
  );
};

export default TerminalTemplate;
