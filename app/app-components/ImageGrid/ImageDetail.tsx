import Image from 'next/image';

import GetIntTouchDialog from '@/components/GetIntTouchDialog';
import { Button } from '@/components/ui/button';
import { Overlay } from '@/components/ui/overlay';

import { ImageItem } from './index';

interface ImageDetailProps {
  image: ImageItem | null;
  onClose: () => void;
  isOpen: boolean;
  imgList: ImageItem[];
  onImageChange: (image: ImageItem | null) => void;
}

export default function ImageDetail({ image, onClose, isOpen, imgList, onImageChange }: ImageDetailProps) {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <div className="relative" onClick={e => e.stopPropagation()}>
        <div className="relative aspect-[3/4] max-h-[60vh] h-[645px] w-auto bg-white rounded-[4px] overflow-hidden">
          {/* 图片详情内容 */}
          {image && (
            <div className="relative w-full h-full border border-[rgba(182,182,182,0.5)] shadow-[0_0.11rem_0.89rem_0_rgba(0,0,0,0.07)] z-[1] transition-transform duration-500">
              {/* 添加模糊背景 */}
              <div
                className="absolute inset-0 bg-cover bg-center blur-xl opacity-50 scale-110"
                style={{ backgroundImage: `url(${image.resultPic})` }}
              />
              {/* 保持原图显示 */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <Image
                  src={image.resultPic}
                  alt={'image generated'}
                  className="max-w-full max-h-full object-contain"
                  width={488}
                  height={645}
                />
              </div>
            </div>
          )}
          {/* 其他详情内容 */}
        </div>
        {image && (
          <div className="w-[252px] h-[140px] bg-white rounded-[4px] overflow-hidden absolute right-[-268px] bottom-0 p-4">
            <div className="text-[#121316] font-inter text-base font-medium leading-6 mb-4">Quick action</div>
            <GetIntTouchDialog
              source="3d_making"
              genImgId={image.genImgId}
              trigger={
                <Button variant="default" className="w-full mb-3">
                  3D making
                </Button>
              }
            />
            <div className="text-[#121316] font-inter text-sm font-normal leading-5">
              <span>Want to retouch it? </span>
              <GetIntTouchDialog
                source="human_tuning"
                genImgId={image.genImgId}
                trigger={<span className="underline cursor-pointer">Countact us</span>}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-[20px] absolute left-[50%] translate-x-[-50%] bottom-[-144px] h-[112px] rounded-[4px] ">
          {imgList
            .filter(item => item.genId === image?.genId)
            .map(pic => {
              const isCurrentImage = pic.genImgId === image?.genImgId;
              return (
                <div
                  key={pic.genImgId}
                  className={`${isCurrentImage ? 'w-[85px]' : 'w-[70px]'} transition-all duration-300 cursor-pointer`}
                  onClick={() => {
                    // 当点击缩略图时，将该图片设为当前查看的大图
                    if (!isCurrentImage && pic.genImgId !== image?.genImgId) {
                      const newImage = imgList.find(item => item.genImgId === pic.genImgId) || null;
                      if (newImage) {
                        // 这里需要通过父组件传入的函数来更新当前查看的图片
                        onImageChange(newImage);
                      }
                    }
                  }}
                >
                  <Image
                    src={pic.resultPic}
                    width={isCurrentImage ? 85 : 70}
                    height={isCurrentImage ? 85 : 70}
                    alt="image"
                    className={`rounded-[4px] overflow-hidden`}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </Overlay>
  );
}
