# 🎯 Google Analytics 埋点系统 - 快速入门

## ✨ 核心功能

✅ **智能环境区分** - 开发环境只打印日志，生产环境发送真实数据  
✅ **自动 UTM 追踪** - 自动保存并追踪营销参数  
✅ **完整类型支持** - TypeScript 类型定义，智能提示  
✅ **调试工具** - 内置调试器，快速测试所有埋点  

---

## 🚀 快速测试（3分钟）

### 1. 启动项目

```bash
pnpm dev
```

### 2. 打开浏览器控制台

访问 http://localhost:3000，按 F12 打开控制台

### 3. 运行调试命令

```javascript
// 查看帮助
AnalyticsDebugger.help()

// 测试所有埋点
AnalyticsDebugger.testAllEvents()

// 查看配置
AnalyticsDebugger.showConfig()
```

### 4. 检查输出

你应该看到类似这样的日志：

```
[GA Event] login_success
Params: { user_id: "test@creamoda.com", ... }
[GA] Event "login_success" not sent (dev mode)
```

---

## 📊 已集成的埋点

| 事件 | 触发时机 | 状态 |
|------|---------|------|
| ✅ login_success | 用户登录成功 | 已完成 |
| ✅ upload_image | 图片上传成功/失败 | 已完成 |
| ✅ generate_click | 点击生成按钮 | 已完成 |
| ✅ purchase_click | 点击订阅/购买 | 已完成 |
| ✅ purchase_result | 支付成功/失败 | 已完成 |
| ⏳ signup_click | 点击注册按钮 | 待集成 |
| ⏳ signup_success | 注册完成 | 待集成 |
| ⏳ login_click | 点击登录按钮 | 待集成 |
| ⏳ generate_result | 图片生成完成 | 待集成 |
| ⏳ download_image | 下载图片 | 待集成 |

---

## 💻 代码使用示例

```typescript
import { Analytics } from '@/lib/analytics';
import { usePersonalInfoStore } from '@/stores/usePersonalInfoStore';

// 获取用户信息
const userInfo = usePersonalInfoStore.getState();

// 发送埋点
Analytics.trackLoginSuccess(userInfo.email, userInfo.email, 'email');
Analytics.trackGenerateClick(userInfo.email, 'magic-kit');
Analytics.trackUploadImage(userInfo.email, 'fashion-design', 'png', 'success');
```

---

## ⚙️ 环境配置

**`.env.local` 已配置：**

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-2KZH01E2XM     # 你的 GA ID
NEXT_PUBLIC_GA_SEND_IN_DEV=false               # 开发环境不发送
NEXT_PUBLIC_GA_DEBUG=true                      # 启用调试日志
```

---

## 📝 待完成任务

### 需要找到并集成的埋点位置

1. **注册按钮点击** - 需要找到注册按钮组件
2. **注册成功** - 需要找到注册成功的回调
3. **登录按钮点击** - 需要找到登录按钮组件
4. **生成完成** - 需要在生成 API 成功回调中添加
5. **下载图片** - 需要找到下载按钮组件

### 集成示例

```typescript
// 1. 注册按钮点击
<Button onClick={() => {
  Analytics.trackSignupClick();
  // ... 原有逻辑
}}>注册</Button>

// 2. 登录按钮点击
<Button onClick={() => {
  Analytics.trackLoginClick('email', email);
  // ... 原有逻辑
}}>登录</Button>

// 3. 生成完成（在 API 回调中）
const result = await generateImage(params);
if (result.success) {
  Analytics.trackGenerateResult(
    userInfo.email,
    'magic-kit',
    result.requestId,
    'success'
  );
}

// 4. 下载图片
<Button onClick={() => {
  Analytics.trackDownloadImage(userInfo.email, 'magic-kit', 'jpg');
  // ... 下载逻辑
}}>下载</Button>
```

---

## 📈 在 Google Analytics 查看数据

### 实时查看（生产环境）
1. 访问 https://analytics.google.com/
2. 选择 Property `G-2KZH01E2XM`
3. 进入 **报告 > 实时**

### 查看历史数据
1. 进入 **报告 > 参与度 > 事件**
2. 查看所有埋点事件

---

## 🛠️ 文件结构

```
Creadmoda_revamped_fe/
├── types/
│   └── analytics.ts              # 埋点事件类型定义
├── utils/
│   ├── utm.ts                    # UTM 参数工具
│   └── analyticsDebugger.ts      # 调试工具
├── lib/
│   └── analytics.ts              # 埋点核心库 ⭐
├── components/
│   └── UTMHandler.tsx            # UTM 自动处理
├── services/
│   └── authService.ts            # ✅ 已添加登录埋点
├── lib/api/
│   ├── common.ts                 # ✅ 已添加上传埋点
│   └── payment.ts                # ✅ 已添加支付埋点
└── components/GenerateButton/
    └── GenerateButton.tsx        # ✅ 已添加生成埋点
```

---

## 🎯 下一步

1. ✅ **基础设施已完成** - 可以开始使用
2. ⏳ **找到剩余埋点位置** - 需要你的帮助
3. ⏳ **完成所有集成** - 按照上面的示例
4. ⏳ **生产环境测试** - 部署后验证
5. ⏳ **创建 GA4 报告** - 配置转化目标

---

## 💡 提示

- 开发时在控制台输入 `AnalyticsDebugger.help()` 查看所有命令
- 所有埋点自动包含 UTM 参数、设备信息、页面信息
- 用户登录后会自动设置 `user_id` 用于跨会话追踪
- 详细文档请查看 `ANALYTICS_GUIDE.md`

---

**🎉 系统已就绪，开始追踪用户行为吧！**

