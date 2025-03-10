import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/');
  const url = new URL(request.url);
  const queryString = url.search;

  try {
    const response = await fetch(`http://8.130.25.28:8000/${path}${queryString}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: '代理请求失败' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/');
  const body = await request.json();

  try {
    const response = await fetch(`http://8.130.25.28:8000/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MTcyNTM3ODJAcXEuY29tIiwiZXhwIjoxNzQyMTk1ODYwfQ.CA7U7us-WqysWG1qgWEZk7wE-JPut-kAV73eLO4LqdQ'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: '代理请求失败' }, { status: 500 });
  }
}

// 可以根据需要添加其他HTTP方法（PUT, DELETE等）
