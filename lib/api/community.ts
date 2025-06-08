import { api } from '@/lib/axios';

export async function queryImageList(page: number, pageSize: number) {
  try {
    const response = await api.get(`/api/v1/community/list?page=${page}&pageSize=${pageSize}`);

    return response.data;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

export async function queryImageDetail(seoImgUid: string) {
  try {
    const response = await api.get(`/api/v1/community/detail?seoImgUid=${seoImgUid}`);

    return response.data;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

export async function likeImage(genImgId: number) {
  try {
    const response = await api.post(`/api/v1/community/like`, {
      genImgId
    });

    return response.data;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

export async function cancelLikeImage(genImgId: number) {
  try {
    const response = await api.post(`/api/v1/community/cancel_like`, {
      genImgId
    });

    return response.data;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

export async function shareImage(payload: { genImgId: number }) {
  try {
    const response = await api.post('/api/v1/community/share', {
      genImgId: payload.genImgId
    });

    return response.data;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}
