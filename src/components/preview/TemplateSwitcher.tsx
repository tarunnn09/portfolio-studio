import React from 'react';
import { useWizardStore } from '../../stores/wizardStore';
import { TemplatePreset } from '../../types/portfolio';

const TEMPLATES: Array<{ id: TemplatePreset; name: string; tag: string }> = [
  { id: 'editorial', name: 'The Editorial Engineer', tag: 'Serif · Essay' },
  { id: 'minimal', name: 'The Minimalist Builder', tag: 'Swiss · Vignelli' },
  { id: 'terminal', name: 'The Terminal Architect', tag: 'Zinc · Devtools' },
];

export const TemplateSwitcher: React.FC = () => {
  const { template, setTemplate } = useWizardStore();

  return (
    <div
      role="radiogroup"
      aria-label="Portfolio Template Presets"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px',
        backgroundColor: 'var(--surface-raised)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border)',
        gap: '2px',
      }}
    >
      {TEMPLATES.map((t) => {
        const isSelected = template === t.id;

        return (
          <button
            key={t.id}
            role="radio"
            aria-checked={isSelected}
            type="button"
            onClick={() => setTemplate(t.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              background: isSelected ? 'var(--bg)' : 'transparent',
              color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: isSelected ? '1px solid var(--border-strong)' : '1px solid transparent',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              fontWeight: isSelected ? 600 : 400,
              cursor: 'pointer',
              transition: 'all var(--duration-fast) var(--ease-out)',
              userSelect: 'none',
            }}
          >
            <span>{t.name}</span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: isSelected ? 'var(--accent)' : 'var(--text-secondary)',
                opacity: isSelected ? 1 : 0.7,
              }}
            >
              {t.tag}
            </span>
          </button>
        );
      })}
    </div>
  );
};
