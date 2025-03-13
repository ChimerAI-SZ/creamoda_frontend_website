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
    } else {
      throw new Error(response.data.msg || 'Failed to get variation type list');
    }
  } catch (error) {
    console.error('Error getting variation type list:', error);
    throw error;
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
    } else {
      throw new Error(response.data.msg || 'Failed to get model size list');
    }
  } catch (error) {
    console.error('Error getting model size list:', error);
    throw error;
  }
}

/**
 * 上传图片
 * @param file 图片文件
 */
export async function uploadImage(file: File) {
  try {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/api/v1/common/img/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: token || ''
      }
    });

    if (response.data.code === 0 && response.data.data && response.data.data.url) {
      return response.data.data.url;
    } else {
      throw new Error(response.data.msg || 'Failed to upload image');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}
