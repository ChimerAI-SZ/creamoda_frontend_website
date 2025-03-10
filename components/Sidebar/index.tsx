'use client';

import { useState } from 'react';
import { Inter } from 'next/font/google';

import { ToggleTag } from './components/ToggleTag';
import TextToImageContent from './components/TextToImageContent';
import { ImageToImageContent } from './components/ImageToImageContent';

const inter = Inter({ subsets: ['latin'] });

import { localAPI } from '@/lib/axios';

interface OutfitFormData {
  description: string;
  gender: 1 | 2;
  age: string;
  country: string;
  modelSize: string;
}

export function Sidebar() {
  const [activeTag, setActiveTag] = useState<'text' | 'image'>('text');

  const handleSubmit = (data: OutfitFormData) => {
    console.log(data);
    localAPI.post('/api/v1/img/txt_generate', data);
  };

  return (
    <div
      className={`w-[320px] h-[calc(100vh-64px)] flex-shrink-0 bg-white border-r border-gray-200 flex flex-col z-10 ${inter.className}`}
    >
      <div className="flex justify-center items-center w-full px-3 border-b border-[#DCDCDC] gap-[46px]">
        <ToggleTag label="Text to image" isActive={activeTag === 'text'} onClick={() => setActiveTag('text')} />
        <ToggleTag label="Image to image" isActive={activeTag === 'image'} onClick={() => setActiveTag('image')} />
      </div>
      <div className="flex-1 overflow-hidden pt-4 px-4">
        {activeTag === 'text' ? <TextToImageContent onSubmit={handleSubmit} /> : <ImageToImageContent />}
      </div>
    </div>
  );
}

export * from './components/ToggleTag';
export * from './components/ImageToImageContent';
