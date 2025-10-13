/**
 * UTM 参数处理组件
 * 在页面加载时保存 UTM 参数到 sessionStorage
 */

'use client';

import { useEffect } from 'react';
import { saveUTMParams } from '@/utils/utm';

export function UTMHandler() {
  useEffect(() => {
    // 页面加载时保存 UTM 参数
    saveUTMParams();

    // 在开发环境加载调试工具
    if (process.env.NODE_ENV === 'development') {
      import('@/utils/analyticsDebugger').then((module) => {
        (window as any).AnalyticsDebugger = module.AnalyticsDebugger;
      });
    }
  }, []);

  // 这个组件不渲染任何内容
  return null;
}

