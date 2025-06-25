import { forwardRef, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import { cn } from '@/utils';
import { downloadImage } from '@/utils';
import { album, community } from '@/lib/api';

const WaveLoader = dynamic(() => import('@/components/LoadingCard').then(mod => mod.WaveLoader), { ssr: false });

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
  const [progress, setProgress] = useState(0);
  const directionRef = useRef(1);

  const onImageLoad = () => {
    setIsLoaded(true);
  };

  const isFailed = image.status === 4 || (!/^https?:\/\/.+\..+/.test(image.picUrl) && image.status === 3);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const dir = directionRef.current;
        let next = prev + dir;
        // 到达 80 ，反向
        if (next >= 70) {
          next = 70;
          directionRef.current = -1;
        }
        // 到达 60 ，反向
        else if (next <= 50) {
          next = 50;
          directionRef.current = 1;
        }
        return next;
      });
    }, 100); // 每 100ms 更新一次，可以根据需求调整

    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={ref} className="relative w-full group border-none z-50" onClick={() => !isFailed && onClick()}>
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FAFAFA] z-[1] rounded-[16px] border border-[#DCDCDC]">
          <WaveLoader progress={progress} />
          <div className="absolute top-[10px] left-[10px] text-center">
            <div className="inline-flex px-2 py-[2px] justify-center items-center gap-1 rounded-[9999px] border border-[#DCDCDC] bg-white">
              <span className="inline-flex px-2 py-[2px] justify-center items-center gap-1 text-sm font-medium text-gray-700 leading-4">
                Loading
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 生成失败状态 */}
      {isFailed && (
        <div className="absolute h-[400px] inset-0 flex flex-col items-center justify-center bg-[#FAFAFA] z-[1] rounded-[16px] border border-[#DCDCDC]">
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
            'w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center bg-[#FAFAFA] rounded-[16px] border border-[#DCDCDC]',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Image
            src={image.picUrl || '/placeholder.svg'}
            alt="Fashion image"
            width={image.width || 512}
            height={image.height || 512}
            className="object-cover w-full h-auto rounded-[16px] border border-[#DCDCDC]"
            loading="lazy"
            onLoadingComplete={onImageLoad}
            unoptimized
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            key={image.genImgId || image.picUrl}
          />
        </div>
      )}

      {/* 正常状态的悬浮效果 (仅在成功生成且加载完成时显示) */}
      {isLoaded && !isFailed && (
        <div className="absolute inset-0">
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
          <div className="">
            <Link href={`/ai-fashion/${image.seoImgUid}`} />
          </div>
        </div>
      )}
    </div>
  );
});

ImageCard.displayName = 'ImageCard';
