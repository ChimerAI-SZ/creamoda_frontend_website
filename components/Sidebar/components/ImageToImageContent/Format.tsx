import React from 'react';
import { FormLabel } from '../../../FormLabel/FormLabel';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormatProps {
  value: string;
  onChange: (value: string) => void;
}

export function Format({ value, onChange }: FormatProps) {
  return (
    <div>
      <FormLabel>Format</FormLabel>
      <div className="mt-2">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-medium text-sm">Aspect Ratio</h3>
            <Select defaultValue={value} onValueChange={onChange}>
              <SelectTrigger className="w-[171.424px]  px-2  flex items-center  rounded-[32px] border border-primary bg-white">
                <SelectValue placeholder="Select ratio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1:1">1:1</SelectItem>
                <SelectItem value="2:3">2:3</SelectItem>
                <SelectItem value="3:4">3:4</SelectItem>
                <SelectItem value="9:16">9:16</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
