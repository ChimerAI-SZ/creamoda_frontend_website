'use client';

import * as React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { GenerateButton, GenerateButtonState } from '@/components/GenerateButton/GenerateButton';
import { MemoizedImageUploader as ImageUploader } from '@/components/Sidebar/components/ImageToImageContent/ImageUploader';
import { FormLabel } from '@/components/Sidebar/components/ImageToImageContent/FormLabel';
import { VariationTypeSelect } from '@/components/Sidebar/components/ImageToImageContent/VariationTypeSelect';
import { FidelitySlider } from '@/components/Sidebar/components/ImageToImageContent/FidelitySlider';
import { ImageUploadFormData } from '@/components/Sidebar';
import { useGenerationStore } from '@/stores/useGenerationStore';

interface ImageUploadFormProps {
  onSubmit?: (data: ImageUploadFormData) => void;
}

export default function ImageUploadForm({ onSubmit }: ImageUploadFormProps) {
  // 将图片相关状态提取到单独的状态对象中
  const [imageState, setImageState] = React.useState({
    image: null as File | null,
    imageUrl: ''
  });

  // 其他表单状态
  const [formState, setFormState] = React.useState({
    variationType: '',
    description: '',
    fidelity: 50
  });

  const { isGenerating, setGenerating } = useGenerationStore();

  // 合并状态以便于处理
  const formData = {
    ...imageState,
    ...formState
  };

  // 图片处理函数
  const handleImageChange = React.useCallback((image: File | null) => {
    setImageState(prev => ({ ...prev, image }));
  }, []);

  const handleImageUrlChange = React.useCallback((imageUrl: string) => {
    setImageState(prev => ({ ...prev, imageUrl }));
  }, []);

  // 其他表单字段处理函数
  const handleDescriptionChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormState(prev => ({ ...prev, description: e.target.value }));
  }, []);

  const handleVariationTypeChange = React.useCallback((value: string) => {
    setFormState(prev => ({ ...prev, variationType: value }));
  }, []);

  const handleFidelityChange = React.useCallback((value: number) => {
    setFormState(prev => ({ ...prev, fidelity: value }));
  }, []);

  const handleSubmit = async () => {
    if (onSubmit) {
      setGenerating(true);
      try {
        // Call the parent's onSubmit function with the combined form data
        await onSubmit(formData);
      } catch (error) {
        console.error('Error submitting form:', error);
        setGenerating(false);
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  // Determine button state
  const buttonState: GenerateButtonState = React.useMemo(() => {
    if (isGenerating) {
      return 'generating';
    }

    if (!formData.description.trim() || (!formData.image && !formData.imageUrl)) {
      return 'disabled';
    }

    return 'ready';
  }, [formData.description, formData.image, formData.imageUrl, isGenerating]);

  return (
    <div className="flex flex-col h-full overflow-x-hidden">
      <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto overflow-x-hidden space-y-4 pb-20 px-4">
        <div className="space-y-[10px]">
          <FormLabel htmlFor="image-upload">Upload image</FormLabel>
          <ImageUploader
            onImageChange={handleImageChange}
            onImageUrlChange={handleImageUrlChange}
            imageUrl={imageState.imageUrl}
            currentImage={imageState.image}
          />
        </div>

        <VariationTypeSelect value={formState.variationType} onChange={handleVariationTypeChange} />

        <div className="space-y-[10px]">
          <FormLabel htmlFor="description">Describe the final design</FormLabel>
          <Textarea
            id="description"
            placeholder="Please describe the category you would like to change."
            className="min-h-[200px] resize-none placeholder:text-[#D5D5D5] font-inter text-sm font-normal leading-5 rounded-[4px] border border-[#DCDCDC]"
            value={formState.description}
            onChange={handleDescriptionChange}
          />
        </div>

        {formState.variationType === '1' && (
          <FidelitySlider value={formState.fidelity} onChange={handleFidelityChange} />
        )}
      </form>
      <div className="sticky bottom-0 left-0 right-0 pb-4 bg-white">
        <GenerateButton onClick={handleSubmit} state={buttonState} />
      </div>
    </div>
  );
}
