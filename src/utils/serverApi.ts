import { FrontendImageItem, FrontendImagesResponse } from '@/types/frontendImages';

interface GetSSRDesignImagesParams {
  page?: number;
  page_size?: number;
  type?: string;
  gender?: string;
}

/**
 * 服务端获取设计图片数据 - 用于SSR
 */
export async function getSSRDesignImages(params: GetSSRDesignImagesParams = {}): Promise<FrontendImageItem[]> {
  try {
    const queryParams = new URLSearchParams({
      page: (params.page || 1).toString(),
      page_size: (params.page_size || 20).toString(),
    });
    
    if (params.type) {
      const typeArray = typeof params.type === 'string' ? params.type.split(',') : [params.type];
      typeArray.forEach(type => {
        queryParams.append('type', type.trim());
      });
    }
    
    if (params.gender) {
      const genderArray = typeof params.gender === 'string' ? params.gender.split(',') : [params.gender];
      genderArray.forEach(gender => {
        queryParams.append('gender', gender.trim());
      });
    }

    // 直接调用后端API
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/common/frontend/images?${queryParams.toString()}`;
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // 设置缓存策略，适合SSR
      cache: 'force-cache',
      next: { revalidate: 3600 } // 1小时重新验证
    });

    if (!response.ok) {
      console.error('Backend API error:', response.status, response.statusText);
      return [];
    }

    const data: FrontendImagesResponse = await response.json();
    
    if (data.code === 0 && data.data && data.data.list) {
      return data.data.list;
    }
    
    return [];
  } catch (error) {
    console.error('Failed to fetch SSR design images:', error);
    // 返回空数组而不是抛出错误，确保页面能正常渲染
    return [];
  }
}
