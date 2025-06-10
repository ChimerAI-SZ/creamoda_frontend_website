// app/image/[id]/page.tsx
import { ImageData } from './type';
import { LoginModal } from '@/app/app-components/Login';

interface ImagePageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  // 生成前10个页面的静态路径
  return Array.from({ length: 10 }, (_, i) => ({
    id: (i + 1).toString()
  }));
}

async function getImageData(id: string): Promise<ImageData> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/image/${id}`);
  const data = await res.json();
  console.log('Fetched data:', data);
  return data.data;
}

export default async function ImageDetailPage({ params }: ImagePageProps) {
  const image = await getImageData(params?.id);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* SEO 优化 */}
      <head>
        <title>{image?.description} | AI艺术画廊</title>
        <meta name="description" content={image?.prompt} />
        <meta property="og:image" content={image?.originalImgUrl} />
      </head>

      <div className="grid md:grid-cols-2 gap-8">
        {/* 图片展示区 */}
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={image?.originalImgUrl}
            alt={image?.description}
            className="w-full h-auto object-contain"
            loading="lazy"
          />
        </div>

        {/* 图片详情 */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{image?.description}</h1>

          <div className="mb-6">
            <p className="text-gray-700 mb-4">{image?.prompt}</p>
            <div className="flex items-center space-x-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{image?.likeCount} 人喜欢</span>
              {image?.isCollected ? (
                <button className="text-red-500">★ 已收藏</button>
              ) : (
                <button className="text-gray-500">☆ 收藏</button>
              )}
            </div>
          </div>

          {/* 创作者信息 */}
          <div className="border-t pt-4">
            <div className="flex items-center mb-3">
              <img src={image?.creator.headPic} alt={image?.creator.name} className="w-12 h-12 rounded-full mr-3" />
              <div>
                <h3 className="font-semibold">{image?.creator.name}</h3>
                <p className="text-sm text-gray-600">{image?.creator.email}</p>
              </div>
            </div>
          </div>

          {/* 标签信息 */}
          <div className="mt-6">
            <div className="flex flex-wrap gap-2">
              {image?.genType.map(tag => (
                <span key={tag} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
              {image?.materials.map(material => (
                <span key={material} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {material}
                </span>
              ))}
              {image?.trendStyles.map(style => (
                <span key={style} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                  {style}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <LoginModal />
    </div>
  );
}
