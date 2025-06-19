import React from 'react';
import Image from 'next/image';

import { StyledLabel } from '../../StyledLabel';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RadioGroup from '@/components/ui/radio';

import { COUNTRIES_LIST, RatioList, AGE_OPTIONS } from '../constant';

// Type for model size option
interface ModelSizeOption {
  code: string;
  name: string;
}

interface GenderAgeCountryFieldsProps {
  gender: string;
  age: string;
  country: string;
  selectedRatio: string;
  onGenderChange: (value: string) => void;
  onAgeChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onRatioChange: (value: string) => void;
  // Optional Type field props
  showModelSizeField?: boolean;
  modelSize?: string | number;
  modelSizes?: ModelSizeOption[];
  onModelSizeChange?: (value: string) => void;
  // Optional title prop
  title?: string;
}

export const GenderAgeCountryFields: React.FC<GenderAgeCountryFieldsProps> = ({
  gender,
  age,
  country,
  onGenderChange,
  onAgeChange,
  onCountryChange,
  // Optional props with defaults
  showModelSizeField = false,
  modelSize,
  modelSizes = [],
  onModelSizeChange,
  title,
  onRatioChange,
  selectedRatio
}) => {
  // Convert modelSize to string for Select component
  const modelSizeValue = modelSize?.toString() || '';

  return (
    <div className="mt-6">
      {title && <h3 className="text-[#121316] font-inter text-[14px] font-bold leading-5 py-[6px]">{title}</h3>}

      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 items-start">
          <StyledLabel htmlFor="gender_field" content="Gender" />
          <RadioGroup
            options={[
              { label: 'Male', value: '1' },
              { label: 'Female', value: '2' }
            ]}
            name="gender"
            selectedValue={gender}
            onChange={onGenderChange}
          />
        </div>

        <div className="flex flex-col gap-2 items-start">
          <StyledLabel content="Age" />

          <Select value={age} onValueChange={onAgeChange}>
            <SelectTrigger className="rounded-sm">
              <SelectValue placeholder="Select age" />
            </SelectTrigger>
            <SelectContent>
              {AGE_OPTIONS.map(age => (
                <SelectItem key={age} value={age.toString()}>
                  {age}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2 items-start">
          <StyledLabel content="Country" />

          <Select value={country} onValueChange={onCountryChange}>
            <SelectTrigger className="rounded-sm">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {COUNTRIES_LIST.map(country => (
                <SelectItem key={country.value} value={country.value}>
                  {country.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {showModelSizeField && onModelSizeChange && (
          <div className="flex flex-col gap-2 items-start">
            <StyledLabel content="Type" />

            <RadioGroup
              options={modelSizes.map(item => ({ label: item.name, value: item.code }))}
              name="modelSize"
              selectedValue={modelSizeValue}
              onChange={onModelSizeChange}
            />
          </div>
        )}

        <h3 className="text-[#121316] font-inter text-[14px] font-bold leading-5 pt-[24px]">Format</h3>
        <div className="flex flex-col gap-2 items-start">
          <StyledLabel content="Aspect Ratio" />

          <RadioGroup
            options={RatioList.map(ratio => {
              return {
                label: (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-[18px] h-[18px] flex items-center justify-center">
                      <Image
                        src={`/images/generate/${ratio.icon}`}
                        alt={ratio.value}
                        width={18}
                        height={18}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-[#0A1532] text-[14px] font-normal leading-[20px]">{ratio.value}</span>
                  </div>
                ),
                value: ratio.value
              };
            })}
            name="gender"
            selectedValue={selectedRatio}
            onChange={onRatioChange}
          />
        </div>
      </div>
    </div>
  );
};

export { AGE_OPTIONS };
