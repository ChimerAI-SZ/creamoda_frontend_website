import { useRef, useCallback } from 'react';

import { generate } from '@/lib/api';
import { useGenerationStore } from '@/stores/useGenerationStore';
import { useAlertStore } from '@/stores/useAlertStore';
import { Analytics } from '@/lib/analytics';
import { usePersonalInfoStore } from '@/stores/usePersonalInfoStore';

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
          // 添加调试日志
          console.log('[usePendingImages] Image update:', {
            genImgId: image.genImgId,
            status: image.status,
            isCompleted: [3, 4].includes(image.status)
          });

          // 通知父组件更新图片
          onImageUpdate(image);

          // 如果图片已完成，记录ID 和发送埋点
          if ([3, 4].includes(image.status)) {
            completedIds.add(image.genImgId);

            // 📊 埋点：图片生成完成
            const userInfo = usePersonalInfoStore.getState();
            const userId = userInfo.email || 'anonymous';
            const featureName = Analytics.getCurrentFeatureName();
            
            // status 3: 成功, status 4: 失败
            const status = image.status === 3 ? 'success' : 'fail';
            
            Analytics.trackGenerateResult(
              userId,
              featureName,
              status,
              {
                requestId: image.genImgId?.toString(),
                errorMessage: image.status === 4 ? (image.errorMsg || 'Generation failed') : undefined
              }
            );

            console.log('[GA] Generate result tracked:', { 
              status, 
              genImgId: image.genImgId, 
              userId, 
              featureName 
            });
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
