// app/api/image/[id]/route.ts
import { NextResponse } from 'next/server';
import { ImageResponse } from '@/app/image/[id]/type';

import { queryImageDetail } from '@/lib/api';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  const imageData = await queryImageDetail(id);

  return NextResponse.json(imageData);
}
