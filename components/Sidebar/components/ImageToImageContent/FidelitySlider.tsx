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

export function FidelitySlider({ value, onChange, label = 'Reference Level', className = '' }: FidelitySliderProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center">
        <StyledLabel content={label} htmlFor="fidelity" />
      </div>
      <div className="relative items-center">
        <Slider
          id="fidelity"
          defaultValue={[value]}
          value={[value]}
          min={1}
          max={3}
          step={1}
          trackClassName="bg-[#dbdbdf]"
          rangeClassName="bg-[#808080]"
        />
        <div className="absolute top-[-8px] left-0 w-full h-full flex justify-between">
          <div
            className={`w-6 h-6 rounded-full cursor-pointer transition-colors ${
              value === 1 || value === 2 || value === 3 ? 'bg-[#808080]' : 'bg-[#dbdbdf]'
            }`}
            onClick={() => onChange(1)}
          />
          <div
            className={`w-6 h-6 rounded-full cursor-pointer transition-colors ${
              value === 2 || value === 3 ? 'bg-[#808080]' : 'bg-[#dbdbdf]'
            }`}
            onClick={() => onChange(2)}
          />
          <div
            className={`w-6 h-6 rounded-full cursor-pointer transition-colors ${
              value === 3 ? 'bg-[#808080]' : 'bg-[#dbdbdf]'
            }`}
            onClick={() => onChange(3)}
          />
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
