# 后续开发流程

基础项目框架已搭建完成，以下是后续开发步骤：

## 📋 开发阶段概览

```
Phase 1: Strapi CMS 配置 (1-2天)
Phase 2: 前端页面开发 (3-5天)
Phase 3: API 集成 (2-3天)
Phase 4: 内容迁移 (2-3天)
Phase 5: SEO & 优化 (1-2天)
Phase 6: 测试 & 部署 (1-2天)
```

---

## Phase 1: Strapi CMS 配置

### 1.1 安装 Strapi

```bash
cd apps
npx create-strapi-app@latest cms --quickstart --typescript
```

### 1.2 创建 Content Types

根据 `docs/04-strapi-schemas.md` 创建以下内容类型：

#### Collection Types
- [ ] **App** - 应用信息（名称、slug、类型、描述、下载链接等）
- [ ] **Blog Post** - 博客文章
- [ ] **Blog Category** - 博客分类
- [ ] **Author** - 作者信息
- [ ] **Tutorial** - 教程
- [ ] **FAQ** - 常见问题
- [ ] **Page** - 静态页面（关于我们、隐私政策等）

#### Single Types
- [ ] **Homepage** - 首页配置（Hero、Stats、Featured Apps）
- [ ] **Global Settings** - 全局配置（Logo、导航、页脚）

#### Components
- [ ] **SEO** - SEO 元数据
- [ ] **Feature** - 功能特性
- [ ] **FAQ Item** - FAQ 条目
- [ ] **Testimonial** - 用户评价

### 1.3 配置 API 权限

1. 进入 Settings → Users & Permissions → Roles → Public
2. 为以下内容开启 `find` 和 `findOne` 权限：
   - App
   - Blog Post
   - Blog Category
   - Tutorial
   - FAQ
   - Page
   - Homepage
   - Global Settings

### 1.4 生成 API Token

1. Settings → API Tokens → Create new API Token
2. 类型选择 `Read-only`
3. 将 Token 添加到 `apps/web/.env.local`:
   ```
   STRAPI_API_TOKEN=your_token_here
   ```

---

## Phase 2: 前端页面开发

### 2.1 完善现有页面

- [ ] 首页 (`/`) - 添加 Testimonials、Blog 预览
- [ ] App 列表页 (`/app`) - 筛选功能、App 卡片
- [ ] App 详情页 (`/app/[slug]`) - 完整功能介绍、下载按钮、截图
- [ ] 博客列表页 (`/blog`) - 分页、分类筛选
- [ ] 博客详情页 (`/blog/[slug]`) - 文章内容、相关文章
- [ ] Tutorial 页面 (`/tutorial`) - 教程列表和详情
- [ ] FAQ 页面 (`/faq`) - 折叠式问答
- [ ] 联系我们 (`/contact-us`) - 表单提交
- [ ] 静态页面 - About Us, Privacy Policy, Terms of Use

### 2.2 新增组件

```
components/
├── app/
│   ├── AppCard/           # App 卡片组件
│   ├── AppGrid/           # App 网格布局
│   ├── AppFilter/         # 筛选组件
│   └── DownloadButtons/   # 下载按钮组
├── blog/
│   ├── BlogCard/          # 博客卡片
│   ├── BlogGrid/          # 博客网格
│   └── BlogContent/       # 博客内容渲染
├── home/
│   ├── HeroSection/       # Hero 区域
│   ├── StatsSection/      # 统计数据
│   ├── FeaturesSection/   # 功能特性
│   ├── AppsSection/       # 应用展示
│   └── TestimonialsSection/ # 用户评价
└── shared/
    ├── Pagination/        # 分页组件
    ├── SearchBox/         # 搜索框
    └── BrandLogos/        # 品牌 Logo 展示
```

---

## Phase 3: API 集成

### 3.1 创建数据获取函数

```typescript
// lib/strapi/api/apps.ts
export async function getApps(type?: AppType);
export async function getAppBySlug(slug: string);

// lib/strapi/api/blog.ts
export async function getBlogPosts(options);
export async function getBlogPostBySlug(slug: string);
export async function getBlogCategories();

// lib/strapi/api/pages.ts
export async function getHomepage();
export async function getGlobalSettings();
export async function getPageBySlug(slug: string);
```

### 3.2 更新页面使用真实数据

1. 替换首页的硬编码数据
2. 实现动态路由页面的数据获取
3. 添加 ISR 缓存策略

---

## Phase 4: 内容迁移

### 4.1 从原网站导出数据

- [ ] App 信息（名称、描述、下载链接、截图）
- [ ] 博客文章（标题、内容、图片）
- [ ] FAQ 内容
- [ ] 静态页面内容

### 4.2 导入到 Strapi

可以选择：
1. 手动通过 Admin Panel 添加
2. 编写迁移脚本批量导入
3. 使用 Strapi Import/Export 插件

### 4.3 图片资源处理

1. 下载原网站图片资源
2. 上传到 Strapi Media Library
3. 更新内容中的图片引用

---

## Phase 5: SEO & 优化

### 5.1 SEO 配置

- [ ] 每个页面的 Metadata
- [ ] Open Graph 标签
- [ ] Twitter Cards
- [ ] 结构化数据 (JSON-LD)
- [ ] sitemap.xml
- [ ] robots.txt

### 5.2 性能优化

- [ ] 图片优化 (Next.js Image)
- [ ] 字体优化
- [ ] 代码分割
- [ ] ISR 缓存策略
- [ ] Core Web Vitals 优化

### 5.3 分析工具

- [ ] Google Analytics 4
- [ ] Google Search Console
- [ ] 错误监控 (Sentry)

---

## Phase 6: 测试 & 部署

### 6.1 测试

- [ ] 单元测试（可选）
- [ ] E2E 测试（可选）
- [ ] 响应式测试
- [ ] 跨浏览器测试
- [ ] 性能测试 (Lighthouse)

### 6.2 部署

#### Next.js (Vercel)

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
cd apps/web
vercel --prod
```

配置环境变量：
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_STRAPI_URL`
- `STRAPI_API_TOKEN`

#### Strapi (Railway/Render)

1. 创建 PostgreSQL 数据库
2. 配置环境变量
3. 部署 Strapi 应用
4. 配置 Webhook 触发 Next.js ISR

### 6.3 域名配置

1. 配置 DNS 指向 Vercel
2. 配置 SSL 证书
3. 设置 301 重定向（如需要）

---

## 📌 当前状态

### ✅ 已完成

- [x] Monorepo 项目结构
- [x] Next.js 16.1.2 + TailwindCSS 4.1 配置
- [x] 基础 UI 组件 (Button)
- [x] 布局组件 (Header, Footer)
- [x] 首页基础框架
- [x] 页面路由结构
- [x] Strapi API 客户端
- [x] TypeScript 类型定义
- [x] 共享包结构

### 🔄 进行中

- [ ] Strapi CMS 安装和配置
- [ ] 完善首页设计

### ⏳ 待开始

- [ ] App 详情页开发
- [ ] 博客功能开发
- [ ] 内容迁移
- [ ] SEO 优化
- [ ] 部署上线

---

## 🚀 快速开始下一步

```bash
# 1. 确保 Node 版本正确
nvm use v20.12.0

# 2. 启动 Next.js 开发服务器
pnpm dev:web

# 3. 安装 Strapi (在另一个终端)
cd apps
npx create-strapi-app@latest cms --quickstart --typescript

# 4. 访问
# - Next.js: http://localhost:3000
# - Strapi Admin: http://localhost:1337/admin
```

