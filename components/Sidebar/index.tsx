'use client';

import { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';
import { showErrorDialog } from '@/utils/index';

import { ToggleTag } from './components/ToggleTag';
import TextToImageContent from './components/TextToImageContent';
import ImageToImageContent from './components/ImageToImageContent/index';
const inter = Inter({ subsets: ['latin'] });

import { textToImageGenerate, getModelSizeList, getVariationTypeList } from '@/lib/api';
import { useModelStore } from '@/stores/useModelStore';
import { useGenerationStore } from '@/stores/useGenerationStore';
import { eventBus } from '@/utils/events';

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
        <div className={activeTag === 'text' ? 'block h-full' : 'hidden '}>
          <TextToImageContent onSubmit={handleSubmit} />
        </div>
        <div className={activeTag === 'image' ? 'block  h-full' : 'hidden'}>
          <ImageToImageContent />
        </div>
      </div>
    </div>
  );
}
