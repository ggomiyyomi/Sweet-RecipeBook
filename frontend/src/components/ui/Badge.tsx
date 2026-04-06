import type { ReactNode } from 'react';

type Color = 'primary' | 'brown' | 'green' | 'blue' | 'red' | 'yellow';

interface BadgeProps {
  children: ReactNode;
  color?: Color;
  size?: 'sm' | 'md';
  dot?: boolean;
}

const colorClass: Record<Color, string> = {
  primary: 'bg-primary-100/80 text-primary-700 border-primary-200/60',
  brown:   'bg-brown-100/80 text-brown-600 border-brown-200/60',
  green:   'bg-emerald-100/80 text-emerald-700 border-emerald-200/60',
  blue:    'bg-sky-100/80 text-sky-700 border-sky-200/60',
  red:     'bg-red-100/80 text-red-600 border-red-200/60',
  yellow:  'bg-amber-100/80 text-amber-700 border-amber-200/60',
};

const dotColor: Record<Color, string> = {
  primary: 'bg-primary-500',
  brown:   'bg-brown-400',
  green:   'bg-emerald-500',
  blue:    'bg-sky-500',
  red:     'bg-red-500',
  yellow:  'bg-amber-500',
};

export function Badge({ children, color = 'primary', size = 'sm', dot = false }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 rounded-full border font-medium backdrop-blur-sm',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        colorClass[color],
      ].join(' ')}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor[color]}`} />}
      {children}
    </span>
  );
}
