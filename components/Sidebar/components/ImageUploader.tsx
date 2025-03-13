'use client';

import * as React from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { X, Loader2 } from 'lucide-react';
import axios from 'axios';
import { uploadImage } from '@/lib/api';

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
  const [uploadError, setUploadError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Create preview URL for the current image
    if (currentImage) {
      const url = URL.createObjectURL(currentImage);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (imageUrl) {
      setPreviewUrl(imageUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [currentImage, imageUrl]);

  const uploadImageToServer = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const url = await uploadImage(file);
      // Success - update with the URL from the server
      onImageUrlChange(url);
      // Clear the file reference since we're now using the URL
      onImageChange(null);
    } catch (error) {
      console.error('Image upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload image');
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

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onImageUrlChange(e.target.value);
    // Clear file when URL is entered
    if (e.target.value) {
      onImageChange(null);
    }
  };

  const handleRemoveImage = () => {
    onImageChange(null);
    onImageUrlChange('');
    setUploadError(null);
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
        {isUploading ? (
          // Loading state
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 text-[#FF7B0D] animate-spin mb-2" />
            <span className="text-sm text-gray-600">Uploading image...</span>
          </div>
        ) : previewUrl ? (
          // Image preview mode
          <div className="relative w-full h-full">
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <Image src={previewUrl} alt="Uploaded image" fill className="object-contain" />
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
              className="absolute left-[50%] translate-x-[-50%] bottom-[12px] w-[270px] h-[36px] px-[12px] text-[14px] font-normal leading-5 placeholder:text-[#D5D5D5]"
            />
          </>
        )}

        {/* {uploadError && (
          <div className="absolute bottom-[50px] left-0 right-0 text-center">
            <span className="text-xs text-red-500">{uploadError}</span>
          </div>
        )} */}
      </div>
    </div>
  );
}
