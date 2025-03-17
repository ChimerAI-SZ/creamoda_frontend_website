'use client';

import * as React from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { X, Loader2 } from 'lucide-react';
import axios from 'axios';
import { uploadImage } from '@/lib/api';
import { showErrorDialog } from '@/utils/index';
import { isValidImageUrl } from '@/utils/validation';

interface ImageUploaderProps {
  onImageChange: (image: File | null) => void;
  onImageUrlChange: (url: string) => void;
  imageUrl: string;
  currentImage: File | null;
}

export function ImageUploader({ onImageChange, onImageUrlChange, imageUrl, currentImage }: ImageUploaderProps) {
  const [dragActive, setDragActive] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isUrlLoading, setIsUrlLoading] = React.useState(false);
  const [lastUrlLength, setLastUrlLength] = React.useState(0);
  const [isProcessingUrl, setIsProcessingUrl] = React.useState(false);

  // 使用useRef来存储上一次有效的预览URL，避免频繁更新
  const lastValidPreviewRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    // Create preview URL for the current image
    if (currentImage) {
      const url = URL.createObjectURL(currentImage);
      setPreviewUrl(url);
      lastValidPreviewRef.current = url;
      return () => URL.revokeObjectURL(url);
    } else if (imageUrl && isValidImageUrl(imageUrl) && !isProcessingUrl) {
      // 只有当imageUrl是有效的URL且与上一次不同时才更新预览
      // 且不在处理URL时才显示预览
      if (imageUrl !== lastValidPreviewRef.current) {
        setPreviewUrl(imageUrl);
        lastValidPreviewRef.current = imageUrl;
      }
    } else if (!imageUrl && previewUrl !== null) {
      // 只有当imageUrl为空且当前有预览时才清除预览
      setPreviewUrl(null);
      lastValidPreviewRef.current = null;
    }
    // 不要在依赖项中包含previewUrl，避免循环更新
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentImage, imageUrl, isProcessingUrl]);

  const uploadImageToServer = async (file: File) => {
    setIsUploading(true);

    try {
      const url = await uploadImage(file);
      // Success - update with the URL from the server
      onImageUrlChange(url);
      // Clear the file reference since we're now using the URL
      onImageChange(null);
    } catch (error) {
      console.error('Image upload error:', error);
      showErrorDialog(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  // New function to fetch and upload external images
  const uploadExternalImage = async (url: string) => {
    if (!url) return;

    // 先验证URL格式 - 确保是HTTP或HTTPS链接
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      showErrorDialog('Please enter a valid image URL. The URL must start with http:// or https://.');
      return;
    }

    // 设置处理状态，阻止显示原始URL的预览
    setIsProcessingUrl(true);
    setIsUrlLoading(true);

    try {
      // 处理URL以确保编码正确 - 仅编码尚未编码的部分
      let processedUrl = url;
      try {
        // 尝试解析URL，确保它是有效的
        new URL(processedUrl);
      } catch (e) {
        // 如果URL无效，尝试进行基本的编码修复
        processedUrl = encodeURI(processedUrl);
      }

      // 使用我们的代理接口获取图片
      const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(processedUrl)}`;

      // 从我们的代理获取图片
      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch image from URL');
      }

      // 转换为blob
      const blob = await response.blob();

      // 验证是否真的是图片 - 放宽检查条件
      // 某些有效图片的blob.type可能不正确，因为我们已经在代理中处理了内容类型
      if (!blob.type.startsWith('image/') && blob.size < 100) {
        // 如果内容类型不是图片且数据很小，可能不是有效图片
        throw new Error('The URL does not point to a valid image');
      }

      // 创建File对象
      const filename = url.split('/').pop()?.split('?')[0] || 'image.jpg'; // 移除可能的查询参数
      const fileType = blob.type || 'image/jpeg';
      const file = new File([blob], filename, { type: fileType });

      // 上传到我们的服务器
      const uploadedUrl = await uploadImage(file);

      // 更新URL
      onImageUrlChange(uploadedUrl);
    } catch (error) {
      console.error('External image processing error:', error);

      // 提供更具体的错误消息
      let errorMessage = 'Failed to process external image';

      if (error instanceof Error) {
        const errorText = error.message;

        if (errorText.includes('parse src') || errorText.includes('relative image')) {
          errorMessage = 'Invalid image URL. The URL must be an absolute URL starting with http:// or https://';
        } else if (errorText.includes('Failed to fetch')) {
          errorMessage = 'Could not access the image. The URL might be incorrect or the server is not responding.';
        } else if (errorText.includes('valid image')) {
          errorMessage = 'The provided URL does not contain a valid image. Please try a different URL.';
        }
      }

      showErrorDialog(errorMessage);

      // 清空无效URL
      onImageUrlChange('');
    } finally {
      setIsUrlLoading(false);
      // 处理完成后，允许显示预览
      setIsProcessingUrl(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.includes('image/')) {
        // First update local state to show preview immediately
        onImageChange(file);
        // Clear any previous image URL
        onImageUrlChange('');
        // Then upload to server
        await uploadImageToServer(file);
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // First update local state to show preview immediately
      onImageChange(file);
      // Clear any previous image URL
      onImageUrlChange('');
      // Then upload to server
      await uploadImageToServer(file);
    }
  };

  // 修改URL输入处理，减少不必要的状态更新
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;

    // 只有当URL真正改变时才更新状态
    if (newUrl !== imageUrl) {
      onImageUrlChange(newUrl);

      // Clear file when URL is entered
      if (newUrl && currentImage) {
        onImageChange(null);
      }

      // 检测是否是粘贴操作 - 如果URL长度突然增加很多，很可能是粘贴操作
      if (newUrl.length > 10 && lastUrlLength < 5) {
        const trimmedUrl = newUrl.trim();
        // 简化URL验证 - 只要以http开头就尝试处理
        if (trimmedUrl.startsWith('http')) {
          // 设置处理状态，阻止显示原始URL的预览
          setIsProcessingUrl(true);

          // 延迟一点执行上传，确保UI已更新
          setTimeout(() => {
            uploadExternalImage(trimmedUrl);
          }, 100);
        }
      }

      setLastUrlLength(newUrl.length);
    }
  };

  // 改进onBlur处理函数
  const handleUrlBlur = async () => {
    // 只有当有URL且不是空字符串，且不在加载状态时才检查
    if (imageUrl && imageUrl.trim() !== '' && !isUrlLoading && !isProcessingUrl) {
      const trimmedUrl = imageUrl.trim();

      // 简化验证 - 只要是http开头的URL就尝试处理
      if (trimmedUrl.startsWith('http') && trimmedUrl !== lastValidPreviewRef.current) {
        await uploadExternalImage(trimmedUrl);
      }
    }
  };

  // 修改粘贴处理函数
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');
    if (pastedText) {
      const trimmedUrl = pastedText.trim();
      // 简化验证 - 只要是http开头的URL就尝试处理
      if (trimmedUrl.startsWith('http')) {
        // 设置处理状态，阻止显示原始URL的预览
        setIsProcessingUrl(true);

        // 更新输入框中的URL
        onImageUrlChange(trimmedUrl);

        // 延迟一点执行上传，确保UI已更新
        setTimeout(() => {
          uploadExternalImage(trimmedUrl);
        }, 100);
      }
    }
  };

  const handleRemoveImage = () => {
    onImageChange(null);
    onImageUrlChange('');
  };

  return (
    <div className="space-y-2">
      <div
        className={`relative w-[302px] h-[288px] rounded-lg border border-[#DCDCDC] bg-[#FAFAFA] transition-colors ${
          dragActive ? 'border-[#FF7B0D] bg-[#FFE4D2]' : 'hover:bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {isUploading || isUrlLoading ? (
          // Loading state
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 text-[#FF7B0D] animate-spin mb-2" />
            <span className="text-sm text-gray-600">{isUploading ? 'Uploading image...' : 'Processing image...'}</span>
          </div>
        ) : previewUrl ? (
          // Image preview mode
          <div className="relative w-full h-full">
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <Image
                src={previewUrl}
                alt="Uploaded image"
                fill
                className="object-contain"
                onError={() => {
                  // 图片加载失败时清除预览
                  setPreviewUrl(null);
                  onImageUrlChange('');
                  showErrorDialog(
                    'Failed to load image. The URL might be invalid or the image format is not supported.'
                  );
                }}
              />
            </div>
            <button
              onClick={handleRemoveImage}
              className="absolute top-3 right-[13.14px] bg-white rounded-[4px] p-1 border-[0.875px] border-[#DCDCDC] hover:bg-gray-100"
              type="button"
            >
              <X className="h-4 w-4 text-[#E4E4E7]" />
            </button>
          </div>
        ) : (
          // Upload mode
          <>
            <input
              id="image-upload"
              type="file"
              className="hidden"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
            />
            <label
              htmlFor="image-upload"
              className="absolute left-[50%] translate-x-[-50%] h-[calc(100%-48px)] w-full cursor-pointer"
            >
              <div className="rounded-lg flex items-center justify-center mt-[82px]">
                <Image src="/images/operation/up.svg" alt="Upload" width={48} height={48} />
              </div>
              <div className="flex flex-col items-center justify-center mt-2">
                <span className="text-sm font-normal text-[#121316] font-inter leading-5">Upload image</span>
                <span className="text-xs font-normal text-[#999] font-inter leading-[15px]">Format: .jpeg, .png</span>
              </div>
            </label>
            <Input
              type="text"
              placeholder="Or paste image address"
              value={imageUrl}
              onChange={handleUrlChange}
              onBlur={handleUrlBlur}
              onPaste={handlePaste}
              className="absolute left-[50%] translate-x-[-50%] bottom-[12px] w-[270px] h-[36px] px-[12px] text-[14px] font-normal leading-5 placeholder:text-[#D5D5D5]"
            />
          </>
        )}
      </div>
    </div>
  );
}

// 在文件末尾，使用React.memo包装组件
export const MemoizedImageUploader = React.memo(ImageUploader);
