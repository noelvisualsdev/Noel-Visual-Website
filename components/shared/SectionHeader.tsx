import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Heading } from '@/components/ui/Heading';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export const SectionHeader = ({
  badge,
  title,
  subtitle,
  centered = false,
  className,
}: SectionHeaderProps) => {
  return (
    <div
      className={cn(
        'max-w-3xl space-y-4 mb-12 md:mb-16',
        centered && 'mx-auto text-center',
        className
      )}
    >
      {badge && <Badge variant="dot">{badge}</Badge>}
      <Heading as="h2" size="lg" className="tracking-tight">
        {title}
      </Heading>
      {subtitle && (
        <p className="text-neutral-400 text-base md:text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
