'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface SectionProps extends HTMLMotionProps<'section'> {
  id?: string;
  className?: string;
  children: React.ReactNode;
}

export const Section = ({ id, className, children, ...props }: SectionProps) => {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn('py-16 md:py-24 relative overflow-hidden', className)}
      {...props}
    >
      {children}
    </motion.section>
  );
};
