import { api } from '@/lib/axios';

/**
 * 获取生成图片列表
 * @param imageUrl 图片url
 * @param clothingText 衣服描述
 * @param hexColor 颜色
 */
export async function changeClothesColor(imageUrl: string, clothingText: string, hexColor: string) {
  try {
    const response = await api.post('/api/v1/img/change_color', {
      imageUrl,
      clothingText,
      hexColor
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
    const response = await api.post('/api/v1/img/change_background', {
      originalPicUrl,
      referencePicUrl,
      backgroundPrompt
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
    const response = await api.post('/api/v1/img/remove_background', {
      originalPicUrl
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
    const response = await api.post('/api/v1/img/particial_modification', {
      originalPicUrl,
      maskPicUrl,
      prompt
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
    const response = await api.post('/api/v1/img/upscale', {
      originalPicUrl
    });
    return response.data;
  } catch (error) {
    console.error('Error getting generate list:', error);
    throw error;
  }
}

export async function patternExtraction(originalPicUrl: string, originalMaskUrl: string) {
  try {
    const response = await api.post('/api/v1/img/extract_pattern', {
      originalPicUrl,
      originalMaskUrl
    });
    return response.data;
  } catch (error) {
    console.error('Error getting generate list:', error);
    throw error;
  }
}

export async function patternApplication(originalPicUrl: string, printingPicUrl: string, fabricPicUrl: string) {
  try {
    const response = await api.post('/api/v1/img/dress_printing_try_on', {
      originalPicUrl,
      printingPicUrl,
      fabricPicUrl
    });
    return response.data;
  } catch (error) {
    console.error('Error getting generate list:', error);
    throw error;
  }
}
