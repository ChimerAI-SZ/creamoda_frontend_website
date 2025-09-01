import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  context?: string;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export default function OptimizedImage({
  src,
  alt,
  width = 400,
  height = 300,
  priority = false,
  className = '',
  context = '',
  sizes,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
}: OptimizedImageProps) {
  // 使用传入的alt属性，如果没有则使用context作为fallback
  const optimizedAlt = alt || `${context} - Creamoda AI` || 'Creamoda AI Tool';
  
  // 默认sizes配置，针对不同屏幕尺寸优化
  const defaultSizes = sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
  
  return (
    <Image
      src={src}
      alt={optimizedAlt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      sizes={defaultSizes}
      quality={quality}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      loading={priority ? 'eager' : 'lazy'}
      style={{
        width: 'auto',
        height: 'auto',
        objectFit: 'cover'
      }}
    />
  );
}
