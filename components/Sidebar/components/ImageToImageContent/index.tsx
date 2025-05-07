'use client';

import * as React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { GenerateButton, GenerateButtonState } from '@/components/GenerateButton/GenerateButton';
import { MemoizedImageUploader as ImageUploader } from '@/components/ImageUploader';
import { FormLabel } from '@/components/Sidebar/components/ImageToImageContent/FormLabel';
import { VariationTypeSelect } from '@/components/VariationTypeSelect/VariationTypeSelect';
import { FidelitySlider } from '@/components/Sidebar/components/ImageToImageContent/FidelitySlider';
import { ImageUploadFormData } from '@/components/Sidebar';
import { useGenerationStore } from '@/stores/useGenerationStore';
import FeatureModal from '@/components/FeatureModal';
import RandomPrompt from '@/components/randomPrompt';
import { useVariationFormStore } from '@/stores/useVariationFormStore';

interface ImageUploadFormProps {
  onSubmit?: (data: ImageUploadFormData) => void;
}

export default function ImageUploadForm({ onSubmit }: ImageUploadFormProps) {
  const {
    currentVariationType,
    variationData,
    setCurrentVariationType,
    updateImage,
    updateImageUrl,
    updateDescription,
    updateReferLevel,
    updateReferenceImage,
    updateReferenceImageUrl
  } = useVariationFormStore();

  const { isGenerating, setGenerating } = useGenerationStore();

  // Get the current variation data based on the selected variation type
  const currentData = React.useMemo(() => {
    if (!currentVariationType || !variationData[currentVariationType]) {
      return {
        image: null,
        imageUrl: '',
        description: '',
        referLevel: 2,
        referenceImage: null,
        referenceImageUrl: ''
      };
    }
    return variationData[currentVariationType];
  }, [currentVariationType, variationData]);

  // Main image handlers
  const handleImageChange = React.useCallback(
    (image: File | null) => {
      updateImage(image);
    },
    [updateImage]
  );

  const handleImageUrlChange = React.useCallback(
    (imageUrl: string) => {
      updateImageUrl(imageUrl);
    },
    [updateImageUrl]
  );

  // Reference image handlers
  const handleReferenceImageChange = React.useCallback(
    (image: File | null) => {
      updateReferenceImage(image);
    },
    [updateReferenceImage]
  );

  const handleReferenceImageUrlChange = React.useCallback(
    (imageUrl: string) => {
      updateReferenceImageUrl(imageUrl);
    },
    [updateReferenceImageUrl]
  );

  // Description change handler
  const handleDescriptionChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateDescription(e.target.value);
    },
    [updateDescription]
  );

  // Variation type change handler
  const handleVariationTypeChange = React.useCallback(
    (value: string) => {
      setCurrentVariationType(value);
    },
    [setCurrentVariationType]
  );

  // Reference level change handler
  const handleReferLevelChange = React.useCallback(
    (value: number) => {
      updateReferLevel(value);
    },
    [updateReferLevel]
  );

  // Feature selection handler
  const handleFeatureSelection = React.useCallback(
    (features: string[]) => {
      const newValue = features.join(', ');
      updateDescription(newValue);
    },
    [updateDescription]
  );

  // Random prompt handler
  const handleQueryRandomPrompt = React.useCallback(
    (prompt: string) => {
      updateDescription(prompt);
    },
    [updateDescription]
  );

  // Function to get the appropriate placeholder text based on variation type
  const getPlaceholderText = () => {
    switch (currentVariationType) {
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

  const handleSubmit = async () => {
    if (onSubmit) {
      setGenerating(true);
      try {
        // Create the form data object from the current variation data
        const formData: ImageUploadFormData = {
          image: currentData.image,
          imageUrl: currentData.imageUrl,
          variationType: currentVariationType,
          description: currentData.description,
          referLevel: currentData.referLevel,
          referenceImage: currentData.referenceImage,
          referenceImageUrl: currentData.referenceImageUrl
        };

        // Call the parent's onSubmit function with the form data
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

    if (!currentData.description.trim() || (!currentData.image && !currentData.imageUrl)) {
      return 'disabled';
    }

    return 'ready';
  }, [currentData.description, currentData.image, currentData.imageUrl, isGenerating]);

  return (
    <div className="flex flex-col h-full overflow-x-hidden">
      <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto overflow-x-hidden space-y-4 pb-20 px-4">
        <VariationTypeSelect value={currentVariationType} onChange={handleVariationTypeChange} />
        {currentVariationType === '1' && (
          <div className="space-y-4">
            <div className="space-y-[10px]">
              <FormLabel>Upload image</FormLabel>
              <ImageUploader
                onImageChange={handleImageChange}
                onImageUrlChange={handleImageUrlChange}
                imageUrl={currentData.imageUrl}
                currentImage={currentData.image}
              />
            </div>
            <FidelitySlider value={currentData.referLevel} onChange={handleReferLevelChange} />
            <div className="space-y-[10px]">
              <div className="flex items-center justify-between">
                <FormLabel>Describe the final design</FormLabel>
                <FeatureModal handleConfirm={handleFeatureSelection} />
              </div>
              <Textarea
                id="description"
                placeholder={getPlaceholderText()}
                className="min-h-[200px] resize-none placeholder:text-[#D5D5D5] font-inter text-sm font-normal leading-5 rounded-[4px] border border-[#DCDCDC]"
                value={currentData.description}
                onChange={handleDescriptionChange}
              />
              <RandomPrompt handleQueryRandomPrompt={handleQueryRandomPrompt} />
            </div>
          </div>
        )}

        {currentVariationType === '2' && (
          <div className="space-y-4">
            <div className="space-y-[10px]">
              <FormLabel>Upload image</FormLabel>
              <ImageUploader
                onImageChange={handleImageChange}
                onImageUrlChange={handleImageUrlChange}
                imageUrl={currentData.imageUrl}
                currentImage={currentData.image}
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
                value={currentData.description}
                onChange={handleDescriptionChange}
              />
              <RandomPrompt handleQueryRandomPrompt={handleQueryRandomPrompt} />
            </div>
          </div>
        )}

        {currentVariationType === '3' && (
          <div className="space-y-4">
            <div className="space-y-[10px]">
              <FormLabel>Upload image</FormLabel>
              <ImageUploader
                onImageChange={handleImageChange}
                onImageUrlChange={handleImageUrlChange}
                imageUrl={currentData.imageUrl}
                currentImage={currentData.image}
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
                value={currentData.description}
                onChange={handleDescriptionChange}
              />
              <RandomPrompt handleQueryRandomPrompt={handleQueryRandomPrompt} />
            </div>
          </div>
        )}

        {currentVariationType === '4' && (
          <div className="space-y-4">
            <div className="space-y-[10px]">
              <FormLabel>Upload image</FormLabel>
              <ImageUploader
                onImageChange={handleImageChange}
                onImageUrlChange={handleImageUrlChange}
                imageUrl={currentData.imageUrl}
                currentImage={currentData.image}
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
                value={currentData.description}
                onChange={handleDescriptionChange}
              />
              <RandomPrompt handleQueryRandomPrompt={handleQueryRandomPrompt} />
            </div>
          </div>
        )}

        {currentVariationType === '5' && (
          <div className="space-y-4">
            <div className="space-y-[10px]">
              <FormLabel>Upload image</FormLabel>
              <ImageUploader
                onImageChange={handleImageChange}
                onImageUrlChange={handleImageUrlChange}
                imageUrl={currentData.imageUrl}
                currentImage={currentData.image}
              />
            </div>
            <div className="space-y-[10px]">
              <FormLabel>Upload reference image</FormLabel>
              <ImageUploader
                onImageChange={handleReferenceImageChange}
                onImageUrlChange={handleReferenceImageUrlChange}
                imageUrl={currentData.referenceImageUrl}
                currentImage={currentData.referenceImage}
              />
            </div>
            <FidelitySlider value={currentData.referLevel} onChange={handleReferLevelChange} />

            <div className="space-y-[10px]">
              <div className="flex items-center justify-between">
                <FormLabel>Describe the final design</FormLabel>
                <FeatureModal handleConfirm={handleFeatureSelection} />
              </div>
              <Textarea
                id="description"
                placeholder={getPlaceholderText()}
                className="min-h-[200px] resize-none placeholder:text-[#D5D5D5] font-inter text-sm font-normal leading-5 rounded-[4px] border border-[#DCDCDC]"
                value={currentData.description}
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
