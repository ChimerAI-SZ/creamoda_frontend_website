'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useTheme } from '@/src/context/ThemeContext';
import Hero from '@/src/components/Hero';
import FAQ from '@/src/components/FAQ';
import Footer from '@/src/components/Footer';

interface ThemeAwarePageProps {
  initialTheme?: string;
}

// 将使用 useSearchParams 的逻辑抽离到单独组件
function ThemeHandler({ initialTheme }: { initialTheme?: string }) {
  const searchParams = useSearchParams();
  const { setTheme, themeId } = useTheme();

  useEffect(() => {
    // 优先使用路径参数传入的主题
    if (initialTheme && initialTheme !== themeId) {
      setTheme(initialTheme);
      return;
    }

    // 备用：检查查询参数（保持向后兼容）
    const themeParam = searchParams.get('theme');
    if (themeParam && themeParam !== themeId) {
      setTheme(themeParam);
    }
  }, [initialTheme, searchParams, setTheme, themeId]);

  return null;
}

// Loading fallback for Suspense
function ThemeHandlerFallback() {
  return null;
}

export default function ThemeAwarePage({ initialTheme }: ThemeAwarePageProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <Suspense fallback={<ThemeHandlerFallback />}>
        <ThemeHandler initialTheme={initialTheme} />
      </Suspense>
      {/* <ThemeSwitcher /> */}
      <Hero />
      {pathname !== '/' && <FAQ />}
      <Footer />
    </div>
  );
} 