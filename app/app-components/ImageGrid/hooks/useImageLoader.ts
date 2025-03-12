import { useState, useCallback } from 'react';

export function useImageLoader() {
  const [loadedImages, setLoadedImages] = useState<Map<number, boolean>>(new Map());

  const handleImageLoad = useCallback((genImgId: number) => {
    if (!genImgId) return;
    setLoadedImages(prev => new Map(prev).set(genImgId, true));
  }, []);

  return { loadedImages, handleImageLoad };
}
