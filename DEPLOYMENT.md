# 📦 部署指南

## CI/CD 自动化测试与部署

本项目配置了完整的 GitHub Actions CI/CD 流程：

### 自动化工作流

1. **Test & Build** (`.github/workflows/test.yml`)
   - 自动运行 32+ 条单元测试
   - 生成覆盖率报告（目标：整体 ≥60%，核心 ≥80%）
   - 构建生产版本
   - 触发条件：push 到 main/develop 或 PR

2. **Test Report** (`.github/workflows/test-report.yml`)
   - 在 PR 中显示测试结果评论
   - 使用 JUnit 报告格式

3. **Deploy to GitHub Pages** (`.github/workflows/deploy.yml`)
   - 自动部署到 GitHub Pages
   - 触发条件：push 到 main 分支

### 本地测试命令

```bash
# 运行所有测试
npm test

# 监听模式（开发时使用）
npm run test:watch

# 生成覆盖率报告
npm run test:coverage
```

---

## 生产环境构建

### 1. 构建项目

```bash
npm run build
```

构建完成后，会在项目根目录生成 `dist/` 文件夹，包含所有静态资源。

### 2. 预览生产构建

```bash
npm run preview
```

默认访问：`http://localhost:4173/`

---

## 部署方案

### 方案 1：Vercel（推荐）⭐

最简单的一键部署方案。

#### 步骤：

1. 安装 Vercel CLI：
   ```bash
   npm install -g vercel
   ```

2. 登录 Vercel：
   ```bash
   vercel login
   ```

3. 部署项目：
   ```bash
   vercel
   ```

4. 按提示操作即可完成部署

**优势**：
- ✅ 自动 HTTPS
- ✅ 全球 CDN 加速
- ✅ 自动域名分配
- ✅ 持续集成支持

---

### 方案 2：Netlify

#### 步骤：

1. 注册 [Netlify](https://www.netlify.com/)

2. 拖拽 `dist/` 文件夹到 Netlify 控制台

3. 或者使用 Git 集成：
   - 连接 GitHub/GitLab 仓库
   - 设置构建命令：`npm run build`
   - 设置发布目录：`dist`

**netlify.toml 配置**：
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### 方案 3：GitHub Pages

#### 步骤：

1. 安装 `gh-pages`：
   ```bash
   npm install --save-dev gh-pages
   ```

2. 在 `package.json` 中添加脚本：
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. 部署：
   ```bash
   npm run deploy
   ```

4. 在 GitHub 仓库设置中启用 GitHub Pages

**注意**：如果部署在子路径，需要在 `vite.config.ts` 中设置 `base`：
```typescript
export default defineConfig({
  base: '/your-repo-name/',
  plugins: [react()],
})
```

---

### 方案 4：Nginx

#### 步骤：

1. 将 `dist/` 文件夹上传到服务器

2. Nginx 配置示例：
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/badminton-score-app/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # 开启 Gzip 压缩
       gzip on;
       gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
   }
   ```

3. 重启 Nginx：
   ```bash
   sudo systemctl restart nginx
   ```

---

### 方案 5：Docker

#### Dockerfile：

```dockerfile
# 构建阶段
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 构建和运行：

```bash
# 构建镜像
docker build -t badminton-score-app .

# 运行容器
docker run -p 80:80 badminton-score-app
```

---

## 性能优化建议

### 1. 启用 Gzip/Brotli 压缩

在 Nginx 或 CDN 中启用压缩，可减少 60-70% 的传输体积。

### 2. 使用 CDN

将静态资源托管到 CDN，提升全球访问速度。

### 3. 缓存策略

设置合理的缓存头：
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 4. 代码分割

Vite 已自动进行代码分割，无需额外配置。

---

## 环境变量

如果需要配置环境变量，创建 `.env.production` 文件：

```env
VITE_APP_TITLE=羽毛球计分器
VITE_API_URL=https://api.example.com
```

在代码中使用：
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## 监控与分析

### 推荐工具：

- **Google Analytics**：用户行为分析
- **Sentry**：错误追踪
- **Lighthouse**：性能审计

---

## 故障排查

### 问题 1：白屏

**原因**：路由配置错误或资源路径问题

**解决**：
- 检查 `vite.config.ts` 中的 `base` 配置
- 确保服务器配置了 SPA 回退规则

### 问题 2：图片导出失败

**原因**：Canvas API 在某些旧浏览器中不支持

**解决**：
- 提示用户使用现代浏览器
- 添加 polyfill 或降级方案

### 问题 3：构建失败

**原因**：依赖版本冲突

**解决**：
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 持续集成/持续部署 (CI/CD)

### GitHub Actions 示例：

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

**祝部署顺利！** 🚀
