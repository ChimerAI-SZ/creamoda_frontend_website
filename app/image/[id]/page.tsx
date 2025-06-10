import { ImageData } from './type';
import { LoginModal } from '@/app/app-components/Login';
import { Metadata } from 'next';

interface ImagePageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return Array.from({ length: 10 }, (_, i) => ({ id: (i + 1).toString() }));
}

async function getImageData(id: string): Promise<ImageData> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_NEXT_SERVER_URL}/api/image/${id}`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching image data:', error);
    throw error;
  }
}

// ✅ 这里是重点：生成页面的 SEO Metadata
export async function generateMetadata({ params }: ImagePageProps): Promise<Metadata> {
  const { id } = await params;
  const image = await getImageData(id);
  return {
    keywords: [...(image?.genType ?? []), ...(image?.materials ?? []), ...(image?.trendStyles ?? [])].join(',')
  };
}

// 页面组件
export default async function ImageDetailPage({ params }: ImagePageProps) {
  // 确保在使用 params 之前等待其解析
  const { id } = await params;
  console.log('Image ID:', id);
  let image;
  try {
    image = await getImageData(id);
    console.log('Image Data:', image);
  } catch (error) {
    console.error('Error fetching image data:', error);
    return <div>Error loading image data.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={image?.originalImgUrl}
            alt={image?.description}
            className="w-full h-auto object-contain"
            loading="lazy"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{image?.description}</h1>
          <div className="mb-6">
            <p className="text-gray-700 mb-4">{image?.prompt}</p>
            <div className="flex items-center space-x-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{image?.likeCount} Liked</span>
              {image?.isCollected ? (
                <button className="text-red-500">★ Collected</button>
              ) : (
                <button className="text-gray-500">☆ Collect</button>
              )}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center mb-3">
              <img src={image?.creator.headPic} alt={image?.creator.name} className="w-12 h-12 rounded-full mr-3" />
              <div>
                <h3 className="font-semibold">{image?.creator.name}</h3>
                <p className="text-sm text-gray-600">{image?.creator.email}</p>
              </div>
            </div>
          </div>

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
