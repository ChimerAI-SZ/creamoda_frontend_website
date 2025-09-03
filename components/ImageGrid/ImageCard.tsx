import { forwardRef, useState, useRef, useEffect, memo } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

import { cn } from '@/utils';
import { downloadImage } from '@/utils';

const WaveLoader = dynamic(() => import('@/components/LoadingCard').then(mod => mod.WaveLoader), { ssr: false });

interface ImageCardProps {
  image: any;
  onClick: () => void;
  handleDeleteImage: (imageId: number) => void;
  handleCollectImage: (imageId: number, isCollected: boolean) => void;
}

const ImageCardComponent = forwardRef<HTMLDivElement, ImageCardProps>(
  ({ image, onClick, handleDeleteImage, handleCollectImage }, ref) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [progress, setProgress] = useState(0);
    const directionRef = useRef(1);

    const onImageLoad = () => {
      setIsLoaded(true);
    };

    const isGenerating = [1, 2].includes(image.status);
    // status 是 4 或者 是 3 但是 resultPic 不是 URL
    const isFailed = image.status === 4 || (!/^https?:\/\/.+\..+/.test(image.resultPic) && image.status === 3);

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
      <div
        suppressHydrationWarning
        ref={ref}
        className="relative w-full group border-none z-50"
        onClick={() => !isGenerating && !isFailed && onClick()}
      >
        {/* 生成中状态，新生成的图片在 generate 和 load 操作完成之前一直展示生成中 */}
        {(!isLoaded || isGenerating) && (
          <div className="relative w-full h-[400px] z-1 inset-0 flex flex-col items-center justify-center bg-[#FAFAFA] z-[1] rounded-[16px] border border-[#DCDCDC]">
            <WaveLoader progress={progress} />
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
        {!isFailed && image?.resultPic && (
          <div
            className={cn(
              'w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center bg-[#FAFAFA] rounded-[16px] border border-[#DCDCDC]',
              !(!isLoaded || isGenerating) ? 'opacity-100' : 'opacity-0',
              !isLoaded && 'h-0'
            )}
          >
            <Image
              src={image.resultPic || '/placeholder.svg'}
              alt="Fashion image"
              width={image.width || 512}
              height={image.height || 512}
              className="object-cover w-full h-auto rounded-[16px] border border-[#DCDCDC]"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              onLoadingComplete={onImageLoad}
              onError={() => setIsLoaded(true)} // 即使加载失败也标记为已加载，避免一直显示loading
              unoptimized
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              key={image.genImgId || image.resultPic}
            />
          </div>
        )}

        {/* 正常状态的悬浮效果 (仅在成功生成且加载完成时显示) */}
        {isLoaded && !isFailed && (
          <div className="absolute inset-0">
            <div className="relative w-full h-full z-1">
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-[16px]"
                style={{
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)'
                }}
              />
            </div>
            <div
              className="absolute w-full h-[28px] z-1 bottom-6 left-1/2 -translate-x-1/2 "
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-center gap-6 w-full h-[28px] absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div
                  className="w-8 h-8 bg-[rgba(255,255,255,0.40)] backdrop-blur-sm rounded-[8px] flex items-center justify-center text-white cursor-pointer"
                  onClick={() => {
                    handleCollectImage(image.genImgId, image.isCollected);
                  }}
                >
                  <Image
                    src={`/images/album/add${image.isCollected ? 'ed' : ''}_to_album.svg`}
                    alt="download"
                    width={18}
                    height={18}
                  />
                </div>
                <div
                  className="w-8 h-8 bg-[rgba(255,255,255,0.40)] backdrop-blur-sm rounded-[8px] flex items-center justify-center text-white cursor-pointer"
                  onClick={() => {
                    downloadImage(image.resultPic, 'image.jpg');
                  }}
                >
                  <Image src="/images/album/download.svg" alt="download" width={18} height={18} />
                </div>

                <div
                  className="w-8 h-8 bg-[rgba(255,255,255,0.40)] backdrop-blur-sm rounded-[8px] flex items-center justify-center text-white cursor-pointer"
                  onClick={() => handleDeleteImage(image.genImgId)}
                >
                  <Image src="/images/album/delete.svg" alt="delete" width={18} height={18} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

ImageCardComponent.displayName = 'ImageCard';

// 使用memo优化性能，只有当props真正改变时才重新渲染
export const ImageCard = memo(ImageCardComponent, (prevProps, nextProps) => {
  // 比较图片的主要属性
  return (
    prevProps.image.genImgId === nextProps.image.genImgId &&
    prevProps.image.status === nextProps.image.status &&
    prevProps.image.resultPic === nextProps.image.resultPic &&
    prevProps.image.isCollected === nextProps.image.isCollected
  );
});
