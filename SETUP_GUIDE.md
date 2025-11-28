# 项目环境准备指南

## 📋 需要的工具和软件

### 1. 必需工具

#### Node.js 和 npm
- **下载地址**: https://nodejs.org/
- **推荐版本**: Node.js 18.x 或更高版本
- **验证安装**:
  ```bash
  node --version
  npm --version
  ```

#### Git
- **下载地址**: https://git-scm.com/
- **验证安装**:
  ```bash
  git --version
  ```

### 2. 代码编辑器（推荐）

- **VS Code**: https://code.visualstudio.com/
- **Cursor**: https://cursor.sh/ （你当前使用的）

## 🚀 快速开始

### 步骤 1: 克隆项目

```bash
# 克隆项目到本地
git clone https://github.com/rytesdd/learnE.git

# 进入项目目录
cd learnE
```

### 步骤 2: 安装依赖

```bash
# 安装所有依赖包
npm install
```

这个过程可能需要几分钟，会下载所有需要的包。

### 步骤 3: 运行项目

#### 开发模式（推荐）

同时运行前端和后端：

```bash
npm run dev:full
```

或者分别运行：

```bash
# 终端1：运行前端开发服务器
npm run dev

# 终端2：运行后端服务器
npm run server
```

#### 访问应用

- **前端**: http://localhost:5173
- **后端 API**: http://localhost:3002

### 步骤 4: 构建生产版本

```bash
# 构建前端
npm run build

# 运行生产服务器（需要先构建）
npm start
```

## 📁 项目结构

```
learnE/
├── src/                    # 前端源代码
│   ├── components/         # React 组件
│   ├── services/          # API 服务
│   ├── utils/            # 工具函数
│   ├── App.jsx           # 主应用组件
│   └── App.css           # 样式文件
├── api/                   # Vercel Serverless Functions
│   ├── subtitle.js       # 字幕 API
│   ├── upload.js         # 上传 API
│   └── health.js         # 健康检查
├── server.js             # Express 服务器（本地开发）
├── package.json          # 项目配置和依赖
├── vite.config.js        # Vite 配置
├── vercel.json           # Vercel 部署配置
└── README.md            # 项目说明
```

## 🔧 常用命令

```bash
# 开发
npm run dev              # 只运行前端
npm run server           # 只运行后端
npm run dev:full         # 同时运行前后端

# 构建
npm run build            # 构建生产版本

# 代码检查
npm run lint             # 运行 ESLint

# 预览
npm run preview          # 预览构建后的版本
```

## 🌐 部署信息

### 当前部署

- **前端 + 后端**: Vercel (完全免费)
- **URL**: https://learn-e-kappa.vercel.app
- **GitHub 仓库**: https://github.com/rytesdd/learnE

### 部署方式

项目已配置为 Vercel 自动部署：
1. 推送到 GitHub 的 `main` 分支
2. Vercel 自动检测并部署
3. 无需手动操作

## 🐛 常见问题

### 问题 1: npm install 失败

**解决方法**:
```bash
# 清除缓存
npm cache clean --force

# 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

### 问题 2: 端口被占用

**解决方法**:
- 前端端口 5173 被占用：修改 `vite.config.js` 中的端口
- 后端端口 3002 被占用：修改 `server.js` 中的 `PORT` 变量

### 问题 3: 依赖版本冲突

**解决方法**:
```bash
# 使用 npm 的版本检查
npm outdated

# 更新依赖
npm update
```

## 📝 开发注意事项

1. **代码提交前**:
   - 运行 `npm run lint` 检查代码
   - 确保没有错误

2. **Git 工作流**:
   ```bash
   # 查看状态
   git status
   
   # 添加更改
   git add .
   
   # 提交
   git commit -m "描述你的更改"
   
   # 推送
   git push origin main
   ```

3. **环境变量**:
   - 本地开发不需要环境变量
   - Vercel 部署会自动处理

## 🔗 相关链接

- **GitHub 仓库**: https://github.com/rytesdd/learnE
- **Vercel 部署**: https://learn-e-kappa.vercel.app
- **Node.js 文档**: https://nodejs.org/docs/
- **React 文档**: https://react.dev/
- **Vite 文档**: https://vitejs.dev/

## ✅ 检查清单

在新电脑上设置完成后，确认：

- [ ] Node.js 已安装（`node --version`）
- [ ] npm 已安装（`npm --version`）
- [ ] Git 已安装（`git --version`）
- [ ] 项目已克隆（`cd learnE`）
- [ ] 依赖已安装（`npm install`）
- [ ] 项目可以运行（`npm run dev:full`）
- [ ] 浏览器可以访问 http://localhost:5173

## 🎉 完成！

现在你可以在新电脑上继续开发了！

