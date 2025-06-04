'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

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

  const handleRatioChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, format: value as '1:1' | '2:3' | '3:4' | '9:16' }));
  }, []);

  // reset prompt after confirm design features
  const handleConfirm = useCallback((features: string[]) => {
    setFormData(prev => ({ ...prev, prompt: features.join(', ') }));
  }, []);
  // reset prompt after get random prompt
  const handleQueryRandomPrompt = useCallback((prompt: string) => {
    setFormData(prev => ({ ...prev, prompt }));
  }, []);

  // 验证表单并更新按钮状态
  useEffect(() => {
    const isFormValid = Boolean(formData.prompt.length > 0 && formData.age && formData.country && formData.modelSize);
    setBtnState(isGenerating ? 'generating' : isFormValid ? 'ready' : 'disabled');
  }, [formData, isGenerating]);

  return (
    <div className="h-full">
      <div className="relative h-full flex flex-col">
        <form className="flex-1 overflow-y-auto space-y-6 pb-[84px] px-4">
          <div className="space-y-6">
            <div className="space-y-2">
              {/* <div className="flex items-center justify-between">
                <StyledLabel htmlFor="text_to_img_description" content="Describe your outfit" />

                <FeatureModal handleConfirm={handleConfirm}>
                  <Button variant={'default'} size={'sm'} className="flex items-center gap-1">
                    <Image src="/images/generate/design_features.svg" alt="Generate" width={16} height={16} />
                    <span>Design Features</span>
                  </Button>
                </FeatureModal>
              </div>
              <Textarea
                id="text_to_img_description"
                placeholder=""
                className="min-h-[180px] resize-none p-4 placeholder:text-[rgba(10,21,50,0.20)] placeholder:font-inter placeholder:text-[14px] placeholder:font-normal placeholder:leading-[20px] rounded-sm"
                value={formData.prompt}
                onChange={handlePromptChange}
              />
              <RandomPrompt handleQueryRandomPrompt={handleQueryRandomPrompt} /> */}
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
function WaveLoader({ progress = 35 }) {
  const waveRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const updateWave = () => {
      const amplitude = 4;
      const wavelength = 40;
      const offsetY = 100 - progress;

      const wavePath = Array.from({ length: 100 }, (_, x) => {
        const y = Math.sin((x / wavelength) * Math.PI * 2) * amplitude + offsetY;
        return `${x},${y}`;
      }).join(' ');

      if (waveRef.current) {
        waveRef.current.setAttribute('d', `M0,100 L${wavePath} L100,100 Z`);
      }
    };

    updateWave();
  }, [progress]);

  return (
    <div className="relative w-[200px] h-[300px] rounded-2xl bg-gray-100 flex items-center justify-center text-xl font-bold text-purple-500">
      <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <clipPath id="waveClip">
            <path ref={waveRef} d="M0,100 L100,100 L100,100 Z" />
          </clipPath>
        </defs>
        <rect x="0" y="0" width="100" height="100" clipPath="url(#waveClip)" fill="url(#grad)" />
        <linearGradient id="grad" gradientTransform="rotate(90)">
          <stop offset="0%" stopColor="#c3baff" />
          <stop offset="100%" stopColor="#8a7aff" />
        </linearGradient>
      </svg>
      <div className="z-10 mix-blend-difference">CREAMODA</div>
    </div>
  );
}
