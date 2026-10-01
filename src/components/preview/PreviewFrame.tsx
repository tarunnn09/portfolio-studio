import { Suspense, lazy } from 'react';
import { useWizardStore } from '../../stores/wizardStore';
import { useGenerationStore } from '../../stores/generationStore';
import { TemplateSwitcher } from './TemplateSwitcher';
import { ViewportToggle } from './ViewportToggle';
import { Sparkles, FileText } from 'lucide-react';

// Lazy-load each template preset to enforce code splitting and perf budget
const EditorialTemplate = lazy(() => import('../templates/editorial/EditorialTemplate'));
const MinimalTemplate = lazy(() => import('../templates/minimal/MinimalTemplate'));
const TerminalTemplate = lazy(() => import('../templates/terminal/TerminalTemplate'));

interface PreviewFrameProps {
  onOpenExport: () => void;
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({ onOpenExport }) => {
  const { data, template, viewport, displayMode, setDisplayMode, useRawPitch } = useWizardStore();
  const { lastGeneratedCopy, flashingFields } = useGenerationStore();

  const renderTemplate = () => {
    const props = {
      data,
      generatedCopy: lastGeneratedCopy,
      displayMode,
      useRawPitch,
      flashingFields,
    };

    switch (template) {
      case 'editorial':
        return <EditorialTemplate {...props} />;
      case 'minimal':
        return <MinimalTemplate {...props} />;
      case 'terminal':
        return <TerminalTemplate {...props} />;
      default:
        return <EditorialTemplate {...props} />;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#0A0A0A',
        overflow: 'hidden',
      }}
    >
      {/* Top Preview Controls Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 20px',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <TemplateSwitcher />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Before / After Copy Display Mode Toggle */}
          <div
            role="group"
            aria-label="Copy Mode"
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
              onClick={() => setDisplayMode('generated')}
              aria-pressed={displayMode === 'generated'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                background: displayMode === 'generated' ? 'var(--bg)' : 'transparent',
                color: displayMode === 'generated' ? 'var(--accent)' : 'var(--text-secondary)',
                border: displayMode === 'generated' ? '1px solid var(--border-strong)' : '1px solid transparent',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              <Sparkles size={12} />
              <span>ai copy</span>
            </button>

            <button
              type="button"
              onClick={() => setDisplayMode('raw')}
              aria-pressed={displayMode === 'raw'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                background: displayMode === 'raw' ? 'var(--bg)' : 'transparent',
                color: displayMode === 'raw' ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: displayMode === 'raw' ? '1px solid var(--border-strong)' : '1px solid transparent',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              <FileText size={12} />
              <span>raw notes</span>
            </button>
          </div>

          <ViewportToggle />

          {/* Direct Export Trigger Button */}
          <button
            type="button"
            onClick={onOpenExport}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--accent)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 14px',
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color var(--duration-fast) var(--ease-out)',
            }}
          >
            Export Site
          </button>
        </div>
      </div>

      {/* Sandboxed Live Viewport Canvas */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: viewport === 'mobile' ? 'flex-start' : 'stretch',
          padding: viewport === 'mobile' ? '32px 16px' : '0',
          backgroundColor: '#09090B',
        }}
      >
        <div
          key={template}
          style={{
            width: viewport === 'mobile' ? '390px' : '100%',
            minHeight: viewport === 'mobile' ? '780px' : '100%',
            boxShadow:
              viewport === 'mobile'
                ? '0 20px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)'
                : 'none',
            borderRadius: viewport === 'mobile' ? '28px' : '0',
            overflow: 'hidden',
            animation: 'previewCrossFade var(--duration-normal) var(--ease-out)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Suspense
            fallback={
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  backgroundColor: 'var(--surface)',
                }}
              >
                Rendering {template}…
              </div>
            }
          >
            {renderTemplate()}
          </Suspense>
        </div>
      </div>

      <style>{`
        @keyframes previewCrossFade {
          from {
            opacity: 0.85;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
