'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import Image from 'next/image';

import { GenerateButton } from '@/components/GenerateButton/GenerateButton';
import { ImageUploader } from '@/components/ImageUploader';
import { StyledLabel } from '@/components/StyledLabel';
import RadioGroup from '@/components/ui/radio';
import { VariationTypeSelect } from '@/components/VariationTypeSelect';

import { useGenerationStore } from '@/stores/useGenerationStore';
import { tryOn } from '@/lib/api';
import { eventBus } from '@/utils/events';
import useModelStore from '@/stores/useModelStore';
import { useAlertStore } from '@/stores/useAlertStore';

import type { TryOnFormData, ChangePoseFormData, VirtualTryOnManualFormData } from '@/types/virtualTryOn';
type ClothingType = 'top' | 'bottom' | 'one-piece';

const clothingTypeList = [
  {
    label: 'Tops',
    value: 'top'
  },
  {
    label: 'Bottoms',
    value: 'bottom'
  },
  {
    label: 'One-pieces',
    value: 'one-piece'
  }
];

interface SidebarProps {
  externalImageUrl?: string;
}

export function Sidebar({ externalImageUrl = '' }: SidebarProps) {
  // 上传的样衣类型
  const [btnState, setBtnState] = useState<'disabled' | 'ready' | 'generating'>('disabled');
  const [currentVariationType, setCurrentVariationType] = useState<string>('1');

  const { isGenerating, setGenerating } = useGenerationStore();
  const { showAlert } = useAlertStore();

  const searchParams = useSearchParams();

  // 从 store 中获取 variationTypes，当前是虚拟试穿，对应 type 为 3
  const { getVariationTypesByType } = useModelStore();
  const variationTypes = getVariationTypesByType(3);

  // virtual try on begins
  const [clothingType, setClothingType] = useState<ClothingType>('top');
  // 上传的模特图片
  const [modelImage, setModelImage] = useState({
    image: null as File | null,
    imageUrl: ''
  });
  // 上传的服饰图片
  const [clothingImage, setClothingImage] = useState({
    image: null as File | null,
    imageUrl: ''
  });
  // virtual try on ends

  // change pose begins
  const [referencePoseImage, setReferencePoseImage] = useState({
    image: null as File | null,
    imageUrl: ''
  });
  // 上传的服饰图片
  const [targetPoseImage, setTargetPoseImage] = useState({
    image: null as File | null,
    imageUrl: ''
  });
  // change pose end

  // virtual try-on manual begins
  const [originalImage, setOriginalImage] = useState({
    image: null as File | null,
    imageUrl: '',
    maskUrl: ''
  });
  const [referenceImage, setReferenceImage] = useState({
    image: null as File | null,
    imageUrl: '',
    maskUrl: ''
  });
  // virtual try-on manual ends

  useEffect(() => {
    if (currentVariationType === '1') {
      setModelImage({ image: null, imageUrl: externalImageUrl });
      setClothingImage({ image: null, imageUrl: '' });
    } else if (currentVariationType === '2') {
      setReferencePoseImage({ image: null, imageUrl: externalImageUrl });
      setTargetPoseImage({ image: null, imageUrl: '' });
    } else if (currentVariationType === '3') {
      setOriginalImage({ image: null, imageUrl: externalImageUrl, maskUrl: '' });
      setReferenceImage({ image: null, imageUrl: '', maskUrl: '' });
    }
  }, [currentVariationType, externalImageUrl]);

  // 文生图 / 图生图 提交事件
  const handleSubmit = async () => {
    try {
      if (currentVariationType === '1') {
        const data: TryOnFormData = {
          originalPicUrl: modelImage.imageUrl,
          clothingPhoto: clothingImage.imageUrl,
          clothType: (clothingType + 's') as 'tops' | 'bottoms' | 'one-pieces'
        };

        const res = await tryOn.tryOnGenerate(data);

        if (res.code === 0) {
          // 触发 iamgeGrid 里的提交回调时间（刷新生图历史图片）
          eventBus.emit('sidebar:submit-success', void 0);
          // 修改getnerating状态
          setGenerating(true);
        } else {
          setGenerating(false);

          showAlert({
            type: 'error',
            content:
              res.message ||
              res.msg ||
              'Something went wrong. Please try again later or contact support if the issue persists'
          });
        }
      } else if (currentVariationType === '2') {
        const data: ChangePoseFormData = {
          originalPicUrl: targetPoseImage.imageUrl,
          referPicUrl: referencePoseImage.imageUrl
        };

        const res = await tryOn.changePoseGenerate(data);

        if (res.code === 0) {
          // 触发 iamgeGrid 里的提交回调时间（刷新生图历史图片）
          eventBus.emit('sidebar:submit-success', void 0);
          // 修改getnerating状态
          setGenerating(true);
        } else {
          setGenerating(false);

          showAlert({
            type: 'error',
            content:
              res.message ||
              res.msg ||
              'Something went wrong. Please try again later or contact support if the issue persists'
                      });
        }
      } else if (currentVariationType === '3') {
        // Virtual Try-on (Manual) logic
        const data: VirtualTryOnManualFormData = {
          modelPicUrl: originalImage.imageUrl,
          modelMaskUrl: originalImage.maskUrl,
          garmentPicUrl: referenceImage.imageUrl,
          garmentMaskUrl: referenceImage.maskUrl,
          modelMargin: 0, // 可以后续添加UI控制
          garmentMargin: 0, // 可以后续添加UI控制
          seed: undefined // 可选参数
        };

        const res = await tryOn.virtualTryOnManualGenerate(data);

        if (res.code === 0) {
          // 触发 iamgeGrid 里的提交回调时间（刷新生图历史图片）
          eventBus.emit('sidebar:submit-success', void 0);
          // 修改getnerating状态
          setGenerating(true);
        } else {
          setGenerating(false);

          showAlert({
            type: 'error',
            content:
              res.message ||
              res.msg ||
              'Something went wrong. Please try again later or contact support if the issue persists'
          });
        }
      }
    } catch (error: any) {
      showAlert({
        type: 'error',
        content:
          error.message || 'Something went wrong. Please try again later or contact support if the issue persists'
      });
    }
  };

  useEffect(() => {
    const isFormValid = Boolean(
      (modelImage.imageUrl && clothingImage.imageUrl) || 
      (referencePoseImage.imageUrl && targetPoseImage.imageUrl) ||
      (originalImage.imageUrl && referenceImage.imageUrl && originalImage.maskUrl && referenceImage.maskUrl)
    );

    setBtnState(isGenerating ? 'generating' : isFormValid ? 'ready' : 'disabled');
  }, [
    isGenerating,
    modelImage.imageUrl,
    clothingImage.imageUrl,
    referencePoseImage.imageUrl,
    targetPoseImage.imageUrl,
    originalImage.imageUrl,
    originalImage.maskUrl,
    referenceImage.imageUrl,
    referenceImage.maskUrl
  ]);

  return (
    <div
      className={`w-[378px] h-[calc(100vh-110px)] overflow-y-auto py-4 rounded-[20px] flex-shrink-0 bg-white shadow-card-shadow flex flex-col z-0 `}
    >
      <div className="flex-1 overflow-hidden">
        <div className="h-full relative flex flex-col px-6 overflow-y-auto">
          <div className="flex flex-col gap-6 pb-20">
            <VariationTypeSelect
              value={currentVariationType}
              onChange={setCurrentVariationType}
              variationTypes={variationTypes}
            />

            {currentVariationType === '1' && (
              <div key={`virtual-try-on-${currentVariationType}`}>
                <div className="space-y-2" key={`modal-uploader-${currentVariationType}`}>
                  <StyledLabel htmlFor="modal-uploader" content="Upload model image" />

                  <ImageUploader
                    key={`modal-uploader-${currentVariationType}-model`}
                    onImageChange={(image: File | null) => {
                      setModelImage(prev => ({ ...prev, image }));
                    }}
                    onImageUrlChange={(imageUrl: string) => {
                      setModelImage(prev => ({ ...prev, imageUrl }));
                    }}
                    imageUrl={modelImage.imageUrl}
                    currentImage={modelImage.image}
                    imageType="Model Image"
                  />
                </div>
                <div className="space-y-2" key={`clothing-type-${currentVariationType}`}>
                  <StyledLabel content="Clothing type" />

                  <RadioGroup
                    options={clothingTypeList.map(type => {
                      return {
                        label: (
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-[18px] h-[18px] flex items-center justify-center">
                              <Image
                                src={`/images/virtual-try-on/${type.value}.svg`}
                                alt={type.value}
                                width={18}
                                height={18}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <span className="text-[#0A1532] text-[14px] font-normal leading-[20px]">{type.value}</span>
                          </div>
                        ),
                        value: type.value
                      };
                    })}
                    name="gender"
                    selectedValue={clothingType}
                    onChange={value => {
                      setClothingType(value as ClothingType);
                    }}
                  />
                </div>
                <div className="space-y-2" key={`cloting-uploader-${currentVariationType}`}>
                  <StyledLabel htmlFor="cloting-uploader" content="Upload clothing image" />

                  <ImageUploader
                    key={`cloting-uploader-${currentVariationType}-clothing`}
                    onImageChange={(image: File | null) => {
                      setClothingImage(prev => ({ ...prev, image }));
                    }}
                    onImageUrlChange={(imageUrl: string) => {
                      setClothingImage(prev => ({ ...prev, imageUrl }));
                    }}
                    imageUrl={clothingImage.imageUrl}
                    currentImage={clothingImage.image}
                    imageType="Clothing Image"
                  />
                </div>
              </div>
            )}

            {currentVariationType === '2' && (
              <div key={`change-pose-${currentVariationType}`}>
                <div className="space-y-2" key={`reference-pose-uploader-${currentVariationType}`}>
                  <StyledLabel htmlFor="reference-pose-uploader" content="Upload reference pose image" />
                  <ImageUploader
                    key={`reference-pose-uploader-${currentVariationType}-reference`}
                    onImageChange={(image: File | null) => {
                      setReferencePoseImage(prev => ({ ...prev, image }));
                    }}
                    onImageUrlChange={(imageUrl: string) => {
                      setReferencePoseImage(prev => ({ ...prev, imageUrl }));
                    }}
                    imageUrl={referencePoseImage.imageUrl}
                    currentImage={referencePoseImage.image}
                    imageType="Reference Pose Image"
                  />
                </div>
                <div className="space-y-2" key={`target-pose-uploader-${currentVariationType}`}>
                  <StyledLabel htmlFor="target-pose-uploader" content="Upload target image" />
                  <ImageUploader
                    key={`target-pose-uploader-${currentVariationType}-target`}
                    onImageChange={(image: File | null) => {
                      setTargetPoseImage(prev => ({ ...prev, image }));
                    }}
                    onImageUrlChange={(imageUrl: string) => {
                      setTargetPoseImage(prev => ({ ...prev, imageUrl }));
                    }}
                    imageUrl={targetPoseImage.imageUrl}
                    currentImage={targetPoseImage.image}
                    imageType="Target Image"
                  />
                </div>
              </div>
            )}

            {currentVariationType === '3' && (
              <div key={`virtual-try-on-manual-${currentVariationType}`}>
                <div className="space-y-2" key={`original-image-uploader-${currentVariationType}`}>
                  <StyledLabel htmlFor="original-image-uploader" content="Upload model image" />
                  <ImageUploader
                    key={`original-image-uploader-${currentVariationType}-original`}
                    onImageUrlChange={(imageUrl: string) => {
                      setOriginalImage(prev => ({ ...prev, imageUrl }));
                    }}
                    onMaskImageUrlChange={(maskUrl: string, uploadedMaskUrl?: string) => {
                      if (uploadedMaskUrl) {
                        setOriginalImage(prev => ({ ...prev, maskUrl: uploadedMaskUrl }));
                      }
                    }}
                    imageUrl={originalImage.imageUrl}
                    maskImageUrl={originalImage.maskUrl}
                    showMaskEditor={true}
                    imageType="Click or drag to upload"
                  />
                </div>
                <div className="space-y-2 mt-6" key={`reference-image-uploader-${currentVariationType}`}>
                  <StyledLabel htmlFor="reference-image-uploader" content="Upload clothing image" />
                  <ImageUploader
                    key={`reference-image-uploader-${currentVariationType}-reference`}
                    onImageUrlChange={(imageUrl: string) => {
                      setReferenceImage(prev => ({ ...prev, imageUrl }));
                    }}
                    onMaskImageUrlChange={(maskUrl: string, uploadedMaskUrl?: string) => {
                      if (uploadedMaskUrl) {
                        setReferenceImage(prev => ({ ...prev, maskUrl: uploadedMaskUrl }));
                      }
                    }}
                    imageUrl={referenceImage.imageUrl}
                    maskImageUrl={referenceImage.maskUrl}
                    showMaskEditor={true}
                    imageType="Click or drag to upload"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="sticky bottom-0 left-0 right-0 pt-4 bg-white shadow-card-shadow">
          <GenerateButton onClick={handleSubmit} state={btnState} />
        </div>
      </div>
    </div>
  );
}
