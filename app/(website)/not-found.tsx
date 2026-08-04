import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { Container } from '@/components/ui/Container';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-16 bg-[#070709]">
      <Container size="sm" className="text-center space-y-6">
        <span className="text-8xl font-black font-mono tracking-tighter text-white/20 block">
          404
        </span>
        <h1 className="text-3xl font-extrabold text-white uppercase tracking-tight">
          FRAME NOT FOUND
        </h1>
        <p className="text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
          The page or case study you are looking for has been moved or doesn't exist.
        </p>
        <div className="pt-4">
          <Button
            href="/"
            variant="primary"
            size="md"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            RETURN TO HOMEPAGE
          </Button>
        </div>
      </Container>
    </div>
  );
}
