import { forwardRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import GetIntTouchDialog from '@/components/GetIntTouchDialog';
import { cn } from '@/lib/utils';

interface ImageCardProps {
  image: any;
  isLoaded?: boolean;
  onImageLoad: () => void;
  onClick: () => void;
}

export const ImageCard = forwardRef<HTMLDivElement, ImageCardProps>(
  ({ image, isLoaded, onImageLoad, onClick }, ref) => {
    const isGenerating = image.status === 1 || image.status === 2;
    const isFailed = image.status === 4;
    const showLoading = isGenerating || (!isLoaded && image.status === 3);

    return (
      <div
        ref={ref}
        className="aspect-[3/4] relative overflow-hidden group border-none"
        onClick={() => !isGenerating && !isFailed && onClick()}
      >
        {/* 生成中状态 */}
        {showLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FAFAFA] z-[1] rounded-[4px] border border-[#DCDCDC]">
            <div className="relative w-[64px] h-[64px]">
              <Image
                src="/images/generate/loading.gif"
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
                  Generating
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
              'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center bg-[#FAFAFA] rounded-[4px] border border-[#DCDCDC] overflow-hidden',
              !showLoading ? 'opacity-100' : 'opacity-0'
            )}
          >
            <Image
              src={image.resultPic || '/placeholder.svg'}
              alt="Fashion image"
              fill
              className="object-cover"
              loading="lazy"
              onLoadingComplete={onImageLoad}
            />
          </div>
        )}

        {/* 正常状态的悬浮效果 (仅在成功生成时显示) */}
        {!showLoading && !isFailed && (
          <>
            <div className="relative w-full h-full z-1">
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-[4px]"
                style={{
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)'
                }}
              />
            </div>
            <div className="absolute inset-0 w-full h-full z-1" onClick={e => e.stopPropagation()}>
              <GetIntTouchDialog
                source="3d_making"
                genImgId={image.genImgId}
                trigger={
                  <Button
                    size="sm"
                    className="w-[104px] h-[28px] absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    3D making
                  </Button>
                }
              />
            </div>
          </>
        )}
      </div>
    );
  }
);

ImageCard.displayName = 'ImageCard';
