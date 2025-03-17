'use client';

import { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';
import { showErrorDialog } from '@/utils/index';

import { ToggleTag } from './components/ToggleTag';
import TextToImageContent from './components/TextToImageContent';
import ImageToImageContent from './components/ImageToImageContent/index';
const inter = Inter({ subsets: ['latin'] });

import {
  textToImageGenerate,
  getModelSizeList,
  getVariationTypeList,
  copyStyleGenerate,
  changeClothesGenerate,
  uploadImage
} from '@/lib/api';
import { useModelStore } from '@/stores/useModelStore';
import { useGenerationStore } from '@/stores/useGenerationStore';
import { eventBus } from '@/utils/events';
import { isValidImageUrl } from '@/utils/validation';

export interface OutfitFormData {
  prompt: string;
  gender: 1 | 2;
  age: string;
  country: string;
  modelSize: number;
  withHumanModel: 1 | 0;
}

// Image to Image form data interface
export interface ImageUploadFormData {
  image: File | null;
  imageUrl: string;
  variationType: string;
  description: string;
  fidelity: number;
}

export function Sidebar() {
  const [activeTag, setActiveTag] = useState<'text' | 'image'>('text');
  const { setModelSizes, setVariationTypes } = useModelStore();
  const { setGenerating } = useGenerationStore();

  // 文生图 / 图生图 提交事件
  const handleSubmit = (data: OutfitFormData) => {
    textToImageGenerate(data)
      .then(data => {
        // 触发 iamgeGrid 里的提交回调时间（刷新生图历史图片）
        eventBus.emit('sidebar:submit-success', void 0);
        // 修改getnerating状态
        setGenerating(true);
      })
      .catch(error => {
        showErrorDialog(error.message || 'Failed to generate image');
        // 若生成失败放开拦截
        setGenerating(false);
      });
  };

  const handleImageSubmit = async (data: ImageUploadFormData) => {
    try {
      // Set generating state to indicate processing
      setGenerating(true);

      // Validate image input (either URL or uploaded image)
      if (!data.imageUrl && !data.image) {
        showErrorDialog('Please upload an image or provide an image URL');
        setGenerating(false);
        return;
      }

      // Validate image URL if provided
      if (data.imageUrl && !data.image && !isValidImageUrl(data.imageUrl)) {
        showErrorDialog('Please provide a valid image URL before generating');
        setGenerating(false);
        return;
      }

      // Validate description
      if (!data.description.trim()) {
        showErrorDialog('Please provide a description');
        setGenerating(false);
        return;
      }

      // If has local image but no URL, upload the image first
      let finalImageUrl = data.imageUrl;
      if (data.image && !data.imageUrl) {
        try {
          finalImageUrl = await uploadImage(data.image);
        } catch (error) {
          console.error('Error uploading image:', error);
          showErrorDialog('Failed to upload image. Please try again.');
          setGenerating(false);
          return;
        }
      }

      // Validate final image URL
      if (!isValidImageUrl(finalImageUrl)) {
        showErrorDialog('The image URL is invalid. Please upload a valid image.');
        setGenerating(false);
        return;
      }

      // Call appropriate API based on variation type
      let response;
      if (data.variationType === '1') {
        // Convert fidelity from percentage to decimal (0-100 -> 0.0-1.0)
        const fidelityDecimal = data.fidelity / 100;
        // Call copy style API
        response = await copyStyleGenerate(finalImageUrl, data.description, fidelityDecimal);
      } else if (data.variationType === '2') {
        // Call change clothes API
        response = await changeClothesGenerate(finalImageUrl, data.description);
      } else {
        // Default to change clothes API if no type selected
        response = await changeClothesGenerate(finalImageUrl, data.description);
      }

      // Process response
      if (response.code === 0) {
        // Trigger refresh of image grid
        eventBus.emit('sidebar:submit-success', void 0);
      } else {
        showErrorDialog(response.msg || 'Failed to generate image');
        setGenerating(false);
      }
    } catch (error) {
      console.error('Error in image-to-image generation:', error);
      showErrorDialog((error as Error).message || 'An unexpected error occurred');
      // Let the ImageToImageContent component handle setting generating to false
      throw error;
    }
  };

  useEffect(() => {
    // 使用 Promise.all 并行获取数据
    const fetchData = async () => {
      try {
        // 并行请求两个API
        const [modelSizes, variationTypes] = await Promise.all([getModelSizeList(), getVariationTypeList()]);

        // 设置数据
        setModelSizes(modelSizes || []);
        setVariationTypes(variationTypes || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        showErrorDialog('Something went wrong. Please try again later or contact support if the issue persists');
      }
    };

    fetchData();
  }, [setModelSizes, setVariationTypes]);

  return (
    <div
      className={`w-[334px] h-[calc(100vh-64px)] flex-shrink-0 bg-white border-r box-content border-gray-200 flex flex-col z-0 ${inter.className}`}
    >
      <div className="flex justify-center items-center w-full px-3 border-b border-[#DCDCDC] gap-[46px]">
        <ToggleTag label="Text to image" isActive={activeTag === 'text'} onClick={() => setActiveTag('text')} />
        <ToggleTag label="Image to image" isActive={activeTag === 'image'} onClick={() => setActiveTag('image')} />
      </div>
      <div className="flex-1 overflow-hidden pt-4 ">
        <div className={activeTag === 'text' ? 'block h-full' : 'hidden'}>
          <TextToImageContent onSubmit={handleSubmit} />
        </div>
        <div className={activeTag === 'image' ? 'block  h-full overflow-x-hidden' : 'hidden'}>
          <ImageToImageContent onSubmit={handleImageSubmit} />
        </div>
      </div>
    </div>
  );
}
