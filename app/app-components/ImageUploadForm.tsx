'use client';

import * as React from 'react';
import { Upload } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GenerateButton } from '@/components/previous-version-ui/generate-button';

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

  const [dragActive, setDragActive] = React.useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.includes('image/')) {
        setFormData(prev => ({ ...prev, image: file }));
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <div className="flex flex-col h-full">
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-6 pb-20">
        <div className="space-y-2">
          <Label htmlFor="image-upload" className="text-base font-semibold">
            Upload image
          </Label>
          <div
            className={`relative h-[200px] rounded-lg border-2 border-dashed transition-colors ${
              dragActive ? 'border-[#FF7B0D] bg-[#FFE4D2]' : 'border-gray-200 hover:bg-gray-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              id="image-upload"
              type="file"
              className="hidden"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
            />
            <label
              htmlFor="image-upload"
              className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2"
            >
              <div className="rounded-lg bg-[#FFE4D2] p-2">
                <Upload className="h-6 w-6 text-[#FF7B0D]" />
              </div>
              <span className="text-sm font-medium">Upload image</span>
              <span className="text-xs text-gray-500">Format: jpeg, .png</span>
              {formData.image && <span className="text-xs text-[#FF7B0D]">{formData.image.name}</span>}
            </label>
          </div>
          <Input
            type="text"
            placeholder="Or paste image address"
            value={formData.imageUrl}
            onChange={e => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
            className="mt-2"
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
          disabled={!formData.description.trim() || (!formData.image && !formData.imageUrl)}
        />
      </div>
    </div>
  );
}
