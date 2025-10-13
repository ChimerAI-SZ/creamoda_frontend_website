/**
 * Analytics 调试工具
 * 用于在开发环境快速测试所有埋点
 */

import { Analytics } from '@/lib/analytics';

// 在浏览器控制台中可用的调试工具
export const AnalyticsDebugger = {
  /**
   * 测试所有埋点事件（使用虚拟数据）
   */
  testAllEvents() {
    console.log('🧪 开始测试所有埋点事件...\n');

    const testUserId = 'test@creamoda.com';
    const testEmail = 'test@creamoda.com';

    // 1. 页面浏览
    console.log('1️⃣ 测试 page_view');
    Analytics.trackPageView();

    // 2. 注册点击
    console.log('2️⃣ 测试 signup_click');
    // Analytics.trackSignupClick(); // 待实现

    // 3. 注册成功
    console.log('3️⃣ 测试 signup_success');
    // Analytics.trackSignupSuccess(testUserId, testEmail); // 待实现

    // 4. 登录点击
    console.log('4️⃣ 测试 login_click');
    Analytics.trackLoginClick('email', testEmail);

    // 5. 登录成功
    console.log('5️⃣ 测试 login_success');
    Analytics.trackLoginSuccess(testUserId, testEmail, 'email');

    // 6. 上传图片
    console.log('6️⃣ 测试 upload_image');
    Analytics.trackUploadImage(testUserId, 'magic-kit', 'png', 'success', {
      file_size: 1024,
    });

    // 7. 生成点击
    console.log('7️⃣ 测试 generate_click');
    Analytics.trackGenerateClick(testUserId, 'fashion-design', 'req_test_123');

    // 8. 生成完成
    console.log('8️⃣ 测试 generate_result');
    Analytics.trackGenerateResult(
      testUserId,
      'fashion-design',
      'req_test_123',
      'success',
      { duration: 5.2 }
    );

    // 9. 下载图片
    console.log('9️⃣ 测试 download_image');
    Analytics.trackDownloadImage(testUserId, 'virtual-try-on', 'jpg', {
      file_size: 2048,
      request_id: 'req_test_123',
    });

    // 10. 付费点击
    console.log('🔟 测试 purchase_click');
    Analytics.trackPurchaseClick(testUserId, 'subscribe', '2', 29.99);

    // 11. 付费完成
    console.log('1️⃣1️⃣ 测试 purchase_result');
    Analytics.trackPurchaseResult(testUserId, 'subscribe', '2', 29.99, 'success', {
      transaction_id: 'txn_test_123',
    });

    console.log('\n✅ 所有埋点事件测试完成！请检查控制台输出。');
  },

  /**
   * 显示当前环境配置
   */
  showConfig() {
    console.log('⚙️ Analytics 配置信息：');
    console.log({
      measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '未配置',
      nodeEnv: process.env.NODE_ENV,
      sendInDev: process.env.NEXT_PUBLIC_GA_SEND_IN_DEV === 'true',
      debug: process.env.NEXT_PUBLIC_GA_DEBUG === 'true',
      gaEnabled: typeof window !== 'undefined' && !!window.gtag,
    });
  },

  /**
   * 测试单个事件
   */
  testEvent(eventName: string) {
    const testUserId = 'test@creamoda.com';
    const testEmail = 'test@creamoda.com';

    console.log(`🧪 测试事件: ${eventName}`);

    switch (eventName) {
      case 'page_view':
        Analytics.trackPageView();
        break;
      case 'login_click':
        Analytics.trackLoginClick('email', testEmail);
        break;
      case 'login_success':
        Analytics.trackLoginSuccess(testUserId, testEmail, 'email');
        break;
      case 'upload_image':
        Analytics.trackUploadImage(testUserId, 'magic-kit', 'png', 'success');
        break;
      case 'generate_click':
        Analytics.trackGenerateClick(testUserId, 'fashion-design');
        break;
      case 'generate_result':
        Analytics.trackGenerateResult(testUserId, 'fashion-design', 'req_123', 'success');
        break;
      case 'download_image':
        Analytics.trackDownloadImage(testUserId, 'virtual-try-on', 'jpg');
        break;
      case 'purchase_click':
        Analytics.trackPurchaseClick(testUserId, 'subscribe', '2', 29.99);
        break;
      case 'purchase_result':
        Analytics.trackPurchaseResult(testUserId, 'subscribe', '2', 29.99, 'success');
        break;
      default:
        console.error(`❌ 未知事件: ${eventName}`);
    }
  },

  /**
   * 显示帮助信息
   */
  help() {
    console.log(`
📊 Analytics Debugger 使用指南

在浏览器控制台中使用以下命令：

1. 测试所有埋点事件：
   AnalyticsDebugger.testAllEvents()

2. 显示配置信息：
   AnalyticsDebugger.showConfig()

3. 测试单个事件：
   AnalyticsDebugger.testEvent('login_success')

4. 显示帮助信息：
   AnalyticsDebugger.help()

可用的事件名称：
- page_view
- login_click
- login_success
- upload_image
- generate_click
- generate_result
- download_image
- purchase_click
- purchase_result
    `);
  },
};

// 在开发环境下将调试工具挂载到 window 对象
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).AnalyticsDebugger = AnalyticsDebugger;
  console.log('💡 Analytics Debugger 已加载！在控制台输入 AnalyticsDebugger.help() 查看使用方法');
}

export default AnalyticsDebugger;

