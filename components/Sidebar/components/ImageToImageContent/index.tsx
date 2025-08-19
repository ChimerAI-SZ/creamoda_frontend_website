'use client';

import * as React from 'react';

import { GenerateButton, GenerateButtonState } from '@/components/GenerateButton/GenerateButton';
import { MemoizedImageUploader as ImageUploader } from '@/components/ImageUploader';
import { FormLabel } from '@/components/FormLabel/FormLabel';
import { VariationTypeSelect } from '@/components/VariationTypeSelect';

import { ImageUploadFormData } from '@/components/Sidebar';
import { DescribeDesign } from '@/components/DescribeDesign';
import { StyledLabel } from '../../../StyledLabel';

import { useGenerationStore } from '@/stores/useGenerationStore';
import { useVariationFormStore } from '@/stores/useVariationFormStore';
import { useModelStore } from '@/stores/useModelStore';
import { ImageUploader as ImageUploader2 } from '@/components/ImageUploader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FidelitySlider } from './FidelitySlider';

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
    updateReferenceImage,
    updateReferenceImageUrl,
    updateFabricPicUrl,
    updateMaskPicUrl,
    updateStyleStrengthLevel
  } = useVariationFormStore();

  const { isGenerating, setGenerating } = useGenerationStore();

  // 从 store 中获取 variationTypes，当前是图生图，对应 type 为 2
  const { getVariationTypesByType } = useModelStore();
  const variationTypes = getVariationTypesByType(2);

  // Get the current variation data based on the selected variation type
  const currentData = React.useMemo(() => {
    if (!currentVariationType || !variationData[currentVariationType]) {
      return {
        image: null,
        imageUrl: '',
        description: '',
        referenceImage: null,
        referenceImageUrl: '',
        fabricPicUrl: '',
        maskPicUrl: '',
        styleStrengthLevel: 'middle'
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

  const onMaskImageUrlChange = React.useCallback(
    (imageUrl: string, uploadedMaskUrl?: string) => {
      if (uploadedMaskUrl) {
        updateMaskPicUrl(uploadedMaskUrl);
      }
    },
    [updateMaskPicUrl]
  );

  const handleFabricImageUrlChange = React.useCallback(
    (imageUrl: string) => {
      updateFabricPicUrl(imageUrl);
    },
    [updateFabricPicUrl]
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

  // Style strength level change handler
  const handleStyleStrengthLevelChange = React.useCallback(
    (value: string) => {
      updateStyleStrengthLevel(value);
    },
    [updateStyleStrengthLevel]
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

  // Convert style strength level string to slider value
  const getSliderValue = (level: string): number => {
    switch (level) {
      case 'low':
        return 0;
      case 'middle':
        return 50;
      case 'high':
        return 100;
      default:
        return 50;
    }
  };

  // Convert slider value to style strength level string
  const getStyleStrengthLevel = (value: number): string => {
    switch (value) {
      case 0:
        return 'low';
      case 50:
        return 'middle';
      case 100:
        return 'high';
      default:
        return 'middle';
    }
  };

  // Handle slider value change
  const handleSliderChange = React.useCallback(
    (value: number) => {
      const levelString = getStyleStrengthLevel(value);
      handleStyleStrengthLevelChange(levelString);
    },
    [handleStyleStrengthLevelChange]
  );

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
          referenceImage: currentData.referenceImage,
          referenceImageUrl: currentData.referenceImageUrl,
          fabricPicUrl: currentData.fabricPicUrl,
          maskPicUrl: currentData.maskPicUrl,
          styleStrengthLevel: currentData.styleStrengthLevel
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

    // Check if main image is provided
    const hasMainImage = currentData.image || currentData.imageUrl;
    if (!hasMainImage) {
      return 'disabled';
    }

    // Validation based on variation type
    switch (currentVariationType) {
      case '1':
      case '2':
      case '3':
      case '4':
        // These types require description
        if (!currentData.description.trim()) {
          return 'disabled';
        }
        break;

      case '5':
        // Type 5 requires reference image only
        {
          const hasReferenceImage = currentData.referenceImage || currentData.referenceImageUrl;
          if (!hasReferenceImage) {
            return 'disabled';
          }
        }
        break;

      case '7':
      case '9':
        // Types 6 and 8 only require main image, no description needed
        break;

      case '8':
        // Change fabric requires both fabric image and a saved mask URL
        if (!currentData.fabricPicUrl || !currentData.maskPicUrl) {
          return 'disabled';
        }
        break;
              case '10':
        // Type 10 requires reference image
        if (!currentData.referenceImageUrl) {
          return 'disabled';
        }
        break;

      case '11':
        // Vary style requires reference image
        const hasReferenceImageForVary = currentData.referenceImage || currentData.referenceImageUrl;
        if (!hasReferenceImageForVary) {
          return 'disabled';
        }
        break;

      default:
        // For unknown types, require description
        if (!currentData.description.trim()) {
          return 'disabled';
        }
        break;
    }

    return 'ready';
  }, [
    currentData.description,
    currentData.image,
    currentData.imageUrl,
    currentData.referenceImage,
    currentData.referenceImageUrl,
    currentData.fabricPicUrl,
    currentData.maskPicUrl,
    currentVariationType,
    isGenerating
  ]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto overflow pb-4 h-[calc(100%-52px)]">
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto overflow-x-hidden space-y-4 px-4">
          <VariationTypeSelect
            value={currentVariationType}
            onChange={handleVariationTypeChange}
            variationTypes={variationTypes}
          />
          
          {/* Upload original image - 对所有 variation type 都显示 */}
          <div className="space-y-[10px]">
            <FormLabel>Upload original image</FormLabel>
            {currentVariationType === '8' ? (
              <ImageUploader2
                onImageUrlChange={handleImageUrlChange}
                imageUrl={currentData.imageUrl}
                onMaskImageUrlChange={onMaskImageUrlChange}
                maskImageUrl={currentData.maskPicUrl}
                showMaskEditor={true}
              />
            ) : (
              <ImageUploader
                onImageChange={handleImageChange}
                onImageUrlChange={handleImageUrlChange}
                imageUrl={currentData.imageUrl}
                currentImage={currentData.image}
              />
            )}
          </div>

          {/* Fabric image upload for variation type 8 */}
          {currentVariationType === '8' && (
            <div className="space-y-[10px]">
              <FormLabel>Upload fabric image</FormLabel>
              <ImageUploader
                onImageChange={handleImageChange}
                onImageUrlChange={handleFabricImageUrlChange}
                imageUrl={currentData.fabricPicUrl}
                currentImage={currentData.image}
              />
            </div>
          )}

          {/* Reference image upload for variation types that need it */}
          {(['5', '10', '11'].includes(currentVariationType)) && (
            <div className="space-y-[10px]">
              <FormLabel>Upload reference image</FormLabel>
              <ImageUploader
                onImageChange={handleReferenceImageChange}
                onImageUrlChange={handleReferenceImageUrlChange}
                imageUrl={currentData.referenceImageUrl}
                currentImage={currentData.referenceImage}
              />
            </div>
          )}

          {/* Reference Level slider for variation types that support it */}
          {(['5', '11'].includes(currentVariationType)) && (
            <div className="space-y-[10px]">
              <FidelitySlider
                value={getSliderValue(currentData.styleStrengthLevel)}
                onChange={handleSliderChange}
                label="Reference Level"
              />
            </div>
          )}

          {/* Description field for variation types that need it */}

          {(['1', '2', '3', '4'].includes(currentVariationType)) && (

            <DescribeDesign
              label="Describe the final design"
              description={currentData.description}
              onDescriptionChange={handleDescriptionChange}
              onFeatureSelection={handleFeatureSelection}
              onRandomPrompt={handleQueryRandomPrompt}
              placeholderText={getPlaceholderText()}
            />
          )}
        </form>
      </div>
      <div className="sticky bottom-0 left-0 right-0 pb-4 bg-white">
        <GenerateButton onClick={handleSubmit} state={buttonState} />
      </div>
    </div>
  );
}
