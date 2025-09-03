import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 构建查询参数
    const queryParams = new URLSearchParams();
    searchParams.forEach((value, key) => {
      queryParams.append(key, value);
    });

    // 转发请求到后端API
    const backendUrl = `http://localhost:8000/api/v1/common/frontend/images/detail?${queryParams.toString()}`;
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // 添加超时设置
      signal: AbortSignal.timeout(10000), // 10秒超时
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API proxy error:', error);
    
    return NextResponse.json({
      code: 500,
      msg: 'Internal Server Error',
      data: null
    }, { status: 500 });
  }
}
