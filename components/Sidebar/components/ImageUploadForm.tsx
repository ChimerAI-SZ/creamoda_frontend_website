'use client';

import * as React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { GenerateButton, GenerateButtonState } from '@/components/GenerateButton/GenerateButton';
import { ImageUploader } from '@/components/Sidebar/components/ImageUploader';
import { FormLabel } from '@/components/Sidebar/components/FormLabel';
import { VariationTypeSelect } from '@/components/Sidebar/components/VariationTypeSelect';
import { FidelitySlider } from '@/components/Sidebar/components/FidelitySlider';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { uploadImage, changeClothesGenerate, copyStyleGenerate } from '@/lib/login/api';
import { emitter } from '@/utils/events';
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

export function ImageUploadForm({ onSubmit }: ImageUploadFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState<ImageUploadFormData>({
    image: null,
    imageUrl: '',
    variationType: '',
    description: '',
    fidelity: 50
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    // if (onSubmit) {
    //   onSubmit(formData);
    //   return;
    // }

    // 如果没有提供 onSubmit 回调，则直接调用 API
    try {
      setIsLoading(true);

      // 确保有图片URL和描述
      if (!formData.imageUrl && !formData.image) {
        toast({
          title: 'Error',
          description: 'Please upload an image or provide an image URL',
          variant: 'destructive'
        });
        return;
      }

      if (!formData.description.trim()) {
        toast({
          title: 'Error',
          description: 'Please provide a description',
          variant: 'destructive'
        });
        return;
      }

      // 如果有本地图片但没有URL，需要先上传图片获取URL
      let finalImageUrl = formData.imageUrl;
      if (formData.image && !formData.imageUrl) {
        try {
          finalImageUrl = await uploadImage(formData.image);
          // 更新表单数据中的图片URL
          setFormData(prev => ({ ...prev, imageUrl: finalImageUrl }));
        } catch (error) {
          console.error('Error uploading image:', error);
          toast({
            title: 'Error',
            description: error instanceof Error ? error.message : 'Failed to upload image',
            variant: 'destructive'
          });
          return;
        }
      }

      // 根据不同的变化类型调用不同的API
      let response;

      if (formData.variationType === '2') {
        // 调用复制风格API
        response = await copyStyleGenerate(finalImageUrl, formData.description, formData.fidelity);
        emitter.emit('sidebar:submit-success', response);
      } else {
        // 默认调用换衣服API
        response = await changeClothesGenerate(finalImageUrl, formData.description);
        emitter.emit('sidebar:submit-success', response);
      }

      if (response.code === 0) {
        toast({
          title: 'Success',
          description: 'Image generation request submitted successfully'
        });
      } else {
        toast({
          title: 'Error',
          description: response.msg || 'Failed to generate image',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  const handleImageChange = (image: File | null) => {
    setFormData(prev => ({ ...prev, image }));
  };

  const handleImageUrlChange = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, imageUrl }));
  };

  // 确定按钮状态
  const buttonState =
    !formData.description.trim() || (!formData.image && !formData.imageUrl)
      ? 'disabled'
      : isLoading
      ? 'ready'
      : 'ready';

  return (
    <div className="flex flex-col h-full">
      <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto space-y-6 pb-20">
        <div className="space-y-2">
          <FormLabel htmlFor="image-upload">Upload image</FormLabel>
          <ImageUploader
            onImageChange={handleImageChange}
            onImageUrlChange={handleImageUrlChange}
            imageUrl={formData.imageUrl}
            currentImage={formData.image}
          />
        </div>

        <VariationTypeSelect
          value={formData.variationType}
          onChange={value => setFormData(prev => ({ ...prev, variationType: value }))}
        />

        <div className="space-y-2">
          <FormLabel htmlFor="description">Describe the final design</FormLabel>
          <Textarea
            id="description"
            placeholder="Please describe the category you would like to change."
            className="min-h-[200px] resize-none"
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>

        {formData.variationType === '1' && (
          <FidelitySlider
            value={formData.fidelity}
            onChange={value => setFormData(prev => ({ ...prev, fidelity: value }))}
          />
        )}
      </form>
      <div className="sticky bottom-0 left-0 right-0 px-6 pb-4 bg-white">
        <GenerateButton onClick={handleSubmit} state={buttonState} />
      </div>
    </div>
  );
}
