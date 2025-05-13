'use client';

import React from 'react';
import ImageDoodleEditor from '../components/ImageDoodleEditor';
import Link from 'next/link';
import { toast } from 'sonner';

export default function DoodleEditorPage() {
  // Sample image URL - replace with your actual image
  const sampleImageUrl = '/sample-clothing.jpg';

  const handleSave = (doodleDataUrl: string) => {
    // 显示成功消息
    toast.success('涂鸦已保存！', {
      description: '您的创作已成功保存，可以在个人收藏中查看。',
      action: {
        label: '查看',
        onClick: () => console.log('查看涂鸦')
      }
    });

    // 这里可以添加实际保存逻辑，如上传到服务器
    console.log('保存的涂鸦数据URL:', doodleDataUrl.substring(0, 50) + '...');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-4">
        <Link href="/magic-kit" className="text-blue-600 hover:underline">
          ← 返回
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-center">图像涂鸦编辑器</h1>
      <p className="mb-6 text-center text-gray-600">使用新的基于Fabric.js的编辑器，支持绘制、擦除、撤销和重做功能</p>

      <div className="max-w-3xl mx-auto">
        <ImageDoodleEditor imageUrl={sampleImageUrl} onSave={handleSave} />
      </div>

      <div className="mt-12 p-6 bg-gray-50 rounded-lg max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">使用指南</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            点击<strong>笔刷图标</strong>进行绘画
          </li>
          <li>
            点击<strong>橡皮擦图标</strong>擦除内容
          </li>
          <li>
            点击<strong>颜色图标</strong>选择颜色
          </li>
          <li>
            使用<strong>撤销</strong>和<strong>重做</strong>按钮修改您的操作
          </li>
          <li>
            点击<strong>清除</strong>按钮重新开始
          </li>
          <li>
            完成后点击<strong>保存</strong>按钮保存您的作品
          </li>
        </ul>
      </div>
    </div>
  );
}
