'use client';

import * as React from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import ImageDoodleEditor from './ImageDoodleEditor';

interface ImageSlotProps {
  imageUrl?: string;
  maskImageUrl?: string;
  placeholder?: string;
  onClick?: () => void;
  onImageSave?: (dataUrl: string, uploadedMaskUrl?: string) => void;
  width?: number;
  height?: number;
}

export const ImageSlot: React.FC<ImageSlotProps> = ({
  imageUrl,
  maskImageUrl,
  placeholder = '/images/operation/up.svg',
  onClick,
  onImageSave,
  width = 360,
  height = 480
}) => {
  const [open, setOpen] = React.useState(false);
  const [currentImage, setCurrentImage] = React.useState<string | undefined>(imageUrl);

  // 保存涂鸦状态
  const [savedStrokes, setSavedStrokes] = React.useState<
    {
      points: { x: number; y: number }[];
      tool: string;
      color: string;
    }[]
  >([]);

  // 保存最终生成的涂鸦遮罩图像
  const [maskImage, setMaskImage] = React.useState<string | null>(maskImageUrl || null);

  // 保存上传到服务器的遮罩图像URL
  const [uploadedMaskUrl, setUploadedMaskUrl] = React.useState<string | undefined>(undefined);

  // 当imageUrl变化时更新currentImage
  React.useEffect(() => {
    setCurrentImage(imageUrl);
  }, [imageUrl]);

  // 当maskImageUrl变化时更新maskImage
  React.useEffect(() => {
    if (maskImageUrl) {
      setMaskImage(maskImageUrl);
    }
  }, [maskImageUrl]);

  const handleSaveDoodle = (dataUrl: string, strokes: any[], newUploadedMaskUrl?: string) => {
    // 更新本地图片状态
    setCurrentImage(imageUrl); // 保持原始图片不变

    // 保存涂鸦状态
    setSavedStrokes(strokes);

    // 保存遮罩图像
    setMaskImage(dataUrl);

    // 保存上传到服务器的遮罩图像URL
    if (newUploadedMaskUrl) {
      setUploadedMaskUrl(newUploadedMaskUrl);
    }

    if (onImageSave) {
      onImageSave(dataUrl, newUploadedMaskUrl);
    }

    // 保存后自动关闭弹窗
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="h-full flex-1 flex items-center justify-center bg-[#EFF3F6] relative p-[1px] border border-border rounded-[18px] w-full bg-gradient-primary">
          <button
            className="w-full h-full flex flex-col items-center justify-center rounded-[16px] bg-[#EFF3F6] cursor-pointer  transition"
            onClick={onClick}
            type="button"
          >
            <div className="w-full h-full flex flex-col">
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                {maskImage ? (
                  <Image src={maskImage} alt="Mask Image" fill className="object-contain" />
                ) : (
                  <div className="text-center p-4 text-black font-inter text-sm font-normal">
                    Select the region to be modified
                  </div>
                )}
              </div>
            </div>
          </button>
        </div>
      </DialogTrigger>
      <DialogContent className="flex items-center justify-center max-w-[90vw] min-w-[1040px] w-[1040px] max-h-[90vh]">
        <DialogTitle className="sr-only"></DialogTitle>
        {/* 直接显示涂鸦编辑器 */}
        <div className="w-full h-full">
          <ImageDoodleEditor
            imageUrl={currentImage || placeholder}
            maskImageUrl={maskImage || undefined}
            onSave={handleSaveDoodle}
            initialStrokes={savedStrokes}
            width={width}
            height={height}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
