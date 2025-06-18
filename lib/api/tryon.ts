import { api } from '@/lib/axios';

import { ChangePoseFormData, TryOnFormData } from '@/types/virtualTryOn';

/**
 * 获取生成图片列表
 * @param page 页码
 * @param pageSize 每页数量
 */
export async function tryOnGenerate(data: TryOnFormData) {
  try {
    const response = await api.post(`/api/v1/img/virtual_try_on`, data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
}

export async function changePoseGenerate(data: ChangePoseFormData) {
  try {
    const response = await api.post(`/api/v1/img/change_pose`, data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
}
