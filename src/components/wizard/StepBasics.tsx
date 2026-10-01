import React from 'react';
import { useWizardStore } from '../../stores/wizardStore';
import { Input, Textarea } from '../ui/Input';

export const StepBasics: React.FC = () => {
  const { data, updateBasics } = useWizardStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
          Core Profile
        </h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Start with who you are. We'll use your raw pitch to seed your refined portfolio bio.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Input
          label="Full Name"
          placeholder="e.g. Elena Rostova"
          value={data.name}
          onChange={(e) => updateBasics({ name: e.target.value })}
          helperText="Appears as the primary display name on your site."
        />

        <Input
          label="Location (Optional)"
          placeholder="e.g. San Francisco, CA"
          value={data.location}
          onChange={(e) => updateBasics({ location: e.target.value })}
          helperText="City, country, or remote base."
        />
      </div>

      <Input
        label="Professional Title / Role"
        placeholder="e.g. Systems & Distributed Infrastructure Engineer"
        value={data.role}
        onChange={(e) => updateBasics({ role: e.target.value })}
        helperText="Your specialty or current high-level title."
      />

      <Textarea
        label="Raw Pitch & Focus"
        rows={4}
        placeholder="e.g. I spend my days making distributed systems fast and resilient. Built edge proxies, consensus engines, and local-first desktop runtimes."
        value={data.rawPitch}
        onChange={(e) => updateBasics({ rawPitch: e.target.value })}
        metaBadge="Seed for AI Bio"
        helperText="Two or three sentences, as if you were telling a colleague what you do — we'll sharpen it into polished, non-hype copy."
      />
    </div>
  );
};
