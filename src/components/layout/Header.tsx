import { useGenerationStore } from '../../stores/generationStore';
import { Button } from '../ui/Button';
import { Key, Download, Cpu, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, onOpenExport }) => {
  const { llmConfig } = useGenerationStore();

  return (
    <header
      style={{
        height: '52px',
        backgroundColor: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        zIndex: 10,
      }}
    >
      {/* Brand Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '20px',
              height: '20px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '6px',
                height: '6px',
                backgroundColor: '#FFFFFF',
                borderRadius: '1px',
              }}
            />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              color: 'var(--text-primary)',
            }}
          >
            Portfolio Studio
          </span>
        </div>

        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            backgroundColor: 'var(--surface-raised)',
            border: '1px solid var(--border)',
            padding: '1px 6px',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          v1.0
        </span>
      </div>

      {/* Center Engine Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          type="button"
          onClick={onOpenSettings}
          title="Click to configure AI Engine / API Key"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--surface-raised)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '4px 10px',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            cursor: 'pointer',
            transition: 'border-color var(--duration-fast) var(--ease-out)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
        >
          {llmConfig.useOfflineFallback ? (
            <>
              <Cpu size={12} color="var(--accent)" />
              <span>engine: offline</span>
            </>
          ) : (
            <>
              <Sparkles size={12} color="var(--accent)" />
              <span>claude: {llmConfig.model.replace('-latest', '')}</span>
            </>
          )}
        </button>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Button
          size="sm"
          variant="secondary"
          onClick={onOpenSettings}
          leftIcon={<Key size={13} />}
        >
          API Config
        </Button>

        <Button
          size="sm"
          variant="primary"
          onClick={onOpenExport}
          leftIcon={<Download size={13} />}
        >
          Export
        </Button>
      </div>
    </header>
  );
};
