'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function AnnouncementBanner() {
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementEnabled, setAnnouncementEnabled] = useState(false);
  const [maintenanceActive, setMaintenanceActive] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    fetch('/api/admin/maintenance')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMaintenanceActive(Boolean(data.maintenanceMode));
          setAnnouncementText(data.announcementText || '');
          setAnnouncementEnabled(Boolean(data.announcementEnabled));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Do not render if dismissed or maintenance is active (maintenance indicator is floating)
  if (isDismissed || maintenanceActive || !announcementEnabled || !announcementText) {
    return null;
  }

  return (
    <div className="relative z-50 bg-[#0c0d14] border-b border-white/15 text-white py-2 px-4 text-xs font-sans">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 mx-auto text-center truncate">
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-white font-mono text-[10px] font-extrabold uppercase border border-white/20 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-white" /> SPECIAL ANNOUNCEMENT
          </span>
          <span className="font-medium text-neutral-200 text-xs md:text-sm truncate">
            {announcementText}
          </span>
          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center gap-1 text-white font-bold hover:underline underline-offset-4 ml-1 text-xs shrink-0"
          >
            <span>Jetzt Anfragen</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer shrink-0"
          title="Schließen"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
