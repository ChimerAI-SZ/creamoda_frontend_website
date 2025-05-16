import { api } from '@/lib/axios';

/**
 * 获取收藏图片列表
 * @param page 页码
 * @param pageSize 每页数量
 */
export async function getCollectList(page: number, pageSize: number) {
  try {
    const response = await api.get(`/api/v1/collect/list?page=${page}&pageSize=${pageSize}`);
    return response.data;
  } catch (error) {
    console.error('Error getting collect list:', error);
    throw error;
  }
}

/**
 * 收藏图片
 * @param genImgId 图片ID
 * @param action 1: 收藏 2: 取消收藏
 */
export async function collectImage(payload: { genImgId: string; action: 1 | 2 }) {
  try {
    const response = await api.post('/api/v1/collect/ops', {
      genImgId: payload.genImgId,
      action: payload.action
    });
    return response.data;
  } catch (error) {
    console.error('Error contacting us:', error);
    throw error;
  }
}
