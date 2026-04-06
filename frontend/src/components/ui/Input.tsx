import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';

// ── Text Input ────────────────────────────────────────────

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-brown-800">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-400">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          className={[
            'w-full h-11 rounded-xl px-4 text-sm',
            'glass-subtle',
            'placeholder:text-brown-400/70 text-brown-800',
            'outline-none focus:ring-2 focus:ring-primary-400/40 focus:border-primary-300',
            'transition-all duration-150',
            error && 'ring-2 ring-red-400/40 border-red-300',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-400">
            {rightIcon}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-brown-400">{hint}</p>}
    </div>
  );
}

// ── Textarea ────────────────────────────────────────────

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Textarea({
  label,
  error,
  hint,
  className = '',
  id,
  ...props
}: TextareaProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-brown-800">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={[
          'w-full rounded-xl px-4 py-3 text-sm',
          'glass-subtle resize-none',
          'placeholder:text-brown-400/70 text-brown-800',
          'outline-none focus:ring-2 focus:ring-primary-400/40 focus:border-primary-300',
          'transition-all duration-150',
          error && 'ring-2 ring-red-400/40 border-red-300',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-brown-400">{hint}</p>}
    </div>
  );
}
