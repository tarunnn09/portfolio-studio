import React, { useState } from 'react';
import { useWizardStore } from '../../stores/wizardStore';
import { Input } from '../ui/Input';
import { Tag } from '../ui/Tag';
import { Github, Linkedin, Globe, Mail, Plus } from 'lucide-react';

const POPULAR_SUGGESTIONS = [
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'Go',
  'Rust',
  'Python',
  'PostgreSQL',
  'Distributed Systems',
  'Docker',
  'Kubernetes',
  'AWS',
  'GraphQL',
];

export const StepStackLinks: React.FC = () => {
  const { data, addStackTag, removeStackTag, updateLinks } = useWizardStore();
  const [tagInput, setTagInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (tagInput.trim()) {
        addStackTag(tagInput.trim());
        setTagInput('');
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
          Stack & Profiles
        </h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Curate your technical core and links. Your stack tags drive badge rendering across the templates.
        </p>
      </div>

      {/* Stack Tags Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <label
          htmlFor="stack-tag-input"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--text-primary)',
          }}
        >
          Technologies & Tools (Type & press Enter)
        </label>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            padding: '10px 12px',
            minHeight: '44px',
            backgroundColor: 'var(--surface-raised)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            alignItems: 'center',
          }}
        >
          {data.stack.map((tag) => (
            <Tag key={tag} label={tag} isRemovable onRemove={() => removeStackTag(tag)} />
          ))}

          <input
            id="stack-tag-input"
            type="text"
            placeholder={data.stack.length === 0 ? "Type tech (e.g. 'Rust', 'TypeScript') and press Enter" : "+ add more"}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              flex: '1 1 140px',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
            }}
          />
        </div>

        {/* Quick Suggestion Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--text-secondary)',
            }}
          >
            quick add:
          </span>
          {POPULAR_SUGGESTIONS.filter((s) => !data.stack.includes(s))
            .slice(0, 6)
            .map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addStackTag(suggestion)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'transparent',
                  border: '1px dashed var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '2px 8px',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  cursor: 'pointer',
                  transition: 'all var(--duration-fast) var(--ease-out)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.borderColor = 'var(--border-strong)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                <Plus size={10} />
                <span>{suggestion.toLowerCase()}</span>
              </button>
            ))}
        </div>
      </div>

      {/* Social & Contact Links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '8px' }}>
        <h3
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}
        >
          Contact & Network Links
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Github size={16} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
            <Input
              placeholder="https://github.com/username"
              value={data.links.github || ''}
              onChange={(e) => updateLinks({ github: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Linkedin size={16} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
            <Input
              placeholder="https://linkedin.com/in/username"
              value={data.links.linkedin || ''}
              onChange={(e) => updateLinks({ linkedin: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mail size={16} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
            <Input
              placeholder="you@domain.com"
              value={data.links.email || ''}
              onChange={(e) => updateLinks({ email: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={16} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
            <Input
              placeholder="https://yourwebsite.com"
              value={data.links.website || ''}
              onChange={(e) => updateLinks({ website: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
