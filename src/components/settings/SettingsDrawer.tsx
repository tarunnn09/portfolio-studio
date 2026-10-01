import React, { useState } from 'react';
import { useGenerationStore } from '../../stores/generationStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Panel } from '../ui/Panel';
import { X, Key, Shield, Cpu, Check } from 'lucide-react';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_MODELS = [
  { id: 'claude-3-5-haiku-latest', label: 'Claude 3.5 Haiku (Fastest · Recommended)' },
  { id: 'claude-3-7-sonnet-latest', label: 'Claude 3.7 Sonnet (Nuanced Synthesis)' },
];

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({ isOpen, onClose }) => {
  const { llmConfig, setConfig } = useGenerationStore();
  const [apiKey, setApiKey] = useState(llmConfig.apiKey);
  const [model, setModel] = useState(llmConfig.model);
  const [useOffline, setUseOffline] = useState(llmConfig.useOfflineFallback);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setConfig({
      apiKey: apiKey.trim(),
      model: model.trim() || 'claude-3-5-haiku-latest',
      useOfflineFallback: useOffline,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-drawer-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        zIndex: 9999,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          height: '100%',
          backgroundColor: 'var(--surface)',
          borderLeft: '1px solid var(--border-strong)',
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          padding: '24px',
          gap: '24px',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Key size={18} color="var(--accent)" />
            <h2
              id="settings-drawer-title"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '16px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              LLM Engine Settings
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Engine Mode Switch */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--text-primary)',
            }}
          >
            Generation Mode
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setUseOffline(false)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: !useOffline ? 'var(--accent-soft)' : 'var(--surface-raised)',
                border: !useOffline ? '1px solid var(--accent)' : '1px solid var(--border)',
                color: !useOffline ? 'var(--accent)' : 'var(--text-secondary)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600 }}>
                Anthropic Claude API
              </span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', marginTop: '2px', opacity: 0.8 }}>
                Live LLM synthesis
              </span>
            </button>

            <button
              type="button"
              onClick={() => setUseOffline(true)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: useOffline ? 'var(--accent-soft)' : 'var(--surface-raised)',
                border: useOffline ? '1px solid var(--accent)' : '1px solid var(--border)',
                color: useOffline ? 'var(--accent)' : 'var(--text-secondary)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600 }}>
                Deterministic Offline
              </span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', marginTop: '2px', opacity: 0.8 }}>
                Zero key required
              </span>
            </button>
          </div>
        </div>

        {/* API Key Configuration */}
        {!useOffline && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              label="Anthropic API Key"
              type="password"
              placeholder="sk-ant-api03-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              helperText="Stored exclusively in your browser's localStorage. Never sent to any intermediate server."
            />

            {/* Model Selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                }}
              >
                Anthropic Model ID
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {POPULAR_MODELS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setModel(m.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: model === m.id ? 'var(--bg)' : 'var(--surface-raised)',
                      border: model === m.id ? '1px solid var(--accent)' : '1px solid var(--border)',
                      color: model === m.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '12px',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span>{m.label}</span>
                    {model === m.id && <Check size={14} color="var(--accent)" />}
                  </button>
                ))}
              </div>

              <Input
                placeholder="Or type custom model ID (e.g. claude-3-5-haiku-latest)"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                helperText="Active in 2026: claude-3-5-haiku-latest and claude-3-7-sonnet-latest."
              />
            </div>

            {/* Browser Access & Proxy Notice */}
            <Panel
              variant="raised"
              style={{
                display: 'flex',
                gap: '10px',
                padding: '12px',
                backgroundColor: 'rgba(31, 157, 107, 0.05)',
                border: '1px solid rgba(31, 157, 107, 0.2)',
              }}
            >
              <Shield size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '11px', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Direct Browser Connection:</strong> Direct browser requests pass <code>anthropic-dangerous-direct-browser-access: true</code>. During local dev, Vite automatically routes via <code>/api/anthropic</code> proxy to prevent devtools credential exposure.
              </div>
            </Panel>
          </div>
        )}

        {useOffline && (
          <Panel variant="raised" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={16} color="var(--accent)" />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Offline Fallback Engine Active
              </span>
            </div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Runs our deterministic copywriting heuristic directly in the browser. It enforces non-hype prose, maintains your exact numbers, and restructures notes into impact-first bullets with zero API latency.
            </p>
          </Panel>
        )}

        {/* Footer Actions */}
        <div style={{ marginTop: 'auto', display: 'flex', gap: '10px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
          <Button variant="ghost" onClick={onClose} style={{ flex: 1 }}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            style={{ flex: 1 }}
            leftIcon={savedSuccess ? <Check size={14} /> : undefined}
          >
            {savedSuccess ? 'Saved' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
};
