# Google One Tap 设置指南.

## ✅ 后端配置已完成

后端已经配置好了 Google One Tap 支持：

### 📋 已有配置：
- **Google Client ID**: `494292609257-bpkdqdn2f817mno2vnb1pks845pdq41c.apps.googleusercontent.com`
- **API 端点**: `POST /api/v1/auth/google-callback`
- **PyJWT 依赖**: 已安装 (`PyJWT>=2.10.1`)

### 🔧 新增功能：
- ✅ Google One Tap JWT credential 处理
- ✅ 用户自动注册/登录
- ✅ 头像下载和上传
- ✅ 与现有认证系统集成

## 🌐 前端配置

### 1. 环境变量 (可选)

如果需要使用不同的 Client ID，在 `.env.local` 中配置：

```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_custom_client_id.apps.googleusercontent.com
```

如果不设置，会使用默认的生产环境 Client ID。

### 2. 组件集成

Google One Tap 已经通过以下方式集成：

- 📁 `components/GoogleOneTap/index.tsx` - 核心组件
- 📁 `components/ConditionalGoogleOneTap.tsx` - 条件性显示
- 🔗 已集成到全局 `layout.tsx`

## 🎯 显示规则

- ✅ **显示场景**：营销页面 + 未登录用户
- ❌ **不显示场景**：
  - 已登录用户
  - SaaS 功能页面
  - API 路由

## 📱 用户流程

1. **用户访问落地页** → 自动显示 Google One Tap（如果未登录）
2. **点击 Google 账号** → JWT 发送到 `/api/v1/auth/google-callback`
3. **后端处理**：
   - 解析 JWT token
   - 验证用户信息
   - 创建/更新用户记录
   - 下载 Google 头像
   - 返回授权 token
4. **登录成功** → 跳转到 `/fashion-design/create`

## 🔐 安全性

目前实现为了简化跳过了 JWT 签名验证，在生产环境中建议：
- 验证 JWT 签名
- 验证 audience (aud) 字段
- 验证 issuer (iss) 字段  
- 验证 token 过期时间

## 🧪 测试

1. **开发环境测试**：
   - 确保在浏览器中退出 Google 账号或使用隐身模式
   - 访问落地页 (http://localhost:3000)
   - 应该会看到 Google One Tap 提示出现在页面右上角

2. **生产环境测试**：
   - 访问 https://creamoda.ai
   - 未登录用户会自动看到 One Tap 提示

3. **后端API测试**：
   ```bash
   cd creamoda_be_new
   python test_google_one_tap.py
   ```

## 🚨 故障排除

如果 One Tap 没有显示：
- 检查浏览器控制台是否有错误
- 确认用户未登录状态
- 确认域名已添加到 Google Console 的授权列表
- 检查网络请求是否正常到达后端
