'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import Image from 'next/image';

import { GenerateButton } from '@/components/GenerateButton/GenerateButton';

import { ImageUploader } from '@/components/ImageUploader';

import { showErrorDialog, cn } from '@/utils/index';
import { useGenerationStore } from '@/stores/useGenerationStore';
import { tryOnGenerate } from '@/lib/api';
import { eventBus } from '@/utils/events';

import type { TryOnFormData } from '@/lib/api';
type ClothingType = 'top' | 'bottom' | 'one-piece';

export function Sidebar() {
  // 上传的样衣类型
  const [clothingType, setClothingType] = useState<ClothingType>('top');
  const { isGenerating, setGenerating } = useGenerationStore();
  const [btnState, setBtnState] = useState<'disabled' | 'ready' | 'generating'>('disabled');

  const searchParams = useSearchParams();

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

  // 文生图 / 图生图 提交事件
  const handleSubmit = () => {
    const data: TryOnFormData = {
      originalPicUrl: modelImage.imageUrl,
      clothingPhoto: clothingImage.imageUrl,
      clothType: (clothingType + 's') as 'tops' | 'bottoms' | 'one-pieces'
    };

    tryOnGenerate(data)
      .then(data => {
        // 触发 iamgeGrid 里的提交回调时间（刷新生图历史图片）
        eventBus.emit('sidebar:submit-success', void 0);
        // 修改getnerating状态
        setGenerating(true);
      })
      .catch(error => {
        showErrorDialog(error.message || 'Failed to generate image');
        // 若生成失败放开拦截
        setGenerating(false);
      });
  };

  useEffect(() => {
    const isFormValid = Boolean(modelImage.imageUrl && clothingImage.imageUrl);

    setBtnState(isGenerating ? 'generating' : isFormValid ? 'ready' : 'disabled');
  }, [isGenerating, modelImage.imageUrl, clothingImage.imageUrl]);

  return (
    <div
      className={`w-[334px] h-[calc(100vh-56px)] flex-shrink-0 bg-white border-r box-content border-gray-200 flex flex-col z-0`}
    >
      <div className="flex-1 overflow-hidden pt-4 ">
        <div className="h-full relative flex flex-col">
          <div className="flex-1 overflow-y-auto pb-20">
            <div>
              <ImageUploader
                key="modal-uploader"
                onImageChange={useCallback((image: File | null) => {
                  setModelImage(prev => ({ ...prev, image }));
                }, [])}
                onImageUrlChange={useCallback((imageUrl: string) => {
                  setModelImage(prev => ({ ...prev, imageUrl }));
                }, [])}
                imageUrl={modelImage.imageUrl}
                currentImage={modelImage.image}
                styleType="newStyle"
                imageType="Model Image"
              />
            </div>
            <div className="flex gap-[16px] items-center justify-center mt-[20px] px-[16px]">
              {['top', 'bottom', 'one-piece'].map(type => (
                <div
                  key={type}
                  className={cn(
                    'w-full h-[48px] flex items-center justify-center border rounded-[4px] border-[#dcdcdc] cursor-pointer',
                    clothingType === type && 'border-primary'
                  )}
                  onClick={() => setClothingType(type as ClothingType)}
                >
                  <div className="flex items-center gap-[2px] flex-col">
                    <Image
                      src={`/images/virtual-try-on/clothing_type_${type}${
                        clothingType === type ? '_selected' : '_unselected'
                      }.svg`}
                      alt={type}
                      width={16}
                      height={16}
                      unoptimized
                    />
                    <span className={cn('leading-[18px] text-[12px]', clothingType === type && 'text-primary')}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-[20px]">
              <ImageUploader
                key="cloting-uploader"
                onImageChange={useCallback((image: File | null) => {
                  setClothingImage(prev => ({ ...prev, image }));
                }, [])}
                onImageUrlChange={useCallback((imageUrl: string) => {
                  setClothingImage(prev => ({ ...prev, imageUrl }));
                }, [])}
                imageUrl={clothingImage.imageUrl}
                currentImage={clothingImage.image}
                styleType="newStyle"
                imageType="Clothing Image"
              />
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 left-0 right-0 pb-4 bg-white">
          <GenerateButton onClick={handleSubmit} state={btnState} />
        </div>
      </div>
    </div>
  );
}
