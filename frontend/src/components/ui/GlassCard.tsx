import type { ReactNode, HTMLAttributes } from 'react';

type Variant = 'default' | 'strong' | 'subtle';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: Variant;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantClass: Record<Variant, string> = {
  default: 'glass',
  strong: 'glass-strong',
  subtle: 'glass-subtle',
};

const paddingClass = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
};

export function GlassCard({
  children,
  variant = 'default',
  hover = false,
  padding = 'md',
  className = '',
  ...props
}: GlassCardProps) {
  return (
    <div
      className={[
        variantClass[variant],
        paddingClass[padding],
        'rounded-2xl',
        hover && 'transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 hover:bg-white/65',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}
