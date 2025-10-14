// 在生产环境控制台执行这个脚本来测试 GA 事件

// 1. 检查环境配置
console.log('=== GA 环境检查 ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('GA_MEASUREMENT_ID:', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
console.log('Has gtag:', typeof window.gtag);
console.log('');

// 2. 手动发送测试事件
console.log('=== 发送测试事件 ===');

if (typeof window.gtag === 'function') {
  // 发送测试事件
  window.gtag('event', 'test_manual_event', {
    test_param: 'test_value',
    timestamp: new Date().toISOString(),
    source: 'manual_test'
  });
  
  console.log('✅ 测试事件已发送: test_manual_event');
  console.log('');
  console.log('现在去 GA DebugView 查看是否有 "test_manual_event"');
  console.log('如果 DebugView 中出现了，说明 GA 配置正常');
  console.log('如果没有出现，说明有其他问题');
} else {
  console.error('❌ window.gtag 不存在，GA 未正确加载');
}

// 3. 发送我们自定义的事件
console.log('');
console.log('=== 发送自定义登录事件 ===');

if (typeof window.gtag === 'function') {
  window.gtag('event', 'login_success', {
    user_id: 'test_user_123',
    email: 'test@example.com',
    method: 'email',
    device: 'desktop',
    country: 'CN',
    page_url: window.location.href,
    page_title: document.title,
    timestamp: new Date().toISOString()
  });
  
  console.log('✅ 自定义登录事件已发送: login_success');
  console.log('');
  console.log('等待 10-30 秒后，去 GA DebugView 查看');
}

