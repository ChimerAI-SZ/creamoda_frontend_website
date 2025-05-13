import { api } from '@/lib/axios';

/**
 * 获取生成图片列表
 * @param imageUrl 图片url
 * @param clothingText 衣服描述
 * @param hexColor 颜色
 */
export async function changeClothesColor(imageUrl: string, clothingText: string, hexColor: string) {
  try {
    const response = await api.get('/api/v1/img/change_color', {
      params: {
        imageUrl,
        clothingText,
        hexColor
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting generate list:', error);
    throw error;
  }
}

/**
 * 获取生成图片列表
 * @param originalPicUrl 原图url
 * @param referencePicUrl 参考图url
 * @param backgroundPrompt 背景描述
 */
export async function changeBackground(originalPicUrl: string, referencePicUrl: string, backgroundPrompt: string) {
  try {
    const response = await api.get('/api/v1/img/change_background', {
      params: {
        originalPicUrl,
        referencePicUrl,
        backgroundPrompt
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting generate list:', error);
    throw error;
  }
}

/**
 * 获取生成图片列表
 * @param originalPicUrl 原图url
 */
export async function removeBackground(originalPicUrl: string) {
  try {
    const response = await api.get('/api/v1/img/remove_background', {
      params: {
        originalPicUrl
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting generate list:', error);
    throw error;
  }
}

/**
 * 获取生成图片列表
 * @param originalPicUrl 原图url
 * @param maskPicUrl 蒙版图url
 * @param prompt 提示词
 */
export async function particialModification(originalPicUrl: string, maskPicUrl: string, prompt: string) {
  try {
    const response = await api.get('/api/v1/img/particial_modification', {
      params: {
        originalPicUrl,
        maskPicUrl,
        prompt
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting generate list:', error);
    throw error;
  }
}

/**
 * 获取生成图片列表
 * @param originalPicUrl 原图url
 */
export async function upscale(originalPicUrl: string) {
  try {
    const response = await api.get('{{host}}/api/v1/img/upscale', {
      params: {
        originalPicUrl
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting generate list:', error);
    throw error;
  }
}
