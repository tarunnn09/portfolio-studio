import React, { forwardRef, useId } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorText?: string;
  metaBadge?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, errorText, metaBadge, id: customId, style, ...props }, ref) => {
    const generatedId = useId();
    const id = customId || generatedId;
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
        {label && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label
              htmlFor={id}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--text-primary)',
              }}
            >
              {label}
            </label>
            {metaBadge && (
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  textTransform: 'lowercase',
                }}
              >
                {metaBadge}
              </span>
            )}
          </div>
        )}

        <input
          ref={ref}
          id={id}
          aria-describedby={errorText ? errorId : helperText ? helperId : undefined}
          aria-invalid={Boolean(errorText)}
          style={{
            height: '38px',
            padding: '0 12px',
            backgroundColor: 'var(--surface-raised)',
            border: `1px solid ${errorText ? 'var(--danger)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
            outline: 'none',
            transition:
              'border-color var(--duration-fast) var(--ease-out), background-color var(--duration-fast) var(--ease-out)',
            ...style,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-strong)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = errorText ? 'var(--danger)' : 'var(--border)';
          }}
          {...props}
        />

        {errorText && (
          <p
            id={errorId}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              color: 'var(--danger)',
              margin: 0,
            }}
          >
            {errorText}
          </p>
        )}

        {helperText && !errorText && (
          <p
            id={helperId}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  errorText?: string;
  metaBadge?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, errorText, metaBadge, id: customId, rows = 3, style, ...props }, ref) => {
    const generatedId = useId();
    const id = customId || generatedId;
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
        {label && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label
              htmlFor={id}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--text-primary)',
              }}
            >
              {label}
            </label>
            {metaBadge && (
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  textTransform: 'lowercase',
                }}
              >
                {metaBadge}
              </span>
            )}
          </div>
        )}

        <textarea
          ref={ref}
          id={id}
          rows={rows}
          aria-describedby={errorText ? errorId : helperText ? helperId : undefined}
          aria-invalid={Boolean(errorText)}
          style={{
            padding: '10px 12px',
            backgroundColor: 'var(--surface-raised)',
            border: `1px solid ${errorText ? 'var(--danger)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
            lineHeight: 1.5,
            outline: 'none',
            resize: 'vertical',
            transition:
              'border-color var(--duration-fast) var(--ease-out), background-color var(--duration-fast) var(--ease-out)',
            ...style,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-strong)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = errorText ? 'var(--danger)' : 'var(--border)';
          }}
          {...props}
        />

        {errorText && (
          <p
            id={errorId}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              color: 'var(--danger)',
              margin: 0,
            }}
          >
            {errorText}
          </p>
        )}

        {helperText && !errorText && (
          <p
            id={helperId}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
