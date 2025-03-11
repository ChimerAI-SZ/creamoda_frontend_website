import { create } from 'zustand';

interface GenerationState {
  // 是否正在生成图片
  isGenerating: boolean;
  // 设置生成状态
  setGenerating: (isGenerating: boolean) => void;
}

export const useGenerationStore = create<GenerationState>(set => ({
  isGenerating: false,
  setGenerating: isGenerating => set({ isGenerating })
}));
