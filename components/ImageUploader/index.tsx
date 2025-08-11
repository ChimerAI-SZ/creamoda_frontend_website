'use client';

import { useEffect, useState, memo } from 'react';
import Image from 'next/image';
import { X, Loader2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { uploadImage } from '@/lib/api';
import { cn } from '@/utils/index';
import { isValidImageUrl } from '@/utils/validation';
import { ImageSlot } from './ImageSlot';
import { useAlertStore } from '@/stores/useAlertStore';

/**
 * ImageUploader组件的属性接口
 * @interface ImageUploaderProps
 * @property {Function} onImageChange - 当图片文件变化时的回调函数
 * @property {Function} onImageUrlChange - 当图片URL变化时的回调函数
 * @property {Function} onMaskImageUrlChange - 当mask图片URL变化时的回调函数
 * @property {string} imageUrl - 当前图片的URL
 * @property {string} maskImageUrl - 当前mask图片的URL
 * @property {File | null} currentImage - 当前选择的图片文件
 * @property {string} imageType - 图片类型
 * @property {boolean} showMaskEditor - 是否显示涂鸦编辑器
 */
interface ImageUploaderProps {
  onImageChange?: (image: File | null) => void;
  onImageUrlChange: (url: string) => void;
  onMaskImageUrlChange?: (url: string, uploadedMaskUrl?: string) => void;
  imageUrl: string;
  maskImageUrl?: string;
  currentImage?: File | null;
  imageType?: string;
  showMaskEditor?: boolean; // 涂鸦编辑器
}

// 后端API前缀 - 移除@字符
const apiPrefix = 'https://imgproxy.creamoda.ai/sig';

/**
 * 图片上传组件
 * 支持拖拽上传、文件选择上传和URL输入三种方式
 * 包含图片预览、加载状态和错误处理功能
 *
 * @param {ImageUploaderProps} props - 组件属性
 * @returns {JSX.Element} 图片上传组件
 */
export function ImageUploader({
  onImageChange,
  onImageUrlChange,
  onMaskImageUrlChange,
  imageUrl,
  currentImage,
  imageType = 'Click or drag to upload',
  maskImageUrl = '',
  showMaskEditor = false
}: ImageUploaderProps) {
  const { showAlert } = useAlertStore();

  // 状态管理
  const [dragActive, setDragActive] = useState(false); // 是否处于拖拽状态
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // 预览图片URL
  const [isUploading, setIsUploading] = useState(false); // 是否正在上传
  const [newImageUrl, setNewImageUrl] = useState<string | null>(null); // 新输入的图片URL
  const [isLoadingImageUrl, setIsLoadingImageUrl] = useState(false); // 是否正在加载URL图片

  /**
   * 当imageUrl或currentImage变化时更新预览URL
   * 如果提供了imageUrl，则使用它
   * 如果提供了currentImage，则创建本地对象URL
   * 否则清除预览
   */
  useEffect(() => {
    if (imageUrl) {
      setPreviewUrl(imageUrl);
    } else if (currentImage) {
      const objectUrl = URL.createObjectURL(currentImage);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [imageUrl, currentImage]);

  /**
   * 将图片上传到服务器
   * @param {File} file - 要上传的图片文件
   */
  const uploadImageToServer = async (file: File) => {
    setIsUploading(true);

    try {
      const url = await uploadImage(file);
      // 上传成功 - 使用服务器返回的URL更新
      onImageUrlChange(url);
      // 清除文件引用，因为我们现在使用URL
      if (onImageChange) {
        onImageChange(null);
      }
    } catch (error: any) {
      showAlert({
        type: 'error',
        content: error.message || 'Failed to upload image'
      });
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * 处理拖拽事件
   * @param {React.DragEvent} e - 拖拽事件对象
   */
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  /**
   * 处理文件拖放
   * @param {React.DragEvent} e - 拖放事件对象
   */
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.includes('image/')) {
        // 首先更新本地状态以立即显示预览
        if (onImageChange) {
          onImageChange(file);
        }
        // 清除之前的图片URL
        onImageUrlChange('');
        // 然后上传到服务器
        await uploadImageToServer(file);
      }
    }
  };

  /**
   * 处理文件选择
   * @param {React.ChangeEvent<HTMLInputElement>} e - 文件选择事件对象
   */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // 首先更新本地状态以立即显示预览
      if (onImageChange) {
        onImageChange(file);
      }
      // 清除之前的图片URL
      onImageUrlChange('');
      // 然后上传到服务器
      await uploadImageToServer(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewImageUrl(e.target.value);
  };

  /**
   * 验证URL格式，转换为Base64，并测试图片是否可加载
   * @param {React.ChangeEvent<HTMLInputElement>} e - 输入变化事件对象
   */
  const handleAddImage = () => {
    if (newImageUrl?.trim()) {
      if (isValidImageUrl(newImageUrl)) {
        try {
          setIsLoadingImageUrl(true);

          // 使用UTF-8编码并转换为Base64
          // 使用TextEncoder将字符串转换为UTF-8编码的字节数组
          const encoder = new TextEncoder();
          const bytes = encoder.encode(newImageUrl);

          // 将UTF-8字节数组转换为Base64字符串
          // 这里我们需要通过一个临时字符串来处理
          let binaryString = '';
          bytes.forEach(byte => {
            binaryString += String.fromCharCode(byte);
          });

          // 将二进制字符串转换为Base64
          const base64Url = btoa(binaryString);

          // 添加API前缀并设置为图片URL
          const processedUrl = `${apiPrefix}/${base64Url}`;
          console.log('processedUrl', processedUrl);
          onImageUrlChange(processedUrl);

          // 测试图片是否能正确加载
          const img = new (window.Image as any)();
          img.onload = () => {
            setIsLoadingImageUrl(false);
          };
          img.onerror = () => {
            setIsLoadingImageUrl(false);
            showAlert({
              type: 'error',
              content: 'Unable to load the image from this URL. Please try another image URL.'
            });
            onImageUrlChange('');
          };
          img.src = processedUrl;
        } catch (error) {
          console.error('Error converting URL to base64:', error);
          showAlert({
            type: 'error',
            content: 'Failed to process the image URL. Please try a different URL.'
          });
          setIsLoadingImageUrl(false);
          onImageUrlChange('');
        }
      } else {
        // URL格式无效
        showAlert({
          type: 'error',
          content:
            'Please enter a valid image URL (must start with http:// or https:// and end with .jpg, .jpeg, .png, etc.)'
        });
        onImageUrlChange('');
      }
    } else {
      // 如果输入为空，清除图片URL
      onImageUrlChange('');
    }
  };

  /**
   * 移除当前图片
   */
  const handleRemoveImage = () => {
    if (onImageChange) {
      onImageChange(null);
    }
    onImageUrlChange('');
    if (onMaskImageUrlChange) {
      onMaskImageUrlChange('', '');
    }
  };

  return (
    <div className="space-y-2 w-full flex flex-col items-center justify-center ">
      <div
        className={cn(
          'relative p-[1px] rounded-md w-full',
          !(!(isUploading || isLoadingImageUrl) && previewUrl && showMaskEditor) &&
            'bg-gradient-to-b from-[#704DFF] via-[#599EFF] to-[#6EFABB]'
        )}
      >
        <div
          className={cn(
            'relative w-full h-[180px] rounded-[4px] transition-colors ',
            dragActive ? 'border-primary bg-[#FFE4D2]' : 'hover:bg-gray-50',
            !(!(isUploading || isLoadingImageUrl) && previewUrl && showMaskEditor) &&
              'border border-[#DCDCDC] bg-[#FAFAFA]'
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {isUploading || isLoadingImageUrl ? (
            // 加载状态
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
              <span className="text-sm text-gray-600">
                {isUploading
                  ? 'Uploading image...'
                  : isLoadingImageUrl
                  ? 'Loading image from URL...'
                  : 'Processing image...'}
              </span>
            </div>
          ) : previewUrl ? (
            showMaskEditor ? (
              // 上传后分为上下两部分，各占50%（用于有涂鸦功能的情况）
              <div className="flex flex-col w-full h-full gap-[7px]">
                {/* 上面：图片预览（50%） */}
                <div className="h-1/2 flex-1 flex items-center justify-center bg-[#EFF3F6] relative p-[1px] border border-border rounded-[18px] w-full bg-gradient-primary">
                  <div className="h-full w-full flex items-center justify-center border border-[#DCDCDC] bg-[#EFF3F6] rounded-[16px]">
                    <Image
                      src={imageUrl}
                      alt="Uploaded image"
                      fill
                      style={{ objectFit: 'contain' }}
                      onError={() => {
                        onImageUrlChange('');
                        showAlert({
                          type: 'error',
                          content:
                            'Failed to load image. The URL might be invalid or the image format is not supported.'
                        });
                      }}
                    />
                    {/* 删除按钮，点击后删除图片并恢复上传区域 */}
                    <button onClick={handleRemoveImage} className="absolute top-4 right-4" type="button">
                      <X className="h-5 w-5 text-black" />
                    </button>
                  </div>
                </div>
                {/* 下面：ImageSlot 组件（50%） */}
                <div className="flex-1 h-1/2 flex items-center justify-center bg-[#EFF3F6] rounded-[16px]">
                  <ImageSlot
                    imageUrl={imageUrl || ''}
                    maskImageUrl={maskImageUrl}
                    onImageSave={(dataUrl, uploadedMaskUrl) => {
                      // 当涂鸦保存后，将涂鸦结果作为mask图片
                      if (onMaskImageUrlChange) {
                        onMaskImageUrlChange(dataUrl, uploadedMaskUrl);
                      }
                    }}
                  />
                </div>
              </div>
            ) : (
              // 图片预览模式
              <div className="relative w-full h-full">
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <Image
                    src={previewUrl}
                    alt="Uploaded image"
                    fill
                    className="object-contain"
                    onError={() => {
                      // 图片加载错误时清除预览
                      setPreviewUrl(null);
                      onImageUrlChange('');

                      showAlert({
                        type: 'error',
                        content: 'Failed to load image. The URL might be invalid or the image format is not supported.'
                      });
                    }}
                  />
                </div>
                <button onClick={handleRemoveImage} className="absolute top-4 right-4" type="button">
                  <X className="h-5 w-5 text-black" />
                </button>
              </div>
            )
          ) : (
            // 上传模式
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
                className="absolute left-[50%] translate-x-[-50%] h-full w-full cursor-pointer flex flex-col items-center justify-center"
              >
                <div className="flex items-center justify-center h-[48px] shrink-0">
                  <Image src="/images/generate/upload_image.svg" alt="Upload" width={55} height={55} />
                </div>
                <div className="flex flex-col items-center justify-center">
                  <span className="text-sm font-normal text-[#121316] font-inter leading-5">{imageType}</span>
                  <span className="text-xs font-normal text-[#999] font-inter leading-[15px]">Format: .jpeg, .png</span>
                </div>
              </label>
            </>
          )}
        </div>
      </div>
      <div className="w-full">
        <div className="text-black text-[14px] font-medium mb-2">Or upload image from URL</div>
        <div className="flex items-center justify-center gap-4">
          <Input
            type="text"
            placeholder="Or paste image address"
            value={newImageUrl || ''}
            onChange={handleUrlChange}
            className={cn(
              'bg-white w-full h-[36px] px-[12px] text-[14px] font-normal leading-5 placeholder:text-[#d5d5d5] rounded-sm',
              'bottom-[12px]'
            )}
          />
          <Button
            variant="outline"
            type="button"
            disabled={!(isUploading || isLoadingImageUrl) && !!previewUrl}
            onClick={handleAddImage}
            className="h-[36px] px-[12px] text-[14px] font-normal leading-5 rounded-[4px] border-input"
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}

// 使用React.memo包装组件以优化性能，避免不必要的重渲染
export const MemoizedImageUploader = memo(ImageUploader, (prevProps, nextProps) => {
  return (
    prevProps.imageUrl === nextProps.imageUrl &&
    prevProps.maskImageUrl === nextProps.maskImageUrl &&
    prevProps.showMaskEditor === nextProps.showMaskEditor
  );
});
