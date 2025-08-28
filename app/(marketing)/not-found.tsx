import Link from 'next/link';
import { getRouteByTheme } from '@/src/config/routes';

export default function NotFound() {
  const defaultRoute = getRouteByTheme('background_remove');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">页面未找到</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          抱歉，您访问的页面不存在。可能是链接错误或页面已被移除。
        </p>
        <div className="space-y-4">
          <Link
            href={`/${defaultRoute}`}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回首页
          </Link>
          <div className="text-sm text-gray-500">
            <p>可用页面：</p>
            <div className="mt-2 space-y-1">
              <Link href="/image-background-remover" className="block text-blue-600 hover:underline">
                AI背景移除
              </Link>
              <Link href="/image-background-changer" className="block text-blue-600 hover:underline">
                AI背景替换
              </Link>
              <Link href="/image-enhancer" className="block text-blue-600 hover:underline">
                AI图像增强
              </Link>
              <Link href="/image-color-changer" className="block text-blue-600 hover:underline">
                AI颜色替换
              </Link>
              <Link href="/virtual-try-on" className="block text-blue-600 hover:underline">
                AI虚拟试穿
              </Link>
              <Link href="/outfit-generator" className="block text-blue-600 hover:underline">
                AI服装生成
              </Link>
              <Link href="/sketch-to-image" className="block text-blue-600 hover:underline">
                AI草图转图片
              </Link>
              <Link href="/image-changer" className="block text-blue-600 hover:underline">
                AI局部编辑
              </Link>
              <Link href="/free-nano-banana" className="block text-blue-600 hover:underline">
                AI纳米香蕉设计器
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 