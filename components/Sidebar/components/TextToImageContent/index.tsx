'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GenerateButton } from '@/components/GenerateButton/GenerateButton';

import { useModelStore } from '@/stores/useModelStore';
import { useGenerationStore } from '@/stores/useGenerationStore';
import { OutfitFormData } from '../../index';
import { GenderAgeCountryFields } from '@/components/Sidebar/components/shared/GenderAgeCountryFields';

interface OutfitFormProps {
  onSubmit?: (data: OutfitFormData) => void;
}

const StyledLabel = memo(({ content, htmlFor }: { content: string; htmlFor?: string }) => (
  <Label htmlFor={htmlFor} className="text-[#1A1A1A] font-inter text-[14px] font-medium leading-[20px] py-[6px]">
    {content}
  </Label>
));
StyledLabel.displayName = 'StyledLabel';

// 年龄选项列表预先计算
const AGE_OPTIONS = Array.from({ length: 83 }, (_, i) => i + 18);

export default function OutfitForm({ onSubmit }: OutfitFormProps) {
  const { modelSizes } = useModelStore();
  const { isGenerating, setGenerating } = useGenerationStore();

  const defaultModelSize = Number(modelSizes.find(size => size.name === 'Mid-size')?.code) || 2;

  const [formData, setFormData] = useState<OutfitFormData>({
    prompt: '',
    gender: 2,
    age: '25',
    country: 'usa',
    modelSize: defaultModelSize,
    withHumanModel: 1
  });

  const [btnState, setBtnState] = useState<'disabled' | 'ready' | 'generating'>('disabled');

  // 使用useCallback优化事件处理函数
  const handleSubmit = useCallback(() => {
    // 提前控制生成状态，如果生成失败再取消拦截
    setGenerating(true);

    onSubmit?.(formData);
  }, [onSubmit, formData, setGenerating]);

  const handlePromptChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, prompt: e.target.value }));
  }, []);

  const handleGenderChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, gender: parseInt(value) as 1 | 2 }));
  }, []);

  const handleAgeChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, age: value }));
  }, []);

  const handleCountryChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, country: value }));
  }, []);

  const handleModelSizeChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, modelSize: Number(value) }));
  }, []);

  // 验证表单并更新按钮状态
  useEffect(() => {
    const isFormValid = Boolean(formData.prompt.length > 0 && formData.age && formData.country && formData.modelSize);
    setBtnState(isGenerating ? 'generating' : isFormValid ? 'ready' : 'disabled');
  }, [formData, isGenerating]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="relative h-full flex flex-col ">
        <form className="flex-1 overflow-y-auto space-y-6 px-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <StyledLabel htmlFor="text_to_img_description" content="Describe your outfit" />
              <Textarea
                id="text_to_img_description"
                placeholder="You can describe the clothing type, fit, color, print, etc."
                className="min-h-[288px] mt-[10px] resize-none p-4 placeholder:text-[#D5D5D5] placeholder:font-inter placeholder:text-[14px] placeholder:font-normal placeholder:leading-[20px] rounded-sm"
                value={formData.prompt}
                onChange={handlePromptChange}
              />
            </div>

            <GenderAgeCountryFields
              gender={formData.gender.toString()}
              age={formData.age}
              country={formData.country}
              onGenderChange={handleGenderChange}
              onAgeChange={handleAgeChange}
              onCountryChange={handleCountryChange}
              showModelSizeField={true}
              modelSize={formData.modelSize}
              modelSizes={modelSizes.map(size => ({ code: size.code, name: size.name }))}
              onModelSizeChange={handleModelSizeChange}
              title="With human model"
            />
          </div>
        </form>
        <div className="sticky bottom-0 left-0 right-0 pb-4 bg-white">
          <GenerateButton onClick={handleSubmit} state={btnState} />
        </div>
      </div>
    </div>
  );
}
