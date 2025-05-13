'use client';

import { useState, useEffect, useCallback } from 'react';

import { GenerateButton } from '@/components/GenerateButton/GenerateButton';
import { useGenerationStore } from '@/stores/useGenerationStore';
import { VariationTypeSelect } from '@/components/VariationTypeSelect/VariationTypeSelect';
import { useVariationFormStore } from '@/stores/useMagicKitStore';
import { MemoizedImageUploader as ImageUploader } from '@/components/ImageUploader';
import { variationTypes } from '@/app/magic-kit/const';
import { FormLabel } from '@/components/FormLabel/FormLabel';
import { DescribeDesign } from '@/components/DescribeDesign/index';
import { ColorPicker } from './ColorPicker';
import { ImageUploader as SecondImageUploader } from './ImageUploader';

export function Sidebar() {
  const { isGenerating, setGenerating } = useGenerationStore();
  const {
    currentVariationType,
    variationData,
    setCurrentVariationType,
    updateImage,
    updateImageUrl,
    updateImageUrlMask,
    updateReferenceImage,
    updateReferenceImageUrl,
    updateReferenceImageUrlMask,
    updateDescription,
    updateColorSelection
  } = useVariationFormStore();

  const [btnState, setBtnState] = useState<'disabled' | 'ready' | 'generating'>('disabled');

  // 提交事件
  const handleSubmit = () => {
    console.log(variationData);
    if (btnState === 'ready') {
      setGenerating(true);
      // Add your actual generation logic here
    }
  };

  // Current variation type data
  const currentData = currentVariationType ? variationData[currentVariationType] : null;

  const handleMainImageUpload = useCallback(
    (image: File | null) => {
      updateImage(image);
    },
    [updateImage]
  );
  const handleReferenceImageUpload = useCallback(
    (file: File | null) => {
      updateReferenceImage(file);
    },
    [updateReferenceImage]
  );

  useEffect(() => {
    let isFormValid = false;

    if (currentVariationType && currentData) {
      // Base requirement for all types - main image
      const hasMainImage = Boolean(currentData.imageUrl);

      switch (currentVariationType) {
        case '1': // Change Color
          isFormValid = hasMainImage && Boolean(currentData.colorSelection);
          break;
        case '2': // Change Background
          isFormValid = hasMainImage && Boolean(currentData.referenceImageUrl);
          break;
        case '3': // Remove background
          isFormValid = hasMainImage;
          break;
        case '4': // Partial modification
          isFormValid = hasMainImage && Boolean(currentData.description);
          break;
        case '5': // Upscale
          isFormValid = hasMainImage;
          break;
        default:
          isFormValid = hasMainImage;
      }
    }

    setBtnState(isGenerating ? 'generating' : isFormValid ? 'ready' : 'disabled');
  }, [isGenerating, currentData, currentVariationType]);

  const handleFeatureSelection = useCallback(
    (features: string[]) => {
      const newValue = features.join(', ');
      updateDescription(newValue);
    },
    [updateDescription]
  );
  // Random prompt handler
  const handleQueryRandomPrompt = useCallback(
    (prompt: string) => {
      updateDescription(prompt);
    },
    [updateDescription]
  );
  // Render specific content based on variation type
  const renderVariationContent = () => {
    if (!currentVariationType || !currentData) return null;

    switch (currentVariationType) {
      case '1': // Change Color
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <FormLabel>Upload original image</FormLabel>
              <SecondImageUploader
                imageUrl={currentData.imageUrl || ''}
                onImageChange={handleMainImageUpload}
                onImageUrlChange={updateImageUrl}
                onMaskImageUrlChange={updateImageUrlMask}
                maskImageUrl={currentData.imageUrlMask || ''}
                currentImage={currentData.image || null}
              />
            </div>
            <div className="space-y-2">
              <FormLabel>Color selection</FormLabel>
              <ColorPicker value={currentData.colorSelection || '#ffffff'} onChange={updateColorSelection} />
            </div>
            <DescribeDesign
              description={currentData.description || ''}
              onDescriptionChange={e => updateDescription(e.target.value)}
              onFeatureSelection={handleFeatureSelection}
              onRandomPrompt={handleQueryRandomPrompt}
            />
          </div>
        );

      case '2': // Change Background
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <FormLabel>Upload original image</FormLabel>
              <ImageUploader
                imageUrl={currentData.imageUrl || ''}
                onImageChange={handleMainImageUpload}
                onImageUrlChange={updateImageUrl}
                onMaskImageUrlChange={updateImageUrlMask}
                maskImageUrl={currentData.imageUrlMask || ''}
                currentImage={currentData.image || null}
              />
            </div>
            <div className="space-y-2">
              <FormLabel>Upload original image</FormLabel>
              <ImageUploader
                imageUrl={currentData.referenceImageUrl || ''}
                onImageChange={handleReferenceImageUpload}
                onImageUrlChange={updateReferenceImageUrl}
                onMaskImageUrlChange={updateReferenceImageUrlMask}
                maskImageUrl={currentData.referenceImageUrlMask || ''}
                currentImage={currentData.referenceImage || null}
              />
            </div>
            <DescribeDesign
              description={currentData.description || ''}
              onDescriptionChange={e => updateDescription(e.target.value)}
              onFeatureSelection={handleFeatureSelection}
              onRandomPrompt={handleQueryRandomPrompt}
            />
          </div>
        );

      case '3': // Remove background
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <FormLabel>Upload original image</FormLabel>
              <ImageUploader
                imageUrl={currentData.imageUrl || ''}
                onImageChange={handleMainImageUpload}
                onImageUrlChange={updateImageUrl}
                onMaskImageUrlChange={updateImageUrlMask}
                maskImageUrl={currentData.imageUrlMask || ''}
                currentImage={currentData.image || null}
              />
            </div>
          </div>
        );

      case '4': // Partial modification
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <FormLabel>Upload original image</FormLabel>
              <ImageUploader
                imageUrl={currentData.imageUrl || ''}
                onImageChange={handleMainImageUpload}
                onImageUrlChange={updateImageUrl}
                onMaskImageUrlChange={updateImageUrlMask}
                maskImageUrl={currentData.imageUrlMask || ''}
                currentImage={currentData.image || null}
              />
            </div>
            <DescribeDesign
              description={currentData.description || ''}
              onDescriptionChange={e => updateDescription(e.target.value)}
              onFeatureSelection={handleFeatureSelection}
              onRandomPrompt={handleQueryRandomPrompt}
            />
          </div>
        );

      case '5': // Upscale
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <FormLabel>Upload original image</FormLabel>
              <ImageUploader
                imageUrl={currentData.imageUrl || ''}
                onImageChange={handleMainImageUpload}
                onImageUrlChange={updateImageUrl}
                onMaskImageUrlChange={updateImageUrlMask}
                maskImageUrl={currentData.imageUrlMask || ''}
                currentImage={currentData.image || null}
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div>
              <FormLabel>Upload Image</FormLabel>
              <ImageUploader
                imageUrl={currentData.imageUrl || ''}
                onImageChange={handleMainImageUpload}
                onImageUrlChange={updateImageUrl}
                onMaskImageUrlChange={updateImageUrlMask}
                maskImageUrl={currentData.imageUrlMask || ''}
                currentImage={currentData.image || null}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-[334px] h-[calc(100vh-64px)] flex-shrink-0 bg-white border-r box-content border-gray-200 flex flex-col z-0">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <VariationTypeSelect
          value={currentVariationType}
          onChange={setCurrentVariationType}
          variationTypes={variationTypes}
        />

        {currentVariationType && <div className="mt-6">{renderVariationContent()}</div>}
      </div>

      <div className="sticky bottom-0 left-0 right-0 px-4 pb-4 bg-white">
        <GenerateButton onClick={handleSubmit} state={btnState} />
      </div>
    </div>
  );
}
