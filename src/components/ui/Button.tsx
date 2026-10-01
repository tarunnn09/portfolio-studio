import React, { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      disabled,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const baseStyle: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      borderRadius: 'var(--radius-sm)',
      fontFamily: 'var(--font-sans)',
      fontWeight: 500,
      cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
      opacity: disabled || isLoading ? 0.6 : 1,
      transition: 'background-color var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out)',
      outline: 'none',
      border: '1px solid transparent',
      textDecoration: 'none',
      whiteSpace: 'nowrap',
      userSelect: 'none',
    };

    const sizeStyles: Record<string, React.CSSProperties> = {
      sm: { height: '32px', padding: '0 12px', fontSize: '12px' },
      md: { height: '38px', padding: '0 16px', fontSize: '13px' },
      lg: { height: '44px', padding: '0 20px', fontSize: '14px' },
    };

    const variantStyles: Record<string, React.CSSProperties> = {
      primary: {
        backgroundColor: 'var(--accent)',
        color: '#FFFFFF',
        borderColor: 'var(--accent)',
      },
      secondary: {
        backgroundColor: 'var(--surface-raised)',
        color: 'var(--text-primary)',
        borderColor: 'var(--border)',
      },
      ghost: {
        backgroundColor: 'transparent',
        color: 'var(--text-secondary)',
        borderColor: 'transparent',
      },
      danger: {
        backgroundColor: 'transparent',
        color: 'var(--danger)',
        borderColor: 'rgba(196, 85, 61, 0.3)',
      },
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        style={{ ...baseStyle, ...sizeStyles[size], ...variantStyles[variant], ...style }}
        className={`ps-button ps-button-${variant} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <span
              style={{
                display: 'inline-block',
                width: '12px',
                height: '12px',
                border: '2px solid currentColor',
                borderRightColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.6s linear infinite',
              }}
            />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
              {loadingText || 'Generating…'}
            </span>
          </>
        ) : (
          <>
            {leftIcon}
            <span>{children}</span>
            {rightIcon}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
