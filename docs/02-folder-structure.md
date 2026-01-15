# BoostVision.tv 项目文件夹结构文档

## 项目架构概述

本项目采用 **Monorepo** 架构，包含前端（Next.js）和后端（Strapi CMS）两个主要部分。

### 技术文档参考

- **Next.js 16**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **TailwindCSS 4**: [https://tailwindcss.com/docs/installation/using-vite](https://tailwindcss.com/docs/installation/using-vite)
- **Strapi 6**: [https://docs.strapi.io/cms/quick-start](https://docs.strapi.io/cms/quick-start)

---

## 顶层目录结构

```
boostvision.tv-new/
├── apps/                          # 应用目录
│   ├── web/                       # Next.js 前端应用
│   └── cms/                       # Strapi CMS 后端
├── packages/                      # 共享包
│   ├── ui/                        # 共享 UI 组件库
│   ├── types/                     # TypeScript 类型定义
│   └── utils/                     # 共享工具函数
├── docs/                          # 项目文档
├── scripts/                       # 构建和部署脚本
├── .cursorrules                   # Cursor AI 规则
├── .gitignore                     # Git 忽略配置
├── package.json                   # 根目录 package.json
├── pnpm-workspace.yaml            # pnpm workspace 配置
├── turbo.json                     # Turborepo 配置
└── README.md                      # 项目说明
```

---

## Next.js 前端应用结构

```
apps/web/
├── public/                        # 静态资源
│   ├── images/                    # 图片资源
│   │   ├── apps/                  # 应用图标
│   │   ├── brands/                # 品牌 Logo
│   │   ├── features/              # 功能图片
│   │   └── screenshots/           # 应用截图
│   ├── icons/                     # 图标资源
│   └── fonts/                     # 字体文件
│
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (marketing)/           # 营销页面组
│   │   │   ├── page.tsx           # 首页
│   │   │   ├── about-us/
│   │   │   │   └── page.tsx
│   │   │   ├── contact-us/
│   │   │   │   └── page.tsx
│   │   │   ├── terms-of-use/
│   │   │   │   └── page.tsx
│   │   │   └── privacy-policy/
│   │   │       └── page.tsx
│   │   │
│   │   ├── app/                   # App 相关页面
│   │   │   ├── page.tsx           # App 下载中心
│   │   │   └── [slug]/
│   │   │       └── page.tsx       # App 详情页
│   │   │
│   │   ├── blog/                  # 博客页面
│   │   │   ├── page.tsx           # 博客列表
│   │   │   ├── [category]/
│   │   │   │   └── page.tsx       # 分类列表
│   │   │   └── [...slug]/
│   │   │       └── page.tsx       # 文章详情
│   │   │
│   │   ├── tutorial/              # 教程页面
│   │   │   ├── page.tsx           # 教程中心
│   │   │   └── [slug]/
│   │   │       └── page.tsx       # 教程详情
│   │   │
│   │   ├── faq/                   # FAQ 页面
│   │   │   ├── page.tsx           # FAQ 中心
│   │   │   └── [slug]/
│   │   │       └── page.tsx       # FAQ 详情
│   │   │
│   │   ├── api/                   # API 路由
│   │   │   ├── revalidate/
│   │   │   │   └── route.ts       # ISR 重新验证
│   │   │   └── contact/
│   │   │       └── route.ts       # 联系表单
│   │   │
│   │   ├── sitemap.ts             # 站点地图
│   │   ├── robots.ts              # robots.txt
│   │   ├── layout.tsx             # 根布局
│   │   ├── not-found.tsx          # 404 页面
│   │   ├── error.tsx              # 错误页面
│   │   └── globals.css            # 全局样式
│   │
│   ├── components/                # 组件目录
│   │   ├── layout/                # 布局组件
│   │   │   ├── Header/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Navigation.tsx
│   │   │   │   ├── MobileMenu.tsx
│   │   │   │   ├── LanguageSwitcher.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Footer/
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── FooterLinks.tsx
│   │   │   │   ├── SocialLinks.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── home/                  # 首页组件
│   │   │   ├── HeroSection.tsx
│   │   │   ├── StatsSection.tsx
│   │   │   ├── WhyChooseSection.tsx
│   │   │   ├── AppsShowcase.tsx
│   │   │   ├── DeviceSupport.tsx
│   │   │   ├── FeatureHighlight.tsx
│   │   │   ├── ReviewsSection.tsx
│   │   │   ├── BlogSection.tsx
│   │   │   ├── CTASection.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── app/                   # App 相关组件
│   │   │   ├── AppCard.tsx
│   │   │   ├── AppGrid.tsx
│   │   │   ├── AppHero.tsx
│   │   │   ├── AppFeatures.tsx
│   │   │   ├── AppFeatureHighlight.tsx
│   │   │   ├── DeviceList.tsx
│   │   │   ├── DownloadButtons.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── blog/                  # 博客组件
│   │   │   ├── BlogCard.tsx
│   │   │   ├── BlogGrid.tsx
│   │   │   ├── CategoryTabs.tsx
│   │   │   ├── ArticleHeader.tsx
│   │   │   ├── ArticleContent.tsx
│   │   │   ├── TableOfContents.tsx
│   │   │   ├── AuthorBio.tsx
│   │   │   ├── RelatedPosts.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── support/               # 支持页面组件
│   │   │   ├── TabNavigation.tsx
│   │   │   ├── AppSelectGrid.tsx
│   │   │   ├── FAQAccordion.tsx
│   │   │   ├── TutorialContent.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── ui/                    # UI 基础组件
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── Accordion.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Image.tsx
│   │   │   ├── Link.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── shared/                # 共享组件
│   │       ├── PageHeader.tsx
│   │       ├── SectionHeader.tsx
│   │       ├── BrandLogos.tsx
│   │       ├── ContactForm.tsx
│   │       ├── Newsletter.tsx
│   │       ├── SEO.tsx
│   │       └── index.ts
│   │
│   ├── lib/                       # 工具库
│   │   ├── strapi/                # Strapi API 客户端
│   │   │   ├── client.ts          # API 客户端实例
│   │   │   ├── queries/           # 查询函数
│   │   │   │   ├── apps.ts
│   │   │   │   ├── blogs.ts
│   │   │   │   ├── tutorials.ts
│   │   │   │   ├── faqs.ts
│   │   │   │   ├── pages.ts
│   │   │   │   └── globals.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── utils/                 # 工具函数
│   │   │   ├── cn.ts              # className 合并
│   │   │   ├── format.ts          # 格式化函数
│   │   │   ├── seo.ts             # SEO 工具
│   │   │   └── index.ts
│   │   │
│   │   └── constants/             # 常量定义
│   │       ├── navigation.ts
│   │       ├── routes.ts
│   │       └── index.ts
│   │
│   ├── hooks/                     # 自定义 Hooks
│   │   ├── useMediaQuery.ts
│   │   ├── useScrollPosition.ts
│   │   ├── useLocalStorage.ts
│   │   └── index.ts
│   │
│   ├── types/                     # TypeScript 类型
│   │   ├── strapi.ts              # Strapi 响应类型
│   │   ├── app.ts                 # 应用类型
│   │   ├── blog.ts                # 博客类型
│   │   └── index.ts
│   │
│   └── styles/                    # 样式文件
│       └── themes/                # 主题配置
│           └── index.ts
│
├── .env.local                     # 环境变量（本地）
├── .env.example                   # 环境变量示例
├── next.config.ts                 # Next.js 配置
├── postcss.config.mjs             # PostCSS 配置 (TailwindCSS 4)
├── tsconfig.json                  # TypeScript 配置
└── package.json                   # 依赖配置
```

---

## Strapi CMS 后端结构

```
apps/cms/
├── config/                        # 配置文件
│   ├── admin.ts                   # 管理面板配置
│   ├── api.ts                     # API 配置
│   ├── database.ts                # 数据库配置
│   ├── middlewares.ts             # 中间件配置
│   ├── plugins.ts                 # 插件配置
│   └── server.ts                  # 服务器配置
│
├── src/
│   ├── api/                       # API 定义
│   │   ├── app/                   # 应用 Content Type
│   │   │   ├── content-types/
│   │   │   │   └── app/
│   │   │   │       └── schema.json
│   │   │   ├── controllers/
│   │   │   │   └── app.ts
│   │   │   ├── routes/
│   │   │   │   └── app.ts
│   │   │   └── services/
│   │   │       └── app.ts
│   │   │
│   │   ├── blog-post/             # 博客文章
│   │   │   ├── content-types/
│   │   │   │   └── blog-post/
│   │   │   │       └── schema.json
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   └── services/
│   │   │
│   │   ├── blog-category/         # 博客分类
│   │   │   └── content-types/
│   │   │       └── blog-category/
│   │   │           └── schema.json
│   │   │
│   │   ├── author/                # 作者
│   │   │   └── content-types/
│   │   │       └── author/
│   │   │           └── schema.json
│   │   │
│   │   ├── tutorial/              # 教程
│   │   │   └── content-types/
│   │   │       └── tutorial/
│   │   │           └── schema.json
│   │   │
│   │   ├── faq/                   # FAQ
│   │   │   └── content-types/
│   │   │       └── faq/
│   │   │           └── schema.json
│   │   │
│   │   ├── review/                # 用户评价
│   │   │   └── content-types/
│   │   │       └── review/
│   │   │           └── schema.json
│   │   │
│   │   ├── device-brand/          # 设备品牌
│   │   │   └── content-types/
│   │   │       └── device-brand/
│   │   │           └── schema.json
│   │   │
│   │   └── page/                  # 静态页面
│   │       └── content-types/
│   │           └── page/
│   │               └── schema.json
│   │
│   ├── components/                # 可复用组件
│   │   ├── shared/                # 共享组件
│   │   │   ├── seo.json           # SEO 组件
│   │   │   ├── feature.json       # 功能组件
│   │   │   ├── download-link.json # 下载链接组件
│   │   │   └── media.json         # 媒体组件
│   │   │
│   │   └── sections/              # 页面区块组件
│   │       ├── hero.json
│   │       ├── feature-list.json
│   │       └── cta.json
│   │
│   ├── extensions/                # 扩展
│   │   └── users-permissions/     # 用户权限扩展
│   │
│   ├── admin/                     # 管理面板扩展
│   │   └── app.tsx
│   │
│   └── index.ts                   # 入口文件
│
├── database/                      # 数据库文件
│   └── migrations/                # 数据库迁移
│
├── public/                        # 公共文件
│   └── uploads/                   # 上传文件
│
├── .env                           # 环境变量
├── .env.example                   # 环境变量示例
├── tsconfig.json                  # TypeScript 配置
└── package.json                   # 依赖配置
```

---

## 共享包结构

### packages/types

```
packages/types/
├── src/
│   ├── strapi/                    # Strapi 类型
│   │   ├── app.ts
│   │   ├── blog.ts
│   │   ├── tutorial.ts
│   │   ├── faq.ts
│   │   ├── page.ts
│   │   ├── global.ts
│   │   └── index.ts
│   │
│   └── index.ts
│
├── tsconfig.json
└── package.json
```

### packages/ui

```
packages/ui/
├── src/
│   ├── components/                # 共享 UI 组件
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Input/
│   │   └── ...
│   │
│   ├── styles/                    # 样式
│   │   └── globals.css
│   │
│   └── index.ts
│
├── postcss.config.mjs             # TailwindCSS 4 配置
├── tsconfig.json
└── package.json
```

### packages/utils

```
packages/utils/
├── src/
│   ├── cn.ts                      # className 工具
│   ├── format.ts                  # 格式化工具
│   ├── validation.ts              # 验证工具
│   └── index.ts
│
├── tsconfig.json
└── package.json
```

---

## 关键配置文件说明

### pnpm-workspace.yaml

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "type-check": {
      "dependsOn": ["^build"]
    }
  }
}
```

---

## 环境变量配置

### apps/web/.env.example

```env
# Strapi API
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-api-token

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Analytics (optional)
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_GTM_ID=

# Revalidation
REVALIDATE_SECRET=your-revalidate-secret
```

### apps/cms/.env.example

```env
# Server
HOST=0.0.0.0
PORT=1337

# Keys
APP_KEYS=your-app-keys
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
JWT_SECRET=your-jwt-secret

# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=boostvision
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your-password

# Upload Provider (Cloudinary/AWS S3)
CLOUDINARY_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=
```

---

## 推荐的 VSCode 配置

### .vscode/settings.json

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

### .vscode/extensions.json

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "csstools.postcss"
  ]
}
```
