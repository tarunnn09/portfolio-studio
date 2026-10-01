import React from 'react';

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'raised' | 'active';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Panel: React.FC<PanelProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  style,
  ...props
}) => {
  const paddingMap = {
    none: '0',
    sm: 'var(--space-3)', // 12px
    md: 'var(--space-4)', // 16px
    lg: 'var(--space-5)', // 24px
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      backgroundColor: 'var(--surface)',
      border: '1px solid var(--border)',
    },
    raised: {
      backgroundColor: 'var(--surface-raised)',
      border: '1px solid var(--border)',
    },
    active: {
      backgroundColor: 'var(--surface-raised)',
      border: '1px solid var(--border-strong)',
      boxShadow: 'var(--shadow-active)',
    },
  };

  return (
    <div
      style={{
        borderRadius: 'var(--radius-md)',
        padding: paddingMap[padding],
        transition:
          'border-color var(--duration-fast) var(--ease-out), background-color var(--duration-fast) var(--ease-out)',
        ...variantStyles[variant],
        ...style,
      }}
      className={`ps-panel ps-panel-${variant} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
