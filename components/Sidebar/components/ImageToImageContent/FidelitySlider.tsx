'use client';

import * as React from 'react';
import { Slider } from '@/components/ui/slider';
import { FormLabel } from '@/components/Sidebar/components/ImageToImageContent/FormLabel';
import { cn } from '@/lib/utils';

interface FidelitySliderProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  className?: string;
}

export function FidelitySlider({ value, onChange, label = 'Fidelity', className = '' }: FidelitySliderProps) {
  const handleValueChange = (values: number[]) => {
    onChange(values[0]);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex  items-center">
        <FormLabel htmlFor="fidelity">{label}</FormLabel>
        <FormLabel className="ml-[6px]">{value}%</FormLabel>
      </div>

      <Slider
        id="fidelity"
        defaultValue={[value]}
        max={100}
        step={1}
        onValueChange={handleValueChange}
        className={cn(
          'w-full',
          'track:h-2 track:bg-gray-200',
          'range:bg-gradient-to-r range:from-[#FF7A00] range:to-[#FF9736]',
          'thumb:h-6 thumb:w-6 thumb:rounded-full thumb:border-2 thumb:border-white thumb:bg-[#FF7A00]'
        )}
      />

      <p className="text-sm text-gray-500 mt-2">
        If the final design is too far from the original style, increase the fidelity value. If the final design is too
        far from your text description, lower the fidelity value.
      </p>
    </div>
  );
}
