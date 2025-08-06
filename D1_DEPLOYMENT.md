# Cloudflare D1 + Workers 部署指南

## 部署步骤

### 1. 安装 Wrangler CLI
```bash
npm install -g wrangler
```

### 2. 登录 Cloudflare
```bash
wrangler login
```

### 3. 创建 D1 数据库
```bash
wrangler d1 create todo-app-db
```

### 4. 获取数据库 ID
创建后会显示数据库信息，复制 `database_id` 到 `wrangler.toml`

### 5. 初始化数据库表
```bash
wrangler d1 execute todo-app-db --file schema.sql
```

### 6. 配置 wrangler.toml
将 `your-database-id` 替换为实际的数据库 ID

### 7. 部署 Workers
```bash
wrangler deploy
```

### 8. 获取 Workers URL
部署后会显示 Workers URL，格式为：`https://todo-app.your-subdomain.workers.dev`

### 9. 配置前端
在 `index.html` 中修改 Workers API 地址：
```javascript
window.WORKERS_API = 'https://todo-app.your-subdomain.workers.dev';
window.USER_ID = 'your-username'; // 可选，用于区分用户
```

## 数据库表结构

### todos 表
- `id`: 主键，自增
- `text`: 任务内容
- `important`: 是否重要 (0/1)
- `completed`: 是否完成 (0/1)
- `created_at`: 创建时间
- `completed_at`: 完成时间
- `user_id`: 用户ID

## API 接口

### GET /api/todos?user_id={user_id}
获取指定用户的所有 todos

### POST /api/todos?user_id={user_id}
创建新的 todo

### PUT /api/todos
批量更新 todos

### DELETE /api/todos?id={id}&user_id={user_id}
删除指定的 todo

### GET /health
健康检查

## 多用户支持

### 用户隔离
- 每个用户的数据通过 `user_id` 隔离
- 默认 `user_id` 为 `default`
- 可以通过设置 `window.USER_ID` 来指定用户

### 配置示例
```javascript
// 用户A
window.WORKERS_API = 'https://todo-app.your-subdomain.workers.dev';
window.USER_ID = 'userA';

// 用户B
window.WORKERS_API = 'https://todo-app.your-subdomain.workers.dev';
window.USER_ID = 'userB';
```

## 功能特性

### 实时同步
- 所有设备实时同步数据
- 离线时使用本地缓存
- 恢复网络后自动同步

### 数据持久化
- D1 数据库永久存储
- 本地 localStorage 缓存
- 支持导入/导出功能

### 网络状态检测
- 在线/离线状态自动检测
- 网络恢复后自动同步
- 页面焦点变化时刷新数据

## 部署后访问

1. **前端页面**: 部署到 Cloudflare Pages
2. **后端 API**: 部署到 Cloudflare Workers
3. **数据库**: Cloudflare D1

## 注意事项

1. Workers 部署后需要几分钟生效
2. D1 数据库有免费额度限制
3. 建议定期备份数据库
4. 生产环境建议添加认证机制

## 故障排除

### 数据库连接失败
- 检查 `wrangler.toml` 中的数据库 ID
- 确认数据库已正确初始化

### API 调用失败
- 检查 Workers URL 是否正确
- 确认 CORS 配置正确

### 同步问题
- 检查网络连接
- 确认 `user_id` 配置正确