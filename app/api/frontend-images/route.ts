import { NextRequest, NextResponse } from 'next/server';

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
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // 添加超时设置
      signal: AbortSignal.timeout(10000), // 10秒超时
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
    
    // 返回模拟数据用于开发测试
    const currentPage = parseInt(request.nextUrl.searchParams.get('page') || '1');
    const pageSize = parseInt(request.nextUrl.searchParams.get('page_size') || '20');
    const totalItems = 100;
    
    const mockData = {
      code: 0,
      data: {
        list: Array.from({ length: pageSize }, (_, i) => ({
          id: (currentPage - 1) * pageSize + i + 1,
          record_id: `record_${(currentPage - 1) * pageSize + i + 1}`,
          slug: `design-${(currentPage - 1) * pageSize + i + 1}`,
          image_url: `https://picsum.photos/300/400?random=${(currentPage - 1) * pageSize + i + 1}`,
          clothing_description: `Design ${(currentPage - 1) * pageSize + i + 1}`,
          complete_prompt: `Complete prompt for design ${(currentPage - 1) * pageSize + i + 1}`,
          type: 'Evening Wear',
          gender: 'Female',
          feature: 'AI Generated',
          create_time: new Date().toISOString()
        })),
        total: totalItems,
        page: currentPage,
        page_size: pageSize,
        has_more: currentPage * pageSize < totalItems
      }
    };
    
    return NextResponse.json(mockData);
  }
}
