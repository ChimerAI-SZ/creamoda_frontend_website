import Link from 'next/link';
import { SimilarImageItem } from '@/types/frontendImages';

interface ServerSimilarImagesProps {
  similarImages: SimilarImageItem[];
}

// 纯服务端组件 - 在HTML源码中生成推荐图片链接
export default function ServerSimilarImages({ similarImages }: ServerSimilarImagesProps) {
  if (similarImages.length === 0) {
    return null;
  }

  return (
    <div className="sr-only" aria-hidden="true">
      {/* 这些链接仅用于SEO，对用户不可见但会出现在HTML源码中 */}
      <h2>Similar Design Recommendations</h2>
      {similarImages.slice(0, 5).map((img) => (
        <Link 
          key={`server-similar-${img.id}`}
          href={`/designs/${img.slug}`}
          prefetch={false}
        >
          {img.clothing_description} - Related Fashion Design
        </Link>
      ))}
    </div>
  );
}
