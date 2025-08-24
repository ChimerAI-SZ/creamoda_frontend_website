import type { Metadata } from 'next';
import ThemeAwarePage from '@/src/components/ThemeAwarePage';

export const metadata: Metadata = {
  title: 'Creamoda AI Tools | 首页',
  description: '一站式 AI 图片编辑工具集合：背景移除、背景替换、图片增强、颜色替换、局部修改、草图转图、虚拟试衣与服装生成。',
};

export default function Home() {
  return <ThemeAwarePage initialTheme="background_remove" />;
}
