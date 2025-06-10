import { forwardRef, useState, useRef } from 'react';
import Image from 'next/image';

import { cn } from '@/utils';
import { downloadImage } from '@/utils';
import { album, community } from '@/lib/api';

interface ImageCardProps {
  image: any;
  onClick: () => void;
}

export const ImageCard = forwardRef<HTMLDivElement, ImageCardProps>(({ image, onClick }, ref) => {
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
        <div className="absolute z-1 inset-0 flex flex-col items-center justify-center bg-[#FAFAFA] z-[1] rounded-[16px] border border-[#DCDCDC]">
          <div className="relative w-[48px] h-[48px]">
            <Image src="/images/generate/loading.svg" alt="Loading..." fill className="object-cover" priority />
          </div>
          <div className="mt-[6px] text-[#999] font-inter text-xs font-medium leading-4">Loading</div>
        </div>
      )}

      {/* 生成中状态，新生成的图片在 generate 和 load 操作完成之前一直展示生成中 */}
      {!isLoaded && isGenerating && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FAFAFA] z-[1] rounded-[16px] border border-[#DCDCDC]">
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
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FAFAFA] z-[1] rounded-[16px] border border-[#DCDCDC]">
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
            src={image.picUrl || '/placeholder.svg'}
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
            key={image.genImgId || image.picUrl}
          />
        </div>
      )}

      {/* 正常状态的悬浮效果 (仅在成功生成且加载完成时显示) */}
      {isLoaded && !isFailed && (
        <>
          <div className="relative w-full h-full z-1">
            <div
              className="absolute inset-0 group-hover:opacity-100 opacity-0 transition-opacity duration-300 flex items-center justify-center rounded-[16px]"
              style={{
                background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)'
              }}
            />
          </div>
          <div
            className="absolute flex items-center justify-center w-full h-[48px] overflow-hidden z-1 top-[1px]"
            onClick={e => e.stopPropagation()}
          >
            {/* 为了防止backdrop-blur影响border，所以需要减去2px */}
            <div className="flex items-center overflow-hidden justify-center w-[calc(100%-2px)] h-[48px] px-[20px] pt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute bg-white/40 backdrop-blur-sm rounded-tr-[16px] rounded-tl-[16px]">
              <div className="flex items-center justify-center gap-[6px] w-full h-full py-[6px]">
                <div className="z-10">
                  <Image
                    src={image.creator.headPic || '/images/defaultAvatar.svg'}
                    alt="用户头像"
                    width={24}
                    height={24}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow z-10">
                  <div className="text-gray-80 text-[10px] font-bold leading-[14px]">{image.creator.name}</div>
                  <div className="text-[rgba(10,21,50,0.60)] text-[10px] font-normal leading-[14px]">
                    {image.creator.email}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="absolute w-full h-[32px] z-1 bottom-6 left-1/2 -translate-x-1/2 "
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-center gap-6 w-full h-[32px] absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div
                className="w-8 h-8 bg-[rgba(255,255,255,0.40)] rounded-[8px] flex items-center justify-center text-white cursor-pointer"
                onClick={() => {
                  album.collectImage({ genImgId: image.genImgId, action: isCollected ? 2 : 1 });
                  setIsCollected(!isCollected);
                }}
              >
                <Image
                  src={`/images/album/add${isCollected ? 'ed' : ''}_to_album.svg`}
                  alt="download"
                  width={18}
                  height={18}
                />
              </div>
              <div
                className="w-8 h-8 bg-[rgba(255,255,255,0.40)] rounded-[8px] flex items-center justify-center text-white cursor-pointer"
                onClick={() => {
                  downloadImage(image.picUrl, 'image.jpg');
                }}
              >
                <Image src="/images/album/download.svg" alt="download" width={18} height={18} />
              </div>
              <div
                className="w-8 h-8 bg-[rgba(255,255,255,0.40)] rounded-[8px] flex items-center justify-center text-white cursor-pointer"
                onClick={() => {
                  if (image.islike) {
                    community.cancelLikeImage(image.genImgId);
                  } else {
                    community.likeImage(image.genImgId);
                  }
                }}
              >
                <Image
                  src={`/images/album/${image.islike ? 'cancel_like' : 'like'}.svg`}
                  alt="like"
                  width={18}
                  height={18}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

ImageCard.displayName = 'ImageCard';
