# Netlify 部署指南

由于当前环境限制，请按照以下步骤手动部署到 Netlify：

## 方法一：通过 Netlify 网站部署（推荐）

1. 访问 [Netlify](https://app.netlify.com/)
2. 登录您的账号（如果没有账号，请先注册）
3. 点击 "Add new site" -> "Deploy manually"
4. 将项目的 `.next` 文件夹拖拽到页面中
5. 等待部署完成

## 方法二：通过 Git 集成部署

1. 将代码推送到 GitHub/GitLab/Bitbucket
2. 在 Netlify 中点击 "Add new site" -> "Import an existing project"
3. 选择您的代码仓库
4. 配置以下构建设置：
   - Build command: `npm run build`
   - Publish directory: `.next`
5. 添加环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`: https://zzyueuweeoakopuuwfau.supabase.co
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6eXVldXdlZW9ha29wdXV3ZmF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzODEzMDEsImV4cCI6MjA1OTk1NzMwMX0.y8V3EXK9QVd3txSWdE3gZrSs96Ao0nvpnd0ntZw_dQ4
   - `NEXT_PUBLIC_APP_NAME`: PVRSD Test System

## 方法三：使用 Netlify CLI（需要认证）

如果您已经有 Netlify 账号并且可以获取访问令牌：

1. 获取 Netlify 访问令牌：
   - 访问 https://app.netlify.com/user/applications#personal-access-tokens
   - 创建新的个人访问令牌

2. 设置环境变量：
   ```bash
   export NETLIFY_AUTH_TOKEN=your-token-here
   ```

3. 部署项目：
   ```bash
   npx netlify-cli deploy --prod --dir=.next
   ```

## 部署后的测试

部署成功后，您将获得一个类似 `https://your-site-name.netlify.app` 的 URL。

### 需要测试的功能：

1. **首页**
   - 检查页面是否正确加载
   - 导航链接是否正常工作

2. **数据大屏**（/dashboard）
   - 检查实时数据展示
   - 图表是否正确渲染
   - 3D 可视化是否正常

3. **实验管理页面**
   - 高压试验（/experiments/high-voltage）
   - 泄漏电流（/experiments/leakage）
   - 正常工况（/experiments/normal）
   - 非正常工况（/experiments/abnormal）
   - 实验仿真（/experiments/simulation）

4. **数据管理**（/data）
   - 文件上传功能
   - 数据表格显示
   - 导出功能

## 已知问题

1. 实验仿真页面目前显示"功能正在开发中"
2. 部分 3D 功能可能需要 WebGL 支持

## 环境变量说明

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 项目 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase 匿名密钥
- `NEXT_PUBLIC_APP_URL`: 应用的公开 URL（部署后更新）
- `NEXT_PUBLIC_APP_NAME`: 应用名称