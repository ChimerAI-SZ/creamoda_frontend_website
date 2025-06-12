'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import Image from 'next/image';

import { GenerateButton } from '@/components/GenerateButton/GenerateButton';
import { ImageUploader } from '@/components/ImageUploader';
import { StyledLabel } from '@/components/StyledLabel';
import RadioGroup from '@/components/ui/radio';
import { VariationTypeSelect } from '@/components/VariationTypeSelect';

import { showErrorDialog } from '@/utils/index';
import { useGenerationStore } from '@/stores/useGenerationStore';
import { tryOn } from '@/lib/api';
import { eventBus } from '@/utils/events';

import { variationTypes } from '../const';

import type { TryOnFormData, ChangePoseFormData } from '@/types/virtualTryOn';
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

export function Sidebar() {
  // 上传的样衣类型
  const [btnState, setBtnState] = useState<'disabled' | 'ready' | 'generating'>('disabled');
  const [currentVariationType, setCurrentVariationType] = useState<string>('virtualTryOn');

  const { isGenerating, setGenerating } = useGenerationStore();

  const searchParams = useSearchParams();

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
    imageUrl: searchParams.get('imageUrl') as string
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

  useEffect(() => {
    if (currentVariationType === 'virtualTryOn') {
      setModelImage({ image: null, imageUrl: '' });
      setClothingImage({ image: null, imageUrl: searchParams.get('imageUrl') as string });
    } else if (currentVariationType === 'changePose') {
      setReferencePoseImage({ image: null, imageUrl: '' });
      setTargetPoseImage({ image: null, imageUrl: '' });
    }
  }, [currentVariationType]);

  // 文生图 / 图生图 提交事件
  const handleSubmit = () => {
    if (currentVariationType === 'virtualTryOn') {
      const data: TryOnFormData = {
        originalPicUrl: modelImage.imageUrl,
        clothingPhoto: clothingImage.imageUrl,
        clothType: (clothingType + 's') as 'tops' | 'bottoms' | 'one-pieces'
      };

      tryOn
        .tryOnGenerate(data)
        .then(() => {
          // 触发 iamgeGrid 里的提交回调时间（刷新生图历史图片）
          eventBus.emit('sidebar:submit-success', void 0);
          // 修改getnerating状态
          setGenerating(true);
        })
        .catch((error: Error) => {
          showErrorDialog(error.message || 'Failed to generate image');
          // 若生成失败放开拦截
          setGenerating(false);
        });
    } else if (currentVariationType === 'changePose') {
      const data: ChangePoseFormData = {
        originalPicUrl: targetPoseImage.imageUrl,
        referPicUrl: referencePoseImage.imageUrl
      };

      tryOn
        .changePoseGenerate(data)
        .then(() => {
          // 触发 iamgeGrid 里的提交回调时间（刷新生图历史图片）
          eventBus.emit('sidebar:submit-success', void 0);
          // 修改getnerating状态
          setGenerating(true);
        })
        .catch((error: Error) => {
          showErrorDialog(error.message || 'Failed to generate image');
          // 若生成失败放开拦截
          setGenerating(false);
        });
    }
  };

  useEffect(() => {
    const isFormValid = Boolean(
      (modelImage.imageUrl && clothingImage.imageUrl) || (referencePoseImage.imageUrl && targetPoseImage.imageUrl)
    );

    setBtnState(isGenerating ? 'generating' : isFormValid ? 'ready' : 'disabled');
  }, [
    isGenerating,
    modelImage.imageUrl,
    clothingImage.imageUrl,
    referencePoseImage.imageUrl,
    targetPoseImage.imageUrl
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

            {currentVariationType === 'virtualTryOn' && (
              <div key={`virtual-try-on-${currentVariationType}`}>
                <div className="space-y-2" key={`modal-uploader-${currentVariationType}`}>
                  <StyledLabel htmlFor="modal-uploader" content="Upload model image" />

                  <ImageUploader
                    key={`modal-uploader-${currentVariationType}-model`}
                    onImageChange={useCallback(
                      (image: File | null) => {
                        setModelImage(prev => ({ ...prev, image }));
                      },
                      [setModelImage]
                    )}
                    onImageUrlChange={useCallback(
                      (imageUrl: string) => {
                        setModelImage(prev => ({ ...prev, imageUrl }));
                      },
                      [setModelImage]
                    )}
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
                    onImageChange={useCallback(
                      (image: File | null) => {
                        setClothingImage(prev => ({ ...prev, image }));
                      },
                      [setClothingImage]
                    )}
                    onImageUrlChange={useCallback(
                      (imageUrl: string) => {
                        setClothingImage(prev => ({ ...prev, imageUrl }));
                      },
                      [setClothingImage]
                    )}
                    imageUrl={clothingImage.imageUrl}
                    currentImage={clothingImage.image}
                    imageType="Clothing Image"
                  />
                </div>
              </div>
            )}

            {currentVariationType === 'changePose' && (
              <div key={`change-pose-${currentVariationType}`}>
                <div className="space-y-2" key={`reference-pose-uploader-${currentVariationType}`}>
                  <StyledLabel htmlFor="reference-pose-uploader" content="Upload reference pose image" />
                  <ImageUploader
                    key={`reference-pose-uploader-${currentVariationType}-reference`}
                    onImageChange={useCallback(
                      (image: File | null) => {
                        setReferencePoseImage(prev => ({ ...prev, image }));
                      },
                      [setReferencePoseImage]
                    )}
                    onImageUrlChange={useCallback(
                      (imageUrl: string) => {
                        setReferencePoseImage(prev => ({ ...prev, imageUrl }));
                      },
                      [setReferencePoseImage]
                    )}
                    imageUrl={referencePoseImage.imageUrl}
                    currentImage={referencePoseImage.image}
                    imageType="Reference Pose Image"
                  />
                </div>
                <div className="space-y-2" key={`target-pose-uploader-${currentVariationType}`}>
                  <StyledLabel htmlFor="target-pose-uploader" content="Upload target pose image" />
                  <ImageUploader
                    key={`target-pose-uploader-${currentVariationType}-target`}
                    onImageChange={useCallback(
                      (image: File | null) => {
                        setTargetPoseImage(prev => ({ ...prev, image }));
                      },
                      [setTargetPoseImage]
                    )}
                    onImageUrlChange={useCallback(
                      (imageUrl: string) => {
                        setTargetPoseImage(prev => ({ ...prev, imageUrl }));
                      },
                      [setTargetPoseImage]
                    )}
                    imageUrl={targetPoseImage.imageUrl}
                    currentImage={targetPoseImage.image}
                    imageType="Target Pose Image"
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
