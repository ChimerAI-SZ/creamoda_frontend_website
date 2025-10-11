import { create } from 'zustand';

/**
 * 待上传图片的参数
 */
interface PendingUploadParams {
  file: File;
  saasUrl: string;
  tab?: string;
  variationType?: string;
}

interface PendingUploadStore {
  pendingUpload: PendingUploadParams | null;
  
  // 设置待上传的图片
  setPendingUpload: (params: PendingUploadParams) => void;
  
  // 清除待上传的图片
  clearPendingUpload: () => void;
  
  // 获取待上传的图片
  getPendingUpload: () => PendingUploadParams | null;
}

/**
 * 用于存储用户未登录时想要上传的图片
 * 登录成功后会自动上传这个图片
 */
export const usePendingUploadStore = create<PendingUploadStore>((set, get) => ({
  pendingUpload: null,
  
  setPendingUpload: (params) => {
    set({ pendingUpload: params });
  },
  
  clearPendingUpload: () => {
    set({ pendingUpload: null });
  },
  
  getPendingUpload: () => {
    return get().pendingUpload;
  }
}));

