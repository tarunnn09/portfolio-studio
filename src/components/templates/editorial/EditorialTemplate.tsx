import { ArrowUpRight } from 'lucide-react';
import { PortfolioData, DisplayMode, GeneratedCopy } from '../../../types/portfolio';

interface EditorialTemplateProps {
  data: PortfolioData;
  generatedCopy: GeneratedCopy | null;
  displayMode: DisplayMode;
  useRawPitch?: boolean;
  flashingFields?: string[];
}

export const EditorialTemplate: React.FC<EditorialTemplateProps> = ({
  data,
  generatedCopy,
  displayMode,
  useRawPitch,
  flashingFields = [],
}) => {
  // Compute copy based on displayMode and per-field flags
  const showRaw = displayMode === 'raw';

  const tagline = showRaw
    ? data.role
    : generatedCopy?.tagline || data.role;

  const bio = showRaw || useRawPitch
    ? data.rawPitch || 'Write your pitch to see it formatted here.'
    : generatedCopy?.bio || data.rawPitch || 'Write your pitch to see it formatted here.';

  return (
    <div
      className="editorial-template-root"
      style={{
        backgroundColor: '#FAFAF8',
        color: '#1A1815',
        minHeight: '100%',
        padding: '64px 28px',
        fontFamily: "'Manrope', sans-serif",
        lineHeight: 1.6,
      }}
    >
      <div
        style={{
          maxWidth: '640px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '40px',
        }}
      >
        {/* Header / Identity */}
        <header style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h1
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: '44px',
                fontWeight: 400,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: '#1A1815',
                margin: 0,
              }}
            >
              {data.name || 'Your Name'}
            </h1>

            {data.location && (
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '11px',
                  color: '#8A8780',
                  textTransform: 'lowercase',
                }}
              >
                {data.location}
              </span>
            )}
          </div>

          <p
            className={flashingFields.includes('tagline') ? 'animate-flash' : ''}
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: 'italic',
              fontSize: '22px',
              lineHeight: 1.3,
              color: '#524F49',
              margin: 0,
            }}
          >
            {tagline}
          </p>

          <hr
            style={{
              border: 'none',
              height: '1px',
              backgroundColor: 'rgba(26, 24, 21, 0.12)',
              margin: '12px 0 4px',
            }}
          />
        </header>

        {/* Signature Move: Pull-Quote Bio Block */}
        <section
          className={flashingFields.includes('bio') ? 'animate-flash' : ''}
          style={{
            borderLeft: '2px solid #A9720A',
            paddingLeft: '20px',
            margin: '0 0 8px 0',
          }}
        >
          <p
            style={{
              fontSize: '16px',
              lineHeight: 1.65,
              color: '#2A2723',
              margin: 0,
              fontWeight: 400,
            }}
          >
            {bio}
          </p>
        </section>

        {/* Experience: Vertical Timeline with Sequential Ticks */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: '24px',
              fontWeight: 400,
              color: '#1A1815',
              margin: 0,
            }}
          >
            Selected Experience
          </h2>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              paddingLeft: '18px',
              borderLeft: '1px solid rgba(26, 24, 21, 0.14)',
            }}
          >
            {data.experiences.map((exp, idx) => {
              const aiExp = generatedCopy?.experience.find(
                (item) => item.company.toLowerCase() === exp.company.toLowerCase()
              );
              const useRawNotes = showRaw || exp.useRaw;

              return (
                <div
                  key={exp.id}
                  style={{
                    position: 'relative',
                    paddingBottom: idx === data.experiences.length - 1 ? 0 : '32px',
                  }}
                >
                  {/* Timeline Tick */}
                  <span
                    style={{
                      position: 'absolute',
                      left: '-22px',
                      top: '6px',
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      backgroundColor: idx === 0 ? '#A9720A' : '#1A1815',
                    }}
                  />

                  {/* Role & Period */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      marginBottom: '4px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '15px',
                          fontWeight: 600,
                          color: '#1A1815',
                        }}
                      >
                        {exp.company || 'Company'}
                      </span>
                      <span style={{ fontSize: '13px', color: '#6A6760' }}>· {exp.role || 'Role'}</span>
                    </div>

                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '11px',
                        color: '#8A8780',
                      }}
                    >
                      {exp.period || '2023—now'}
                    </span>
                  </div>

                  {/* Accomplishment Bullets */}
                  <div
                    className={flashingFields.includes('experience') ? 'animate-flash' : ''}
                    style={{ marginTop: '6px' }}
                  >
                    {useRawNotes ? (
                      <p
                        style={{
                          fontSize: '13px',
                          color: '#524F49',
                          margin: 0,
                          whiteSpace: 'pre-line',
                        }}
                      >
                        {exp.rawNotes || 'No notes added'}
                      </p>
                    ) : (
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '13px',
                          color: '#3A3833',
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
          <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                color: '#8A8780',
                textTransform: 'lowercase',
              }}
            >
              stack:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {data.stack.map((tech) => (
                <span
                  key={tech}
                  style={{
                    display: 'inline-block',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '11px',
                    color: '#3A3833',
                    backgroundColor: 'rgba(26, 24, 21, 0.05)',
                    padding: '2px 8px',
                    borderRadius: '2px',
                  }}
                >
                  {tech.toLowerCase()}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Contact & Social Links */}
        <footer
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '24px',
            borderTop: '1px solid rgba(26, 24, 21, 0.12)',
          }}
        >
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {data.links.github && (
              <a
                href={data.links.github}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: '#1A1815',
                  textDecoration: 'none',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>github</span>
                <ArrowUpRight size={12} color="#A9720A" />
              </a>
            )}
            {data.links.linkedin && (
              <a
                href={data.links.linkedin}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: '#1A1815',
                  textDecoration: 'none',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>linkedin</span>
                <ArrowUpRight size={12} color="#A9720A" />
              </a>
            )}
            {data.links.website && (
              <a
                href={data.links.website}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: '#1A1815',
                  textDecoration: 'none',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>website</span>
                <ArrowUpRight size={12} color="#A9720A" />
              </a>
            )}
          </div>

          {data.links.email && (
            <a
              href={`mailto:${data.links.email}`}
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: '12px',
                fontWeight: 600,
                color: '#FFFFFF',
                backgroundColor: '#A9720A',
                padding: '6px 14px',
                borderRadius: '3px',
                textDecoration: 'none',
              }}
            >
              Get in touch
            </a>
          )}
        </footer>
      </div>
    </div>
  );
};

export default EditorialTemplate;
