export const dynamic = 'force-dynamic'; // 开启 SSR

import Image from 'next/image';

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={image.originalImgUrl}
            alt={image.description}
            className="w-full h-auto object-contain"
            loading="lazy"
            width={500}
            height={500}
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{image.description}</h1>
          <div className="mb-6">
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

          <div className="border-t pt-4">
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

          <div className="mt-6">
            <div className="flex flex-wrap gap-2">
              {image.genType.map((tag: string) => (
                <span key={tag} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
              {image.materials.map((material: string) => (
                <span key={material} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {material}
                </span>
              ))}
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
  );
}
