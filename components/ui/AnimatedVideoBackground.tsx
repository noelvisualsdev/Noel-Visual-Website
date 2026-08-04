'use client';

import React from 'react';

interface AnimatedVideoBackgroundProps {
  videoId?: string;
  overlayOpacity?: string;
}

export const AnimatedVideoBackground = ({
  videoId = '9vntypeV5QU',
  overlayOpacity = 'bg-black/75',
}: AnimatedVideoBackgroundProps) => {
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1&disablekb=1&playsinline=1`;

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 transform-gpu translate-z-0">
      {/* Optimized Video Container using hardware acceleration (no heavy CSS filters) */}
      <div className="absolute top-1/2 left-1/2 w-[180%] h-[180%] sm:w-[150%] sm:h-[150%] -translate-x-1/2 -translate-y-1/2 will-change-transform transform-gpu">
        <iframe
          src={embedUrl}
          title="NOEL VISUALS Background Video"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="w-full h-full object-cover opacity-35 pointer-events-none transform-gpu"
        />
      </div>

      {/* Lightweight Dark Overlay (Pure solid/gradient overlays, no heavy GPU backdrop-filter) */}
      <div className={`absolute inset-0 ${overlayOpacity} pointer-events-none`} />

      {/* Top & Bottom Smooth Fade-outs */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#070709] to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#070709] to-transparent pointer-events-none" />
    </div>
  );
};
