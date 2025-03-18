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
  const [newImageUrl, setNewImageUrl] = React.useState<string | null>(null);
  const [isLoadingImageUrl, setIsLoadingImageUrl] = React.useState(false);

  // Define prefix for backend API - remove the @ character
  const apiPrefix = 'https://imgproxy.creamoda.ai/sig';

  // Effect to update the preview URL whenever imageUrl changes
  React.useEffect(() => {
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

  // Handle URL input
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawUrl = e.target.value;
    setNewImageUrl(rawUrl);

    if (rawUrl.trim()) {
      if (isValidImageUrl(rawUrl)) {
        try {
          setIsLoadingImageUrl(true);

          // 使用UTF-8编码并转换为Base64
          // 使用TextEncoder将字符串转换为UTF-8编码的字节数组
          const encoder = new TextEncoder();
          const bytes = encoder.encode(rawUrl);

          // 将UTF-8字节数组转换为Base64字符串
          // 这里我们需要通过一个临时字符串来处理
          let binaryString = '';
          bytes.forEach(byte => {
            binaryString += String.fromCharCode(byte);
          });

          // 将二进制字符串转换为Base64
          const base64Url = btoa(binaryString);

          // Prepend the API prefix and set as the image URL
          const processedUrl = `${apiPrefix}/${base64Url}`;
          console.log('processedUrl', processedUrl);
          onImageUrlChange(processedUrl);

          // Test if the image loads properly
          const img = new (window.Image as any)();
          img.onload = () => {
            setIsLoadingImageUrl(false);
          };
          img.onerror = () => {
            setIsLoadingImageUrl(false);
            showErrorDialog('Unable to load the image from this URL. Please try another image URL.');
            onImageUrlChange('');
          };
          img.src = processedUrl;
        } catch (error) {
          console.error('Error converting URL to base64:', error);
          showErrorDialog('Failed to process the image URL. Please try a different URL.');
          setIsLoadingImageUrl(false);
          onImageUrlChange('');
        }
      } else {
        // URL doesn't look valid
        showErrorDialog(
          'Please enter a valid image URL (must start with http:// or https:// and end with .jpg, .jpeg, .png, etc.)'
        );
        onImageUrlChange('');
      }
    } else {
      // Clear the image URL if input is empty
      onImageUrlChange('');
    }
  };

  const handleRemoveImage = () => {
    onImageChange(null);
    onImageUrlChange('');
  };

  return (
    <div className="space-y-2">
      <div
        className={`relative w-[302px] h-[288px] rounded-[4px] border border-[#DCDCDC] bg-[#FAFAFA] transition-colors ${
          dragActive ? 'border-[#FF7B0D] bg-[#FFE4D2]' : 'hover:bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {isUploading || isLoadingImageUrl ? (
          // Loading state
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 text-[#FF7B0D] animate-spin mb-2" />
            <span className="text-sm text-gray-600">
              {isUploading
                ? 'Uploading image...'
                : isLoadingImageUrl
                ? 'Loading image from URL...'
                : 'Processing image...'}
            </span>
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
                  // Clear preview on image load error
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
              <div className="flex items-center justify-center mt-[82px] h-[48px] shrink-0">
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
              value={newImageUrl || ''}
              onChange={handleUrlChange}
              className="bg-white absolute left-[50%] translate-x-[-50%] bottom-[12px] w-[270px] h-[36px] px-[12px] text-[14px] font-normal leading-5 placeholder:text-[#D5D5D5]"
            />
          </>
        )}
      </div>
    </div>
  );
}

// 在文件末尾，使用React.memo包装组件
export const MemoizedImageUploader = React.memo(ImageUploader);
