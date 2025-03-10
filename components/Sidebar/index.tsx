'use client';

import { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';

import { ToggleTag } from './components/ToggleTag';
import TextToImageContent from './components/TextToImageContent';
import { ImageToImageContent } from './components/ImageToImageContent';

const inter = Inter({ subsets: ['latin'] });

import { localAPI } from '@/lib/axios';

export interface OutfitFormData {
  prompt: string;
  gender: 1 | 2;
  age: string;
  country: string;
  modelSize: string;
  withHumanModel: 1 | 0;
}

// 添加新的接口定义
interface OptionItem {
  code: string;
  name: string;
}

export function Sidebar() {
  const [activeTag, setActiveTag] = useState<'text' | 'image'>('text');
  const [modelSizes, setModelSizes] = useState<OptionItem[]>([]);
  const [variationTypes, setVariationTypes] = useState<OptionItem[]>([]);

  const handleSubmit = (data: OutfitFormData) => {
    console.log(data);
    localAPI.post('/api/v1/img/txt_generate', data);
  };

  useEffect(() => {
    // 使用Promise.all同步执行两个请求
    Promise.all([localAPI.get('/api/v1/common/model_size/list'), localAPI.get('/api/v1/common/variation_type/list')])
      .then(([modelSizesRes, variationTypesRes]) => {
        console.log('模型尺寸列表:', modelSizesRes);
        console.log('变化类型列表:', variationTypesRes);
        setModelSizes(modelSizesRes.data || []);
        setVariationTypes(variationTypesRes.data || []);
      })
      .catch(error => {
        console.error('获取数据失败:', error);
      });
  }, []);

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
