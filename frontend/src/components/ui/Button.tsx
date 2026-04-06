import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClass: Record<Variant, string> = {
  primary:
    'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-md shadow-primary-500/25',
  secondary:
    'glass text-primary-700 hover:bg-white/70 border-primary-200/60',
  ghost:
    'text-brown-600 hover:bg-white/40 hover:text-primary-600',
  danger:
    'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-md shadow-red-500/25',
};

const sizeClass: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-5 text-sm gap-2',
  lg: 'h-12 px-7 text-base gap-2.5',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center font-medium rounded-xl',
        'transition-all duration-150',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClass[variant],
        sizeClass[size],
        fullWidth && 'w-full',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-0.5 w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
