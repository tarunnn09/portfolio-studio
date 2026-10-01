import React from 'react';
import { useWizardStore } from '../../stores/wizardStore';
import { Monitor, Smartphone } from 'lucide-react';

export const ViewportToggle: React.FC = () => {
  const { viewport, setViewport } = useWizardStore();

  return (
    <div
      role="group"
      aria-label="Preview Viewport"
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
      <button
        type="button"
        aria-label="Desktop viewport"
        aria-pressed={viewport === 'desktop'}
        onClick={() => setViewport('desktop')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '28px',
          height: '26px',
          background: viewport === 'desktop' ? 'var(--bg)' : 'transparent',
          color: viewport === 'desktop' ? 'var(--text-primary)' : 'var(--text-secondary)',
          border: viewport === 'desktop' ? '1px solid var(--border-strong)' : '1px solid transparent',
          borderRadius: 'var(--radius-sm)',
          cursor: 'pointer',
          transition: 'all var(--duration-fast) var(--ease-out)',
        }}
      >
        <Monitor size={14} />
      </button>

      <button
        type="button"
        aria-label="Mobile viewport"
        aria-pressed={viewport === 'mobile'}
        onClick={() => setViewport('mobile')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '28px',
          height: '26px',
          background: viewport === 'mobile' ? 'var(--bg)' : 'transparent',
          color: viewport === 'mobile' ? 'var(--text-primary)' : 'var(--text-secondary)',
          border: viewport === 'mobile' ? '1px solid var(--border-strong)' : '1px solid transparent',
          borderRadius: 'var(--radius-sm)',
          cursor: 'pointer',
          transition: 'all var(--duration-fast) var(--ease-out)',
        }}
      >
        <Smartphone size={14} />
      </button>
    </div>
  );
};
