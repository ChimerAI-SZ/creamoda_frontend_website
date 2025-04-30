'use client';

import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormLabel } from '@/components/Sidebar/components/ImageToImageContent/FormLabel';
import { cn } from '@/lib/utils';
import { useModelStore } from '@/stores/useModelStore';

interface VariationTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

// Default options to use when API data is still loading
const defaultOptions = [
  { id: '1', code: '1', name: 'Copy Style' },
  { id: '2', code: '2', name: 'Category Switcher' },
  { id: '3', code: '3', name: 'Fabric to Clothes' },
  { id: '4', code: '4', name: 'Sketch to Design' },
  { id: '5', code: '5', name: 'Mix Images' }
];

export function VariationTypeSelect({
  value,
  onChange,
  label = 'Variation Type',
  placeholder = 'Category Switcher',
  className = ''
}: VariationTypeSelectProps) {
  const { variationTypes } = useModelStore();

  // Use default options if the API hasn't returned any data yet
  const options = variationTypes.length > 0 ? variationTypes : defaultOptions;

  // Ensure a value is selected
  React.useEffect(() => {
    if (options.length > 0 && !value) {
      onChange(options[0].code);
    }
  }, [options, value, onChange]);

  return (
    <div className={`space-y-[6px] ${className}`}>
      {label && <FormLabel>{label}</FormLabel>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className={cn(
            'rounded-sm border border-[rgba(249,121,23,0.4)]',
            'bg-gradient-to-r from-[rgba(252,226,214,0.2)] to-[rgba(252,226,214,0.2)]',
            'focus:ring-[rgba(249,121,23,0.4)] focus:border-[rgba(249,121,23,0.6)]'
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map(type => (
            <SelectItem key={type.code} value={type.code}>
              {type.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
