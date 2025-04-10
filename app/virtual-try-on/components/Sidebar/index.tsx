'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';

import { GenerateButton, GenerateButtonState } from '@/components/GenerateButton/GenerateButton';

import { ImageUploader } from '@/components/ImageUploader';

import { useGenerationStore } from '@/stores/useGenerationStore';
import { cn } from '@/lib/utils';

type ClothingType = 'top' | 'bottom' | 'one-piece';

export function Sidebar() {
  // 上传的样衣类型
  const [clothingType, setClothingType] = useState<ClothingType>('top');
  const { isGenerating, setGenerating } = useGenerationStore();
  const [btnState, setBtnState] = useState<'disabled' | 'ready' | 'generating'>('disabled');

  return (
    <div
      className={`w-[334px] h-[calc(100vh-64px)] flex-shrink-0 bg-white border-r box-content border-gray-200 flex flex-col z-0`}
    >
      <div className="flex-1 overflow-hidden pt-4 ">
        <form className="h-full">
          <div className="h-full relative flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <div>
                <ImageUploader
                  key="modal-uploader"
                  onImageChange={() => {}}
                  onImageUrlChange={() => {}}
                  imageUrl={''}
                  currentImage={null}
                  styleType="newStyle"
                />
              </div>
              <div className="flex gap-[16px] items-center justify-center mt-[20px] px-[16px]">
                {['top', 'bottom', 'one-piece'].map(type => (
                  <div
                    key={type}
                    className={cn(
                      'w-full h-[48px] flex items-center justify-center border rounded-[4px] border-[#dcdcdc] cursor-pointer',
                      clothingType === type && 'border-[#F97917]'
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
                      <span className={cn('leading-[18px] text-[12px]', clothingType === type && 'text-[#F97917]')}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-[20px]">
                <ImageUploader
                  key="cloting-uploader"
                  onImageChange={() => {}}
                  onImageUrlChange={() => {}}
                  imageUrl={''}
                  currentImage={null}
                  styleType="newStyle"
                />
              </div>
            </div>
            <div className="sticky bottom-0 left-0 right-0 pb-4 bg-white">
              <GenerateButton onClick={() => {}} state={btnState} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
