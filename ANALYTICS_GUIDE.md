# 📊 Google Analytics 埋点实施指南

## ✅ 已完成的工作

### 1. 基础设施 ✅
- ✅ 创建了类型定义 `types/analytics.ts`
- ✅ 创建了 UTM 工具 `utils/utm.ts`
- ✅ 创建了埋点工具库 `lib/analytics.ts`
- ✅ 配置了环境变量 `.env.local`
- ✅ 添加了 UTM 参数自动保存

### 2. 已集成的埋点事件 ✅

| 序号 | 事件名称 | 集成位置 | 状态 |
|------|---------|---------|------|
| 1 | `page_view` | 自动追踪 | ✅ 已完成 |
| 2 | `signup_click` | 待集成 | ⏳ 需要找到注册按钮 |
| 3 | `signup_success` | 待集成 | ⏳ 需要找到注册成功回调 |
| 4 | `login_click` | 待集成 | ⏳ 需要在登录按钮添加 |
| 5 | `login_success` | `services/authService.ts` | ✅ 已完成 |
| 6 | `upload_image` | `lib/api/common.ts` | ✅ 已完成 |
| 7 | `generate_click` | `components/GenerateButton/GenerateButton.tsx` | ✅ 已完成 |
| 8 | `generate_result` | 待集成 | ⏳ 需要在生成完成回调添加 |
| 9 | `download_image` | 待集成 | ⏳ 需要找到下载按钮 |
| 10 | `purchase_click` | `lib/api/payment.ts` | ✅ 已完成 |
| 11 | `purchase_result` | `lib/api/payment.ts` | ✅ 已完成 |

---

## 🚀 快速开始

### 1. 环境配置

已创建 `.env.local` 文件，内容如下：

```bash
# Google Analytics 配置
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-2KZH01E2XM

# 是否在开发环境也发送数据到 GA（默认：false）
NEXT_PUBLIC_GA_SEND_IN_DEV=false

# 是否启用调试模式（默认：开发环境自动启用）
NEXT_PUBLIC_GA_DEBUG=true
```

### 2. 启动开发服务器

```bash
# 安装依赖（如果还没安装）
pnpm install

# 启动开发服务器
pnpm dev
```

### 3. 查看埋点日志

打开浏览器控制台（F12），你会看到类似以下的日志：

```
[GA Event] login_success
Params: {
  user_id: "user@example.com",
  email: "user@example.com",
  method: "email",
  utm_source: "google",
  device: "desktop",
  country: "US",
  page_url: "https://...",
  timestamp: "2025-01-..."
}
Environment: {
  production: false,
  gaEnabled: true,
  sendInDev: false
}
[GA] Event "login_success" not sent (dev mode)
```

---

## 🧪 测试埋点

### 测试步骤

#### 1. 测试登录成功埋点
1. 打开网站
2. 点击登录按钮
3. 使用邮箱或 Google 登录
4. 查看控制台，应该看到 `login_success` 事件

#### 2. 测试图片上传埋点
1. 登录后进入任一创作页面
2. 上传一张图片
3. 查看控制台，应该看到 `upload_image` 事件

#### 3. 测试生成点击埋点
1. 在创作页面配置参数
2. 点击 "Generate" 按钮
3. 查看控制台，应该看到 `generate_click` 事件

#### 4. 测试付费埋点
1. 进入订阅或购买积分页面
2. 选择一个方案
3. 查看控制台，应该看到 `purchase_click` 事件

---

## 📊 在 Google Analytics 中查看数据

### 方法 1：实时报告
1. 登录 [Google Analytics](https://analytics.google.com/)
2. 选择你的 Property `G-2KZH01E2XM`
3. 进入 **报告 > 实时**
4. 在生产环境执行操作，实时查看事件

### 方法 2：调试视图
1. 安装 [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna) Chrome 扩展
2. 启用扩展
3. 刷新页面，在控制台查看详细的 GA 日志

### 方法 3：事件报告
1. 进入 **报告 > 参与度 > 事件**
2. 查看所有事件列表
3. 点击具体事件查看详情

---

## 🔧 常见问题

### Q1: 为什么开发环境看不到事件发送到 GA？
**A:** 默认配置下，开发环境只在控制台打印日志，不发送真实数据到 GA。如果想在开发环境也发送，设置：
```bash
NEXT_PUBLIC_GA_SEND_IN_DEV=true
```

### Q2: 如何关闭调试日志？
**A:** 设置环境变量：
```bash
NEXT_PUBLIC_GA_DEBUG=false
```

### Q3: 为什么有些事件没有 user_id？
**A:** user_id 只在用户登录后才有。未登录用户的事件不会包含 user_id。

### Q4: UTM 参数是如何保存的？
**A:** UTM 参数在用户首次访问时自动保存到 `sessionStorage`，在整个会话中保持不变，直到用户关闭浏览器或登出。

---

## 📝 剩余工作

### 需要添加的埋点

#### 1. 注册按钮点击埋点 (`signup_click`)
**位置**：需要在注册按钮的 `onClick` 中添加
```typescript
Analytics.trackSignupClick();
```

#### 2. 注册成功埋点 (`signup_success`)
**位置**：邮箱验证成功后的回调中添加
```typescript
Analytics.trackSignupSuccess(userId, email);
```

#### 3. 登录按钮点击埋点 (`login_click`)
**位置**：登录按钮的 `onClick` 中添加
```typescript
Analytics.trackLoginClick('email', emailValue);
// 或 Google 登录
Analytics.trackLoginClick('google');
```

#### 4. 图片生成完成埋点 (`generate_result`)
**位置**：在 `lib/api/generate.ts` 的生成函数成功回调中添加
```typescript
Analytics.trackGenerateResult(
  userId,
  featureName,
  requestId,
  'success',
  { duration: endTime - startTime }
);
```

#### 5. 下载图片埋点 (`download_image`)
**位置**：下载按钮的 `onClick` 中添加
```typescript
Analytics.trackDownloadImage(
  userId,
  featureName,
  fileType,
  { file_size: fileSize }
);
```

---

## 🎯 使用 Analytics 工具库

### 基本用法

```typescript
import { Analytics } from '@/lib/analytics';
import { usePersonalInfoStore } from '@/stores/usePersonalInfoStore';

// 在组件或函数中
const userInfo = usePersonalInfoStore.getState();

// 1. 登录成功
Analytics.trackLoginSuccess(userInfo.email, userInfo.email, 'email');

// 2. 上传图片
Analytics.trackUploadImage(
  userInfo.email,
  'magic-kit',
  'png',
  'success',
  { file_size: 1024 }
);

// 3. 生成点击
Analytics.trackGenerateClick(userInfo.email, 'fashion-design');

// 4. 生成完成
Analytics.trackGenerateResult(
  userInfo.email,
  'virtual-try-on',
  'req_12345',
  'success',
  { duration: 5.2 }
);

// 5. 下载图片
Analytics.trackDownloadImage(
  userInfo.email,
  'magic-kit',
  'jpg',
  { request_id: 'req_12345' }
);

// 6. 付费点击
Analytics.trackPurchaseClick(
  userInfo.email,
  'subscribe',
  '2',
  29.99
);

// 7. 付费完成
Analytics.trackPurchaseResult(
  userInfo.email,
  'one-time',
  '100',
  19.99,
  'success',
  { transaction_id: 'txn_12345' }
);
```

### 工具函数

```typescript
// 获取当前功能名称
const feature = Analytics.getCurrentFeatureName();
// 返回: 'magic-kit' | 'virtual-try-on' | 'fashion-design' | 'unknown'

// 获取文件扩展名
const ext = Analytics.getFileExtension('image.png');
// 返回: 'png'

// 格式化文件大小（转为 KB）
const size = Analytics.formatFileSize(2048);
// 返回: 2
```

---

## 📞 需要帮助？

如果遇到问题：
1. 检查控制台是否有错误日志
2. 确认 `.env.local` 配置正确
3. 查看浏览器控制台的埋点日志
4. 使用 Google Analytics Debugger 调试

---

## 🎉 总结

✅ **已完成**：
- 基础设施搭建完成
- 7/11 个埋点已集成
- 开发/生产环境自动区分
- UTM 参数自动追踪

⏳ **待完成**：
- 4 个埋点需要找到具体位置集成
- 根据实际业务调整价格映射
- 测试所有埋点在生产环境的表现

🚀 **下一步**：
1. 找到剩余 4 个埋点的集成位置
2. 完成所有埋点集成
3. 在测试环境验证
4. 部署到生产环境
5. 在 GA4 中创建自定义报告和转化目标

