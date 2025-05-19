'use client';

import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormLabel } from '@/components/FormLabel/FormLabel';
import { cn } from '@/utils';

export interface VariationType {
  code: string;
  name: string;
}

interface VariationTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  variationTypes: VariationType[];
  label?: string;
  placeholder?: string;
  className?: string;
}

export function VariationTypeSelect({
  value,
  onChange,
  variationTypes,
  label = 'Variation Type',
  placeholder = 'Category Switcher',
  className = ''
}: VariationTypeSelectProps) {
  const [isLoading, setIsLoading] = React.useState(true);

  // Set initial value when variations are loaded
  React.useEffect(() => {
    if (variationTypes.length > 0) {
      setIsLoading(false);
      if (!value && variationTypes.length > 0) {
        onChange(variationTypes[0].code);
      }
    }
  }, [variationTypes, value, onChange]);

  return (
    <div className={`space-y-[6px] ${className}`}>
      {label && <FormLabel>{label}</FormLabel>}
      <Select value={value} onValueChange={onChange} disabled={isLoading}>
        <SelectTrigger
          className={cn(
            'rounded-sm border border-[rgba(249,121,23,0.4)]',
            'bg-gradient-to-r from-[rgba(252,226,214,0.2)] to-[rgba(252,226,214,0.2)]',
            'focus:ring-[rgba(249,121,23,0.4)] focus:border-[rgba(249,121,23,0.6)]'
          )}
        >
          <SelectValue placeholder={isLoading ? 'Loading...' : placeholder} />
        </SelectTrigger>
        <SelectContent>
          {variationTypes.map(type => (
            <SelectItem key={type.code} value={type.code}>
              {type.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
