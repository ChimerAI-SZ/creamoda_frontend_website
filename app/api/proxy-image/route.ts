import { NextRequest, NextResponse } from 'next/server';

// 声明为Edge Function
export const config = {
  runtime: 'edge'
};

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  // 验证URL是否有效，并检测并修复URL重复问题
  let processedUrl = url;
  try {
    // 检测是否有URL重复的情况 (例如: https://example.com/image.jpghttps://example.com/image.jpg)
    const httpMatches = url.match(/(https?:\/\/.*?)(https?:\/\/)/i);
    if (httpMatches && httpMatches.length > 2) {
      // 发现重复URL，尝试使用第一个URL
      console.warn(`[proxy-image] Detected duplicate URLs in: ${url}`);
      processedUrl = httpMatches[1];
      console.log(`[proxy-image] Using first URL part: ${processedUrl}`);
    }

    // 尝试构造有效的URL对象
    new URL(processedUrl);
  } catch (e) {
    console.error(`[proxy-image] Invalid URL format: ${processedUrl}`);
    return NextResponse.json(
      {
        error: 'Invalid URL format',
        message: 'The provided URL is not properly formatted or contains invalid characters.',
        originalUrl: url
      },
      { status: 400 }
    );
  }

  // 确保URL是http或https
  if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
    console.error(`[proxy-image] URL must start with http/https: ${processedUrl}`);
    return NextResponse.json({ error: 'URL must start with http:// or https://' }, { status: 400 });
  }

  // 检查是否正在尝试代理我们自己的OSS资源
  const urlObj = new URL(processedUrl);
  if (
    urlObj.hostname.includes('creamoda-test.oss-cn-beijing.aliyuncs.com') ||
    urlObj.hostname.includes('creamoda.oss-cn-beijing.aliyuncs.com')
  ) {
    console.error(`[proxy-image] Attempting to proxy our own OSS resource: ${processedUrl}`);
    return NextResponse.json(
      {
        error: 'Cannot proxy our own OSS resources. Use the OSS URL directly.',
        url: processedUrl
      },
      { status: 400 }
    );
  }

  console.log(`[proxy-image] Attempting to fetch: ${processedUrl}`);

  try {
    // Edge函数处理
    // 记录所有请求头部
    const headers = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      Referer: urlObj.origin,
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache'
    };

    // 从服务器端获取图片，避开浏览器的CORS限制
    let response;
    try {
      response = await fetch(processedUrl, {
        headers: headers
        // Vercel Edge Functions有自动的超时处理
      });
    } catch (fetchError) {
      console.error(`[proxy-image] Fetch network error:`, fetchError);
      throw fetchError;
    }

    // 如果遇到重定向，记录日志
    if (response.redirected) {
      console.log(`[proxy-image] URL was redirected to: ${response.url}`);
    }

    if (!response.ok) {
      console.error(`[proxy-image] Response not OK: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }

    // 获取图片数据
    let imageBuffer;
    try {
      // Edge Function使用arrayBuffer来处理二进制数据
      imageBuffer = await response.arrayBuffer();
    } catch (bufferError) {
      console.error(`[proxy-image] Error reading response body:`, bufferError);
      throw new Error(
        `Error reading response body: ${bufferError instanceof Error ? bufferError.message : String(bufferError)}`
      );
    }

    // 检查响应大小
    console.log(`[proxy-image] Successfully fetched image data: ${imageBuffer.byteLength} bytes`);
    if (imageBuffer.byteLength < 100) {
      console.warn(`[proxy-image] Warning: Response is suspiciously small (${imageBuffer.byteLength} bytes)`);
    }

    // 获取内容类型
    let contentType = response.headers.get('content-type');

    // 如果内容类型不是图片或不存在，尝试从二进制数据检测
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
      // SVG: 尝试检测XML格式，并包含svg标签
      else if (imageBuffer.byteLength > 5) {
        try {
          // 使用Array.from转换Uint8Array为普通数组，以解决类型错误
          const firstChars = Array.from(uint8Arr.slice(0, 5));
          if (String.fromCharCode.apply(null, firstChars) === '<?xml') {
            // 简单检查是否包含svg标签
            const text = new TextDecoder().decode(imageBuffer);
            if (text.includes('<svg')) {
              contentType = 'image/svg+xml';
            }
          }
        } catch (e) {
          console.warn('[proxy-image] Error while checking for SVG format:', e);
        }
      }
      // 如果没有检测到有效的图片格式，返回错误
      else {
        return NextResponse.json(
          {
            error: 'The resource does not appear to be a valid image',
            url: processedUrl,
            contentType: response.headers.get('content-type'),
            size: imageBuffer.byteLength
          },
          {
            status: 415, // Unsupported Media Type
            headers: {
              'Access-Control-Allow-Origin': '*'
            }
          }
        );
      }
    }

    // 返回图片数据，设置缓存控制
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400', // 缓存24小时
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      }
    });
  } catch (error) {
    console.error(`[proxy-image] Error fetching ${processedUrl}:`, error);

    // 提供错误信息
    let errorMessage = 'Failed to proxy image';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = 'Request timeout when fetching image';
        statusCode = 504; // Gateway Timeout
      } else if (error.message.includes('ENOTFOUND') || error.message.includes('ETIMEDOUT')) {
        errorMessage = 'Could not connect to the image server';
        statusCode = 502; // Bad Gateway
      } else {
        errorMessage = error.message;
      }
    }

    // 返回错误响应
    return NextResponse.json(
      {
        error: errorMessage,
        url: processedUrl,
        originalUrl: url !== processedUrl ? url : undefined
      },
      {
        status: statusCode,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS'
        }
      }
    );
  }
}
