# 统一部署方案 - 详细步骤

## 🎯 目标
将前端和后端统一部署到 Railway，避免 CORS 问题，简化部署流程。

## 📋 前置准备

### 1. 确认代码已更新
确保你已经有了最新的代码，包括：
- ✅ `server.js` 已支持静态文件服务
- ✅ `package.json` 已添加 `start` 脚本
- ✅ `railway.json` 配置文件已创建

## 🚀 部署步骤

### 步骤 1: 提交代码到 GitHub

```bash
cd /Users/cc/Documents/trae_projects/learnE
git add .
git commit -m "配置统一部署：后端同时提供静态文件服务"
git push origin main
```

### 步骤 2: 登录 Railway

1. 打开浏览器，访问 https://railway.app
2. 使用 GitHub 账号登录
3. 进入你的项目（learnE）

### 步骤 3: 配置 Railway 项目

#### 3.1 设置环境变量

1. 在 Railway 项目页面，点击项目名称
2. 点击 **Variables** 标签
3. 添加以下环境变量：
   - **变量名**: `NODE_ENV`
   - **变量值**: `production`
   - 点击 **Add** 保存

#### 3.2 配置构建和启动命令（如果需要）

1. 在项目设置中，找到 **Settings** → **Deploy**
2. 检查以下配置：
   - **Build Command**: `npm run build`（或留空，Railway 会自动检测）
   - **Start Command**: `npm start`（或留空，Railway 会自动检测）

> 注意：如果创建了 `railway.json`，Railway 会自动使用其中的配置。

### 步骤 4: 触发部署

Railway 会在你推送代码后自动触发部署。如果没有自动部署：

1. 在 Railway 项目页面
2. 点击 **Deployments** 标签
3. 点击 **Redeploy** 按钮

### 步骤 5: 等待部署完成

1. 在 **Deployments** 页面查看部署状态
2. 等待状态变为 **✅ Deployed**（通常需要 2-5 分钟）
3. 如果部署失败，点击部署记录查看日志

### 步骤 6: 获取部署 URL

1. 部署完成后，在项目页面找到 **Settings** → **Networking**
2. 找到 **Public Domain** 或 **Custom Domain**
3. 复制你的应用 URL（例如：`https://your-app.up.railway.app`）

### 步骤 7: 测试部署

1. 在浏览器中打开你的 Railway URL
2. 测试前端功能是否正常
3. 测试 API 调用是否正常（打开浏览器开发者工具查看网络请求）

### 步骤 8: （可选）停止 Vercel 部署

如果之前使用 Vercel 部署前端，现在可以：

1. 登录 https://vercel.com
2. 找到你的项目
3. 在项目设置中暂停或删除部署（可选，不影响 Railway 部署）

## 🔍 验证部署

### 检查清单

- [ ] 前端页面可以正常访问
- [ ] API 请求返回正常（检查浏览器控制台）
- [ ] 没有 CORS 错误
- [ ] 所有功能正常工作

### 测试命令

```bash
# 测试健康检查
curl https://your-app.up.railway.app/health

# 测试 API
curl -X POST https://your-app.up.railway.app/api/upload \
  -H "Content-Type: application/json" \
  -d '{"content":"test","fileName":"test.txt"}'
```

## 🐛 常见问题

### 问题 1: 部署失败

**可能原因**:
- 构建命令错误
- 依赖安装失败
- 代码错误

**解决方法**:
1. 查看 Railway 部署日志
2. 检查 `package.json` 中的脚本是否正确
3. 本地运行 `npm run build` 测试构建是否成功

### 问题 2: 前端页面显示 404

**可能原因**:
- `dist` 目录未生成
- 静态文件路径配置错误

**解决方法**:
1. 确认构建成功（检查日志中是否有 `npm run build` 的输出）
2. 确认 `server.js` 中的静态文件路径正确

### 问题 3: API 请求失败

**可能原因**:
- 环境变量未设置
- 端口配置错误

**解决方法**:
1. 确认 `NODE_ENV=production` 已设置
2. Railway 会自动设置 `PORT` 环境变量，无需手动配置

## 📝 后续优化

### 自定义域名

1. 在 Railway 项目设置中
2. 找到 **Settings** → **Networking**
3. 添加自定义域名

### 环境变量管理

如果需要更多环境变量（如 API keys），在 Railway 的 **Variables** 中添加。

## ✅ 完成！

部署完成后，你的应用将：
- ✅ 前端和后端在同一个域名下
- ✅ 无 CORS 问题
- ✅ 只需维护一个部署
- ✅ 配置更简单

享受无 CORS 烦恼的部署体验！🎉

