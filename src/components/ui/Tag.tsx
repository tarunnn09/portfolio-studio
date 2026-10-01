import React from 'react';
import { X } from 'lucide-react';

export interface TagProps {
  label: string;
  onRemove?: () => void;
  isRemovable?: boolean;
  variant?: 'default' | 'accent' | 'outlined';
  className?: string;
  style?: React.CSSProperties;
}

export const Tag: React.FC<TagProps> = ({
  label,
  onRemove,
  isRemovable = false,
  variant = 'default',
  className = '',
  style,
}) => {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    height: '24px',
    padding: '0 8px',
    borderRadius: 'var(--radius-sm)',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    fontWeight: 500,
    textTransform: 'lowercase',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    transition: 'all var(--duration-fast) var(--ease-out)',
    ...style,
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      backgroundColor: 'var(--surface-raised)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border)',
    },
    accent: {
      backgroundColor: 'var(--accent-soft)',
      color: 'var(--accent)',
      border: '1px solid rgba(31, 157, 107, 0.3)',
    },
    outlined: {
      backgroundColor: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border-strong)',
    },
  };

  return (
    <span
      className={`animate-tag-enter ${className}`}
      style={{ ...baseStyle, ...variantStyles[variant] }}
    >
      <span>{label}</span>
      {isRemovable && onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Backspace' || e.key === 'Delete') {
              e.preventDefault();
              onRemove();
            }
          }}
          aria-label={`Remove ${label}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '14px',
            height: '14px',
            padding: 0,
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            opacity: 0.7,
            transition: 'opacity var(--duration-fast) var(--ease-out)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
        >
          <X size={10} strokeWidth={2.5} />
        </button>
      )}
    </span>
  );
};
