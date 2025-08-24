'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useTheme } from '@/src/context/ThemeContext';
import Hero from '@/src/components/Hero';
import FAQ from '@/src/components/FAQ';
import Footer from '@/src/components/Footer';

interface ThemeAwarePageProps {
  initialTheme?: string;
}

export default function ThemeAwarePage({ initialTheme }: ThemeAwarePageProps) {
  const searchParams = useSearchParams();
  const { setTheme, themeId } = useTheme();
  const pathname = usePathname();

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

  return (
    <div className="min-h-screen">
      {/* <ThemeSwitcher /> */}
      <Hero />
      {pathname !== '/' && <FAQ />}
      <Footer />
    </div>
  );
} 