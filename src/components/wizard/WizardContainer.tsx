import React from 'react';
import { useWizardStore } from '../../stores/wizardStore';
import { StepBasics } from './StepBasics';
import { StepExperience } from './StepExperience';
import { StepStackLinks } from './StepStackLinks';
import { StepGenerate } from './StepGenerate';
import { Button } from '../ui/Button';
import { ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Basics', label: '1. Basics' },
  { id: 2, title: 'Experience', label: '2. Experience' },
  { id: 3, title: 'Stack & Links', label: '3. Stack & Links' },
  { id: 4, title: 'Review & AI', label: '4. AI Copy' },
];

interface WizardContainerProps {
  onOpenSettings: () => void;
}

export const WizardContainer: React.FC<WizardContainerProps> = ({ onOpenSettings }) => {
  const { currentStep, direction, setStep, nextStep, prevStep, loadSampleData } = useWizardStore();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <StepBasics />;
      case 2:
        return <StepExperience />;
      case 3:
        return <StepStackLinks />;
      case 4:
        return <StepGenerate onOpenSettings={onOpenSettings} />;
      default:
        return <StepBasics />;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        overflow: 'hidden',
      }}
    >
      {/* Wizard Step Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 20px',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--bg)',
        }}
      >
        <div
          role="tablist"
          aria-label="Wizard Steps"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {STEPS.map((step) => {
            const isActive = currentStep === step.id;
            const isPassed = currentStep > step.id;

            return (
              <button
                key={step.id}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => setStep(step.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: isActive ? 'var(--accent-soft)' : 'transparent',
                  color: isActive
                    ? 'var(--accent)'
                    : isPassed
                    ? 'var(--text-primary)'
                    : 'var(--text-secondary)',
                  border: isActive
                    ? '1px solid rgba(31, 157, 107, 0.3)'
                    : '1px solid transparent',
                  borderRadius: 'var(--radius-sm)',
                  padding: '4px 10px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  cursor: 'pointer',
                  transition: 'all var(--duration-fast) var(--ease-out)',
                }}
              >
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={loadSampleData}
          title="Reset to Elena's reference profile"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={11} />
          <span>sample data</span>
        </button>
      </div>

      {/* Wizard Content Body with Direction-Aware Transition */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 28px',
          position: 'relative',
        }}
      >
        <div
          key={currentStep}
          style={{
            animation: `stepSlide${direction > 0 ? 'Forward' : 'Backward'} var(--duration-normal) var(--ease-out)`,
          }}
        >
          {renderCurrentStep()}
        </div>
      </div>

      {/* Wizard Navigation Footer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          borderTop: '1px solid var(--border)',
          backgroundColor: 'var(--bg)',
        }}
      >
        <Button
          variant="ghost"
          size="md"
          onClick={prevStep}
          disabled={currentStep === 1}
          leftIcon={<ArrowLeft size={14} />}
        >
          Previous
        </Button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {currentStep < 4 ? (
            <Button
              variant="primary"
              size="md"
              onClick={nextStep}
              rightIcon={<ArrowRight size={14} />}
            >
              {currentStep === 3 ? 'Proceed to Copy' : 'Next Step'}
            </Button>
          ) : (
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--accent)',
              }}
            >
              ready for export
            </span>
          )}
        </div>
      </div>

      {/* Inline Animation Styles for Step Transition */}
      <style>{`
        @keyframes stepSlideForward {
          from {
            opacity: 0;
            transform: translateX(12px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes stepSlideBackward {
          from {
            opacity: 0;
            transform: translateX(-12px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};
