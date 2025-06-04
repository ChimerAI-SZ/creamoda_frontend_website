'use client';

import * as React from 'react';

import { Slider } from '@/components/ui/slider';
import { StyledLabel } from '../StyledLabel';

import { cn } from '@/utils';

interface FidelitySliderProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  className?: string;
}

const marks = [0, 50, 100];
const dotLeftOffset = [
  {
    isCurrent: '8px',
    default: '8px'
  },
  {
    isCurrent: '50%',
    default: '50%'
  },
  {
    isCurrent: 'calc(100% - 8px)',
    default: 'calc(100% - 8px)'
  }
];

export function FidelitySlider({ value, onChange, label = 'Reference Level', className = '' }: FidelitySliderProps) {
  const [sliderValue, setSliderValue] = React.useState([50]);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center">
        <StyledLabel content={label} htmlFor="fidelity" />
      </div>
      <div className="relative items-center">
        <Slider min={0} max={100} step={50} value={sliderValue} onValueChange={setSliderValue} className="mb-4" />
        {/* dot 状态层 */}
        <div className="absolute top-1/2 left-1/2 w-full h-0 translate-x-[-50%] translate-y-[-50%] pointer-events-none">
          <div className="relative w-full h-2">
            {marks.map((step, index) => {
              let dotClass = '';
              const isCurrent = step === sliderValue[0];

              if (step < sliderValue[0]) {
                dotClass = 'bg-primary opacity-100';
              } else if (step === sliderValue[0]) {
                dotClass = 'bg-primary ring-2 ring-primary/50 scale-110';
              } else {
                dotClass = 'bg-[#D9D9D9]';
              }

              return (
                <span
                  key={index}
                  onClick={e => {
                    e.stopPropagation();
                  }}
                  className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${dotClass}`}
                  style={{ left: isCurrent ? dotLeftOffset[index].isCurrent : dotLeftOffset[index].default }}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <span className="text-xs text-gray-500">Low</span>
        <span className="text-xs text-gray-500">Medium</span>
        <span className="text-xs text-gray-500">High</span>
      </div>
    </div>
  );
}
