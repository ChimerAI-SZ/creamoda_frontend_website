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
  console.log('imageUrl2222', imageUrl);
  console.log('maskImageUrl', maskImageUrl);
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
        <button
          className="w-full h-full flex flex-col items-center justify-center border border-dashed border-gray-300 rounded cursor-pointer bg-white hover:bg-gray-50 transition"
          onClick={onClick}
          type="button"
        >
          <div className="w-full h-full flex flex-col">
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              <Image src={maskImage || placeholder} alt="Mask Image" fill className="object-contain" />
            </div>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="flex items-center justify-center max-w-[90vw] max-h-[90vh]">
        <DialogTitle className="sr-only">图像编辑器</DialogTitle>
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
