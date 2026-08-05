'use client';

import React from 'react';

interface AnimatedVideoBackgroundProps {
  videoId?: string;
  overlayOpacity?: string;
  isFixed?: boolean;
}

export const AnimatedVideoBackground = ({
  videoId = '9vntypeV5QU',
  overlayOpacity = 'bg-black/75',
  isFixed = false,
}: AnimatedVideoBackgroundProps) => {
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1&disablekb=1&playsinline=1`;

  const containerClass = isFixed
    ? 'fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0 transform-gpu translate-z-0'
    : 'absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 transform-gpu translate-z-0';

  return (
    <div className={containerClass}>
      {/* Optimized Video Container */}
      <div className="absolute top-1/2 left-1/2 w-[180%] h-[180%] sm:w-[150%] sm:h-[150%] -translate-x-1/2 -translate-y-1/2 will-change-transform transform-gpu">
        <iframe
          src={embedUrl}
          title="NOEL VISUALS Background Video"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="w-full h-full object-cover opacity-30 pointer-events-none transform-gpu"
        />
      </div>

      {/* Dark Overlay */}
      <div className={`absolute inset-0 ${overlayOpacity} pointer-events-none`} />
    </div>
  );
};
