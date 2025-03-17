'use client';

import * as React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { GenerateButton, GenerateButtonState } from '@/components/GenerateButton/GenerateButton';
import { MemoizedImageUploader as ImageUploader } from '@/components/Sidebar/components/ImageToImageContent/ImageUploader';
import { FormLabel } from '@/components/Sidebar/components/ImageToImageContent/FormLabel';
import { VariationTypeSelect } from '@/components/Sidebar/components/ImageToImageContent/VariationTypeSelect';
import { FidelitySlider } from '@/components/Sidebar/components/ImageToImageContent/FidelitySlider';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { copyStyleGenerate, uploadImage, changeClothesGenerate } from '@/lib/api/index';
import { eventBus } from '@/utils/events';
import { showErrorDialog } from '@/utils/index';
import { isValidImageUrl } from '@/utils/validation';

interface ImageUploadFormProps {
  onSubmit?: (data: ImageUploadFormData) => void;
}

interface ImageUploadFormData {
  image: File | null;
  imageUrl: string;
  variationType: string;
  description: string;
  fidelity: number;
}

export default function ImageUploadForm({ onSubmit }: ImageUploadFormProps) {
  // 将图片相关状态提取到单独的状态对象中
  const [imageState, setImageState] = React.useState({
    image: null as File | null,
    imageUrl: ''
  });

  // 其他表单状态
  const [formState, setFormState] = React.useState({
    variationType: '',
    description: '',
    fidelity: 50
  });

  const [isLoading, setIsLoading] = useState(false);

  // 合并状态以便于处理
  const formData = {
    ...imageState,
    ...formState
  };

  // 图片处理函数
  const handleImageChange = React.useCallback((image: File | null) => {
    setImageState(prev => ({ ...prev, image }));
  }, []);

  const handleImageUrlChange = React.useCallback((imageUrl: string) => {
    setImageState(prev => ({ ...prev, imageUrl }));
  }, []);

  // 其他表单字段处理函数
  const handleDescriptionChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormState(prev => ({ ...prev, description: e.target.value }));
  }, []);

  const handleVariationTypeChange = React.useCallback((value: string) => {
    setFormState(prev => ({ ...prev, variationType: value }));
  }, []);

  const handleFidelityChange = React.useCallback((value: number) => {
    setFormState(prev => ({ ...prev, fidelity: value }));
  }, []);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      await new Promise(resolve => setTimeout(resolve, 0));

      // 确保有图片URL和描述
      if (!formData.imageUrl && !formData.image) {
        showErrorDialog('Please upload an image or provide an image URL');
        setIsLoading(false);
        return;
      }

      // 验证图片URL的有效性
      if (formData.imageUrl && !formData.image) {
        if (!isValidImageUrl(formData.imageUrl)) {
          showErrorDialog('Please provide a valid image URL before generating');
          setIsLoading(false);
          return;
        }
      }

      if (!formData.description.trim()) {
        showErrorDialog('Please provide a description');
        setIsLoading(false);
        return;
      }

      // 如果有本地图片但没有URL，需要先上传图片获取URL
      let finalImageUrl = formData.imageUrl;
      if (formData.image && !formData.imageUrl) {
        try {
          finalImageUrl = await uploadImage(formData.image);
          // 更新表单数据中的图片URL
          setImageState(prev => ({ ...prev, imageUrl: finalImageUrl }));
        } catch (error) {
          console.error('Error uploading image:', error);
          showErrorDialog('Something went wrong. Please try again later or contact support if the issue persists');
          return;
        }
      }

      // 最后再次验证finalImageUrl是否有效
      if (!isValidImageUrl(finalImageUrl)) {
        showErrorDialog('The image URL is invalid. Please upload a valid image.');
        setIsLoading(false);
        return;
      }

      // 根据不同的变化类型调用不同的API
      let response;

      if (formData.variationType === '1') {
        // 将fidelity从百分比转换为小数 (0-100 -> 0.0-1.0)
        const fidelityDecimal = formData.fidelity / 100;
        // 调用复制风格API
        response = await copyStyleGenerate(finalImageUrl, formData.description, fidelityDecimal);
      } else if (formData.variationType === '2') {
        // 调用换衣服API
        response = await changeClothesGenerate(finalImageUrl, formData.description);
      } else {
        // 默认调用换衣服API，以防没有选择类型
        response = await changeClothesGenerate(finalImageUrl, formData.description);
      }

      if (response.code === 0) {
        eventBus.emit('sidebar:submit-success', void 0);
        console.log('response', response);
      } else {
        showErrorDialog(response.msg || 'Failed to generate image');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      showErrorDialog('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  // 确定按钮状态
  const buttonState: GenerateButtonState = React.useMemo(() => {
    if (isLoading) {
      return 'generating';
    }

    if (!formData.description.trim() || (!formData.image && !formData.imageUrl)) {
      return 'disabled';
    }

    return 'ready';
  }, [formData.description, formData.image, formData.imageUrl, isLoading]);

  return (
    <div className="flex flex-col h-full">
      <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto space-y-4 pb-20 px-4">
        <div className="space-y-2">
          <FormLabel htmlFor="image-upload">Upload image</FormLabel>
          <ImageUploader
            onImageChange={handleImageChange}
            onImageUrlChange={handleImageUrlChange}
            imageUrl={imageState.imageUrl}
            currentImage={imageState.image}
          />
        </div>

        <VariationTypeSelect value={formState.variationType} onChange={handleVariationTypeChange} />

        <div className="space-y-2">
          <FormLabel htmlFor="description">Describe the final design</FormLabel>
          <Textarea
            id="description"
            placeholder="Please describe the category you would like to change."
            className="min-h-[200px] resize-none placeholder:text-[#D5D5D5] font-inter text-sm font-normal leading-5 rounded-[4px] border border-[#DCDCDC]"
            value={formState.description}
            onChange={handleDescriptionChange}
          />
        </div>

        {formState.variationType === '1' && (
          <FidelitySlider value={formState.fidelity} onChange={handleFidelityChange} />
        )}
      </form>
      <div className="sticky bottom-0 left-0 right-0 pb-4 bg-white">
        <GenerateButton onClick={handleSubmit} state={buttonState} />
      </div>
    </div>
  );
}
