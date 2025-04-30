'use client';

import * as React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { GenerateButton, GenerateButtonState } from '@/components/GenerateButton/GenerateButton';
import { MemoizedImageUploader as ImageUploader } from '@/components/ImageUploader';
import { FormLabel } from '@/components/Sidebar/components/ImageToImageContent/FormLabel';
import { VariationTypeSelect } from '@/components/Sidebar/components/ImageToImageContent/VariationTypeSelect';
import { FidelitySlider } from '@/components/Sidebar/components/ImageToImageContent/FidelitySlider';
import { ImageUploadFormData } from '@/components/Sidebar';
import { useGenerationStore } from '@/stores/useGenerationStore';
import FeatureModal from '@/components/FeatureModal';
import RandomPrompt from '@/components/randomPrompt';
interface ImageUploadFormProps {
  onSubmit?: (data: ImageUploadFormData) => void;
}

export default function ImageUploadForm({ onSubmit }: ImageUploadFormProps) {
  // 将图片相关状态提取到单独的状态对象中
  const [imageState, setImageState] = React.useState({
    image: null as File | null,
    imageUrl: ''
  });

  // 将参考图片相关状态提取到单独的状态对象中
  const [referenceImageState, setReferenceImageState] = React.useState({
    referenceImage: null as File | null,
    referenceImageUrl: ''
  });

  // 其他表单状态
  const [formState, setFormState] = React.useState({
    variationType: '',
    description: '',
    referLevel: 1
  });

  const { isGenerating, setGenerating } = useGenerationStore();

  // 合并状态以便于处理
  const formData: ImageUploadFormData = {
    image: imageState.image,
    imageUrl: imageState.imageUrl,
    variationType: formState.variationType,
    description: formState.description,
    referLevel: formState.referLevel,
    referenceImage: referenceImageState.referenceImage,
    referenceImageUrl: referenceImageState.referenceImageUrl
  };

  // 主图片处理函数
  const handleImageChange = React.useCallback((image: File | null) => {
    setImageState(prev => ({ ...prev, image }));
  }, []);

  const handleImageUrlChange = React.useCallback((imageUrl: string) => {
    setImageState(prev => ({ ...prev, imageUrl }));
  }, []);

  // 参考图片处理函数
  const handleReferenceImageChange = React.useCallback((image: File | null) => {
    setReferenceImageState(prev => ({ ...prev, referenceImage: image }));
  }, []);

  const handleReferenceImageUrlChange = React.useCallback((imageUrl: string) => {
    setReferenceImageState(prev => ({ ...prev, referenceImageUrl: imageUrl }));
  }, []);

  // 其他表单字段处理函数
  const handleDescriptionChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormState(prev => ({ ...prev, description: e.target.value }));
  }, []);

  const handleVariationTypeChange = React.useCallback((value: string) => {
    setFormState(prev => ({ ...prev, variationType: value }));
  }, []);

  // Function to get the appropriate placeholder text based on variation type
  const getPlaceholderText = () => {
    switch (formState.variationType) {
      case '1':
        return 'Please describe the new variation.';
      case '2':
        return 'Please describe the category you would like to change.';
      case '3':
        return 'Please describe the clothing type, fit, color, print, etc.';
      default:
        return 'Please describe the changes you want to make.';
    }
  };

  const handleReferLevelChange = React.useCallback((value: number) => {
    setFormState(prev => ({ ...prev, referLevel: value }));
  }, []);

  // Add a new handler for feature selection
  const handleFeatureSelection = React.useCallback((features: string[]) => {
    console.log(features);
    // Simply replace the description with the joined features
    const newValue = features.join(', ');
    setFormState(prev => ({ ...prev, description: newValue }));
  }, []);

  const handleQueryRandomPrompt = React.useCallback((prompt: string) => {
    setFormState(prev => ({ ...prev, description: prompt }));
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
        <VariationTypeSelect value={formState.variationType} onChange={handleVariationTypeChange} />
        {formState.variationType === '1' && (
          <div className="space-y-4">
            <div className="space-y-[10px]">
              <FormLabel>Upload image</FormLabel>
              <ImageUploader
                onImageChange={handleImageChange}
                onImageUrlChange={handleImageUrlChange}
                imageUrl={imageState.imageUrl}
                currentImage={imageState.image}
              />
            </div>
            <FidelitySlider value={formState.referLevel} onChange={handleReferLevelChange} />
            <div className="space-y-[10px]">
              <div className="flex items-center justify-between">
                <FormLabel>Describe the final design</FormLabel>
                <FeatureModal handleConfirm={handleFeatureSelection} />
              </div>
              <Textarea
                id="description"
                placeholder={getPlaceholderText()}
                className="min-h-[200px] resize-none placeholder:text-[#D5D5D5] font-inter text-sm font-normal leading-5 rounded-[4px] border border-[#DCDCDC]"
                value={formState.description}
                onChange={handleDescriptionChange}
              />
              <RandomPrompt handleQueryRandomPrompt={handleQueryRandomPrompt} />
            </div>
          </div>
        )}

        {formState.variationType === '2' && (
          <div className="space-y-4">
            <div className="space-y-[10px]">
              <FormLabel>Upload image</FormLabel>
              <ImageUploader
                onImageChange={handleImageChange}
                onImageUrlChange={handleImageUrlChange}
                imageUrl={imageState.imageUrl}
                currentImage={imageState.image}
              />
            </div>
            <div className="space-y-[10px]">
              <div className="flex items-center justify-between">
                <FormLabel>Describe the final design</FormLabel>
                <FeatureModal handleConfirm={handleFeatureSelection} />
              </div>
              <Textarea
                id="description"
                placeholder={getPlaceholderText()}
                className="min-h-[200px] resize-none placeholder:text-[#D5D5D5] font-inter text-sm font-normal leading-5 rounded-[4px] border border-[#DCDCDC]"
                value={formState.description}
                onChange={handleDescriptionChange}
              />
              <RandomPrompt handleQueryRandomPrompt={handleQueryRandomPrompt} />
            </div>
          </div>
        )}

        {formState.variationType === '3' && (
          <div className="space-y-4">
            <div className="space-y-[10px]">
              <FormLabel>Upload image</FormLabel>
              <ImageUploader
                onImageChange={handleImageChange}
                onImageUrlChange={handleImageUrlChange}
                imageUrl={imageState.imageUrl}
                currentImage={imageState.image}
              />
            </div>
            <div className="space-y-[10px]">
              <div className="flex items-center justify-between">
                <FormLabel>Describe the final design</FormLabel>
                <FeatureModal handleConfirm={handleFeatureSelection} />
              </div>
              <Textarea
                id="description"
                placeholder={getPlaceholderText()}
                className="min-h-[200px] resize-none placeholder:text-[#D5D5D5] font-inter text-sm font-normal leading-5 rounded-[4px] border border-[#DCDCDC]"
                value={formState.description}
                onChange={handleDescriptionChange}
              />
              <RandomPrompt handleQueryRandomPrompt={handleQueryRandomPrompt} />
            </div>
          </div>
        )}

        {formState.variationType === '4' && (
          <div className="space-y-4">
            <div className="space-y-[10px]">
              <FormLabel>Upload image</FormLabel>
              <ImageUploader
                onImageChange={handleImageChange}
                onImageUrlChange={handleImageUrlChange}
                imageUrl={imageState.imageUrl}
                currentImage={imageState.image}
              />
            </div>
            <div className="space-y-[10px]">
              <div className="flex items-center justify-between">
                <FormLabel>Describe the final design</FormLabel>
                <FeatureModal handleConfirm={handleFeatureSelection} />
              </div>
              <Textarea
                id="description"
                placeholder={getPlaceholderText()}
                className="min-h-[200px] resize-none placeholder:text-[#D5D5D5] font-inter text-sm font-normal leading-5 rounded-[4px] border border-[#DCDCDC]"
                value={formState.description}
                onChange={handleDescriptionChange}
              />
              <RandomPrompt handleQueryRandomPrompt={handleQueryRandomPrompt} />
            </div>
          </div>
        )}

        {formState.variationType === '5' && (
          <div className="space-y-4">
            <div className="space-y-[10px]">
              <FormLabel>Upload image</FormLabel>
              <ImageUploader
                onImageChange={handleImageChange}
                onImageUrlChange={handleImageUrlChange}
                imageUrl={imageState.imageUrl}
                currentImage={imageState.image}
              />
            </div>
            <div className="space-y-[10px]">
              <FormLabel>Upload reference image</FormLabel>
              <ImageUploader
                onImageChange={handleReferenceImageChange}
                onImageUrlChange={handleReferenceImageUrlChange}
                imageUrl={referenceImageState.referenceImageUrl}
                currentImage={referenceImageState.referenceImage}
              />
            </div>
            <FidelitySlider value={formState.referLevel} onChange={handleReferLevelChange} />

            <div className="space-y-[10px]">
              <div className="flex items-center justify-between">
                <FormLabel>Describe the final design</FormLabel>
                <FeatureModal handleConfirm={handleFeatureSelection} />
              </div>
              <Textarea
                id="description"
                placeholder={getPlaceholderText()}
                className="min-h-[200px] resize-none placeholder:text-[#D5D5D5] font-inter text-sm font-normal leading-5 rounded-[4px] border border-[#DCDCDC]"
                value={formState.description}
                onChange={handleDescriptionChange}
              />
              <RandomPrompt handleQueryRandomPrompt={handleQueryRandomPrompt} />
            </div>
          </div>
        )}
      </form>
      <div className="sticky bottom-0 left-0 right-0 pb-4 bg-white">
        <GenerateButton onClick={handleSubmit} state={buttonState} />
      </div>
    </div>
  );
}
