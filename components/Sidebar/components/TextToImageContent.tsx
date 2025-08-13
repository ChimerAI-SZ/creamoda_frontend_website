'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { PROMPT_MAX_LEN } from '@/utils';

import { GenerateButton } from '@/components/GenerateButton/GenerateButton';
import { GenderAgeCountryFields } from '@/components/Sidebar/components/GenderAgeCountryFields';
import { DescribeDesign } from '../../DescribeDesign';

import { useModelStore } from '@/stores/useModelStore';
import { useGenerationStore } from '@/stores/useGenerationStore';
import { OutfitFormData } from '../index';

interface OutfitFormProps {
  onSubmit?: (data: OutfitFormData) => void;
}

function OutfitForm({ onSubmit }: OutfitFormProps) {
  const { modelSizes } = useModelStore();
  const { isGenerating, setGenerating } = useGenerationStore();

  const defaultModelSize = Number(modelSizes.find(size => size.name === 'Mid-size')?.code) || 2;

  const [formData, setFormData] = useState<OutfitFormData>({
    prompt: '',
    gender: 2,
    age: '25',
    country: 'usa',
    modelSize: defaultModelSize,
    withHumanModel: 1,
    format: '3:4'
  });

  const [btnState, setBtnState] = useState<'disabled' | 'ready' | 'generating'>('disabled');

  // 使用useCallback优化事件处理函数
  const handleSubmit = useCallback(() => {
    // 提前控制生成状态，如果生成失败再取消拦截
    setGenerating(true);

    onSubmit?.(formData);
  }, [onSubmit, formData, setGenerating]);

  const handlePromptChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, prompt: value.slice(0, PROMPT_MAX_LEN) }));
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

  const handleRatioChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, format: value as '1:1' | '2:3' | '3:4' | '9:16' }));
  }, []);

  // toggle withHumanModel
  const handleWithHumanModelChange = useCallback((checked: boolean) => {
    setFormData(prev => ({ ...prev, withHumanModel: checked ? 1 : 0 }));
  }, []);

  // reset prompt after confirm design features
  const handleConfirm = useCallback((features: string[]) => {
    const joined = features.join(', ');
    setFormData(prev => ({ ...prev, prompt: joined.slice(0, PROMPT_MAX_LEN) }));
  }, []);
  // reset prompt after get random prompt
  const handleQueryRandomPrompt = useCallback((prompt: string) => {
    setFormData(prev => ({ ...prev, prompt: prompt.slice(0, PROMPT_MAX_LEN) }));
  }, []);

  // 验证表单并更新按钮状态
  useEffect(() => {
    const baseValid = formData.prompt.length > 0;
    const needHuman = formData.withHumanModel === 1;
    const extraValid = !needHuman || (Boolean(formData.age) && Boolean(formData.country) && Boolean(formData.modelSize));
    const isFormValid = Boolean(baseValid && extraValid);
    setBtnState(isGenerating ? 'generating' : isFormValid ? 'ready' : 'disabled');
  }, [formData, isGenerating]);

  return (
    <div className="h-full">
      <div className="relative h-full flex flex-col">
        <form className="flex-1 overflow-y-auto space-y-6 pb-[84px] px-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <DescribeDesign
                label="Describe the final design"
                description={formData.prompt}
                onDescriptionChange={handlePromptChange}
                onFeatureSelection={handleConfirm}
                onRandomPrompt={handleQueryRandomPrompt}
                placeholderText="You can describe the clothing type, fit, color, print, etc."
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
              onRatioChange={handleRatioChange}
              selectedRatio={formData.format}
              onModelSizeChange={handleModelSizeChange}
              title="With human model"
              withHumanModel={formData.withHumanModel === 1}
              onWithHumanModelChange={handleWithHumanModelChange}
            />
          </div>
        </form>
        <div className="absolute bottom-0 left-0 right-0 py-4 bg-white">
          <GenerateButton onClick={handleSubmit} state={btnState} />
        </div>
      </div>
    </div>
  );
}

export default OutfitForm;
