'use client';

import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useModelStore } from '@/stores/useModelStore';
import { StyledLabel } from '../StyledLabel';

interface VariationTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export function VariationTypeSelect({
  value,
  onChange,
  label = 'Variation Type',
  placeholder = 'Category Switcher'
}: VariationTypeSelectProps) {
  const { variationTypes } = useModelStore();
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
    <div
      className={`space-y-[6px] rounded-[16px] px-3 py-[10px] bg-gradient-to-r from-[#95FFCF] via-[#599EFF] to-[#7E5EFF]`}
    >
      {label && <StyledLabel content={label} />}
      <Select value={value} onValueChange={onChange} disabled={isLoading}>
        <SelectTrigger>
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
