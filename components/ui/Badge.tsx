import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'outline' | 'solid' | 'accent' | 'dot';
  children: React.ReactNode;
  className?: string;
}

export const Badge = ({
  variant = 'outline',
  children,
  className,
}: BadgeProps) => {
  const variants = {
    outline: 'border border-white/20 bg-white/5 text-neutral-300',
    solid: 'bg-white text-black font-semibold',
    accent: 'bg-neutral-800 text-white border border-white/10',
    dot: 'bg-neutral-900/80 border border-white/20 text-neutral-200 pl-2.5 pr-3 py-1',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full text-[11px] font-mono tracking-widest uppercase px-3 py-1',
        variants[variant],
        className
      )}
    >
      {variant === 'dot' && (
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
      )}
      {children}
    </span>
  );
};
