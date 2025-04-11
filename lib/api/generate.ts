import { api } from '@/lib/axios';
import { getAuthToken } from './token';

/**
 * 获取生成图片列表
 * @param page 页码
 * @param pageSize 每页数量
 */
export async function getGenerateList(page: number, pageSize: number) {
  try {
    const response = await api.get(`/api/v1/img/generate/list?page=${page}&pageSize=${pageSize}`);
    return response.data;
  } catch (error) {
    console.error('Error getting generate list:', error);
    throw error;
  }
}

/**
 * 刷新生成图片状态
 * @param pendingIds 待生成图片ID
 */
export async function refreshGenerateStatus(pendingIds: string) {
  try {
    const response = await api.get(`/api/v1/img/generate/refresh_status?genImgIdList=${pendingIds}`);
    return response.data;
  } catch (error) {
    console.error('Error refreshing generate status:', error);
    throw error;
  }
}
/**
 * 获取单个生成图片详情
 * @param genImgId 生成图片ID
 */
export async function getGenerateDetail(genImgId: number) {
  try {
    const response = await api.get(`/api/v1/img/generate/detail?genImgId=${genImgId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting generate detail:', error);
    throw error;
  }
}

/**
 * 获取生成图片状态
 * @param genImgIds 生成图片ID数组
 */
export async function getGenerateStatus(genImgIds: number[]) {
  try {
    const response = await api.post('/api/v1/img/generate/status', {
      genImgIds
    });
    return response.data;
  } catch (error) {
    console.error('Error getting generate status:', error);
    throw error;
  }
}

/**
 * 文本生成图片
 * @param data 生成参数
 */
export async function textToImageGenerate(data: {
  prompt: string;
  gender: 1 | 2;
  age: string;
  country: string;
  modelSize: number;
  withHumanModel: 1 | 0;
}) {
  try {
    const response = await api.post('/api/v1/img/txt_generate', data);
    return response.data;
  } catch (error) {
    console.error('Error generating image from text:', error);
    throw error;
  }
}

/**
 * 换衣服生成
 * @param originalPicUrl 原始图片URL
 * @param prompt 提示词
 */
export async function changeClothesGenerate(originalPicUrl: string, prompt: string) {
  try {
    const response = await api.post('/api/v1/img/change_clothes_generate', {
      originalPicUrl,
      prompt
    });
    return response.data;
  } catch (error) {
    console.error('Error changing clothes generate:', error);
    throw error;
  }
}

/**
 * 复制风格生成
 * @param originalPicUrl 原始图片URL
 * @param prompt 提示词
 * @param fidelity 保真度
 */
export async function copyStyleGenerate(originalPicUrl: string, prompt: string, fidelity: number) {
  try {
    const response = await api.post('/api/v1/img/copy_style_generate', {
      originalPicUrl,
      fidelity,
      prompt
    });
    return response.data;
  } catch (error) {
    console.error('Error copying style generate:', error);
    throw error;
  }
}

/**
 * 人物模型生成
 * @param originalPicUrl 原始图片URL
 * @param prompt 提示词
 * @param gender 性别 (1: 男, 2: 女)
 * @param age 年龄
 * @param country 国家
 */
export async function humanModelGenerate(
  originalPicUrl: string,
  prompt: string,
  gender: string,
  age: string,
  country: string
) {
  try {
    const response = await api.post('/api/v1/img/human_model_generate', {
      originalPicUrl,
      prompt,
      gender,
      age,
      country
    });
    return response.data;
  } catch (error) {
    console.error('Error generating with human model:', error);
    throw error;
  }
}

/**
 * 复制面料生成
 * @param originalPicUrl 原始图片URL
 * @param prompt 提示词
 * @param gender 性别 (1: 男, 2: 女)
 * @param age 年龄
 * @param country 国家
 */
export async function copyFabricGenerate(
  originalPicUrl: string,
  prompt: string,
  gender: number,
  age: number,
  country: string
) {
  try {
    const response = await api.post('/api/v1/img/copy_fabric', {
      originalPicUrl,
      prompt,
      gender,
      age,
      country
    });
    return response.data;
  } catch (error) {
    console.error('Error generating with fabric copy:', error);
    throw error;
  }
}
