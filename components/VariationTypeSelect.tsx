'use client';

import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StyledLabel } from './StyledLabel';

import type { UnifiedVariationType } from '@/stores/useModelStore';

interface VariationTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  variationTypes: UnifiedVariationType[];
  label?: string;
  placeholder?: string;
}

export function VariationTypeSelect({
  value,
  onChange,
  variationTypes,
  label = 'Generation Mode',
  placeholder = 'Category Switcher'
}: VariationTypeSelectProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasSetDefault, setHasSetDefault] = useState(false);

  // Set initial value when variations are loaded
  useEffect(() => {
    if (variationTypes.length > 0) {
      setIsLoading(false);
      
      // 延迟设置默认值，给 SearchParamsHandler 时间处理 URL 参数
      const timer = setTimeout(() => {
        if (!value && variationTypes.length > 0 && !hasSetDefault) {
          onChange(variationTypes[0].variationType.toString());
          setHasSetDefault(true);
        }
      }, 100); // 100ms 延迟，让 SearchParamsHandler 先执行
      
      return () => clearTimeout(timer);
    }
  }, [variationTypes, value, onChange, hasSetDefault]);

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
            <SelectItem key={index} value={type.variationType.toString()}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
