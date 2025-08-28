'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface DemoThumbnailProps {
  imageSrc: string;
  index: number;
  title: string;
  saasUrl: string;
}

export default function DemoThumbnail({ imageSrc, index, title, saasUrl }: DemoThumbnailProps) {
  const router = useRouter();

  const handleDemoClick = () => {
    router.push(saasUrl);
  };

  return (
    <div 
      key={index} 
      className="demo-thumb"
      onClick={handleDemoClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleDemoClick();
        }
      }}
    >
      <Image
        src={imageSrc}
        alt={`Demo image ${index + 1} for ${title}`}
        width={50}
        height={50}
        className="demo-img"
      />
    </div>
  );
}
