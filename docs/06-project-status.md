# BoostVision.tv 项目进度与交接文档 (Project Status & Handover)

本文档记录了项目目前的开发进度、已完成模块、待办事项以及在不同环境下继续开发的步骤。

---

## 📅 最后更新时间: 2026-01-15

## ✅ 1. 已完成内容 (Completed)

### 🏗️ 架构与基础设施
- **Monorepo 搭建**: 使用 `pnpm workspaces` + `Turborepo`。
- **开发规范**: 配置了 `.cursorrules` (Cursor AI 专用规则)、`.nvmrc` (Node v20.12.0)。
- **文档体系**: `docs/` 目录下包含网站分析、目录结构、实现指南、Strapi Schema 定义。

### 🗄️ Strapi 后端 (CMS)
- **内容建模**: 完成了 9 个集合类型 (Collection Types) 和 2 个单一类型 (Single Types) 的 Schema 定义。
- **API 生成**: 建立了所有内容的 Controller, Service, Route 样板代码 (TS)。

### 🌐 Next.js 前端
- **视觉还原**: 基于 TailwindCSS 4.1 还原了原站的颜色系统、字体排版 (`Poppins` & `Roboto`) 和核心 UI 类。
- **公共组件**: 
  - `Header`: 支持多级下拉菜单、吸顶缩放、响应式菜单。
  - `Footer`: 完整五列式深色渐变布局。
- **核心页面**:
  - `Home`: 首页动态对接 Strapi 数据（App 列表、统计数据）。
  - `App Catalog`: 应用列表页布局。
  - `App Detail`: 动态详情页（包含 SEO、截图、特性网格）。
  - `Blog`: 博客列表与详情页（包含作者与日期格式化）。
- **数据层**: 封装了 `fetchStrapi` 客户端，支持 Strapi 6 扁平化数据结构。

---

## 🚧 2. 进行中 / 需完善 (In Progress)

- **交互逻辑**:
  - 应用列表和博客列表的客户端过滤（Tab 切换）逻辑目前为静态，需转换为 `Client Components`。
- **资源文件**:
  - `public/icons/` 和 `public/images/` 缺少实际的图标和图片素材（需从原站抓取）。
- **数据联调**:
  - 需在 Strapi 后台配置 **Public 角色权限**。
  - 详情页富文本目前使用 `dangerouslySetInnerHTML`。

---

## ⏳ 3. 未开始内容 (Not Started)

- **SEO 深度配置**: `sitemap.ts`, `robots.txt` 详细配置。
- **多语言 (i18n)**: 逻辑预留，尚未接入框架。
- **搜索功能**: 全局内容搜索。
- **生产环境部署**: Vercel + CMS Server 配置。

---

## 🛠️ 4. 换机开发指南 (How to continue on another machine)

如果你在另一台电脑上重新拉取代码，请执行以下操作：

### 第一步：环境准备
```bash
# 确保 Node 版本正确 (推荐 20.12.0)
nvm use

# 安装依赖
pnpm install
```

### 第二步：环境变量
在 `apps/web/.env.local` 中创建以下变量：
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=你的_STRAPI_READ_ONLY_TOKEN
```

### 第三步：启动服务
```bash
# 同时启动前后端
pnpm dev

# 或者单独启动
pnpm dev:cms  # 启动 Strapi (端口 1337)
pnpm dev:web  # 启动 Next.js (端口 3000)
```

### 第四步：Strapi 配置 (首次运行需手动)
1. 进入 `http://localhost:1337/admin` 创建管理员账号。
2. 前往 **Settings -> Roles -> Public**。
3. 勾选所有 API 的 `find` 和 `findOne` 权限。
4. 录入少量测试数据并 **Publish**。

---

**建议接下来的工作重点**: 
> 处理 `apps/web/src/app/app/page.tsx` 的 Tab 切换逻辑，并补全 `public` 目录下的图标文件。

