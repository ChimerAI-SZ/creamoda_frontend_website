'use client';

import type React from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';
import { OutfitForm } from './OutfitForm';
import { ImageUploadForm } from './ImageUploadForm';

const inter = Inter({ subsets: ['latin'] });

interface ToggleTagProps {
  icon?: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function ToggleTag({ icon, label, isActive, onClick }: ToggleTagProps) {
  console.log(isActive);
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-2 px-4 py-2 rounded-t-lg transition-colors relative',
        isActive ? 'text-[#F97917] bg-white' : 'text-[#999] hover:text-[#F97917]',
        'font-inter text-sm font-medium'
      )}
    >
      {icon}
      <span>{label}</span>
      {isActive && <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#F97917]" />}
    </button>
  );
}

export function Sidebar() {
  const [activeTag, setActiveTag] = useState<'text' | 'image'>('text');

  return (
    <div
      className={`w-[320px] h-[calc(100vh-64px)] flex-shrink-0 bg-white border-r border-gray-200 flex flex-col z-10 ${inter.className}`}
    >
      <div className="flex justify-center items-center w-full px-3 border-b border-[#DCDCDC]">
        <ToggleTag label="Text to image" isActive={activeTag === 'text'} onClick={() => setActiveTag('text')} />
        <ToggleTag label="Image to image" isActive={activeTag === 'image'} onClick={() => setActiveTag('image')} />
      </div>
      <div className="flex-1 overflow-hidden pt-4 px-4">
        {activeTag === 'text' ? <TextToImageContent /> : <ImageToImageContent />}
      </div>
    </div>
  );
}

function TextToImageContent() {
  return (
    <div className="h-full overflow-y-auto">
      <OutfitForm onSubmit={data => console.log(data)} />
    </div>
  );
}

function ImageToImageContent() {
  return (
    <div className="h-full">
      <ImageUploadForm onSubmit={data => console.log(data)} />
    </div>
  );
}
