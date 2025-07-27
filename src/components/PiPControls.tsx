'use client';

import React from 'react';
import { usePiP } from '@/hooks/usePiP';
import { Monitor, X } from 'lucide-react';

export function PiPControls() {
  const { isSupported, isPiPActive, enterPiP, exitPiP } = usePiP();

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-sm text-yellow-800">
          Picture-in-Picture is not supported in your browser.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {isPiPActive ? (
        <button
          onClick={exitPiP}
          className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
        >
          <X className="w-4 h-4" />
          Exit PiP
        </button>
      ) : (
        <button
          onClick={enterPiP}
          className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
        >
          <Monitor className="w-4 h-4" />
          Enter PiP
        </button>
      )}
      
      <div className="text-xs text-gray-500">
        {isPiPActive ? 'Floating window active' : 'Click to float'}
      </div>
    </div>
  );
} 