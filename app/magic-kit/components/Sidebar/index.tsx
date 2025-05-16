'use client';

import { useState, useEffect, useCallback } from 'react';

import { GenerateButton } from '@/components/GenerateButton/GenerateButton';
import { useGenerationStore } from '@/stores/useGenerationStore';
import { VariationTypeSelect } from '@/components/VariationTypeSelect/VariationTypeSelect';
import { useVariationFormStore } from '@/stores/useMagicKitStore';
import { variationTypes } from '@/app/magic-kit/const';
import { FormLabel } from '@/components/FormLabel/FormLabel';
import { DescribeDesign } from '@/components/DescribeDesign/index';
import { ColorPicker } from './ColorPicker';
import { ImageUploader as SecondImageUploader, MemoizedImageUploader } from './ImageUploader';
import {
  changeClothesColor,
  changeBackground,
  removeBackground,
  particialModification,
  upscale
} from '@/lib/api/magicKit';
import { eventBus } from '@/utils/events';
import { showErrorDialog } from '@/utils/index';

export function Sidebar() {
  const { isGenerating, setGenerating } = useGenerationStore();
  const {
    currentVariationType,
    formData,
    setCurrentVariationType,
    updateImageUrl,
    updateMaskUrl,
    updateReferenceImageUrl,
    updateDescription,
    updateColorSelection
  } = useVariationFormStore();

  const [btnState, setBtnState] = useState<'disabled' | 'ready' | 'generating'>('disabled');

  // 提交事件
  const handleSubmit = async () => {
    console.log(formData);
    if (btnState === 'ready') {
      try {
        // Set generating state to indicate processing
        setGenerating(true);

        if (!currentVariationType) {
          console.error('No variation type selected');
          setGenerating(false);
          return;
        }

        // Validate image input (URL only)
        if (!formData.imageUrl) {
          console.error('Please upload an image or provide an image URL');
          setGenerating(false);
          return;
        }

        // Validate required data based on variation type
        switch (currentVariationType) {
          case '1': // Change Color
            if (!formData.colorSelection) {
              console.error('Please select a color');
              setGenerating(false);
              return;
            }
            if (!formData.description) {
              console.error('Please provide a description');
              setGenerating(false);
              return;
            }
            break;
          case '2': // Change Background
            if (!formData.referenceImageUrl) {
              console.error('Please provide a reference image');
              setGenerating(false);
              return;
            }
            if (!formData.description) {
              console.error('Please provide a description');
              setGenerating(false);
              return;
            }
            break;
          case '4': // Partial modification
            if (!formData.maskUrl) {
              console.error('Please provide a mask image');
              setGenerating(false);
              return;
            }
            if (!formData.description) {
              console.error('Please provide a description');
              setGenerating(false);
              return;
            }
            break;
        }

        // Call appropriate API based on variation type
        let response;
        switch (currentVariationType) {
          case '1': // Change Color
            response = await changeClothesColor(formData.imageUrl!, formData.description!, formData.colorSelection!);
            break;
          case '2': // Change Background
            response = await changeBackground(formData.imageUrl!, formData.referenceImageUrl!, formData.description!);
            break;
          case '3': // Remove background
            response = await removeBackground(formData.imageUrl!);
            break;
          case '4': // Partial modification
            response = await particialModification(formData.imageUrl!, formData.maskUrl!, formData.description!);
            break;
          case '5': // Upscale
            response = await upscale(formData.imageUrl!);
            break;
          default:
            console.error('Unknown variation type');
            setGenerating(false);
            return;
        }

        // Process response
        console.log('Generation response:', response);
        if (response.code === 0) {
          eventBus.emit('sidebar:submit-success', void 0);
        } else {
          showErrorDialog(response.msg || 'Failed to generate image');
          setGenerating(false);
        }

        // Here you would handle the response, like updating the UI or showing results
        // Example: if (response && response.success) { ... }
      } catch (error) {
        console.error('Error in image generation:', error);
      }
    }
  };

  useEffect(() => {
    let isFormValid = false;

    if (currentVariationType) {
      // Base requirement for all types - main image
      const hasMainImage = Boolean(formData.imageUrl);

      switch (currentVariationType) {
        case '1': // Change Color
          isFormValid = hasMainImage && Boolean(formData.colorSelection) && Boolean(formData.description);
          break;
        case '2': // Change Background
          isFormValid = hasMainImage && Boolean(formData.referenceImageUrl) && Boolean(formData.description);
          break;
        case '3': // Remove background
          isFormValid = hasMainImage;
          break;
        case '4': // Partial modification
          isFormValid = hasMainImage && Boolean(formData.maskUrl) && Boolean(formData.description);
          break;
        case '5': // Upscale
          isFormValid = hasMainImage;
          break;
        default:
          isFormValid = hasMainImage;
      }
    }

    setBtnState(isGenerating ? 'generating' : isFormValid ? 'ready' : 'disabled');
  }, [isGenerating, formData, currentVariationType]);

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
    if (!currentVariationType) return null;

    switch (currentVariationType) {
      case '1': // Change Color
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <FormLabel>Upload original image</FormLabel>
              <MemoizedImageUploader
                imageUrl={formData.imageUrl || ''}
                onImageUrlChange={updateImageUrl}
                onMaskImageUrlChange={(dataUrl, uploadedUrl) => updateMaskUrl(uploadedUrl || '')}
                maskImageUrl={formData.maskUrl || ''}
                showMaskEditor={false}
              />
            </div>
            <div className="space-y-2">
              <FormLabel>Color selection</FormLabel>
              <ColorPicker value={formData.colorSelection || '#ffffff'} onChange={updateColorSelection} />
            </div>
            <DescribeDesign
              description={formData.description || ''}
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
              <MemoizedImageUploader
                imageUrl={formData.imageUrl || ''}
                onImageUrlChange={updateImageUrl}
                onMaskImageUrlChange={(dataUrl, uploadedUrl) => updateMaskUrl(uploadedUrl || '')}
                maskImageUrl={formData.maskUrl || ''}
                showMaskEditor={false}
              />
            </div>
            <div className="space-y-2">
              <FormLabel>Upload reference image</FormLabel>
              <MemoizedImageUploader
                imageUrl={formData.referenceImageUrl || ''}
                onImageUrlChange={updateReferenceImageUrl}
                onMaskImageUrlChange={(dataUrl, uploadedUrl) => {}} // Not used for reference
                maskImageUrl=""
                showMaskEditor={false}
              />
            </div>
            <DescribeDesign
              description={formData.description || ''}
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
              <MemoizedImageUploader
                imageUrl={formData.imageUrl || ''}
                onImageUrlChange={updateImageUrl}
                onMaskImageUrlChange={(dataUrl, uploadedUrl) => updateMaskUrl(uploadedUrl || '')}
                maskImageUrl={formData.maskUrl || ''}
                showMaskEditor={false}
              />
            </div>
          </div>
        );

      case '4': // Partial modification
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <FormLabel>Upload original image</FormLabel>
              <MemoizedImageUploader
                imageUrl={formData.imageUrl || ''}
                onImageUrlChange={updateImageUrl}
                onMaskImageUrlChange={(dataUrl, uploadedUrl) => updateMaskUrl(uploadedUrl || '')}
                maskImageUrl={formData.maskUrl || ''}
                showMaskEditor={true}
              />
            </div>
            <DescribeDesign
              description={formData.description || ''}
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
              <MemoizedImageUploader
                imageUrl={formData.imageUrl || ''}
                onImageUrlChange={updateImageUrl}
                onMaskImageUrlChange={(dataUrl, uploadedUrl) => updateMaskUrl(uploadedUrl || '')}
                maskImageUrl={formData.maskUrl || ''}
                showMaskEditor={false}
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div>
              <FormLabel>Upload Image</FormLabel>
              <MemoizedImageUploader
                imageUrl={formData.imageUrl || ''}
                onImageUrlChange={updateImageUrl}
                onMaskImageUrlChange={(dataUrl, uploadedUrl) => updateMaskUrl(uploadedUrl || '')}
                maskImageUrl={formData.maskUrl || ''}
                showMaskEditor={false}
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
