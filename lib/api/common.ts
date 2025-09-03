import { api } from '@/lib/axios';
import { getAuthToken } from './token';
import { FrontendImagesParams, FrontendImagesResponse, FrontendImageDetailResponse, SimilarImageItem } from '@/types/frontendImages';

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
 * 登出接口
 */
export async function logout() {
  try {
    const response = await api.post('/api/v1/user/logout');
    return response.data;
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
}

/**
 * 联系我们
 * @param email 邮箱
 * @param genImgId 图片ID
 * @param source 来源 目前只支持'3d_making' | 'human_tuning';
 */
export async function contactUs(email: string, genImgId: number, source: '3d_making' | 'human_tuning') {
  try {
    const response = await api.post('/api/v1/common/contact', { contactEmail: email, genImgId, source });
    return response.data;
  } catch (error) {
    console.error('Error contacting us:', error);
    throw error;
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

export async function updateUserInfo(payload: {
  headPic?: string | null;
  username?: string | null;
  pwd?: string | null;
  billingEmail?: string | null;
}) {
  try {
    const response = await api.post('/api/v1/user/change/user_info', {
      username: payload.username,
      pwd: payload.pwd,
      headPic: payload.headPic,
      billingEmail: payload.billingEmail
    });
    return response.data;
  } catch (error) {
    console.error('Error contacting us:', error);
    throw error;
  }
}

/**
 * 获取前端图片列表
 * @param params 查询参数
 */
export async function getFrontendImages(params: FrontendImagesParams): Promise<FrontendImagesResponse> {
  try {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      page_size: params.page_size.toString(),
    });
    
    if (params.type) {
      // 如果type是字符串（逗号分隔），则分割成数组
      const typeArray = typeof params.type === 'string' ? params.type.split(',') : [params.type];
      typeArray.forEach(type => {
        queryParams.append('type', type.trim());
      });
    }
    
    if (params.gender) {
      // 如果gender是字符串（逗号分隔），则分割成数组
      const genderArray = typeof params.gender === 'string' ? params.gender.split(',') : [params.gender];
      genderArray.forEach(gender => {
        queryParams.append('gender', gender.trim());
      });
    }

    // 使用Next.js API代理避免CORS问题
    const response = await fetch(`/api/frontend-images?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching frontend images:', error);
    throw error;
  }
}

/**
 * 获取前端图片详情（包含相似图片推荐）
 * @param params 查询参数
 */
export async function getFrontendImageDetail(params: { record_id?: string; slug?: string }): Promise<FrontendImageDetailResponse> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.record_id) {
      queryParams.append('record_id', params.record_id);
    }
    
    if (params.slug) {
      queryParams.append('slug', params.slug);
    }

    // 使用Next.js API代理避免CORS问题
    const response = await fetch(`/api/frontend-images/detail?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching frontend image detail:', error);
    throw error;
  }
}
