# Cloudflare Pages 部署指南

## 部署步骤

### 1. 准备文件
确保以下文件在项目根目录：
- `index.html` - 主应用文件
- `README.md` - 项目说明（可选）

### 2. 登录 Cloudflare Dashboard
- 访问 https://dash.cloudflare.com
- 登录您的 Cloudflare 账户

### 3. 创建 Pages 项目
1. 在左侧菜单中选择 "Pages"
2. 点击 "Create a project"
3. 选择 "Connect to Git"

### 4. 连接 GitHub 仓库
1. 选择您的 GitHub 仓库 `CallMeChou/todo-app`
2. 授权 Cloudflare 访问您的仓库
3. 配构建设置：
   - **Framework preset**: `None`
   - **Build command**: 留空
   - **Build output directory**: 留空
   - **Root directory**: `/`

### 5. 环境变量配置（可选）
如果您想启用云端同步功能，可以配置以下环境变量：
- `GITHUB_TOKEN` - GitHub 个人访问令牌
- `GIST_ID` - GitHub Gist ID

### 6. 保存并部署
点击 "Save and Deploy" 开始部署

## 数据存储方案

### 方案1：纯本地存储（默认）
- 数据存储在浏览器 localStorage
- 刷新页面数据不会丢失
- 适合个人使用

### 方案2：GitHub Gist 云端同步
1. 创建 GitHub Gist：
   - 访问 https://gist.github.com
   - 创建新的 Gist，文件名设为 `todos.json`
   - 内容设为 `[]`

2. 获取 Gist ID：
   - 创建后，URL 格式为：https://gist.github.com/username/{gist_id}
   - 复制 {gist_id} 部分

3. 修改 `index.html` 文件：
   在 `<script>` 标签开始处添加：
   ```javascript
   window.GIST_ID = 'your_gist_id';
   window.GITHUB_TOKEN = 'your_github_token';
   ```

### 方案3：导入/导出功能
- 点击 "导出数据" 按钮备份到本地文件
- 点击 "导入数据" 按钮恢复数据

## 部署后访问
部署完成后，您将获得一个 `.pages.dev` 域名的网站，例如：
`https://todo-app.pages.dev`

## 注意事项
1. Cloudflare Pages 只支持静态网站
2. 数据存储依赖客户端技术
3. 如需多人协作，建议配置 GitHub Gist 同步
4. 定期导出数据作为备份