'use client';

import { useEffect } from 'react';
import { Inter } from 'next/font/google';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import TextToImageContent from './components/TextToImageContent';
import ImageToImageContent from './components/ImageToImageContent/index';

import { useAlertStore } from '@/stores/useAlertStore';

const inter = Inter({ subsets: ['latin'] });

import {
  textToImageGenerate,
  getModelSizeList,
  getVariationTypeList,
  copyStyleGenerate,
  changeClothesGenerate,
  uploadImage,
  copyFabricGenerate,
  sketchToDesign,
  mixImage,
  changeFabric,
  changePrinting,
  changePattern,
  styleFusion
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
  format: '1:1' | '2:3' | '3:4' | '9:16';
}

// Image to Image form data interface
export interface ImageUploadFormData {
  image: File | null;
  imageUrl: string;
  variationType: string;
  description: string;
  referLevel: number;
  referenceImage: File | null;
  referenceImageUrl: string;
  fabricPicUrl: string;
  maskPicUrl: string;
}

// slider 的值和后端传的值的映射关系
const levelMap = new Map([
  [0, 1],
  [50, 2],
  [100, 3]
]);

export function Sidebar() {
  const { setModelSizes } = useModelStore();
  const { setGenerating } = useGenerationStore();

  const { showAlert } = useAlertStore();

  // 文生图 / 图生图 提交事件
  const handleSubmit = async (data: OutfitFormData) => {
    try {
      const response = await textToImageGenerate(data);
      if (response.code === 0) {
        // 触发 iamgeGrid 里的提交回调时间（刷新生图历史图片）
        eventBus.emit('sidebar:submit-success', void 0);
        // 修改getnerating状态
        setGenerating(true);
      } else {
        showAlert({
          type: 'error',
          content: response.msg || 'Failed to generate image'
        });

        setGenerating(false);
      }
    } catch (error) {
      showAlert({
        type: 'error',
        content: (error as Error).message || 'An unexpected error occurred'
      });
      // Let the TextToImageContent component handle setting generating to false
      throw error;
    }
  };

  const handleImageSubmit = async (data: ImageUploadFormData) => {
    try {
      // Set generating state to indicate processing
      setGenerating(true);

      // Validate image input (either URL or uploaded image)
      if (!data.imageUrl && !data.image) {
        showAlert({
          type: 'error',
          content: 'Please upload an image or provide an image URL'
        });
        setGenerating(false);
        return;
      }

      // Validate image URL if provided
      if (data.imageUrl && !data.image && !isValidImageUrl(data.imageUrl)) {
        showAlert({
          type: 'error',
          content: 'Please provide a valid image URL before generating'
        });
        setGenerating(false);
        return;
      }

      // Validation based on variation type
      switch (data.variationType) {
        case '1':
        case '2':
        case '3':
        case '4':
          // These types require description
          if (!data.description.trim()) {
            showAlert({
              type: 'error',
              content: 'Please provide a description'
            });
            setGenerating(false);
            return;
          }
          break;

        case '5':
          // Type 5 requires description and reference image
          if (!data.description.trim()) {
            showAlert({
              type: 'error',
              content: 'Please provide a description'
            });
            setGenerating(false);
            return;
          }
          if (!data.referenceImageUrl && !data.referenceImage) {
            showAlert({
              type: 'error',
              content: 'Please upload a reference image'
            });
            setGenerating(false);
            return;
          }
          break;

        case '6':
        case '7':
        case '9':
          // Types 6 and 8 only require main image, no description needed
          break;

        case '8':
          // Type 7 requires fabric image
          if (!data.fabricPicUrl) {
            showAlert({
              type: 'error',
              content: 'Please upload a fabric image'
            });
            setGenerating(false);
            return;
          }
          break;

        case '10':
          // 风格融合需要两张图片
          if (!data.referenceImageUrl && !data.referenceImage) {
            showAlert({
              type: 'error',
              content: 'Please upload a reference image'
            });
            setGenerating(false);
            return;
          }
          break;

        default:
          // For unknown types, require description
          if (!data.description.trim()) {
            showAlert({
              type: 'error',
              content: 'Please provide a description'
            });
            setGenerating(false);
            return;
          }
          break;
      }

      // If has local image but no URL, upload the image first
      let finalImageUrl = data.imageUrl;
      if (data.image && !data.imageUrl) {
        try {
          finalImageUrl = await uploadImage(data.image);
        } catch (error) {
          console.error('Error uploading image:', error);
          showAlert({
            type: 'error',
            content: 'Failed to upload image. Please try again.'
          });
          setGenerating(false);
          return;
        }
      }

      // Validate final image URL
      if (!isValidImageUrl(finalImageUrl)) {
        showAlert({
          type: 'error',
          content: 'The image URL is invalid. Please upload a valid image.'
        });
        setGenerating(false);
        return;
      }

      // Handle reference image upload for type 5 if needed
      let finalReferenceImageUrl = data.referenceImageUrl;
      if (data.variationType === '5' && data.referenceImage && !data.referenceImageUrl) {
        try {
          finalReferenceImageUrl = await uploadImage(data.referenceImage);
        } catch (error) {
          console.error('Error uploading reference image:', error);
          showAlert({
            type: 'error',
            content: 'Failed to upload reference image. Please try again.'
          });
          setGenerating(false);
          return;
        }
      }

      // Call appropriate API based on variation type
      let response;
      if (data.variationType === '1') {
        // Call copy style API
        response = await copyStyleGenerate(finalImageUrl, data.description, levelMap.get(data.referLevel) || 1);
      } else if (data.variationType === '2') {
        // Call change clothes API
        response = await changeClothesGenerate(finalImageUrl, data.description);
      } else if (data.variationType === '3') {
        // Call copy fabric API
        response = await copyFabricGenerate(finalImageUrl, data.description);
      } else if (data.variationType === '4') {
        // Call copy fabric API
        response = await sketchToDesign(finalImageUrl, data.description, levelMap.get(data.referLevel) || 1);
      } else if (data.variationType === '5') {
        // Call mix image API
        response = await mixImage(
          finalImageUrl,
          data.description,
          finalReferenceImageUrl,
          levelMap.get(data.referLevel) || 1
        );
      } else if (data.variationType === '7') {
        // Call change pattern API
        response = await changePattern(finalImageUrl);
      } else if (data.variationType === '8') {
        // Call change fabric API
        response = await changeFabric(finalImageUrl, data.fabricPicUrl, data.maskPicUrl);
      } else if (data.variationType === '9') {
        // Call change printing API
        response = await changePrinting(finalImageUrl);
      } else if (data.variationType === '10') {
        // Call style fusion API
        response = await styleFusion(finalImageUrl, finalReferenceImageUrl);
      } else {
        // Default to change clothes API if no type selected
        response = await changeClothesGenerate(finalImageUrl, data.description);
      }

      // Process response
      if (response.code === 0) {
        // Trigger refresh of image grid
        eventBus.emit('sidebar:submit-success', void 0);
      } else {
        showAlert({
          type: 'error',
          content: response.msg || 'Failed to generate image'
        });
        setGenerating(false);
      }
    } catch (error) {
      console.error('Error in image-to-image generation:', error);
      showAlert({
        type: 'error',
        content: (error as Error).message || 'An unexpected error occurred'
      });
      // Let the ImageToImageContent component handle setting generating to false
      throw error;
    }
  };

  useEffect(() => {
    // 使用 Promise.all 并行获取数据
    const fetchData = async () => {
      try {
        // 并行请求两个API
        const [modelSizes] = await Promise.all([getModelSizeList()]);

        // 设置数据
        setModelSizes(modelSizes || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        showAlert({
          type: 'error',
          content: 'Something went wrong. Please try again later or contact support if the issue persists'
        });
      }
    };

    fetchData();
  }, [setModelSizes]);

  return (
    <div
      className={`w-[378px] h-[calc(100vh-110px)] overflow-y-auto py-4 rounded-[20px] flex-shrink-0 bg-white shadow-card-shadow flex flex-col z-0 ${inter.className}`}
    >
      <div className="flex justify-center items-center w-full h-full gap-[46px]">
        <Tabs defaultValue="text" className="h-full w-full flex flex-col">
          <div className="flex items-center justify-center">
            <TabsList>
              <TabsTrigger value="text">Text to image</TabsTrigger>
              <TabsTrigger value="image">Image to image</TabsTrigger>
            </TabsList>
          </div>
          <div className="flex-1 overflow-hidden pt-4 ">
            <TabsContent value="text" className="h-full">
              <div className={'block h-full'}>
                <TextToImageContent onSubmit={handleSubmit} />
              </div>
            </TabsContent>
            <TabsContent value="image" className="h-full">
              <div className={'block  h-full overflow-y-auto'}>
                <ImageToImageContent onSubmit={handleImageSubmit} />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
