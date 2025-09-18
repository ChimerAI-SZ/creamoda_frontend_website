import { FrontendImageItem, FrontendImagesResponse } from '@/types/frontendImages';
import { retryFetch } from '@/lib/utils/retryUtils';

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

    // 使用与 API 路由完全相同的逻辑
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/common/frontend/images?${queryParams.toString()}`;
    
    console.log('🔍 [SSR] 请求后端URL:', backendUrl);
    
    // 使用与 API 路由相同的 retryFetch 和超时设置
    const response = await retryFetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // 与 API 路由使用相同的超时时间
      signal: AbortSignal.timeout(15000), // 15秒超时
      // 设置缓存策略，适合SSR
      cache: 'force-cache',
      next: { revalidate: 3600 } // 1小时重新验证
    }, {
      // 与 API 路由使用相同的重试策略
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 5000,
      backoffMultiplier: 2
    });

    if (!response.ok) {
      console.error('❌ [SSR] 后端API错误:', response.status, response.statusText);
      return [];
    }

    const data: FrontendImagesResponse = await response.json();
    console.log('✅ [SSR] 后端API响应成功:', data);
    
    if (data.code === 0 && data.data && data.data.list) {
      console.log(`✅ [SSR] 成功获取 ${data.data.list.length} 张设计图片`);
      return data.data.list;
    }
    
    console.error('❌ [SSR] 无效的API响应:', { code: data.code, msg: data.msg });
    return [];
  } catch (error) {
    console.error('❌ [SSR] 获取设计图片失败:', error);
    // 返回空数组而不是抛出错误，确保页面能正常渲染
    return [];
  }
}
