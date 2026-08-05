'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { ExternalLink, Handshake } from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
  description?: string;
  category?: string;
}

export const PartnersSection = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/partners')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setPartners(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (!isLoading && partners.length === 0) return null;
};

function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <div className="relative flex flex-col items-center justify-center gap-3 p-5 rounded-xl bg-white/[0.03] border border-white/8 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300 group cursor-pointer min-h-[100px]">
      {partner.logoUrl ? (
        <img
          src={partner.logoUrl}
          alt={partner.name}
          className="max-h-10 max-w-[120px] object-contain filter brightness-75 group-hover:brightness-100 transition-all duration-300"
        />
      ) : (
        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-lg font-extrabold text-white uppercase">
          {partner.name.charAt(0)}
        </div>
      )}
      <span className="text-[11px] font-semibold text-neutral-400 group-hover:text-white transition-colors text-center uppercase tracking-wider">
        {partner.name}
      </span>
      {partner.websiteUrl && (
        <ExternalLink className="absolute top-2.5 right-2.5 w-3 h-3 text-neutral-600 group-hover:text-neutral-300 transition-colors" />
      )}
    </div>
  );
}
