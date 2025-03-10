'use client';

import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormLabel } from '@/components/Sidebar/components/FormLabel';
import { commonApi } from '@/app/services/api';
import { cn } from '@/lib/utils';

interface VariationType {
  code: string;
  name: string;
}

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
  const [variationTypes, setVariationTypes] = React.useState<VariationType[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchVariationTypes = async () => {
      try {
        setLoading(true);
        const data = await commonApi.getVariationTypeList();
        setVariationTypes(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch variation types:', err);
        setError('Failed to load variation types');
        // 设置一些默认值，以防 API 调用失败
        setVariationTypes([
          { code: 'style', name: 'Style Change' },
          { code: 'color', name: 'Color Change' },
          { code: 'pattern', name: 'Pattern Change' },
          { code: 'material', name: 'Material Change' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchVariationTypes();
  }, []);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <FormLabel htmlFor="variation-type">{label}</FormLabel>}
      <Select value={value} onValueChange={onChange} disabled={loading}>
        <SelectTrigger
          className={cn(
            'rounded-md border border-[rgba(249,121,23,0.4)]',
            'bg-gradient-to-r from-[rgba(252,226,214,0.2)] to-[rgba(252,226,214,0.2)]',
            'focus:ring-[rgba(249,121,23,0.4)] focus:border-[rgba(249,121,23,0.6)]'
          )}
        >
          <SelectValue placeholder={loading ? 'Loading...' : placeholder} />
        </SelectTrigger>
        <SelectContent>
          {error && <div className="px-2 py-1 text-sm text-red-500">{error}</div>}
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
