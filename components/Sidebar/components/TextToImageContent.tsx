'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GenerateButton } from '@/components/GenerateButton/GenerateButton';

import { useModelStore } from '@/stores/useModelStore';

import { OutfitFormData } from '../index';

interface OutfitFormProps {
  onSubmit?: (data: OutfitFormData) => void;
}

const StyledLabel = ({ content, htmlFor }: { content: string; htmlFor?: string }) => {
  return (
    <Label htmlFor={htmlFor} className="text-[#1A1A1A] font-inter text-[14px] font-medium leading-[20px] py-[6px]">
      {content}
    </Label>
  );
};

export default function OutfitForm({ onSubmit }: OutfitFormProps) {
  const [formData, setFormData] = useState<OutfitFormData>({
    prompt: '',
    gender: 2,
    age: '25',
    country: 'Vatican',
    modelSize: 'mid-size',
    withHumanModel: 1
  });
  const [btnState, setBtnState] = useState<'disabled' | 'ready' | 'generating'>('disabled');

  const { modelSizes, variationTypes } = useModelStore();

  console.log(modelSizes);

  const handleSubmit = () => {
    onSubmit?.(formData);
  };

  useEffect(() => {
    if (formData.prompt.length > 0 && formData.gender && formData.age && formData.country && formData.modelSize) {
      setBtnState('ready');
    } else {
      setBtnState('disabled');
    }
  }, [formData]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="relative h-full flex flex-col">
        <form className="flex-1 overflow-y-auto space-y-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <StyledLabel htmlFor="text_to_img_description" content="Describe your outfit" />

              <Textarea
                id="text_to_img_description"
                placeholder="You can describe the clothing type, fit, color, print, etc."
                className="min-h-[288px] mt-[10px] resize-none"
                value={formData.prompt}
                onChange={e => setFormData({ ...formData, prompt: e.target.value })}
              />
            </div>

            <div className="mt-4">
              <h3 className="text-[#121316] font-inter text-sm font-medium leading-5 py-[6px]">With human model</h3>

              <div className="mt-3">
                <div className="flex items-center justify-between mt-2">
                  <StyledLabel htmlFor="text_to_img_gender" content="Gender" />

                  <RadioGroup
                    id="text_to_img_gender"
                    defaultValue="female"
                    onValueChange={value =>
                      setFormData({
                        ...formData,
                        gender: parseInt(value) as 1 | 2 // 将字符串转换为数字
                      })
                    }
                    className="flex gap-4 w-[155px]"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <StyledLabel content="Age" />

                  <Select value={formData.age} onValueChange={value => setFormData({ ...formData, age: value })}>
                    <SelectTrigger className="w-[155px]">
                      <SelectValue placeholder="Select age" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 83 }, (_, i) => i + 18).map(age => (
                        <SelectItem key={age} value={age.toString()}>
                          {age}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <StyledLabel content="Country" />

                  <Select
                    value={formData.country}
                    onValueChange={value => setFormData({ ...formData, country: value })}
                  >
                    <SelectTrigger className="w-[155px]">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Vatican', 'Italy', 'France', 'Spain', 'Germany'].map(country => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <StyledLabel content="Type" />

                  <Select
                    value={formData.modelSize}
                    onValueChange={value => setFormData({ ...formData, modelSize: value })}
                  >
                    <SelectTrigger className="w-[155px]">
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
              </div>
            </div>
          </div>
        </form>
        <div className="sticky bottom-0 left-0 right-0 px-6 pb-4 bg-white">
          <GenerateButton onClick={handleSubmit} state={btnState} />
        </div>
      </div>
    </div>
  );
}
