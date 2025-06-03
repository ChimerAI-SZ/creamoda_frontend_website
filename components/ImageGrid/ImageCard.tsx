import { forwardRef, useState, useRef } from 'react';
import Image from 'next/image';
import { Star, ImageDown, Trash2 } from 'lucide-react';

import { cn } from '@/utils';
import { downloadImage } from '@/utils';
import { collectImage } from '@/lib/api/album';

interface ImageCardProps {
  image: any;
  onClick: () => void;
  handleDeleteImage: (imageId: number) => void;
}

export const ImageCard = forwardRef<HTMLDivElement, ImageCardProps>(({ image, onClick, handleDeleteImage }, ref) => {
  const [isLoaded, setIsLoaded] = useState(false);
  // 新生成的图片的标记，如果为 true 则表示图片是新生成的
  // 新生成的图片不需要进入loading状态
  const newImageRef = useRef<boolean>([1, 2].includes(image.status));

  const [isCollected, setIsCollected] = useState(image.isCollected);

  const onImageLoad = () => {
    setIsLoaded(true);
  };

  const isGenerating = [1, 2].includes(image.status);
  const isFailed = image.status === 4;

  return (
    <div
      ref={ref}
      className="aspect-[3/4] relative overflow-hidden group border-none"
      onClick={() => !isGenerating && !isFailed && onClick()}
    >
      {/* 初次加载状态 */}
      {!isLoaded && !newImageRef.current && (
        <div className="absolute z-1 inset-0 flex flex-col items-center justify-center bg-[#FAFAFA] z-[1] rounded-[4px] border border-[#DCDCDC]">
          <div className="relative w-[48px] h-[48px]">
            <Image src="/images/generate/loading.svg" alt="Loading..." fill className="object-cover" priority />
          </div>
          <div className="mt-[6px] text-[#999] font-inter text-xs font-medium leading-4">Loading</div>
        </div>
      )}

      {/* 生成中状态，新生成的图片在 generate 和 load 操作完成之前一直展示生成中 */}
      {!isLoaded && isGenerating && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FAFAFA] z-[1] rounded-[4px] border border-[#DCDCDC]">
          <div className="relative w-[56px] h-[56px]">
            <Image
              src="/images/generate/generating.gif"
              alt="Generating..."
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>
          <div className="absolute top-[10px] left-[10px] text-center">
            <div className="inline-flex px-2 py-[2px] justify-center items-center gap-1 rounded-[9999px] border border-[#DCDCDC] bg-white">
              <span className="inline-flex px-2 py-[2px] justify-center items-center gap-1 text-sm font-medium text-gray-700 leading-4">
                {isGenerating ? 'Generating' : 'Loading'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 生成失败状态 */}
      {isFailed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FAFAFA] z-[1] rounded-[4px] border border-[#DCDCDC]">
          <div className="relative w-[150px] h-[150px]">
            <Image
              src="/images/generate/failToGenerate.svg"
              alt="Generation Failed"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* 结果图片 (仅在成功生成且加载完成时显示) */}
      {!isFailed && (
        <div
          className={cn(
            'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center bg-[#FAFAFA] rounded-[16px] border border-[#DCDCDC] overflow-hidden',
            !(!isLoaded || isGenerating) ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Image
            src={image.resultPic || '/placeholder.svg'}
            alt="Fashion image"
            fill
            className="object-cover"
            loading="lazy"
            onLoadingComplete={onImageLoad}
            unoptimized={true}
            // 添加 referrerPolicy 以优化跨域缓存
            referrerPolicy="no-referrer"
            // 使用 crossOrigin 属性以确保正确缓存
            crossOrigin="anonymous"
            // 添加唯一的 key 属性
            key={image.genImgId || image.resultPic}
          />
        </div>
      )}

      {/* 正常状态的悬浮效果 (仅在成功生成且加载完成时显示) */}
      {isLoaded && !isFailed && (
        <>
          <div className="relative w-full h-full z-1">
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-[4px]"
              style={{
                background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)'
              }}
            />
          </div>
          <div
            className="absolute w-full h-[28px] z-1 bottom-6 left-1/2 -translate-x-1/2 "
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-center gap-8 w-full h-[28px] absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div
                className={cn(
                  'w-[33px] h-[33px] flex items-center justify-center rounded-[50%] cursor-pointer',
                  isCollected ? 'bg-primary text-white' : 'bg-[#fff] text-black'
                )}
                onClick={() => {
                  collectImage({ genImgId: image.genImgId, action: isCollected ? 2 : 1 });
                  setIsCollected(!isCollected);
                }}
              >
                <Star className="w-[18px] h-[18px]" />
              </div>
              <div
                className="w-[33px] h-[33px] bg-[#fff] flex items-center justify-center text-white rounded-[50%] cursor-pointer"
                onClick={() => {
                  downloadImage(image.resultPic, 'image.jpg');
                }}
              >
                <ImageDown className="w-[18px] h-[18px] text-[#000]" />
              </div>
              <div
                className="w-[33px] h-[33px] bg-[#fff] flex items-center justify-center text-white rounded-[50%] cursor-pointer"
                onClick={() => handleDeleteImage(image.genImgId)}
              >
                <Trash2 className="w-[18px] h-[18px] text-[#000]" />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

ImageCard.displayName = 'ImageCard';
