import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Overlay } from '@/components/ui/overlay';

import { cn } from '@/utils';
import type { ImageItem } from './index';

interface ImageDetailProps {
  image: ImageItem | null;
  onClose: () => void;
  isOpen: boolean;
  imgList: ImageItem[];
  onImageChange: (image: ImageItem | null) => void;
  handleActionButtonClick: (text: string, image: ImageItem) => void;
}

// 提取一个通用的按钮组件
interface ActionButtonProps {
  variant: 'primary' | 'tertiary' | 'secondary';
  text: string;
  iconName: string;
  className?: string;
  content?: React.ReactNode | string;
}

export default function ImageDetail({
  image,
  onClose,
  isOpen,
  imgList,
  onImageChange,
  handleActionButtonClick
}: ImageDetailProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  const ActionButton: React.FC<ActionButtonProps> = ({ variant, text, content, className, iconName }) => (
    <Button
      variant={variant}
      className={cn('w-[192px] mb-3 px-0', className)}
      onClick={() => handleActionButtonClick(text, image as ImageItem)}
    >
      <Image
        src={`/images/album/${iconName}.svg`}
        alt={iconName}
        width={20}
        height={20}
        className="object-cover"
        priority
      />
      <span>{content ?? text}</span>
    </Button>
  );

  return (
    <Overlay onClick={onClose}>
      <div
        className="relative flex items-center justify-center max-h-[75vh] h-[680px] "
        onClick={e => e.stopPropagation()}
      >
        <div className="relative aspect-[3/4] h-full w-auto bg-white rounded-tl-[20px] rounded-bl-[20px] overflow-hidden shadow-card-shadow">
          {/* 图片详情内容 */}
          {image && (
            <div className="relative w-full h-full shadow-[0_0.11rem_0.89rem_0_rgba(0,0,0,0.07)] z-[1] transition-transform duration-500">
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
                  unoptimized={true}
                  // 添加 referrerPolicy 以优化跨域缓存
                  referrerPolicy="no-referrer"
                  // 使用 crossOrigin 属性以确保正确缓存
                  crossOrigin="anonymous"
                  // 添加与 ImageCard 相同的 key
                  key={image.genImgId || image.resultPic}
                />
              </div>
            </div>
          )}
          {/* 其他详情内容 */}
        </div>
        {image && (
          <div className="bg-white overflow-hidden rounded-tr-[20px] rounded-br-[20px] px-6 h-full w-[240px] flex flex-col gap-6">
            <div className="text-gray-60 text-sm font-medium h-[68px] flex items-center justify-center border-b border-[#EFF3F6]">
              Quick action
            </div>
            <div>
            <ActionButton variant="tertiary" text="Download" iconName="download_black" />
            <ActionButton
                variant="tertiary"
                text={image?.isCollected ? 'Remove from favorites' : 'Add to favorites'}
                iconName={image?.isCollected ? 'added_to_album' : 'add_to_album_black'}
              />
               <ActionButton variant="tertiary" text="Delete" iconName="delete_black" />
              {['/', '/virtual-try-on', '/magic-kit'].includes(pathname) && (
                <>
                  {pathname !== '/virtual-try-on' && (
                    <ActionButton variant="primary" text="Virtual Try-On" iconName="virtual_try_on" />
                  )}
                  {pathname !== '/magic-kit' && (
                    <ActionButton
                      variant={pathname === '/virtual-try-on' ? 'primary' : 'secondary'}
                      text="Magic Kit"
                      iconName="magic_kit"
                    />
                  )}
                </>
              )}
              {/* <ActionButton variant="tertiary" text="Share" iconName="share" /> */}
            </div>
          </div>
        )}

        {/* <div className="flex items-center justify-center gap-[20px] absolute left-[50%] translate-x-[-50%] bottom-[-144px] h-[112px] rounded-[4px] ">
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
        </div> */}
      </div>
    </Overlay>
  );
}
