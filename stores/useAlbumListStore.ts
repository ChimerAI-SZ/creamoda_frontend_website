import { create } from 'zustand';

import type { ImageItem } from '@/components/ImageGrid';

interface AlbumListState {
  imageList: ImageItem[];
  addImage: (image: ImageItem) => void;
  resetImageList: (images: ImageItem[]) => void;
  clearImageList: () => void;
  removeImage: (image: ImageItem) => void;
}

export const useAlbumListStore = create<AlbumListState>(set => ({
  imageList: [],
  addImage: (image: ImageItem) => set(state => ({ imageList: [...state.imageList, image] })),
  resetImageList: (images: ImageItem[]) => set({ imageList: images }),
  clearImageList: () => set({ imageList: [] }),
  removeImage: (image: ImageItem) =>
    set(state => ({ imageList: state.imageList.filter(item => item.genImgId !== image.genImgId) }))
}));
