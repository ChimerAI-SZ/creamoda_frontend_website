import { useState } from 'react';
import Image from 'next/image';

import { downloadImage, cn } from '@/utils';

import type { AlbumItem } from './Drawer';

export default function ImageCard({
  image,
  handleDislike
}: {
  image: AlbumItem;
  handleDislike: (imageId: number) => void;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  const onImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className="group">
      <div
        className={cn(
          'mb-3 break-inside-avoid flex flex-col items-center justify-center bg-[#FAFAFA] z-[1] rounded-[4px] border border-[#DCDCDC] overflow-hidden relative'
        )}
      >
        <Image
          onLoadingComplete={onImageLoad}
          src={image.resultPic || '/placeholder.svg'}
          alt="Fashion image"
          width={100}
          height={100}
          className={cn('w-full h-auto object-cover z-0', isLoaded ? 'opacity-100' : 'opacity-0 h-0')}
          loading="lazy"
          unoptimized={true}
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
        />
        {!isLoaded && (
          <div className="flex flex-col items-center justify-center bg-[#FAFAFA] z-[1] rounded-[4px] h-[200px]">
            <div className="relative w-[48px] h-[48px]">
              <Image src="/images/generate/loading.svg" alt="Loading..." fill className="object-cover" priority />
            </div>
            <div className="mt-[6px] text-[#999] font-inter text-xs font-medium leading-4">Loading</div>
          </div>
        )}
        {/* 正常状态的悬浮效果 (仅在成功生成且加载完成时显示) */}
        {isLoaded && (
          <>
            <div className="absolute inset-0 w-full h-full z-1">
              <div
                className="opacity-0 w-full h-full group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-[4px]"
                style={{
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)'
                }}
              />
            </div>
            <div
              className="absolute  w-full h-[28px] z-1 bottom-4 left-1/2 -translate-x-1/2 "
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-center gap-4 w-full h-[28px] opacity-0 absolute group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-8 h-8 bg-gray-40 rounded-[8px] flex items-center justify-center text-white cursor-pointer">
                  {/* <Star className="w-[18px] h-[18px]" > */}
                  <Image
                    src={`/images/album/added_to_album.svg`}
                    alt="download"
                    width={18}
                    height={18}
                    onClick={() => handleDislike(image.genImgId)}
                  />
                </div>
                <div
                  className="w-8 h-8 bg-gray-40 rounded-[8px] flex items-center justify-center text-white cursor-pointer"
                  onClick={() => {
                    downloadImage(image.resultPic, 'image.jpg');
                  }}
                >
                  <Image src="/images/album/download.svg" alt="download" width={18} height={18} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
