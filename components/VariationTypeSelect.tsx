'use client';

import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StyledLabel } from './StyledLabel';

import type { BasicOptionItem } from '@/stores/useModelStore';

interface VariationTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  variationTypes: BasicOptionItem[];
  label?: string;
  placeholder?: string;
}

export function VariationTypeSelect({
  value,
  onChange,
  variationTypes,
  label = 'Variation Type',
  placeholder = 'Category Switcher'
}: VariationTypeSelectProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Set initial value when variations are loaded
  useEffect(() => {
    if (variationTypes.length > 0) {
      setIsLoading(false);
      if (!value && variationTypes.length > 0) {
        onChange(variationTypes[0].code);
      }
    }
  }, [variationTypes, value, onChange]);

  return (
    <div
      className={`space-y-[6px] rounded-[16px] px-3 py-[10px] bg-gradient-to-r from-[#95FFCF] via-[#599EFF] to-[#7E5EFF]`}
    >
      {label && <StyledLabel content={label} />}
      <Select value={value} onValueChange={onChange} disabled={isLoading}>
        <SelectTrigger>
          <SelectValue placeholder={isLoading ? 'Loading...' : placeholder} />
        </SelectTrigger>
        <SelectContent>
          {variationTypes.map((type, index) => (
            <SelectItem key={index} value={type.code}>
              {type.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
