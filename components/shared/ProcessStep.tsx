import React from 'react';
import { ProcessStep as ProcessStepType } from '@/types';
import { Card } from '@/components/ui/Card';
import { Check } from 'lucide-react';

interface ProcessStepProps {
  step: ProcessStepType;
  isLast?: boolean;
}

export const ProcessStep = ({ step, isLast = false }: ProcessStepProps) => {
  return (
    <div className="relative group">
      <Card variant="glass" className="p-6 md:p-8 space-y-4 relative z-10 h-full flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-3xl md:text-4xl font-extrabold font-mono text-white/40 group-hover:text-white transition-colors">
              {step.step}
            </span>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-white/5 border border-white/10 text-neutral-400">
              {step.timeframe}
            </span>
          </div>

          <h3 className="text-xl font-bold tracking-tight text-white uppercase">
            {step.title}
          </h3>

          <p className="text-xs text-neutral-400 leading-relaxed">
            {step.description}
          </p>
        </div>

        <div className="pt-4 border-t border-white/5 space-y-2">
          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
            Deliverables
          </span>
          <div className="flex flex-wrap gap-1.5">
            {step.deliverables.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1 text-[11px] text-neutral-300 bg-white/5 px-2 py-1 rounded border border-white/5"
              >
                <Check className="w-3 h-3 text-emerald-400" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </Card>

      {!isLast && (
        <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-[1px] bg-gradient-to-r from-white/20 to-transparent z-20" />
      )}
    </div>
  );
};
