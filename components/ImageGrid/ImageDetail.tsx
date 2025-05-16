import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Overlay } from '@/components/ui/overlay';

import { downloadImage } from '@/utils';
import { collectImage } from '@/lib/api/album';

import type { ImageItem } from './index';

interface ImageDetailProps {
  image: ImageItem | null;
  onClose: () => void;
  isOpen: boolean;
  imgList: ImageItem[];
  onImageChange: (image: ImageItem | null) => void;
}

// 提取一个通用的按钮组件
interface ActionButtonProps {
  variant: 'default' | 'secondary';
  text: string;
}

export default function ImageDetail({ image, onClose, isOpen, imgList, onImageChange }: ImageDetailProps) {
  const pathname = usePathname();
  const router = useRouter();

  if (!isOpen) return null;

  console.log(pathname, image, 'pathname');

  const handleActionButtonClick = (text: string) => {
    console.log(text, 'text');
    if (text === 'Download') {
      downloadImage(image?.resultPic ?? '', 'image.jpg');
    } else if (text === 'Delete') {
      console.log('delete');
    } else if (text === 'Remove from album') {
      console.log('remove from album');
      collectImage({ genImgId: image?.genImgId ?? 0, action: 2 });
    } else if (text === 'Add to album') {
      collectImage({ genImgId: image?.genImgId ?? 0, action: 1 });
    } else if (text === 'Magic Kit') {
      router.push('/magic-kit');
    } else if (text === 'Virtual Try-On') {
      router.push('/');
    }
  };

  const ActionButton: React.FC<ActionButtonProps> = ({ variant, text }) => (
    <Button variant={variant} className="w-full mb-3 text-[#fff]" onClick={() => handleActionButtonClick(text)}>
      <Image src="/images/sparkles.svg" alt="sparkles" width={20} height={20} className="object-cover" priority />
      <span>{text}</span>
    </Button>
  );

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
          <div className="w-[252px] bg-white rounded-[4px] overflow-hidden absolute right-[-268px] bottom-0 p-4">
            <div className="text-[#121316] font-inter text-base font-medium leading-6 mb-4">Quick action</div>
            <div>
              {['/', '/virtual-try-on', '/magic-kit'].includes(pathname) && (
                <>
                  {pathname !== '/magic-kit' && <ActionButton variant="default" text="Magic Kit" />}
                  {pathname !== '/virtual-try-on' && (
                    <ActionButton variant={pathname === '/' ? 'secondary' : 'default'} text="Virtual Try-On" />
                  )}
                </>
              )}
              <ActionButton variant="secondary" text={image?.isCollected ? 'Remove from album' : 'Add to album'} />
              <ActionButton variant="secondary" text="Download" />
              <ActionButton variant="secondary" text="Delete" />
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
