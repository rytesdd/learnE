# 部署方案

## 方案一：统一部署（推荐，无 CORS 问题）

### 优点
- ✅ 无 CORS 问题
- ✅ 只需部署一个服务
- ✅ 配置简单
- ✅ 成本更低

### 部署步骤

1. **构建前端**
```bash
npm run build
```

2. **部署到 Railway**
   - 将整个项目推送到 GitHub
   - Railway 会自动检测并部署
   - 设置环境变量 `NODE_ENV=production`

3. **访问**
   - 前端和后端都在同一个域名下
   - 例如：`https://your-app.railway.app`

## 方案二：前后端分离（当前方案）

### 优点
- ✅ 前后端可以独立扩展
- ✅ 可以使用不同的技术栈

### 缺点
- ❌ 需要配置 CORS
- ❌ 需要部署两个服务
- ❌ 配置复杂

### 当前配置
- 前端：Vercel (`https://new-english-17tq.vercel.app`)
- 后端：Railway (`https://web-production-3aff5.up.railway.app`)

## 推荐

**建议使用方案一（统一部署）**，这样可以：
1. 避免所有 CORS 问题
2. 简化部署流程
3. 降低维护成本

只需要在 Railway 上部署一次，前端和后端都在同一个服务上。

