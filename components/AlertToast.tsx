'use client';
import { useEffect } from 'react';
import { X, TriangleAlert, Check, CircleAlert } from 'lucide-react';

import { useAlertStore } from '@/stores/useAlertStore';
import { cn } from '@/utils';

const typeMap = {
  success: {
    icon: (
      <div className="w-full h-full rounded-full bg-transparent flex items-center justify-center">
        <Check color="#239a3b" className="w-full h-full" />
      </div>
    ), // 可替换为真实 SVG
    bg: 'bg-green-50',
    text: 'text-green-800'
  },
  warning: {
    icon: (
      <div className="w-full h-full rounded-full bg-transparent flex items-center justify-center">
        <CircleAlert color="#ff6600" className="w-full h-full" />
      </div>
    ),

    bg: 'bg-yellow-50',
    text: 'text-yellow-800'
  },
  error: {
    icon: (
      <div className="w-full h-full rounded-full bg-transparent flex items-center justify-center">
        <TriangleAlert color="#ff3c2e" className="w-full h-full" />
      </div>
    ),
    bg: 'bg-red-50',
    text: 'text-red-800'
  },
  custom: {
    icon: null,
    bg: 'bg-neutral-50',
    text: 'text-neutral-800'
  }
};

export const AlertToast = () => {
  const { open, type, title, content, icon, close } = useAlertStore();

  // 自动关闭逻辑
  useEffect(() => {
    if (open) {
      const timeout = setTimeout(() => close(), 4000);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  if (!open) return null;

  const styles = typeMap[type] || {
    icon: null,
    bg: 'bg-neutral-50',
    text: 'text-neutral-800'
  };

  return (
    <div
      className={cn(
        'fixed top-8 left-1/2 -translate-x-1/2 rounded-xl shadow-xl w-[360px] flex items-center justify-start gap-3 p-4 z-[10000]',
        styles.bg
      )}
    >
      <div className="w-6 h-6 shrink-0 mt-1">{icon || styles.icon}</div>
      <div className="flex-1 text-sm">
        <p className={cn('text-base font-medium', styles.text)}>{title}</p>
        {content && <p className={cn('text-sm font-normal text-[rgba(10,21,50,0.6)]', styles.text)}>{content}</p>}
      </div>
      <button onClick={close} className="ml-2 text-gray-400 hover:text-gray-600">
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};
