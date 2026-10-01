import { useState } from 'react';
import { Header } from './components/layout/Header';
import { WizardContainer } from './components/wizard/WizardContainer';
import { PreviewFrame } from './components/preview/PreviewFrame';
import { ExportModal } from './components/export/ExportModal';
import { SettingsDrawer } from './components/settings/SettingsDrawer';

export function App() {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: 'var(--bg)',
      }}
    >
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* Main Split-Screen Workspace */}
      <main
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '480px 1fr',
          height: 'calc(100vh - 52px)',
          overflow: 'hidden',
        }}
      >
        {/* Left Side: Structured Input Wizard */}
        <section
          aria-label="Structured Input Wizard"
          style={{ height: '100%', overflow: 'hidden' }}
        >
          <WizardContainer onOpenSettings={() => setIsSettingsOpen(true)} />
        </section>

        {/* Right Side: Live Sandbox Preview */}
        <section
          aria-label="Live Sandbox Preview"
          style={{ height: '100%', overflow: 'hidden' }}
        >
          <PreviewFrame onOpenExport={() => setIsExportOpen(true)} />
        </section>
      </main>

      {/* Modals & Drawers */}
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
      <SettingsDrawer isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}

export default App;
