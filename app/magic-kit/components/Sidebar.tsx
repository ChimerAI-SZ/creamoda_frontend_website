'use client';

import { useState, useEffect, useCallback } from 'react';

import { GenerateButton } from '@/components/GenerateButton/GenerateButton';
import { useGenerationStore } from '@/stores/useGenerationStore';
import { VariationTypeSelect } from '@/components/VariationTypeSelect';
import { useVariationFormStore } from '@/stores/useMagicKitStore';
import { StyledLabel } from '@/components/StyledLabel';
import { DescribeDesign } from '@/components/DescribeDesign';
import { ColorPicker } from './ColorPicker';
import { MemoizedImageUploader } from '@/components/ImageUploader';

import { magicKit } from '@/lib/api';
import { eventBus } from '@/utils/events';
import useModelStore from '@/stores/useModelStore';
import { useAlertStore } from '@/stores/useAlertStore';

export function Sidebar() {
  const { isGenerating, setGenerating } = useGenerationStore();
  const {
    currentVariationType,
    formData,
    setCurrentVariationType,
    updateImageUrl,
    updateMaskUrl,
    updateReferenceImageUrl,
    updateFabricImageUrl,
    updateDescription,
    updateColorSelection
  } = useVariationFormStore();

  const { showAlert } = useAlertStore();
  const [btnState, setBtnState] = useState<'disabled' | 'ready' | 'generating'>('disabled');
  const { getVariationTypesByType } = useModelStore();
  const variationTypes = getVariationTypesByType(4);

  // 提交事件
  const handleSubmit = async () => {
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
              showAlert({
                type: 'error',
                content: 'Please select a color'
              });
              setGenerating(false);
              return;
            }
            if (!formData.description) {
              showAlert({
                type: 'error',
                content: 'Please provide a description'
              });
              setGenerating(false);
              return;
            }
            break;
          case '2': // Change Background
            if (!formData.referenceImageUrl) {
              showAlert({
                type: 'error',
                content: 'Please provide a reference image'
              });
              setGenerating(false);
              return;
            }
            if (!formData.description) {
              showAlert({
                type: 'error',
                content: 'Please provide a description'
              });
              setGenerating(false);
              return;
            }
            break;
          case '4': // Partial modification
            if (!formData.maskUrl) {
              showAlert({
                type: 'error',
                content: 'Please provide a mask image'
              });
              setGenerating(false);
              return;
            }
            if (!formData.description) {
              showAlert({
                type: 'error',
                content: 'Please provide a description'
              });
              setGenerating(false);
              return;
            }
            break;
          case '6': // Pattern extraction
            if (!formData.maskUrl) {
              showAlert({
                type: 'error',
                content: 'Please provide a mask image'
              });
              setGenerating(false);
              return;
            }
            break;
          case '7': // Pattern extraction
            if (!formData.referenceImageUrl) {
              showAlert({
                type: 'error',
                content: 'Please provide a reference image'
              });
              setGenerating(false);
              return;
            }
            if (!formData.fabricImageUrl) {
              showAlert({
                type: 'error',
                content: 'Please provide a fabric image'
              });
              setGenerating(false);
              return;
            }
            break;
        }

        // Call appropriate API based on variation type
        let response;
        switch (currentVariationType) {
          case '1': // Change Color
            response = await magicKit.changeClothesColor(
              formData.imageUrl!,
              formData.description!,
              formData.colorSelection!
            );
            break;
          case '2': // Change Background
            response = await magicKit.changeBackground(
              formData.imageUrl!,
              formData.referenceImageUrl!,
              formData.description!
            );
            break;
          case '3': // Remove background
            response = await magicKit.removeBackground(formData.imageUrl!);
            break;
          case '4': // Partial modification
            response = await magicKit.particialModification(
              formData.imageUrl!,
              formData.maskUrl!,
              formData.description!
            );
            break;
          case '5': // Upscale
            response = await magicKit.upscale(formData.imageUrl!);
            break;
          case '6': // Pattern extraction
            response = await magicKit.patternExtraction(formData.imageUrl!, formData.maskUrl!);
            break;
          case '7': // Pattern application
            response = await magicKit.patternApplication(
              formData.imageUrl!,
              formData.referenceImageUrl!,
              formData.fabricImageUrl!
            );
            break;
          case '9': // Extend image
            response = await magicKit.extendImage(
              formData.imageUrl!,
              100, // 默认上边距
              100, // 默认右边距
              100, // 默认下边距
              100  // 默认左边距
            );
            break;

          default:
            console.error('Unknown variation type');
            setGenerating(false);
            return;
        }

        if (response.code === 0) {
          eventBus.emit('sidebar:submit-success', void 0);
        } else {
          showAlert({
            type: 'error',
            content: response.msg || 'Failed to generate image'
          });
          setGenerating(false);
        }

        // Here you would handle the response, like updating the UI or showing results
        // Example: if (response && response.success) { ... }
      } catch (error: any) {
        showAlert({
          type: 'error',
          content:
            error.message || 'Something went wrong. Please try again later or contact support if the issue persists'
        });
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
        case '6': // Pattern extraction
          isFormValid = hasMainImage && Boolean(formData.maskUrl);
          break;
        case '7': // Pattern application
          isFormValid = hasMainImage && Boolean(formData.referenceImageUrl) && Boolean(formData.fabricImageUrl);
          break;
        case '9': // Extend image
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
          <div className="space-y-2">
            <div className="space-y-2">
              <StyledLabel content="Upload original image" />
              <MemoizedImageUploader
                imageUrl={formData.imageUrl || ''}
                onImageUrlChange={updateImageUrl}
                onMaskImageUrlChange={(dataUrl, uploadedUrl) => updateMaskUrl(uploadedUrl || '')}
                maskImageUrl={formData.maskUrl || ''}
                showMaskEditor={false}
              />
            </div>
            <div className="space-y-2">
              <StyledLabel content="Color selection" />
              <ColorPicker value={formData.colorSelection || '#ffffff'} onChange={updateColorSelection} />
            </div>
            <DescribeDesign
              label="Describe the final design"
              description={formData.description || ''}
              onDescriptionChange={e => updateDescription(e.target.value)}
              onFeatureSelection={handleFeatureSelection}
              onRandomPrompt={handleQueryRandomPrompt}
            />
          </div>
        );

      case '2': // Change Background
        return (
          <div className="space-y-2">
            <div className="space-y-2">
              <StyledLabel content="Upload original image" />
              <MemoizedImageUploader
                imageUrl={formData.imageUrl || ''}
                onImageUrlChange={updateImageUrl}
                onMaskImageUrlChange={(dataUrl, uploadedUrl) => updateMaskUrl(uploadedUrl || '')}
                maskImageUrl={formData.maskUrl || ''}
                showMaskEditor={false}
              />
            </div>
            <div className="space-y-2">
              <StyledLabel content="Upload reference image" />
              <MemoizedImageUploader
                imageUrl={formData.referenceImageUrl || ''}
                onImageUrlChange={updateReferenceImageUrl}
                onMaskImageUrlChange={(dataUrl, uploadedUrl) => {}} // Not used for reference
                maskImageUrl=""
                showMaskEditor={false}
              />
            </div>
            <DescribeDesign
              label="Describe the final design"
              description={formData.description || ''}
              onDescriptionChange={e => updateDescription(e.target.value)}
              onFeatureSelection={handleFeatureSelection}
              onRandomPrompt={handleQueryRandomPrompt}
            />
          </div>
        );

      case '3': // Remove background
        return (
          <div className="space-y-2">
            <div className="space-y-2">
              <StyledLabel content="Upload original image" />
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
          <div className="space-y-2">
            <div className="space-y-2">
              <StyledLabel content="Upload original image" />
              <MemoizedImageUploader
                imageUrl={formData.imageUrl || ''}
                onImageUrlChange={updateImageUrl}
                onMaskImageUrlChange={(dataUrl, uploadedUrl) => updateMaskUrl(uploadedUrl || '')}
                maskImageUrl={formData.maskUrl || ''}
                showMaskEditor={true}
              />
            </div>
            <DescribeDesign
              label="Describe the final design"
              description={formData.description || ''}
              onDescriptionChange={e => updateDescription(e.target.value)}
              onFeatureSelection={handleFeatureSelection}
              onRandomPrompt={handleQueryRandomPrompt}
            />
          </div>
        );

      case '5': // Upscale
        return (
          <div className="space-y-2">
            <div className="space-y-2">
              <StyledLabel content="Upload original image" />
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

      case '6': // Pattern extraction
        return (
          <div className="space-y-2">
            <StyledLabel content="Upload original image" />
            <MemoizedImageUploader
              imageUrl={formData.imageUrl || ''}
              onImageUrlChange={updateImageUrl}
              onMaskImageUrlChange={(dataUrl, uploadedUrl) => updateMaskUrl(uploadedUrl || '')}
              maskImageUrl={formData.maskUrl || ''}
              showMaskEditor={true}
            />
          </div>
        );
      case '7': // Pattern application
        return (
          <div className="space-y-2">
            <StyledLabel content="Upload original image" />
            <MemoizedImageUploader
              imageUrl={formData.imageUrl || ''}
              onImageUrlChange={updateImageUrl}
              onMaskImageUrlChange={(dataUrl, uploadedUrl) => updateMaskUrl(uploadedUrl || '')}
              maskImageUrl={formData.maskUrl || ''}
              showMaskEditor={false}
            />
            <StyledLabel content="Upload printing image" />
            <MemoizedImageUploader
              imageUrl={formData.referenceImageUrl || ''}
              onImageUrlChange={updateReferenceImageUrl}
              onMaskImageUrlChange={(dataUrl, uploadedUrl) => {}} // Not used for reference
              maskImageUrl=""
              showMaskEditor={false}
            />
            <StyledLabel content="Upload fabric image" />
            <MemoizedImageUploader
              imageUrl={formData.fabricImageUrl || ''}
              onImageUrlChange={updateFabricImageUrl}
              onMaskImageUrlChange={(dataUrl, uploadedUrl) => {}} // Not used for fabric
              maskImageUrl=""
              showMaskEditor={false}
            />
          </div>
        );

      case '9': // Extend image
        return (
          <div className="space-y-2">
            <div className="space-y-2">
              <StyledLabel content="Upload original image" />
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
          <div className="space-y-2">
            <div>
              <StyledLabel content="Upload Image" />
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
    <div
      className={`w-[378px] h-[calc(100vh-110px)] py-4 rounded-[20px] flex-shrink-0 bg-white shadow-card-shadow flex flex-col z-0 `}
    >
      <div className="flex-1 overflow-hidden">
        <div className="h-full relative flex flex-col px-6 overflow-y-auto">
          <div className="flex flex-col gap-6 pb-20">
            <VariationTypeSelect
              value={currentVariationType}
              onChange={setCurrentVariationType}
              variationTypes={variationTypes}
            />

            {currentVariationType && <div>{renderVariationContent()}</div>}
          </div>
        </div>

        <div className="sticky bottom-0 left-0 right-0 pt-4 bg-white shadow-card-shadow">
          <GenerateButton onClick={handleSubmit} state={btnState} />
        </div>
      </div>
    </div>
  );
}
