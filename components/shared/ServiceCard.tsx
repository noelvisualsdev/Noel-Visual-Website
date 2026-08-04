import React from 'react';
import { Service } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Clapperboard,
  Image as ImageIcon,
  PencilRuler,
  Zap,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

interface ServiceCardProps {
  service: Service;
}

const iconMap: Record<string, React.ReactNode> = {
  Clapperboard: <Clapperboard className="w-6 h-6 text-white" />,
  Image: <ImageIcon className="w-6 h-6 text-white" />,
  PencilRuler: <PencilRuler className="w-6 h-6 text-white" />,
  Zap: <Zap className="w-6 h-6 text-white" />,
};

export const ServiceCard = ({ service }: ServiceCardProps) => {
  return (
    <Card variant="glass" className="h-full flex flex-col justify-between p-8 space-y-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shadow-inner">
            {iconMap[service.iconName] || <Zap className="w-6 h-6 text-white" />}
          </div>
          <Badge variant="accent">{service.deliverTime}</Badge>
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-bold tracking-tight text-white uppercase">
            {service.title}
          </h3>
          <p className="text-sm text-neutral-300 font-medium leading-relaxed">
            {service.shortDescription}
          </p>
        </div>

        <p className="text-xs text-neutral-400 leading-relaxed border-t border-white/5 pt-4">
          {service.fullDescription}
        </p>

        {/* Benefits list */}
        <div className="space-y-2 pt-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-500">
            Key Advantages
          </span>
          <ul className="space-y-2">
            {service.benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-center gap-2.5 text-xs text-neutral-300"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-6 border-t border-white/10 flex items-center justify-between">
        <Button
          href="/contact"
          variant="outline"
          size="sm"
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          className="w-full justify-between"
        >
          Book {service.title}
        </Button>
      </div>
    </Card>
  );
};
