import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070709] text-white">
      <div className="w-14 h-14 rounded-2xl bg-white text-black font-black text-2xl flex items-center justify-center shadow-2xl animate-bounce">
        NV
      </div>
      <p className="mt-4 text-xs font-mono tracking-widest text-neutral-400 uppercase animate-pulse">
        LOADING NOEL VISUALS...
      </p>
    </div>
  );
}
