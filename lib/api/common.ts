import { localAPI as api } from '@/lib/axios';
import { getAuthToken } from './token';

/**
 * 获取变化类型列表
 */
export async function getVariationTypeList() {
  try {
    const response = await api.get('/api/v1/common/variationType/list');
    if (response.data.code === 0 && response.data.data && response.data.data.list) {
      return response.data.data.list;
    }
    // 返回空数组而不是抛出错误，这样更容易处理
    return [];
  } catch (error) {
    console.error('Error getting variation type list:', error);
    // 返回空数组而不是抛出错误
    return [];
  }
}

/**
 * 获取模型尺寸列表
 */
export async function getModelSizeList() {
  try {
    const response = await api.get('/api/v1/common/modelSize/list');
    if (response.data.code === 0 && response.data.data && response.data.data.list) {
      return response.data.data.list;
    }
    // 返回空数组而不是抛出错误
    return [];
  } catch (error) {
    console.error('Error getting model size list:', error);
    // 返回空数组而不是抛出错误
    return [];
  }
}

/**
 * 上传图片
 * @param file 图片文件
 */
export async function uploadImage(file: File) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/api/v1/common/img/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.data.code === 0 && response.data.data && response.data.data.url) {
      return response.data.data.url;
    }
    throw new Error(response.data.msg || 'Failed to upload image');
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}
