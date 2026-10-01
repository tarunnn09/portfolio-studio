import React, { useState } from 'react';
import { useWizardStore } from '../../stores/wizardStore';
import { useGenerationStore } from '../../stores/generationStore';
import { generateReactViteProjectZip } from '../../lib/export/exportReactProject';
import { generateStaticHtml } from '../../lib/export/exportStaticHtml';
import { Button } from '../ui/Button';
import { Panel } from '../ui/Panel';
import {
  X,
  Download,
  Copy,
  Check,
  Globe,
  FileCode,
  ExternalLink,
  Layers,
  Terminal,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { data, template, useRawPitch } = useWizardStore();
  const { lastGeneratedCopy } = useGenerationStore();

  const [activeTab, setActiveTab] = useState<'export' | 'deploy' | 'code'>('export');
  const [isZipping, setIsZipping] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);

  if (!isOpen) return null;

  const slug = (data.name || 'developer').toLowerCase().replace(/\s+/g, '-');

  const handleDownloadReactZip = async () => {
    try {
      setIsZipping(true);
      const zipBlob = await generateReactViteProjectZip(
        data,
        lastGeneratedCopy,
        template,
        useRawPitch
      );

      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `portfolio-${slug}-${template}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to create zip bundle:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const handleDownloadStaticHtml = () => {
    const html = generateStaticHtml(data, lastGeneratedCopy, template, useRawPitch);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `index.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyStaticHtml = () => {
    const html = generateStaticHtml(data, lastGeneratedCopy, template, useRawPitch);
    navigator.clipboard.writeText(html);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const staticHtmlPreview = generateStaticHtml(data, lastGeneratedCopy, template, useRawPitch);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '24px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          overflow: 'hidden',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            backgroundColor: 'var(--bg)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2
              id="export-modal-title"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              Export & Deploy Portfolio
            </h2>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--accent)',
                backgroundColor: 'var(--accent-soft)',
                padding: '2px 6px',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              preset: {template}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close export modal"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '2px',
            padding: '8px 20px',
            borderBottom: '1px solid var(--border)',
            backgroundColor: 'var(--surface-raised)',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('export')}
            style={{
              padding: '6px 12px',
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              fontWeight: activeTab === 'export' ? 600 : 400,
              color: activeTab === 'export' ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: activeTab === 'export' ? 'var(--bg)' : 'transparent',
              border: activeTab === 'export' ? '1px solid var(--border)' : '1px solid transparent',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
            }}
          >
            Download Bundles
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('deploy')}
            style={{
              padding: '6px 12px',
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              fontWeight: activeTab === 'deploy' ? 600 : 400,
              color: activeTab === 'deploy' ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: activeTab === 'deploy' ? 'var(--bg)' : 'transparent',
              border: activeTab === 'deploy' ? '1px solid var(--border)' : '1px solid transparent',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
            }}
          >
            1-Click Live Hosting
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('code')}
            style={{
              padding: '6px 12px',
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              fontWeight: activeTab === 'code' ? 600 : 400,
              color: activeTab === 'code' ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: activeTab === 'code' ? 'var(--bg)' : 'transparent',
              border: activeTab === 'code' ? '1px solid var(--border)' : '1px solid transparent',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
            }}
          >
            Inspect Source
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {activeTab === 'export' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Option 1: Standalone React/Vite Project */}
              <Panel
                variant="raised"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                }}
              >
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent)',
                    }}
                  >
                    <Layers size={18} />
                  </div>
                  <div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        margin: 0,
                      }}
                    >
                      Standalone React/Vite Project (.zip)
                    </h3>
                    <p
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                        margin: '2px 0 0',
                      }}
                    >
                      Complete codebase with typed config, only {template} template, zero bloat. Run with{' '}
                      <code>npm install && npm run dev</code>.
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleDownloadReactZip}
                  isLoading={isZipping}
                  loadingText="Archiving…"
                  leftIcon={<Download size={14} />}
                >
                  Download ZIP
                </Button>
              </Panel>

              {/* Option 2: Pre-rendered Static HTML */}
              <Panel
                variant="raised"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                }}
              >
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#F5F4F1',
                    }}
                  >
                    <FileCode size={18} />
                  </div>
                  <div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        margin: 0,
                      }}
                    >
                      Pre-rendered Static HTML (index.html)
                    </h3>
                    <p
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                        margin: '2px 0 0',
                      }}
                    >
                      Zero build step. Standalone HTML5 with scoped CSS and embedded typography.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleCopyStaticHtml}
                    leftIcon={copiedHtml ? <Check size={14} color="var(--accent)" /> : <Copy size={14} />}
                  >
                    {copiedHtml ? 'Copied' : 'Copy'}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleDownloadStaticHtml}
                    leftIcon={<Download size={14} />}
                  >
                    Download
                  </Button>
                </div>
              </Panel>
            </div>
          )}

          {activeTab === 'deploy' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Netlify Drop: Zero-Auth Instant Deploy */}
              <Panel variant="raised" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Globe size={16} color="var(--accent)" />
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Instant Drag-and-Drop Hosting (Netlify Drop)
                    </span>
                  </div>
                  <a
                    href="https://app.netlify.com/drop"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: 'var(--accent)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      textDecoration: 'none',
                    }}
                  >
                    <span>open dropzone</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                  Download the <strong>Static HTML (index.html)</strong>, then simply drag it into Netlify Drop. You get an immediate, permanent live URL in 5 seconds with zero account required.
                </p>
              </Panel>

              {/* Vercel Deploy Button */}
              <Panel variant="raised" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Terminal size={16} color="var(--text-primary)" />
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Vercel CLI or Git Repository
                    </span>
                  </div>
                </div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                  Extract the exported React project zip and run:
                </p>
                <div
                  style={{
                    backgroundColor: 'var(--bg)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    color: 'var(--text-primary)',
                  }}
                >
                  npx vercel
                </div>
              </Panel>
            </div>
          )}

          {activeTab === 'code' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Generated index.html ({template})
                </span>
                <button
                  type="button"
                  onClick={handleCopyStaticHtml}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'transparent',
                    border: 'none',
                    color: copiedHtml ? 'var(--accent)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    cursor: 'pointer',
                  }}
                >
                  {copiedHtml ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedHtml ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <pre
                style={{
                  backgroundColor: 'var(--bg)',
                  padding: '14px',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  lineHeight: 1.5,
                  color: 'var(--text-primary)',
                  overflowX: 'auto',
                  maxHeight: '360px',
                  border: '1px solid var(--border)',
                }}
              >
                <code>{staticHtmlPreview}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
