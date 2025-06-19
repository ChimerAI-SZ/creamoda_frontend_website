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
export async function copyStyleGenerate(originalPicUrl: string, prompt: string, referLevel: number) {
  try {
    const response = await api.post('/api/v1/img/copy_style_generate', {
      originalPicUrl,
      prompt,
      referLevel
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
 */
export async function humanModelGenerate(originalPicUrl: string, prompt: string) {
  try {
    const response = await api.post('/api/v1/img/human_model_generate', {
      originalPicUrl,
      prompt
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
 */
export async function copyFabricGenerate(fabricPicUrl: string, prompt: string) {
  try {
    const response = await api.post('/api/v1/img/fabric_to_design', {
      fabricPicUrl,
      prompt
    });
    return response.data;
  } catch (error) {
    console.error('Error generating with fabric copy:', error);
    throw error;
  }
}

/**
 * 手绘生成设计
 * @param originalPicUrl 原始图片URL
 * @param prompt 提示词
 * @param colorReproduction 颜色复原
 * @param referLevel 参考级别
 */
export async function sketchToDesign(originalPicUrl: string, prompt: string, referLevel: number) {
  try {
    const response = await api.post('/api/v1/img/sketch_to_design', {
      originalPicUrl,
      prompt,
      referLevel
    });
    return response.data;
  } catch (error) {
    console.error('Error generating with fabric copy:', error);
    throw error;
  }
}

/**
 * 混合图片生成
 * @param originalPicUrl 原始图片URL
 * @param prompt 提示词
 * @param referenceImageUrl 参考图片URL
 * @param referLevel 参考级别
 */
export async function mixImage(originalPicUrl: string, prompt: string, referenceImageUrl: string, referLevel: number) {
  try {
    const response = await api.post('/api/v1/img/mix_image', {
      originalPicUrl,
      prompt,
      referPicUrl: referenceImageUrl,
      referLevel
    });
    return response.data;
  } catch (error) {
    console.error('Error generating with fabric copy:', error);
    throw error;
  }
}

/**
 * 删除图片
 * @param genImgId 图片ID
 */
export async function deleteImage(genImgId: number) {
  try {
    const response = await api.post('/api/v1/img/del', {
      genImgId
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

/**
 * 图生图-改变版型
 * @param originalPicUrl 原始图片URL
 */
export async function changePattern(originalPicUrl: string) {
  try {
    const response = await api.post('/api/v1/img/change_pattern', {
      originalPicUrl
    });
    return response.data;
  } catch (error) {
    console.error('Error changing pattern:', error);
    throw error;
  }
}

/**
 * 图生图-改变面料
 * @param originalPicUrl 原始图片URL
 * @param fabricPicUrl 面料图片URL
 * @param maskPicUrl 蒙版图片URL
 */
export async function changeFabric(originalPicUrl: string, fabricPicUrl: string, maskPicUrl: string) {
  try {
    const response = await api.post('/api/v1/img/change_fabric', {
      originalPicUrl,
      fabricPicUrl,
      maskPicUrl
    });
    return response.data;
  } catch (error) {
    console.error('Error changing fabric:', error);
    throw error;
  }
}

/**
 * 图生图-改变印花
 * @param originalPicUrl 原始图片URL
 */
export async function changePrinting(originalPicUrl: string) {
  try {
    const response = await api.post('/api/v1/img/change_printing', {
      originalPicUrl
    });
    return response.data;
  } catch (error) {
    console.error('Error changing printing:', error);
    throw error;
  }
}

export async function styleFusion(originalPicUrl: string, referPicUrl: string) {
  try {
    const response = await api.post('/api/v1/img/style_fusion', {
      originalPicUrl,
      referPicUrl
    });
    return response.data;
  } catch (error) {
    console.error('Error fusing styles:', error);
    throw error;
  }
}
