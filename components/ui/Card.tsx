'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'glass' | 'solid' | 'outline';
  hoverEffect?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Card = ({
  variant = 'glass',
  hoverEffect = true,
  className,
  children,
  ...props
}: CardProps) => {
  const variantStyles = {
    glass: 'glass-card',
    solid: 'bg-[#0e0f14] border border-white/10 shadow-xl',
    outline: 'bg-transparent border border-white/15',
  };

  return (
    <motion.div
      className={cn(
        'rounded-xl p-6 relative overflow-hidden',
        variantStyles[variant],
        hoverEffect && 'glass-card-hover',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
