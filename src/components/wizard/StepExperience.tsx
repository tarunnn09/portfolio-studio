import React from 'react';
import { useWizardStore } from '../../stores/wizardStore';
import { Input, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { Panel } from '../ui/Panel';
import { Plus, Trash2, ArrowUp, ArrowDown, Briefcase } from 'lucide-react';

export const StepExperience: React.FC = () => {
  const { data, addExperience, updateExperience, removeExperience, reorderExperience } =
    useWizardStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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
            Work History & Impact
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)' }}>
            List your key roles. Dump messy notes or bullets — our engine extracts quantified outcomes.
          </p>
        </div>

        <Button
          size="sm"
          variant="secondary"
          onClick={addExperience}
          leftIcon={<Plus size={14} />}
        >
          Add Role
        </Button>
      </div>

      {data.experiences.length === 0 ? (
        <Panel
          variant="default"
          style={{
            textAlign: 'center',
            padding: '32px 16px',
            borderStyle: 'dashed',
          }}
        >
          <Briefcase size={28} style={{ color: 'var(--text-secondary)', margin: '0 auto 12px' }} />
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              color: 'var(--text-primary)',
              marginBottom: '6px',
            }}
          >
            No experience entries yet
          </p>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              marginBottom: '16px',
            }}
          >
            Add at least one role so your portfolio has career context.
          </p>
          <Button size="sm" variant="primary" onClick={addExperience} leftIcon={<Plus size={14} />}>
            Add First Role
          </Button>
        </Panel>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {data.experiences.map((exp, index) => (
            <Panel
              key={exp.id}
              variant="raised"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  role 0{index + 1}
                </span>

                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    type="button"
                    onClick={() => reorderExperience(index, index - 1)}
                    disabled={index === 0}
                    aria-label={`Move ${exp.company || 'role'} up`}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-secondary)',
                      padding: '4px 6px',
                      cursor: index === 0 ? 'not-allowed' : 'pointer',
                      opacity: index === 0 ? 0.4 : 0.8,
                    }}
                  >
                    <ArrowUp size={12} />
                  </button>

                  <button
                    type="button"
                    onClick={() => reorderExperience(index, index + 1)}
                    disabled={index === data.experiences.length - 1}
                    aria-label={`Move ${exp.company || 'role'} down`}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-secondary)',
                      padding: '4px 6px',
                      cursor: index === data.experiences.length - 1 ? 'not-allowed' : 'pointer',
                      opacity: index === data.experiences.length - 1 ? 0.4 : 0.8,
                    }}
                  >
                    <ArrowDown size={12} />
                  </button>

                  <button
                    type="button"
                    onClick={() => removeExperience(exp.id)}
                    aria-label={`Remove ${exp.company || 'role'}`}
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(196, 85, 61, 0.2)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--danger)',
                      padding: '4px 6px',
                      cursor: 'pointer',
                      marginLeft: '4px',
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr', gap: '12px' }}>
                <Input
                  label="Company / Project"
                  placeholder="e.g. Linear"
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                />
                <Input
                  label="Title / Role"
                  placeholder="e.g. Staff Systems Engineer"
                  value={exp.role}
                  onChange={(e) => updateExperience(exp.id, { role: e.target.value })}
                />
                <Input
                  label="Period"
                  placeholder="e.g. 2023 — Present"
                  value={exp.period}
                  onChange={(e) => updateExperience(exp.id, { period: e.target.value })}
                />
              </div>

              <Textarea
                label="Raw Accomplishment Notes"
                rows={3}
                placeholder="e.g. rebuilt client sync engine in rust/wasm, reduced cold launch time from 2.4s to 480ms. cut memory footprint 35%."
                value={exp.rawNotes}
                onChange={(e) => updateExperience(exp.id, { rawNotes: e.target.value })}
                helperText="Include any numbers, architectural changes, or scale. No need to polish grammar — we turn this into impact bullets."
              />
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
};
