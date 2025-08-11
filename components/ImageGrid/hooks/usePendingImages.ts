import { useRef, useCallback } from 'react';

import { generate } from '@/lib/api';
import { useGenerationStore } from '@/stores/useGenerationStore';
import { useAlertStore } from '@/stores/useAlertStore';

interface UsePendingImagesProps {
  onImageUpdate: (updatedImage: any) => void;
  pollInterval?: number;
}

export function usePendingImages({ onImageUpdate, pollInterval = 3000 }: UsePendingImagesProps) {
  const pendingIdsRef = useRef<Set<string>>(new Set());
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { setGenerating } = useGenerationStore();

  const { showAlert } = useAlertStore();

  const checkPendingImages = useCallback(async () => {
    if (pendingIdsRef.current.size === 0) {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
      return;
    }

    try {
      const pendingIds = Array.from(pendingIdsRef.current).join(',');
      const data = await generate.refreshGenerateStatus(pendingIds);

      if (data.code === 0) {
        const updatedImages = data.data?.list || [];
        const completedIds = new Set<string>();

        updatedImages.forEach((image: any) => {
          // 通知父组件更新图片
          onImageUpdate(image);

          // 如果图片已完成，记录ID
          if ([3, 4].includes(image.status)) {
            completedIds.add(image.genImgId);
          }
        });

        // 从pendingIdsRef中移除已完成的图片
        if (completedIds.size > 0) {
          const newSet = new Set(pendingIdsRef.current);
          completedIds.forEach(id => newSet.delete(id));

          // 所有图片都已经生成完成，关闭isGenerating状态
          if (newSet.size === 0) {
            setGenerating(false);
          }

          pendingIdsRef.current = newSet;
        }
      } else {
        showAlert({
          type: 'error',
          content: data.message || 'Failed to check image status'
        });
      }
    } catch (error: any) {
      showAlert({
        type: 'error',
        content: error.message || 'Failed to check image status'
      });
    }
  }, [onImageUpdate, setGenerating, showAlert]);

  const startPolling = useCallback(() => {
    if (!pollTimerRef.current && pendingIdsRef.current.size > 0) {
      // 立即执行一次检查
      setTimeout(() => {
        checkPendingImages();
      }, 0);

      // 开始定时轮询
      pollTimerRef.current = setInterval(checkPendingImages, pollInterval);
    }
  }, [pollInterval, checkPendingImages]);

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  return {
    pendingIdsRef,
    checkPendingImages,
    startPolling,
    stopPolling
  };
}
