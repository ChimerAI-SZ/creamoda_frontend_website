'use client';

import { useEffect, useState } from 'react';
import { getMainDomainUrl } from '../../utils/navigation';

interface DynamicCreateButtonProps {
  fallbackUrl?: string;
  className?: string;
}

export default function DynamicCreateButton({ 
  fallbackUrl = 'https://www.creamoda.ai/fashion-design/create',
  className = 'create-btn'
}: DynamicCreateButtonProps) {
  const [createUrl, setCreateUrl] = useState(fallbackUrl);

  useEffect(() => {
    // 客户端环境下动态获取正确的域名
    const dynamicUrl = `${getMainDomainUrl()}/fashion-design/create`;
    setCreateUrl(dynamicUrl);
  }, []);

  return (
    <a 
      href={createUrl} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={className}
    >
      Create
    </a>
  );
}
