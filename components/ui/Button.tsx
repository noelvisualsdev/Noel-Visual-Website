'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glow';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      href,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-orbitron font-medium tracking-wider uppercase transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:pointer-events-none active:scale-95 cursor-pointer rounded-lg';

    const variants = {
      primary:
        'bg-white text-black hover:bg-neutral-200 shadow-lg shadow-white/10 font-bold',
      secondary:
        'bg-neutral-800 text-white hover:bg-neutral-700 border border-white/10',
      outline:
        'bg-neutral-900/60 backdrop-blur-md text-white border border-white/20 hover:border-white/50 hover:bg-white/10',
      ghost:
        'bg-transparent text-neutral-300 hover:text-white hover:bg-white/5',
      glow:
        'bg-white text-black hover:bg-neutral-100 shadow-[0_0_25px_rgba(255,255,255,0.4)] font-bold',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-xs md:text-sm px-5 py-2.5 gap-2',
      lg: 'text-sm md:text-base px-7 py-3.5 gap-2.5',
    };

    const content = (
      <>
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
        <span>{children}</span>
        {rightIcon}
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          className={cn(baseStyles, variants[variant], sizes[size], className)}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';
