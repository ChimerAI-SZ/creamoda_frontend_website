import { create } from 'zustand';

export interface BasicOptionItem {
  id: number | string;
  name: string;
  [key: string]: any;
}

interface ModelState {
  modelSizes: BasicOptionItem[];
  variationTypes: BasicOptionItem[];
  setModelSizes: (sizes: BasicOptionItem[]) => void;
  setVariationTypes: (types: BasicOptionItem[]) => void;
}

export const useModelStore = create<ModelState>(set => ({
  modelSizes: [],
  variationTypes: [],
  setModelSizes: sizes => set({ modelSizes: sizes }),
  setVariationTypes: types => set({ variationTypes: types })
}));

// 导出 store
export default useModelStore;
