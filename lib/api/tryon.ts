import { api } from '@/lib/axios';
import { getAuthToken } from './token';

export interface TryOnFormData {
  originalPicUrl: string; // 模特图片
  clothingPhoto: string; // 服饰图片
  clothType: 'tops' | 'bottoms' | 'one-pieces'; // 服饰类型
}

/**
 * 获取生成图片列表
 * @param page 页码
 * @param pageSize 每页数量
 */
export async function tryOnGenerate(data: TryOnFormData) {
  try {
    const response = await api.post(`/api/v1/img/virtual_try_on`, data);
    return response.data;
  } catch (error) {
    console.error('Error getting generate list:', error);
    throw error;
  }
}
