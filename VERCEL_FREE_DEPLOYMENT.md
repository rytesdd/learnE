# 🆓 Vercel 免费部署方案（完全免费！）

## 为什么选择 Vercel？

- ✅ **完全免费**（个人项目，无限制）
- ✅ 前端和后端在同一平台（无 CORS 问题）
- ✅ 自动 HTTPS 和 CDN
- ✅ 自动部署（GitHub 推送即部署）
- ✅ 全球加速
- ✅ 无需配置服务器

## 📋 部署步骤

### 步骤 1: 准备代码

代码已经准备好了：
- ✅ `vercel.json` 配置文件
- ✅ `api/index.js` API 路由文件
- ✅ 前端代码在 `src/` 目录

### 步骤 2: 登录 Vercel

1. 访问 https://vercel.com
2. 使用 **GitHub 账号**登录
3. 点击 **Add New Project**

### 步骤 3: 导入项目

1. 选择你的 GitHub 仓库：`rytesdd/learnE`
2. Vercel 会自动检测配置

### 步骤 4: 配置项目（重要！）

在项目设置页面：

1. **Framework Preset**: 选择 `Vite`
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`
4. **Install Command**: `npm install`

### 步骤 5: 环境变量（如果需要）

通常不需要，但如果需要可以添加：
- 在 **Environment Variables** 中添加

### 步骤 6: 部署

1. 点击 **Deploy**
2. 等待 2-3 分钟
3. 部署完成后会给你一个 URL（例如：`https://learn-e.vercel.app`）

### 步骤 7: 测试

1. 打开部署的 URL
2. 测试所有功能
3. 检查浏览器控制台（应该没有 CORS 错误）

## 🎯 优势

### 与 Railway 对比

| 特性 | Railway | Vercel |
|------|---------|--------|
| 费用 | $5/月（试用后） | **完全免费** |
| CORS | 需要配置 | **无需配置** |
| 部署 | 需要配置 | **自动检测** |
| 速度 | 一般 | **全球 CDN** |

## 🔄 从 Railway 迁移

如果你已经在 Railway 上部署了：

1. **保留 Railway 部署**（试用期内免费）
2. **同时在 Vercel 部署**（完全免费）
3. **测试 Vercel 版本**
4. **如果一切正常，可以停止 Railway**

## 📝 注意事项

### API 路由

- API 路由在 `api/` 目录下
- 访问路径：`/api/subtitle`、`/api/upload` 等
- Vercel 会自动处理路由

### 静态文件

- 前端构建后的文件在 `dist/` 目录
- Vercel 会自动提供静态文件服务

### 环境变量

- 如果需要，在 Vercel 项目设置中添加
- 通常不需要 `NODE_ENV`（Vercel 自动设置）

## ✅ 完成！

部署完成后：
- ✅ 前端和后端都在同一个域名
- ✅ 无 CORS 问题
- ✅ 完全免费
- ✅ 自动部署

享受免费的部署体验！🎉

