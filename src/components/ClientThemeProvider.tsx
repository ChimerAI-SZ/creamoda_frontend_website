'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ThemeProvider } from '@/src/context/ThemeContext';

interface ClientThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: string;
}

// 将使用 useSearchParams 的逻辑抽离到单独组件
function ThemeHandler({ initialTheme }: { initialTheme?: string }) {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // 这里可以添加客户端的主题切换逻辑
    // 但目前主要依赖服务器端传入的initialTheme
    const themeParam = searchParams.get('theme');
    if (themeParam && themeParam !== initialTheme) {
      // 如果需要，可以在这里处理客户端的主题切换
      console.log('Client theme change:', themeParam);
    }
  }, [initialTheme, searchParams]);

  return null;
}

export default function ClientThemeProvider({ children, initialTheme }: ClientThemeProviderProps) {
  return (
    <ThemeProvider initialTheme={initialTheme}>
      <Suspense fallback={null}>
        <ThemeHandler initialTheme={initialTheme} />
      </Suspense>
      {children}
    </ThemeProvider>
  );
}
