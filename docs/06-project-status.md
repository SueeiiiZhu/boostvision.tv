# BoostVision.tv 项目进度与交接文档 (Project Status & Handover)

本文档记录了项目目前的开发进度、已完成模块、待办事项以及在不同环境下继续开发的步骤。

---

## 📅 最后更新时间: 2026-01-16

## ✅ 1. 已完成内容 (Completed)

### 🏗️ 架构与基础设施
- **Monorepo 搭建**: 使用 `pnpm workspaces` + `Turborepo`。
- **开发规范**: 配置了 `.cursorrules` (Cursor AI 专用规则)、`.nvmrc` (Node v20.12.0)。
- **多语言架构 (i18n)**: 
  - 集成了 `next-intl` 框架。
  - 实现了基于动态路由 `[locale]` 的多语言方案。
  - 配置了中间件 (`middleware.ts`) 实现自动语言识别与重定向。
  - **多语言适配完成**: 完成了英 (en)、葡 (pt)、西 (es)、法 (fr)、德 (de)、日 (ja) 六种语言的基础翻译配置。
  - **Strapi 数据联调**: 
    - 升级了 Strapi 客户端，全面支持 `locale` 参数。
    - 所有前端页面（首页、详情页、搜索等）均已实现根据当前语言从 Strapi 获取对应的本地化内容。

### 🗄️ Strapi 后端 (CMS)
- **内容建模**: 完成了 9 个集合类型 (Collection Types) 和 2 个单一类型 (Single Types) 的 Schema 定义。
- **API 生成**: 建立了所有内容的 Controller, Service, Route 样板代码 (TS)。

### 🌐 Next.js 前端
- **视觉还原**: 基于 TailwindCSS 4.1 还原了原站的颜色系统、字体排版 (`Poppins` & `Roboto`) 和核心 UI 类。
- **公共组件**: 
  - `Header`: 
    - 支持多级下拉菜单、吸顶缩放、响应式菜单。
    - **语言切换器**: 支持实时切换六种语言，并保持当前路径。
    - 集成了 **全局内容搜索入口**。
  - `Footer`: 完整五列式深色渐变布局，已适配国际化链接。
  - `RichText`: 基于 `@strapi/blocks-react-renderer` 的富文本渲染组件。
- **核心页面**:
  - `Home`: 首页全面动态化，支持国际化元数据 (Metadata) 和内容展示。
  - `App Catalog/Detail`, `Blog`, `Tutorial`, `FAQ`: 均已迁移至 `[locale]` 路由下，支持多语言访问及 Strapi 动态内容切换。
  - `Search`: 支持多语言环境下的实时检索。
- **数据层**: 封装了 `fetchStrapi` 客户端，支持 Strapi 6 扁平化数据结构及多语言查询。
- **SEO 增强**: 
  - 动态 `sitemap.ts` 与 `robots.txt` 配置。
  - 全球化 Metadata 策略，支持不同语言的 SEO 优化。
  - 核心页面 `JSON-LD` 结构化数据接入。

### 🚀 生产环境部署
- **部署配置**: 
  - 提供了 `vercel.json` 根目录配置。
  - 提供了 `apps/web/env.example` 环境变量模板。
  - 完善了 `docs/07-production-deployment.md` 生产部署指南。
  - 优化了 `next.config.ts` 生产环境资源加载与 i18n 支持。

---

## 🚧 2. 进行中 / 需完善 (In Progress)

- **数据联调 (权限)**:
  - 需在 Strapi 后台配置 **Public 角色权限**。
- **交互细节**:
  - 移动端菜单的滑动流畅度及详情页 Tab 的切换动画。

---

## ⏳ 3. 未开始内容 (Not Started)

- **生产环境正式发布**: 待域名解析及 CMS 正式上线后的联调。

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

---

**建议接下来的工作重点**: 
> 处理生产环境部署流程，或完善移动端交互体验。
