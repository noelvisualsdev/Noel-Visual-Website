import React from 'react';
import { cn } from '@/lib/utils';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: 'xl' | 'lg' | 'md' | 'sm';
  children: React.ReactNode;
}

export const Heading = ({
  as: Component = 'h2',
  size = 'lg',
  className,
  children,
  ...props
}: HeadingProps) => {
  const sizes = {
    xl: 'text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08]',
    lg: 'text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight',
    md: 'text-2xl sm:text-3xl font-semibold tracking-tight',
    sm: 'text-xl sm:text-2xl font-semibold',
  };

  return (
    <Component
      className={cn('text-white font-orbitron', sizes[size], className)}
      {...props}
    >
      {children}
    </Component>
  );
};
