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

## 后续扩展建议
- 接入真实后端与鉴权（JWT）
- 丰富数据维度与分页/懒加载
- 引入 UI 库（如 Element Plus）增强筛选与表格
- 添加错误边界与性能监控