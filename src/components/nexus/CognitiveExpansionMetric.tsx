'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface CognitiveExpansionMetricProps {
  knowledgeDensity: number;
  className?: string;
}

/**
 * CognitiveExpansionMetric Component
 * 
 * Pulses at 40Hz (Gamma frequency) and scales its geometry based on 
 * metadata density in the ArtifactStore.
 */
export function CognitiveExpansionMetric({ 
  knowledgeDensity, 
  className 
}: CognitiveExpansionMetricProps) {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    // 40Hz pulse = 25ms interval
    const interval = setInterval(() => {
      setPulse((p) => (p + 1) % 100);
    }, 25);

    return () => clearInterval(interval);
  }, []);

  // Calculate scaling factor based on knowledge density (0 to 1)
  // We want it to be visually significant but not overwhelming
  const scale = useMemo(() => 0.8 + (knowledgeDensity * 0.4), [knowledgeDensity]);
  
  // Oscillate opacity and size slightly based on pulse
  const pulseScale = 1 + (Math.sin(pulse * 0.2) * 0.05);
  const opacity = 0.6 + (Math.sin(pulse * 0.2) * 0.2);

  return (
    <div className={cn("relative flex items-center justify-center p-4", className)}>
      <div 
        className="absolute inset-0 rounded-full bg-cyan-500/10 blur-xl animate-pulse"
        style={{
          transform: `scale(${scale * pulseScale * 1.5})`,
        }}
      />
      
      <div 
        className="relative flex flex-col items-center"
        style={{
          transform: `scale(${scale * pulseScale})`,
          opacity: opacity,
          transition: 'transform 0.1s ease-out',
        }}
      >
        {/* Core Geometry */}
        <div className="w-16 h-16 border-2 border-cyan-400 rounded-lg rotate-45 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.5)]">
          <div className="w-8 h-8 bg-cyan-500 rounded-sm animate-spin-slow" />
        </div>
        
        {/* Metric Label */}
        <div className="mt-4 text-[10px] font-mono text-cyan-300 uppercase tracking-widest">
          Cognitive Aurora: {(knowledgeDensity * 100).toFixed(1)}%
        </div>
        
        {/* Resonance Frequency Indicator */}
        <div className="mt-1 text-[8px] font-mono text-cyan-500/70">
          40Hz RES_STABLE
        </div>
      </div>
    </div>
  );
}
