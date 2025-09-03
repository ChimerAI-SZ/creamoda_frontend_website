'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
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
  styleFusion,
  varyStyleImage
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
  referenceImage: File | null;
  referenceImageUrl: string;
  fabricPicUrl: string;
  maskPicUrl: string;
  styleStrengthLevel: string;
}



export function Sidebar({ initialPrompt }: { initialPrompt?: string }) {
  const { setModelSizes } = useModelStore();
  const { setGenerating } = useGenerationStore();
  const { showAlert } = useAlertStore();
  const searchParams = useSearchParams();
  
  // Tab 状态管理
  const [activeTab, setActiveTab] = useState('text');

  // 处理URL参数来设置默认Tab
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'image-to-image') {
      setActiveTab('image');
    } else if (tab === 'text-to-image') {
      setActiveTab('text');
    }
  }, [searchParams]);

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
          // Change fabric requires both fabric image and a saved mask URL
          if (!data.fabricPicUrl) {
            showAlert({
              type: 'error',
              content: 'Please upload a fabric image'
            });
            setGenerating(false);
            return;
          }
          // Ensure the user has saved the mask (we only store URL after successful upload)
          if (!data.maskPicUrl || data.maskPicUrl.trim() === '') {
            showAlert({
              type: 'error',
              content:
                'Please save the mask area first. Click on the mask editor, draw the area to change, then press Confirm to upload the mask.'
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

        case '11':
          // Vary style 需要参考图片
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

      // Handle reference image upload for types that need it
      let finalReferenceImageUrl = data.referenceImageUrl;
      if ((data.variationType === '5' || data.variationType === '10' || data.variationType === '11') && data.referenceImage && !data.referenceImageUrl) {
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
        response = await copyStyleGenerate(finalImageUrl, data.description, 2);
      } else if (data.variationType === '2') {
        // Call change clothes API
        response = await changeClothesGenerate(finalImageUrl, data.description);
      } else if (data.variationType === '3') {
        // Call copy fabric API
        response = await copyFabricGenerate(finalImageUrl, data.description);
      } else if (data.variationType === '4') {
        // Call copy fabric API
        response = await sketchToDesign(finalImageUrl, data.description, 2);
      } else if (data.variationType === '5') {
        // Convert style strength level to numeric value for API
        // Backend REFER_LEVEL_MAP expects: 1->0.3, 2->0.5, 3->0.9
        const getReferLevel = (level: string): number => {
          switch (level) {
            case 'low':
              return 1;  // Maps to 0.3 in backend
            case 'middle':
              return 2;  // Maps to 0.5 in backend
            case 'high':
              return 3;  // Maps to 0.9 in backend
            default:
              return 2;  // Default to middle
          }
        };
        
        // Call mix image API
        response = await mixImage(
          finalImageUrl,
          '',
          finalReferenceImageUrl,
          getReferLevel(data.styleStrengthLevel)
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
      } else if (data.variationType === '11') {
        // Call vary style image API
        response = await varyStyleImage(finalImageUrl, data.description || '', finalReferenceImageUrl, data.styleStrengthLevel);
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
  }, [setModelSizes, showAlert]);

  return (
    <div
      className={`w-[378px] h-[calc(100vh-110px)] overflow-y-auto py-4 rounded-[20px] flex-shrink-0 bg-white shadow-card-shadow flex flex-col z-0 ${inter.className}`}
    >
      <div className="flex justify-center items-center w-full h-full gap-[46px]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full w-full flex flex-col">
          <div className="flex items-center justify-center">
            <TabsList>
              <TabsTrigger value="text">Text to image</TabsTrigger>
              <TabsTrigger value="image">Image to image</TabsTrigger>
            </TabsList>
          </div>
          <div className="flex-1 overflow-hidden pt-4 ">
            <TabsContent value="text" className="h-full">
              <div className={'block h-full'}>
                <TextToImageContent onSubmit={handleSubmit} initialPrompt={initialPrompt} />
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
