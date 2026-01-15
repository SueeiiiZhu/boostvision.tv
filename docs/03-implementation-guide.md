# BoostVision.tv 重构实施步骤文档

## 概述

本文档详细描述了将 BoostVision.tv 从 WordPress 迁移到 Next.js 16 + TailwindCSS 4 + Strapi 6 技术栈的完整实施步骤。

### 技术栈版本

| 技术 | 版本 | 文档链接 |
|------|------|---------|
| Next.js | 16.1.2 | [官方文档](https://nextjs.org/docs) |
| TailwindCSS | 4.1 | [官方文档](https://tailwindcss.com/docs/installation/using-vite) |
| Strapi | 6.14.1 | [官方文档](https://docs.strapi.io/cms/quick-start) |
| Node.js | 20+ (推荐 22 LTS) | - |
| pnpm | 9+ | - |

---

## 阶段一：项目初始化 (预计 1 天)

### 1.1 创建 Monorepo 项目结构

```bash
# 创建项目根目录
mkdir boostvision.tv-new
cd boostvision.tv-new

# 初始化 pnpm workspace
pnpm init

# 创建 workspace 配置
cat > pnpm-workspace.yaml << EOF
packages:
  - "apps/*"
  - "packages/*"
EOF

# 创建目录结构
mkdir -p apps packages docs scripts
```

### 1.2 初始化 Next.js 前端应用

```bash
cd apps

# 创建 Next.js 16 应用
pnpm create next-app@16.1.2 web --typescript --eslint --app --src-dir --import-alias "@/*"

# 进入前端目录
cd web

# 安装 TailwindCSS 4
pnpm add tailwindcss@4.1 @tailwindcss/postcss

# 安装额外依赖
pnpm add clsx tailwind-merge lucide-react
```

### 1.3 配置 TailwindCSS 4

TailwindCSS 4 使用全新的配置方式，不再需要 `tailwind.config.js`。

```bash
# apps/web/postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

```css
/* apps/web/src/app/globals.css */
@import "tailwindcss";

/* 自定义主题变量 */
@theme {
  /* Primary Colors */
  --color-primary: #2563eb;
  --color-primary-dark: #1d4ed8;
  --color-primary-light: #3b82f6;
  
  /* Secondary Colors */
  --color-secondary: #10b981;
  --color-secondary-dark: #059669;
  --color-secondary-light: #34d399;
  
  /* 字体 */
  --font-sans: "Inter", system-ui, sans-serif;
}

/* 自定义工具类 */
@utility container-custom {
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}
```

### 1.4 初始化 Strapi 6 CMS

```bash
cd apps

# 创建 Strapi 6 应用
pnpm create strapi@6.14.1 cms

# 或者指定数据库
pnpm create strapi@6.14.1 cms --dbclient=postgres
```

> **注意**: Strapi 6 使用新的 Document Service API，与 Strapi 4 有较大变化。

### 1.5 配置 Turborepo

```bash
# 回到根目录
cd ../..

# 安装 Turborepo
pnpm add -D turbo

# 创建 turbo.json 配置
cat > turbo.json << EOF
{
  "\$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "build/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "type-check": {
      "dependsOn": ["^build"]
    }
  }
}
EOF
```

### 1.6 配置根目录 package.json

```json
{
  "name": "boostvision.tv",
  "private": true,
  "packageManager": "pnpm@9.0.0",
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    "dev:web": "pnpm --filter web dev",
    "dev:cms": "pnpm --filter cms develop",
    "build:web": "pnpm --filter web build",
    "build:cms": "pnpm --filter cms build"
  },
  "devDependencies": {
    "turbo": "^2.3.0"
  }
}
```

---

## 阶段二：Strapi 6 CMS 配置 (预计 2-3 天)

### 2.1 Strapi 6 重要变化

Strapi 6 与 Strapi 4 相比有以下主要变化：

1. **Document Service API**: 新的数据查询 API
2. **Flat Response**: API 响应结构扁平化，不再有 `data.attributes`
3. **改进的 TypeScript 支持**
4. **新的插件系统**

### 2.2 创建 Content Types

#### App (应用)

在 Strapi 管理面板创建以下 Collection Type：

**App Schema:**
```json
{
  "kind": "collectionType",
  "collectionName": "apps",
  "info": {
    "singularName": "app",
    "pluralName": "apps",
    "displayName": "App"
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "name": {
      "type": "string",
      "required": true
    },
    "slug": {
      "type": "uid",
      "targetField": "name",
      "required": true
    },
    "type": {
      "type": "enumeration",
      "enum": ["screen-mirroring", "tv-remote"],
      "required": true
    },
    "shortDescription": {
      "type": "string"
    },
    "description": {
      "type": "text"
    },
    "icon": {
      "type": "media",
      "allowedTypes": ["images"]
    },
    "screenshots": {
      "type": "media",
      "multiple": true,
      "allowedTypes": ["images"]
    },
    "appStoreUrl": {
      "type": "string"
    },
    "googlePlayUrl": {
      "type": "string"
    },
    "amazonUrl": {
      "type": "string"
    },
    "downloadCount": {
      "type": "string"
    },
    "rating": {
      "type": "decimal"
    },
    "features": {
      "type": "component",
      "repeatable": true,
      "component": "shared.feature"
    },
    "supportedDevices": {
      "type": "json"
    },
    "seo": {
      "type": "component",
      "component": "shared.seo"
    }
  }
}
```

#### Blog Post (博客文章)

```json
{
  "kind": "collectionType",
  "collectionName": "blog_posts",
  "info": {
    "singularName": "blog-post",
    "pluralName": "blog-posts",
    "displayName": "Blog Post"
  },
  "attributes": {
    "title": {
      "type": "string",
      "required": true
    },
    "slug": {
      "type": "uid",
      "targetField": "title",
      "required": true
    },
    "content": {
      "type": "blocks"
    },
    "excerpt": {
      "type": "text"
    },
    "coverImage": {
      "type": "media",
      "allowedTypes": ["images"]
    },
    "category": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::blog-category.blog-category"
    },
    "author": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::author.author"
    },
    "publishedAt": {
      "type": "datetime"
    },
    "seo": {
      "type": "component",
      "component": "shared.seo"
    }
  }
}
```

> **注意**: Strapi 6 推荐使用 `blocks` 类型替代 `richtext`，提供更好的编辑体验。

#### 其他 Content Types

（Blog Category、Author、Tutorial、FAQ、Review、Device Brand 结构与之前类似，此处省略）

### 2.3 创建共享组件

#### SEO Component

```json
{
  "collectionName": "components_shared_seos",
  "info": {
    "displayName": "SEO",
    "icon": "search"
  },
  "attributes": {
    "metaTitle": {
      "type": "string"
    },
    "metaDescription": {
      "type": "text"
    },
    "metaImage": {
      "type": "media",
      "allowedTypes": ["images"]
    },
    "keywords": {
      "type": "string"
    }
  }
}
```

### 2.4 配置 API 权限

1. 进入 Strapi 管理面板
2. Settings → Users & Permissions Plugin → Roles → Public
3. 为以下 Content Types 启用 `find` 和 `findOne` 权限

### 2.5 创建 API Token

1. Settings → API Tokens
2. Create new API token
3. Name: "Frontend"
4. Token type: Full access 或 Custom
5. 保存并复制 Token

---

## 阶段三：Next.js 16 前端开发 (预计 5-7 天)

### 3.1 配置环境变量

```bash
# apps/web/.env.local
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-api-token-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
REVALIDATE_SECRET=your-revalidate-secret
```

### 3.2 创建 Strapi 6 API 客户端

Strapi 6 的响应结构已扁平化，不再有 `data.attributes` 嵌套。

```typescript
// apps/web/src/lib/strapi/client.ts
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export async function fetchStrapi<T>(
  endpoint: string,
  options?: RequestInit & { revalidate?: number }
): Promise<StrapiResponse<T>> {
  const { revalidate = 3600, ...fetchOptions } = options || {};
  
  const res = await fetch(`${STRAPI_URL}/api${endpoint}`, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_TOKEN}`,
      ...fetchOptions?.headers,
    },
    next: {
      revalidate,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${endpoint}`);
  }

  return res.json();
}
```

### 3.3 创建类型定义 (Strapi 6 扁平化结构)

```typescript
// apps/web/src/types/strapi.ts

// Strapi 6 扁平化响应结构
export interface StrapiMedia {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

// Strapi 6 扁平化 - 直接访问属性，无需 .attributes
export interface App {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  type: 'screen-mirroring' | 'tv-remote';
  shortDescription: string;
  description: string;
  icon: StrapiMedia | null;
  screenshots: StrapiMedia[];
  appStoreUrl: string | null;
  googlePlayUrl: string | null;
  amazonUrl: string | null;
  downloadCount: string | null;
  rating: number | null;
  features: Feature[];
  supportedDevices: string[];
  seo: SEO | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Feature {
  id: number;
  title: string;
  description: string;
  icon: StrapiMedia | null;
}

export interface SEO {
  id: number;
  metaTitle: string | null;
  metaDescription: string | null;
  metaImage: StrapiMedia | null;
  keywords: string | null;
}

export interface BlogPost {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  content: any; // Strapi Blocks content
  excerpt: string;
  coverImage: StrapiMedia | null;
  category: BlogCategory | null;
  author: Author | null;
  publishedAt: string;
  seo: SEO | null;
}

export interface BlogCategory {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface Author {
  id: number;
  documentId: string;
  name: string;
  avatar: StrapiMedia | null;
  bio: string | null;
}
```

### 3.4 创建查询函数

```typescript
// apps/web/src/lib/strapi/queries/apps.ts
import { fetchStrapi } from '../client';
import type { App } from '@/types/strapi';

export async function getApps(type?: 'screen-mirroring' | 'tv-remote') {
  const filters = type ? `&filters[type][$eq]=${type}` : '';
  return fetchStrapi<App[]>(`/apps?populate=*${filters}`);
}

export async function getAppBySlug(slug: string) {
  const response = await fetchStrapi<App[]>(
    `/apps?filters[slug][$eq]=${slug}&populate=deep`
  );
  return response.data[0] || null;
}

export async function getAppSlugs() {
  return fetchStrapi<Pick<App, 'slug'>[]>('/apps?fields[0]=slug');
}
```

### 3.5 Next.js 16 新特性使用

```typescript
// apps/web/src/app/app/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getAppBySlug, getAppSlugs } from '@/lib/strapi/queries/apps';

// Next.js 16 - 使用新的 generateStaticParams
export async function generateStaticParams() {
  const { data } = await getAppSlugs();
  return data.map((app) => ({
    slug: app.slug,
  }));
}

// Next.js 16 - generateMetadata
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const app = await getAppBySlug(slug);
  
  if (!app) return {};
  
  return {
    title: app.seo?.metaTitle || `${app.name} | BoostVision`,
    description: app.seo?.metaDescription || app.shortDescription,
    openGraph: {
      title: app.name,
      description: app.shortDescription,
      images: app.icon ? [app.icon.url] : [],
    },
  };
}

// Next.js 16 - 异步 params
export default async function AppPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const app = await getAppBySlug(slug);
  
  if (!app) {
    notFound();
  }
  
  return (
    <main>
      {/* App content */}
    </main>
  );
}
```

### 3.6 TailwindCSS 4 使用示例

```tsx
// apps/web/src/components/ui/Button.tsx
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // TailwindCSS 4 - 使用新的颜色变量语法
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
          'focus-visible:outline-2 focus-visible:outline-offset-2',
          {
            // Primary variant - 使用 @theme 定义的颜色
            'bg-primary text-white hover:bg-primary-dark focus-visible:outline-primary':
              variant === 'primary',
            'bg-secondary text-white hover:bg-secondary-dark focus-visible:outline-secondary':
              variant === 'secondary',
            'border-2 border-primary text-primary hover:bg-primary/10':
              variant === 'outline',
          },
          {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-base': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, type ButtonProps };
```

### 3.7 开发页面组件

按照优先级顺序开发：

1. **布局组件** (Header, Footer)
2. **首页** (Hero, Features, Apps Showcase, Reviews, CTA)
3. **App 下载中心页**
4. **App 详情页**
5. **博客列表页**
6. **博客文章页**
7. **Tutorial 页面**
8. **FAQ 页面**
9. **静态页面** (About, Contact, Terms, Privacy)

---

## 阶段四：数据迁移 (预计 2-3 天)

### 4.1 准备数据导出脚本

从 WordPress 导出数据：
- 所有 App 信息
- 所有博客文章
- 所有媒体文件

### 4.2 编写数据导入脚本 (Strapi 6)

```typescript
// scripts/migrate-data.ts
import fs from 'fs';

const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

// Strapi 6 使用新的 Document Service API
async function migrateApps() {
  const apps = JSON.parse(fs.readFileSync('./data/apps.json', 'utf-8'));
  
  for (const app of apps) {
    await fetch(`${STRAPI_URL}/api/apps`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
      body: JSON.stringify({ data: app }),
    });
  }
}

async function migrateBlogPosts() {
  const posts = JSON.parse(fs.readFileSync('./data/posts.json', 'utf-8'));
  
  for (const post of posts) {
    await fetch(`${STRAPI_URL}/api/blog-posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
      body: JSON.stringify({ data: post }),
    });
  }
}
```

### 4.3 迁移媒体文件

1. 下载所有 WordPress 媒体文件
2. 使用 Strapi Media Library API 上传
3. 更新内容引用

---

## 阶段五：优化与测试 (预计 2-3 天)

### 5.1 性能优化

- [ ] 图片优化 (next/image, WebP)
- [ ] 字体优化 (next/font)
- [ ] 代码分割
- [ ] 缓存策略优化

### 5.2 SEO 优化

- [ ] 元数据配置
- [ ] 结构化数据
- [ ] sitemap.xml
- [ ] robots.txt
- [ ] 301 重定向配置

### 5.3 测试

- [ ] 功能测试
- [ ] 响应式测试
- [ ] 跨浏览器测试
- [ ] 性能测试 (Lighthouse)
- [ ] SEO 审计

---

## 阶段六：部署 (预计 1 天)

### 6.1 部署 Strapi 6 CMS

推荐平台：
- Strapi Cloud (官方推荐)
- Railway
- Render
- DigitalOcean App Platform
- AWS EC2

```bash
# 配置生产环境变量
NODE_ENV=production
DATABASE_CLIENT=postgres
DATABASE_URL=your-database-url
APP_KEYS=your-app-keys
API_TOKEN_SALT=your-salt
ADMIN_JWT_SECRET=your-secret
JWT_SECRET=your-jwt-secret
```

### 6.2 部署 Next.js 16

推荐平台：
- Vercel (推荐)
- Netlify
- AWS Amplify
- Cloudflare Pages

```bash
# 在 Vercel 中配置环境变量
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-url.com
STRAPI_API_TOKEN=your-token
NEXT_PUBLIC_SITE_URL=https://www.boostvision.tv
```

### 6.3 配置域名和 SSL

1. 更新 DNS 记录
2. 配置 SSL 证书
3. 设置 CDN (可选)

### 6.4 配置 Webhook (缓存重新验证)

```typescript
// apps/web/src/app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret');
  
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }
  
  const body = await request.json();
  const { model, entry } = body;
  
  switch (model) {
    case 'app':
      revalidatePath('/app');
      revalidatePath(`/app/${entry.slug}`);
      break;
    case 'blog-post':
      revalidatePath('/blog');
      revalidatePath(`/blog/${entry.slug}`);
      break;
  }
  
  return NextResponse.json({ revalidated: true });
}
```

---

## 时间估算总结

| 阶段             | 预计时间 |
| ---------------- | -------- |
| 项目初始化       | 1 天     |
| Strapi CMS 配置  | 2-3 天   |
| Next.js 前端开发 | 5-7 天   |
| 数据迁移         | 2-3 天   |
| 优化与测试       | 2-3 天   |
| 部署             | 1 天     |
| **总计**         | **13-18 天** |

---

## 版本特性摘要

### Next.js 16.1.2 新特性

- 异步 params 和 searchParams
- 改进的 Server Actions
- 更好的 Turbopack 支持
- 增强的缓存控制

### TailwindCSS 4.1 新特性

- 无需配置文件，使用 CSS `@theme` 指令
- 原生 CSS 变量支持
- 更快的构建速度
- 使用 `@utility` 自定义工具类

### Strapi 6.14.1 新特性

- 扁平化 API 响应
- Document Service API
- Blocks 编辑器
- 改进的 TypeScript 支持
- 更好的性能

---

## 检查清单

### 上线前检查

- [ ] 所有页面正常渲染
- [ ] 所有链接可用
- [ ] 图片加载正常
- [ ] 响应式布局正常
- [ ] SEO meta 信息正确
- [ ] 表单功能正常
- [ ] 404 页面正常
- [ ] 500 错误处理正常
- [ ] SSL 配置正确
- [ ] 旧 URL 重定向配置
- [ ] Google Analytics 配置
- [ ] Search Console 提交

### 上线后监控

- [ ] 设置性能监控
- [ ] 设置错误监控
- [ ] 设置 uptime 监控
- [ ] 定期备份数据库
