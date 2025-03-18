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

export function VariationTypeSelect({
  value,
  onChange,
  label = 'Variation Type',
  placeholder = 'Category Switcher',
  className = ''
}: VariationTypeSelectProps) {
  const { variationTypes } = useModelStore();
  return (
    <div className={`space-y-[6px] ${className}`}>
      {label && <FormLabel htmlFor="variation-type">{label}</FormLabel>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className={cn(
            'rounded-md border border-[rgba(249,121,23,0.4)]',
            'bg-gradient-to-r from-[rgba(252,226,214,0.2)] to-[rgba(252,226,214,0.2)]',
            'focus:ring-[rgba(249,121,23,0.4)] focus:border-[rgba(249,121,23,0.6)]'
          )}
        >
          <SelectValue placeholder={placeholder} />
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
