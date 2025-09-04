import { NextRequest, NextResponse } from 'next/server';
import { retryFetch } from '@/lib/utils/retryUtils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 构建查询参数
    const queryParams = new URLSearchParams();
    searchParams.forEach((value, key) => {
      queryParams.append(key, value);
    });

    // 转发请求到后端API - 使用环境变量配置的后端地址
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/common/frontend/images?${queryParams.toString()}`;
    
    console.log('🔍 请求后端URL:', backendUrl);
    
    const response = await retryFetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // 添加超时设置
      signal: AbortSignal.timeout(15000), // 15秒超时
    }, {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 5000,
      backoffMultiplier: 2
    });

    if (!response.ok) {
      console.error('❌ 后端API错误:', response.status, response.statusText);
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ 后端API响应成功:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API proxy error:', error);
    
    // 直接返回错误，不提供兜底数据
    return NextResponse.json({
      code: 500,
      msg: 'Failed to fetch images from backend',
      data: {
        list: [],
        total: 0,
        page: 1,
        page_size: 20,
        has_more: false
      }
    }, { status: 500 });
  }
}
