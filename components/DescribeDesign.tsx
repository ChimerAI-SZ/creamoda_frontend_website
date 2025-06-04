'use client';

import * as React from 'react';
import Image from 'next/image';

import { Textarea } from '@/components/ui/textarea';
import FeatureModal from '@/components/FeatureModal';
import RandomPrompt from '@/components/randomPrompt';
import { StyledLabel } from './Sidebar/components/StyledLabel';
import { Button } from '@/components/ui/button';

interface DescribeDesignProps {
  description: string;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFeatureSelection: (features: string[]) => void;
  onRandomPrompt: (prompt: string) => void;
  label: string;
  placeholderText?: string;
}

export function DescribeDesign({
  description,
  onDescriptionChange,
  onFeatureSelection,
  onRandomPrompt,
  label,
  placeholderText = 'Please describe the changes you want to make.'
}: DescribeDesignProps) {
  return (
    <div className="space-y-[10px]">
      <div className="flex items-center justify-between">
        <StyledLabel content={label} />
        <FeatureModal handleConfirm={onFeatureSelection}>
          <Button variant={'default'} size={'sm'} className="flex items-center gap-1">
            <Image src="/images/generate/design_features.svg" alt="Generate" width={16} height={16} />
            <span>Design Features</span>
          </Button>
        </FeatureModal>
      </div>
      <Textarea
        id="description"
        placeholder={placeholderText}
        className="min-h-[180px] resize-none placeholder:text-[#D5D5D5] font-inter text-sm font-normal leading-5 rounded-[4px] border border-[#DCDCDC]"
        value={description}
        onChange={onDescriptionChange}
      />
      <RandomPrompt handleQueryRandomPrompt={onRandomPrompt} />
    </div>
  );
}
