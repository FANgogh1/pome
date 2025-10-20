# 诗词鉴赏平台（前端演示）

基于 Vue 3 + Vite 的前端演示，实现首页、诗词列表、详情与个人中心页面的路由跳转与基础展示。数据来自前端内置的 JSON（无后端/数据库）。

## 技术栈
- Vue 3（组合式 API）
- Vue Router
- Pinia（状态管理，本地模拟数据）
- Vite

## 运行
```sh
npm install
npm run dev
```

## 页面与路由
- 首页 /           展示轮播、热门、最新诗词
- 诗词列表 /poems  搜索、筛选（朝代/题材）、排序（热度/时间）
- 诗词详情 /poems/:id 原文、注释、译文、赏析、作者介绍，点赞/收藏/分享（前端占位）
- 个人中心 /profile 我的收藏/点赞/资料占位

## 主要文件
- src/router/index.js 路由定义（懒加载）
- src/stores/index.js  Pinia 实例
- src/stores/poems.js  诗词 Store（搜索/收藏/点赞）
- src/data/poems.json  示例诗词数据
- src/pages/*.vue      四个页面组件
- src/components/NavBar.vue / AppFooter.vue 导航与页脚
- src/App.vue          整体布局（Nav + router-view + Footer）
- src/main.js          应用入口，挂载 Router 与 Pinia

## 设计说明
- 扁平化与简洁：卡片、网格布局、轻量配色（白/灰/蓝）
- 响应式：基于 CSS grid 与简单媒体查询
- 无后端：互动操作（点赞/收藏/评论输入）仅前端演示，不持久化

## AI 对话功能

项目集成了基于 n8n 工作流的 AI 对话功能：

### 功能特性
- **智能对话**：基于 DeepSeek API 的诗词鉴赏助手
- **上下文记忆**：支持多轮对话，保持对话历史
- **错误处理**：完善的错误处理和超时机制
- **响应式设计**：适配移动端和桌面端

### 技术实现
- **前端**：Vue 3 + TypeScript 实现的聊天组件
- **后端**：n8n 工作流处理 AI API 调用
- **API**：DeepSeek Chat API 提供 AI 能力

### 配置说明
1. **n8n 工作流**：导入 `workflows/AI Chat Backend (Final).json` 到你的 n8n 实例
2. **API 密钥配置**：在 n8n 中配置 DeepSeek API 凭证
   - 凭证名称：DeepSeek account
   - API Key：你的 DeepSeek API 密钥
3. **前端配置**：在 `src/components/ChatWidget.vue` 中修改 webhook URL

### 问题修复说明
**原问题**：n8n 工作流与前端 AI 对话连接不上
**根本原因**：
1. 原工作流使用了 LangChain Agent 模式，但前端发送的是简单消息格式
2. 缺少数据预处理和响应处理节点
3. 工作流节点连接配置不正确

**修复方案**：
1. 创建了最终版工作流 `AI Chat Backend (Final).json`，使用 Merge 节点合并数据流
2. 解决了 Process Response 节点输入数据不完整的问题
3. 添加了完整的错误处理和调试信息
4. 确保数据在节点间正确传递

### 工作流节点说明（最终版）
- **Webhook**：接收前端 POST 请求
- **Process Input**：JavaScript 代码节点，将前端消息转换为 DeepSeek API 格式
- **Call DeepSeek API**：HTTP Request 节点，直接调用 DeepSeek Chat API
- **Merge Data**：合并节点，将原始数据和API响应合并
- **Process Response**：JavaScript 代码节点，处理合并后的数据，返回正确格式
- **Respond to Webhook**：返回 JSON 格式的响应给前端

### 测试方法
1. 导入最终版工作流到 n8n
2. 确保 DeepSeek API 密钥配置正确
3. 运行测试脚本：`node test-final-workflow.js`
4. 或在浏览器控制台中运行测试代码

## 后续扩展建议
- 接入真实后端与鉴权（JWT）
- 丰富数据维度与分页/懒加载
- 引入 UI 库（如 Element Plus）增强筛选与表格
- 添加错误边界与性能监控
- 支持更多 AI 模型和自定义提示词

## Vercel 部署指引
- 构建命令（Build Command）：`npm run build`
- 输出目录（Output Directory）：`dist`
- 安装命令（Install Command）：`npm install` 或 `npm ci`

### 环境变量
在 Vercel 项目 Settings → Environment Variables 添加：
- `VITE_SUPABASE_URL`：你的 Supabase 项目 URL
- `VITE_SUPABASE_ANON_KEY`：你的 Supabase 匿名 Key
说明：本项目通过 `import.meta.env.*` 读取变量，必须以 `VITE_` 前缀。已提供 `.env.example` 作为参考。

### SPA 回退（history 路由）
本项目使用 `createWebHistory()`，已在根目录添加 `vercel.json`：
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
作用：所有非静态文件请求回退到 `index.html`，由前端路由接管，避免子路由访问空白或 404。

### 常见问题排查
- 页面空白或 404：检查 `vercel.json` 是否存在且如上所示；确认 Vercel 的 Build/Output 设置正确。
- 资源 404：若部署在根域名通常无需设置 `base`；如仍异常，可在 `vite.config.js` 增加 `base: '/'`。
- 环境变量未配置：浏览器控制台可能出现 Supabase 初始化警告或错误；在 Vercel 正确添加 `VITE_*` 变量后重新部署。
- 想避免服务器回退：可将路由改为 `createWebHashHistory()`（URL 中会包含 `#`，不建议生产使用）。

### 部署步骤
1. 推送代码到 Git 仓库（GitHub/GitLab/Bitbucket）。
2. 在 Vercel 导入项目，设置 Build/Output。
3. 在 Vercel 添加环境变量（参考 `.env.example`）。
4. 触发部署并在浏览器访问 `/poems`、`/profile` 等子路由验证。