import { FrontendImageItem } from '@/types/frontendImages';
import Link from 'next/link';

interface SSRDesignLinksProps {
  images: FrontendImageItem[];
}

// 服务端组件 - 用于在HTML源码中生成设计链接
export default async function SSRDesignLinks({ images }: SSRDesignLinksProps) {
  return (
    <div className="sr-only" aria-hidden="true">
      {/* 这些链接仅用于SEO，对用户不可见但会出现在HTML源码中 */}
      {images.map((image) => (
        <Link 
          key={`ssr-link-${image.id}`}
          href={`/designs/${image.slug}`}
          prefetch={false}
        >
          {image.clothing_description}
        </Link>
      ))}
    </div>
  );
}
