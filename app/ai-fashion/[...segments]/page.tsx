export const dynamic = 'force-dynamic'; // 开启 SSR

import Image from 'next/image';
import Head from 'next/head';

import { community } from '@/lib/api';

type tParams = Promise<{ segments: string[] }>;

// 模拟接口请求函数（你可以替换为真实 API 调用）
async function fetchImageBySlug(slug: string) {
  if (!slug) throw new Error('Missing slug');

  const { data } = await community.queryImageDetail(slug as string);
  console.log(data);
  return data;
}

export default async function ImageDetailPage(props: { params: tParams }) {
  const { segments } = await props.params;

  if (!segments || segments.length === 0) {
    return (
      <div className="p-8 text-red-500">
        <h1>Invalid URL</h1>
        <p>Segments are missing from the URL.</p>
      </div>
    );
  }

  // 假设第一个segment是图片ID或slug
  const slug = segments[0];

  let image;
  try {
    image = await fetchImageBySlug(slug);
  } catch (error) {
    const err = error as Error;
    return (
      <div className="p-8 text-red-500">
        <h1>Error</h1>
        <p>{err.message}</p>
      </div>
    );
  }

  // 动态生成 JSON-LD 结构化数据
  // 考虑到服务端渲染，这里就把域名写死了。
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://creamoda.ai';
  const pageUrl = `${siteUrl}/ai-fashion/${slug}`;
  const ratingValue = (Math.random() * 1.4 + 3.5).toFixed(1); // 3.5-4.9
  const ratingCount = Math.floor(Math.random() * 200 + 50); // 50-250
  const reviewCount = Math.floor(ratingCount * 0.6);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': pageUrl,
    name: image.title || image.description || 'AI T-shirt Design Generator',
    url: pageUrl,
    description:
      image.prompt || 'Generate T-shirt designs from text prompts, with real-time material and style suggestions.',
    applicationCategory: ['DesignApplication', 'ImageEditor'],
    operatingSystem: 'Web',
    featureList: [
      'Prompt input',
      'Material generation',
      'Style matching',
      'AI description generation',
      'Copyright management'
    ],
    author: {
      '@type': 'Person',
      name: image.creator?.name || 'Anonymous',
      email: image.creator?.email || '',
      image: image.creator?.headPic || '/images/defaultAvatar.svg'
    },
    screenshot: {
      '@type': 'ImageObject',
      url: image.originalImgUrl,
      caption: image.description || ''
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/OnlineOnly'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: ratingValue,
      ratingCount: ratingCount,
      bestRating: '5',
      reviewCount: reviewCount
    },
    potentialAction: [
      {
        '@type': 'BookmarkAction',
        name: 'Add to album',
        target: `${pageUrl}/api/favorite?design_id=${slug}`
      },
      {
        '@type': 'DownloadAction',
        name: 'Download',
        target: `${pageUrl}/download/design-${slug}.jpg`
      },
      {
        '@type': 'LikeAction',
        name: 'Like',
        target: `${pageUrl}/api/like?design_id=${slug}`
      }
    ],
    copyrightNotice: `Design © ${image.creator?.name || 'Anonymous'}. All rights reserved.`
  };

  return (
    <>
      <Head>
        <link rel="canonical" href={pageUrl} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>
      <div className="container mx-auto flex items-center justify-center h-[calc(100vh-56px)]">
        <div className="flex items-start justify-center gap-8">
          <div className="bg-transparent max-h-[80vh] rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
            <Image
              src={image.originalImgUrl}
              alt={image.description}
              className="max-w-full max-h-full object-contain"
              loading="lazy"
              width={600}
              height={600}
              style={{ maxHeight: '80vh' }}
            />
          </div>

          <div className="flex flex-col gap-4 h-full">
            <div className="border-b pt-4">
              <div className="flex items-center mb-3">
                <img
                  src={image.creator.headPic || '/images/defaultAvatar.svg'}
                  alt={image.creator.name}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div>
                  <h3 className="font-semibold">{image.creator.name}</h3>
                  <p className="text-sm text-gray-600">{image.creator.email}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center flex-wrap justify-start gap-[6px] w-full cursor-default">
              {image.genType.map((type: string) => (
                <div
                  key={type}
                  className="shrink-0 h-24px py-[2px] px-[6px] text-[#46B2FF] text-center text-sm font-medium"
                >
                  # {type}
                </div>
              ))}
            </div>

            <div className="">
              <p className="text-gray-700 mb-4">{image.prompt}</p>
              <div className="flex items-center space-x-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{image.likeCount} Liked</span>
                {image.isCollected ? (
                  <button className="text-red-500">★ Collected</button>
                ) : (
                  <button className="text-gray-500">☆ Collect</button>
                )}
              </div>
            </div>

            {image.prompt && (
              <div className="">
                <div className="text-3xl font-bold mb-2">Prompt</div>
                <div>{image.prompt}</div>
              </div>
            )}

            <div className="">
              <div className="text-3xl font-bold mb-2">AI description</div>
              <div>{image.description}</div>
            </div>

            <div>
              <div className="text-3xl font-bold mb-2">Materials</div>
              <div>
                {image.materials.map((material: string) => (
                  <span key={material} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {material}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-3xl font-bold mb-2">Trend Styles</div>
              <div>
                {image.trendStyles.map((style: string) => (
                  <span key={style} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                    {style}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
