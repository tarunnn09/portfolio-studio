import React from 'react';
import { useWizardStore } from '../../stores/wizardStore';
import { useGenerationStore } from '../../stores/generationStore';
import { generatePortfolioCopy } from '../../lib/llm/client';
import { Button } from '../ui/Button';
import { Panel } from '../ui/Panel';
import { Sparkles, Check, Undo2, AlertCircle, Cpu, Key } from 'lucide-react';

interface StepGenerateProps {
  onOpenSettings: () => void;
}

export const StepGenerate: React.FC<StepGenerateProps> = ({ onOpenSettings }) => {
  const {
    data,
    useRawPitch,
    toggleUseRawPitch,
    toggleExperienceUseRaw,
    setExperienceBullets,
  } = useWizardStore();

  const {
    status,
    lastGeneratedCopy,
    error,
    llmConfig,
    setGenerating,
    setSuccess,
    setError,
    setConfig,
  } = useGenerationStore();

  const handleGenerate = async () => {
    try {
      setGenerating();
      const generated = await generatePortfolioCopy(data, llmConfig);

      // Apply to store
      setSuccess(generated, ['tagline', 'bio', 'experience']);

      // Update experience bullets in wizard data
      generated.experience.forEach((item) => {
        setExperienceBullets(item.company, item.bullets);
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to generate copy. Check settings or network connection.');
    }
  };

  const isGenerating = status === 'generating';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '4px',
          }}
        >
          AI Copy & Review Engine
        </h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Transform raw notes into sharp, non-hype copy. Review diffs and selectively revert to your raw notes anytime.
        </p>
      </div>

      {/* Engine Status Bar */}
      <Panel
        variant="raised"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--accent-soft)',
              color: 'var(--accent)',
            }}
          >
            <Cpu size={16} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}
              >
                {llmConfig.useOfflineFallback
                  ? 'Deterministic Offline Engine'
                  : `Anthropic Claude (${llmConfig.model})`}
              </span>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent)',
                }}
              />
            </div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
              {llmConfig.useOfflineFallback
                ? 'Zero network required · Rule-based non-hype synthesis'
                : 'Direct API connection with negative prompt constraints'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenSettings}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 10px',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            cursor: 'pointer',
          }}
        >
          <Key size={12} />
          <span>Config</span>
        </button>
      </Panel>

      {/* Error Banner */}
      {error && (
        <Panel
          variant="raised"
          style={{
            borderColor: 'var(--danger)',
            backgroundColor: 'rgba(196, 85, 61, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            padding: '12px 16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <AlertCircle size={16} style={{ color: 'var(--danger)', marginTop: '2px', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--danger)',
                  margin: 0,
                }}
              >
                Generation Notice
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                  marginTop: '2px',
                }}
              >
                {error}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setConfig({ useOfflineFallback: true });
                handleGenerate();
              }}
            >
              Switch to Offline Fallback Engine
            </Button>
            <Button size="sm" variant="ghost" onClick={onOpenSettings}>
              Edit API Key / Model
            </Button>
          </div>
        </Panel>
      )}

      {/* Primary Action Row */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <Button
          variant="primary"
          size="lg"
          style={{ flex: 1 }}
          onClick={handleGenerate}
          isLoading={isGenerating}
          loadingText="Synthesizing copy…"
          leftIcon={<Sparkles size={16} />}
        >
          {lastGeneratedCopy ? 'Re-roll AI Copy' : 'Generate Sharp Copy'}
        </Button>
      </div>

      {/* Before / After Transparency Review */}
      {lastGeneratedCopy && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-primary)',
              }}
            >
              Copy Diff & Field Controls
            </h3>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--accent)',
              }}
            >
              ✓ active in preview
            </span>
          </div>

          {/* Bio / Pitch Diff Card */}
          <Panel variant="raised" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                }}
              >
                Bio / Pitch
              </span>
              <button
                type="button"
                onClick={toggleUseRawPitch}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'transparent',
                  border: 'none',
                  color: useRawPitch ? 'var(--text-secondary)' : 'var(--accent)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                {useRawPitch ? <Undo2 size={12} /> : <Check size={12} />}
                <span>{useRawPitch ? 'Revert to AI Copy' : 'Use Raw Text'}</span>
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                fontSize: '12px',
                lineHeight: 1.5,
              }}
            >
              <div
                style={{
                  padding: '10px',
                  backgroundColor: 'var(--surface)',
                  borderRadius: 'var(--radius-sm)',
                  border: useRawPitch ? '1px solid var(--accent)' : '1px solid var(--border)',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--text-secondary)',
                    marginBottom: '4px',
                  }}
                >
                  RAW NOTE
                </span>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                  {data.rawPitch || 'No pitch provided'}
                </p>
              </div>

              <div
                style={{
                  padding: '10px',
                  backgroundColor: 'var(--surface)',
                  borderRadius: 'var(--radius-sm)',
                  border: !useRawPitch ? '1px solid var(--accent)' : '1px solid var(--border)',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--accent)',
                    marginBottom: '4px',
                  }}
                >
                  AI GENERATED (NON-HYPE)
                </span>
                <p style={{ color: 'var(--text-primary)', margin: 0 }}>{lastGeneratedCopy.bio}</p>
              </div>
            </div>
          </Panel>

          {/* Experience Entries Diff Cards */}
          {data.experiences.map((exp) => {
            const aiRole = lastGeneratedCopy.experience.find(
              (item) => item.company.toLowerCase() === exp.company.toLowerCase()
            );

            return (
              <Panel
                key={exp.id}
                variant="raised"
                style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--text-primary)',
                      fontWeight: 600,
                    }}
                  >
                    {exp.company || 'Role'} — {exp.role}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleExperienceUseRaw(exp.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'transparent',
                      border: 'none',
                      color: exp.useRaw ? 'var(--text-secondary)' : 'var(--accent)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    {exp.useRaw ? <Undo2 size={12} /> : <Check size={12} />}
                    <span>{exp.useRaw ? 'Revert to AI Bullets' : 'Use Raw Notes'}</span>
                  </button>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    fontSize: '12px',
                    lineHeight: 1.5,
                  }}
                >
                  <div
                    style={{
                      padding: '10px',
                      backgroundColor: 'var(--surface)',
                      borderRadius: 'var(--radius-sm)',
                      border: exp.useRaw ? '1px solid var(--accent)' : '1px solid var(--border)',
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        color: 'var(--text-secondary)',
                        marginBottom: '4px',
                      }}
                    >
                      RAW DUMP
                    </span>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                      {exp.rawNotes || 'No notes provided'}
                    </p>
                  </div>

                  <div
                    style={{
                      padding: '10px',
                      backgroundColor: 'var(--surface)',
                      borderRadius: 'var(--radius-sm)',
                      border: !exp.useRaw ? '1px solid var(--accent)' : '1px solid var(--border)',
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        color: 'var(--accent)',
                        marginBottom: '4px',
                      }}
                    >
                      QUANTIFIED IMPACT BULLETS
                    </span>
                    <ul style={{ paddingLeft: '16px', margin: 0, color: 'var(--text-primary)' }}>
                      {(exp.generatedBullets && exp.generatedBullets.length > 0
                        ? exp.generatedBullets
                        : aiRole?.bullets || []
                      ).map((bullet, bIdx) => (
                        <li key={bIdx} style={{ marginBottom: '4px' }}>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Panel>
            );
          })}
        </div>
      )}
    </div>
  );
};
