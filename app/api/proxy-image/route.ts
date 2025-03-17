import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    // 从服务器端获取图片，避开浏览器的CORS限制
    const response = await fetch(url, {
      headers: {
        // 模拟更完整的浏览器请求头
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        Referer: new URL(url).origin, // 设置为目标网站的域名，减少被拒绝的可能性
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }

    // 获取图片数据
    const imageBuffer = await response.arrayBuffer();

    // 确保我们有正确的内容类型 - 某些服务器可能不返回正确的类型
    let contentType = response.headers.get('content-type');

    // 如果没有内容类型或非图片类型，尝试根据数据推断类型
    if (!contentType || !contentType.startsWith('image/')) {
      // 简单的图片格式签名检测 (基本的魔数检测)
      const uint8Arr = new Uint8Array(imageBuffer);

      // JPEG: 开始于 ff d8 ff
      if (uint8Arr[0] === 0xff && uint8Arr[1] === 0xd8 && uint8Arr[2] === 0xff) {
        contentType = 'image/jpeg';
      }
      // PNG: 开始于 89 50 4E 47 0D 0A 1A 0A
      else if (uint8Arr[0] === 0x89 && uint8Arr[1] === 0x50 && uint8Arr[2] === 0x4e && uint8Arr[3] === 0x47) {
        contentType = 'image/png';
      }
      // GIF: 'GIF87a' 或 'GIF89a'
      else if (uint8Arr[0] === 0x47 && uint8Arr[1] === 0x49 && uint8Arr[2] === 0x46) {
        contentType = 'image/gif';
      }
      // WebP: 'RIFF' + size + 'WEBP'
      else if (uint8Arr[0] === 0x52 && uint8Arr[1] === 0x49 && uint8Arr[2] === 0x46 && uint8Arr[3] === 0x46) {
        contentType = 'image/webp';
      }
      // 默认假设为JPEG
      else {
        contentType = 'image/jpeg';
      }
    }

    // 返回图片数据
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // 缓存24小时
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Proxy image error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to proxy image' },
      { status: 500 }
    );
  }
}
