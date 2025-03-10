'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GenerateButton } from '@/components/GenerateButton/GenerateButton';
import { ImageUploader } from '@/components/Sidebar/components/ImageUploader';

interface ImageUploadFormProps {
  onSubmit?: (data: ImageUploadFormData) => void;
}

interface ImageUploadFormData {
  image: File | null;
  imageUrl: string;
  variationType: string;
  description: string;
}

export function ImageUploadForm({ onSubmit }: ImageUploadFormProps) {
  const [formData, setFormData] = React.useState<ImageUploadFormData>({
    image: null,
    imageUrl: '',
    variationType: '',
    description: ''
  });

  const handleSubmit = () => {
    onSubmit?.(formData);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  const handleImageChange = (image: File | null) => {
    setFormData(prev => ({ ...prev, image }));
  };

  const handleImageUrlChange = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, imageUrl }));
  };

  return (
    <div className="flex flex-col h-full">
      <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto space-y-6 pb-20">
        <div className="space-y-2">
          <Label htmlFor="image-upload" className="text-base font-semibold">
            Upload image
          </Label>
          <ImageUploader
            onImageChange={handleImageChange}
            onImageUrlChange={handleImageUrlChange}
            imageUrl={formData.imageUrl}
            currentImage={formData.image}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="variation-type" className="text-base font-semibold">
            Variation Type
          </Label>
          <Select
            value={formData.variationType}
            onValueChange={value => setFormData(prev => ({ ...prev, variationType: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Category Switcher" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="style">Style Change</SelectItem>
              <SelectItem value="color">Color Change</SelectItem>
              <SelectItem value="pattern">Pattern Change</SelectItem>
              <SelectItem value="material">Material Change</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-base font-semibold">
            Describe the final design
          </Label>
          <Textarea
            id="description"
            placeholder="Please describe the category you would like to change."
            className="min-h-[200px] resize-none"
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>
      </form>
      <div className="sticky bottom-0 left-0 right-0 px-6 pb-4 bg-white">
        <GenerateButton
          onClick={handleSubmit}
          state={!formData.description.trim() || (!formData.image && !formData.imageUrl) ? 'disabled' : 'ready'}
        />
      </div>
    </div>
  );
}
