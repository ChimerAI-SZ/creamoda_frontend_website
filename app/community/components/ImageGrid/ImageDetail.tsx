import Image from 'next/image';
import { Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Overlay } from '@/components/ui/overlay';

import { cn, downloadImage } from '@/utils';
import type { SEO_Image_Type } from './index';
import { StyledLabel } from '@/components/StyledLabel';
import { album, community } from '@/lib/api';

interface ImageDetailProps {
  image: SEO_Image_Type | null;
  onClose: () => void;
  isOpen: boolean;
  handleActionButtonClick: (text: string, image: SEO_Image_Type) => void;
}

// 提取一个通用的按钮组件
interface ActionButtonProps {
  variant: 'primary' | 'tertiary' | 'secondary';
  text: string;
  iconName: string;
  className?: string;
  content?: React.ReactNode | string;
}

export default function ImageDetail({ image, onClose, isOpen, handleActionButtonClick }: ImageDetailProps) {
  if (!isOpen) return null;

  const ActionButton: React.FC<ActionButtonProps> = ({ variant, text, content, className, iconName }) => (
    <Button
      variant={variant}
      className={cn('px-0', className)}
      onClick={() => handleActionButtonClick(text, image as SEO_Image_Type)}
    >
      <Image
        src={`/images/album/${iconName}.svg`}
        alt={iconName}
        width={20}
        height={20}
        className="object-cover"
        priority
      />
      {(content ?? text) && <span>{content ?? text}</span>}
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
                style={{ backgroundImage: `url(${image.originalImgUrl})` }}
              />
              {/* 保持原图显示 */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <Image
                  src={image.originalImgUrl || '/placeholder.svg'}
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
                  key={image.genImgId || image.originalImgUrl}
                />
              </div>
            </div>
          )}
          {/* 其他详情内容 */}
        </div>
        {image && (
          <div className="relative bg-white overflow-hidden rounded-tr-[20px] rounded-br-[20px] h-full w-[394px]">
            <div className="overflow-y-auto pb-[calc(32px+80px)] h-full">
              <div className=" flex flex-col gap-4">
                <div className="pt-6 sticky top-0 bg-white shadow-[0px_8px_40px_0px_rgba(10,21,50,0.06)] pb-3 px-6">
                  <div className="flex items-center justify-center gap-3 w-full h-[40px] mb-[10px]">
                    <div>
                      <Image
                        src={image.creator.headPic || '/images/defaultAvatar.svg'}
                        alt="用户头像"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="text-[rgba(10,21,50,.80)] text-sm font-semibold">{image.creator.name}</div>
                      <div className="text-[rgba(10,21,50,.60)] text-sm font-semibold">{image.creator.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center flex-wrap justify-start gap-[6px] w-full cursor-default">
                    {image.genType.map(type => (
                      <div
                        key={type}
                        className="shrink-0 h-24px py-[2px] px-[6px] text-[#46B2FF] max-w-[150px] text-center truncate text-sm font-medium"
                      >
                        # {type}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="px-6">
                  <div className="flex items-center justify-between gap-[6px] w-full">
                    <StyledLabel content="Prompt" />
                    <Copy
                      className="w-4 h-4 cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(image.prompt).then(
                          () => {
                            // todo 成功提示
                            console.log('Prompt copied to clipboard');
                          },
                          err => {
                            console.error('Could not copy text: ', err);
                          }
                        );
                      }}
                    />
                  </div>
                  <div className="relative p-[1px] border border-border rounded-[18px] w-full bg-gradient-primary">
                    <div className="bg-[#EFF3F6] text-gray-60 p-3 w-full h-full text-sm rounded-[16px] font-normal">
                      {image.prompt}
                    </div>
                  </div>
                </div>
                {image.trendStyles.length > 0 && (
                  <div className="px-6">
                    <StyledLabel content="Material" />
                    <div className="flex flex-wrap gap-2">
                      {image.trendStyles.map((trend: string) => (
                        <Tag key={trend} text={trend} />
                      ))}
                    </div>
                  </div>
                )}
                {image.materials.length > 0 && (
                  <div className="px-6">
                    <StyledLabel content="Material" />
                    <div className="flex flex-wrap gap-2">
                      {image.materials.map((material: string) => (
                        <Tag key={material} text={material} />
                      ))}
                    </div>
                  </div>
                )}
                <div className="px-6">
                  <StyledLabel content="Al design description" />
                  <div>{image.description}</div>
                </div>
                <div className="px-6">
                  <div className="text-gray-20 text-center text-xs font-medium">
                    The creator has full license for this design.
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0  flex w-full items-center justify-start gap-2 px-4 py-5 bg-white shadow-[0px_8px_40px_0px_rgba(10,21,50,0.06)]">
              <Button
                variant="tertiary"
                className={cn('px-0', 'flex-grow h-[40px]')}
                onClick={() =>
                  album.collectImage({ genImgId: image?.genImgId ?? 0, action: image?.isCollected ? 2 : 1 })
                }
              >
                <Image
                  src={`/images/album/${image?.isCollected ? 'added_to_album' : 'add_to_album_black'}.svg`}
                  alt={image?.isCollected ? 'added_to_album' : 'add_to_album_black'}
                  width={20}
                  height={20}
                  className="object-cover"
                  priority
                />
                <span>{image?.isCollected ? 'Remove from album' : 'Add to album'}</span>
              </Button>
              <Button
                variant="tertiary"
                className={cn('px-0', 'flex-grow h-[40px]')}
                onClick={() => {
                  if (image.isLike) {
                    community.cancelLikeImage(image.genImgId);
                  } else {
                    community.likeImage(image.genImgId);
                  }
                }}
              >
                <Image
                  src={`/images/album/${image.isLike ? 'cancel_like' : 'like_black'}.svg`}
                  alt={image.isLike ? 'cancel_like' : 'like_black'}
                  width={20}
                  height={20}
                  className="object-cover"
                  priority
                />
                <span>Like({image.likeCount})</span>
              </Button>
              <Button
                variant={'tertiary'}
                className={cn('px-0', 'w-[40px] h-[40px] rounded-full flex items-center justify-center')}
                onClick={() => {
                  downloadImage(image?.originalImgUrl || '', 'image.jpg');
                }}
              >
                <Image
                  src={`/images/album/download_black.svg`}
                  alt="download_black"
                  width={20}
                  height={20}
                  className="object-cover"
                  priority
                />
              </Button>
            </div>
          </div>
        )}
      </div>
    </Overlay>
  );
}

function Tag({ text }: { text: string }) {
  return (
    <div className="gap-4 p-[2px_10px] text-gray-60 text-sm font-medium rounded-[8px] border border-primary max-w-[150px] truncate">
      {text}
    </div>
  );
}
