'use client';

import * as React from 'react';
import { Textarea } from '@/components/ui/textarea';
import FeatureModal from '@/components/FeatureModal';
import RandomPrompt from '@/components/randomPrompt';
import { FormLabel } from '@/components/FormLabel/FormLabel';

interface DescribeDesignProps {
  description: string;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFeatureSelection: (features: string[]) => void;
  onRandomPrompt: (prompt: string) => void;
  placeholderText?: string;
}

export function DescribeDesign({
  description,
  onDescriptionChange,
  onFeatureSelection,
  onRandomPrompt,
  placeholderText = 'Please describe the changes you want to make.'
}: DescribeDesignProps) {
  return (
    <div className="space-y-[10px]">
      <div className="flex items-center justify-between">
        <FormLabel>Describe the final design</FormLabel>
        <FeatureModal handleConfirm={onFeatureSelection} />
      </div>
      <Textarea
        id="description"
        placeholder={placeholderText}
        className="min-h-[200px] resize-none placeholder:text-[#D5D5D5] font-inter text-sm font-normal leading-5 rounded-[4px] border border-[#DCDCDC]"
        value={description}
        onChange={onDescriptionChange}
      />
      <RandomPrompt handleQueryRandomPrompt={onRandomPrompt} />
    </div>
  );
}
