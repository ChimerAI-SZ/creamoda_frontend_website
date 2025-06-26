'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/utils';
import './tempStyle.css';

interface LoadingCardProps {
  /** 0–100 */
  progress: number;
  className?: string;
}

export function LoadingCard({ progress, className }: LoadingCardProps) {
  // clamp to [0,100]
  const pct = Math.min(100, Math.max(0, progress));

  // Height of the wave, from 0% to 40% of the container height
  const waveHeight = `${(pct / 100) * 40}%`;

  return (
    <div
      className={cn(
        // The container uses flex and filter to create the effect
        'flex w-[180px] h-[60px] overflow-hidden rounded-lg bg-white',
        // The filter properties create the "gooey" or "lava lamp" effect
        'filter blur-sm contrast-[12]',
        className
      )}
    >
      {/* The blue div. Its pseudo-element has the moving dots */}
      <div className="grow relative bg-sky-500 waving-dot" />

      {/* The white div. Its pseudo-element also has the moving dots */}
      <div className="grow relative bg-white waving-dot" />
    </div>
  );
}
