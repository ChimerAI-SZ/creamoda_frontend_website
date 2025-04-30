import React, { memo } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { COUNTRIES_LIST } from './constant';

// StyledLabel component from TextToImageContent
const StyledLabel = memo(({ content, htmlFor }: { content: string; htmlFor?: string }) => (
  <Label htmlFor={htmlFor} className="text-[#1A1A1A] font-inter text-[14px] font-medium leading-[20px] py-[6px]">
    {content}
  </Label>
));
StyledLabel.displayName = 'StyledLabel';

// Constants for options
const AGE_OPTIONS = Array.from({ length: 80 }, (_, i) => i + 18); // Ages 18-97

// Type for model size option
interface ModelSizeOption {
  code: string;
  name: string;
}

interface GenderAgeCountryFieldsProps {
  gender: string;
  age: string;
  country: string;
  onGenderChange: (value: string) => void;
  onAgeChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  // Optional Type field props
  showModelSizeField?: boolean;
  modelSize?: string | number;
  modelSizes?: ModelSizeOption[];
  onModelSizeChange?: (value: string) => void;
  // Optional title prop
  title?: string;
  ratioList?: string[];
  onRatioChange?: (value: string) => void;
  selectedRatio?: string;
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
  ratioList,
  onRatioChange,
  selectedRatio
}) => {
  // Convert modelSize to string for Select component
  const modelSizeValue = modelSize?.toString() || '';

  return (
    <div className="space-y-4 mt-4">
      {title && <h3 className="text-[#121316] font-inter text-[14px] font-bold leading-5 py-[6px]">{title}</h3>}

      <div className={title ? 'mt-3' : ''}>
        <div className="flex items-center justify-between mt-2">
          <StyledLabel htmlFor="gender_field" content="Gender" />

          <RadioGroup id="gender_field" value={gender} onValueChange={onGenderChange} className="flex gap-4 w-[155px]">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="female" />
              <Label className="text-[#121316] font-inter text-[14px] font-normal leading-5 py-[6px]" htmlFor="female">
                Female
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="male" />
              <Label className="text-[#121316] font-inter text-[14px] font-normal leading-5 py-[6px]" htmlFor="male">
                Male
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex items-center justify-between mt-2">
          <StyledLabel content="Age" />

          <Select value={age} onValueChange={onAgeChange}>
            <SelectTrigger className="w-[155px] rounded-sm">
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

        <div className="flex items-center justify-between mt-2">
          <StyledLabel content="Country" />

          <Select value={country} onValueChange={onCountryChange}>
            <SelectTrigger className="w-[155px] rounded-sm">
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
          <div className="flex items-center justify-between mt-2">
            <StyledLabel content="Type" />

            <Select value={modelSizeValue} onValueChange={onModelSizeChange}>
              <SelectTrigger className="w-[155px] rounded-sm">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {modelSizes.map(type => (
                  <SelectItem key={type.code} value={type.code}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <h3 className="text-[#121316] font-inter text-[14px] font-bold leading-5 pt-[24px]">Format</h3>
        <div className="flex items-center justify-between mt-2">
          <StyledLabel content="Aspect Ratio" />

          <Select value={selectedRatio} onValueChange={onRatioChange}>
            <SelectTrigger className="w-[155px] rounded-sm">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {ratioList?.map(ratio => (
                <SelectItem key={ratio} value={ratio}>
                  {ratio}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export { AGE_OPTIONS };
