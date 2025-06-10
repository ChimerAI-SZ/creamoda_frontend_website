// app/api/image/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { queryImageDetail } from '@/lib/api';

export async function GET(request: NextRequest) {
  // 从路径中提取 id
  const pathname = request.nextUrl.pathname;
  const id = pathname.split('/').pop(); // 获取路径中的最后一个部分作为 id

  console.log('id', id);
  debugger;
  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const imageData = await queryImageDetail(id);

  return NextResponse.json(imageData);
}
