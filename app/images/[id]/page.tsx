// import { ImageData } from './type';
// import { queryImageDetail } from '@/lib/api';

// import { log } from '@/utils';

// async function getImageData(id: string): Promise<ImageData> {
//   try {
//     log('Fetching image data for ID:', id);
//     const { data } = await queryImageDetail(id);

//     log('Fetched data:', data);
//     return data;
//   } catch (error) {
//     log('Error fetching image data:', JSON.stringify(error));
//     throw error;
//   }
// }
'use client';
// 页面组件
export default function ImageDetailPage() {
  // const id = params.id;
  let image;
  try {
    // image = await getImageData(id);
    image = {
      genImgId: 660,
      genType: ['design', 'text to image'],
      prompt: 'Helped me generate a cool T-shirt with a cat on it',
      originalImgUrl: 'https://creamoda-test.oss-cn-beijing.aliyuncs.com/uploads/20250528141224_d74b45af.jpg',
      materials: [],
      trendStyles: [],
      description: 'test desc',
      isLike: 0,
      likeCount: 1,
      isCollected: 0,
      creator: {
        uid: 46,
        name: 'Rick_123',
        email: '417253782@qq.com',
        headPic: ''
      }
    };
  } catch (error) {
    const err = error as Error; // 将 error 转换为 Error 类型
    return (
      <div>
        <h1>Error</h1>
        <p>{err.message}</p>
      </div>
    );
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
              <img src={image?.creator?.headPic} alt={image?.creator.name} className="w-12 h-12 rounded-full mr-3" />
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
    </div>
  );
}
