'use client';

import { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';
import { showErrorDialog } from '@/utils/index';

import { ToggleTag } from './components/ToggleTag';
import TextToImageContent from './components/TextToImageContent';
import { ImageToImageContent } from './components/ImageToImageContent';

const inter = Inter({ subsets: ['latin'] });

import { localAPI } from '@/lib/axios';
import { useModelStore } from '@/stores/useModelStore';
import { emitter } from '@/utils/events';

export interface OutfitFormData {
  prompt: string;
  gender: 1 | 2;
  age: string;
  country: string;
  modelSize: number;
  withHumanModel: 1 | 0;
}

// 添加新的接口定义

export function Sidebar() {
  const [activeTag, setActiveTag] = useState<'text' | 'image'>('text');
  const { setModelSizes, setVariationTypes } = useModelStore();

  const handleSubmit = (data: OutfitFormData) => {
    localAPI.post('/api/v1/img/txt_generate', data).then(res => {
      console.log(res);
      emitter.emit('sidebar:submit-success', res);
    });
  };

  useEffect(() => {
    Promise.allSettled([
      localAPI.get('/api/v1/common/modelSize/list'),
      localAPI.get('/api/v1/common/variationType/list')
    ])
      .then(results => {
        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            const { data } = result.value || {};

            if (data?.code === 0) {
              if (index === 0) {
                setModelSizes(data.data.list || []);
              } else {
                setVariationTypes(data.data.list || []);
              }
            } else {
              const errorType = index === 0 ? '模型尺寸' : '变化类型';

              showErrorDialog(`获取${errorType}失败: ${data?.message}`);
            }
          }
        });
      })
      .catch(error => {
        showErrorDialog('Something went wrong. Please try again later or contact support if the issue persists');
      });
  }, [setModelSizes, setVariationTypes]);

  return (
    <div
      className={`w-[334px] h-[calc(100vh-64px)] flex-shrink-0 bg-white border-r box-content border-gray-200 flex flex-col z-10 ${inter.className}`}
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
