# BoostVision.tv 官网重构项目

使用 Next.js 14 + TailwindCSS + Strapi CMS 重构 BoostVision.tv 官方网站。

## 技术栈

- **前端框架**: [Next.js 16.1.2](https://nextjs.org/docs) (App Router)
- **样式方案**: [TailwindCSS 4.1](https://tailwindcss.com/docs/installation/using-vite)
- **后端 CMS**: [Strapi 6.14.1](https://docs.strapi.io/cms/quick-start)
- **语言**: TypeScript 5
- **包管理**: pnpm
- **Monorepo**: Turborepo

## 项目结构

```
boostvision.tv-new/
├── apps/
│   ├── web/          # Next.js 前端应用
│   └── cms/          # Strapi CMS 后端
├── packages/
│   ├── ui/           # 共享 UI 组件库
│   ├── types/        # TypeScript 类型定义
│   └── utils/        # 共享工具函数
├── docs/             # 项目文档
└── scripts/          # 构建和部署脚本
```

## 快速开始

### 环境要求

- Node.js >= 20.12.0 (使用 `nvm use` 切换)
- pnpm 9+
- PostgreSQL 14+ (用于 Strapi 生产环境)

### 安装依赖

```bash
# 安装 pnpm (如果未安装)
npm install -g pnpm

# 安装项目依赖
pnpm install
```

### 环境变量配置

复制环境变量模板并填写配置：

```bash
# 前端
cp apps/web/.env.example apps/web/.env.local

# CMS
cp apps/cms/.env.example apps/cms/.env
```

### 启动开发服务器

```bash
# 同时启动前端和 CMS
pnpm dev

# 单独启动前端
pnpm dev:web

# 单独启动 CMS
pnpm dev:cms
```

访问地址：
- 前端: http://localhost:3000
- CMS 管理面板: http://localhost:1337/admin

## 文档

详细文档位于 `docs/` 目录：

- [01-website-analysis.md](./docs/01-website-analysis.md) - 原网站分析文档
- [02-folder-structure.md](./docs/02-folder-structure.md) - 项目文件夹结构
- [03-implementation-guide.md](./docs/03-implementation-guide.md) - 实施步骤指南
- [04-strapi-schemas.md](./docs/04-strapi-schemas.md) - Strapi Content Types 定义
- [05-next-steps.md](./docs/05-next-steps.md) - **后续开发流程** ⭐
- [06-web-cache-revalidation.md](./docs/06-web-cache-revalidation.md) - Web ISR 缓存与 Strapi Webhook 失效策略

## 开发规范

请参考 [.cursorrules](./.cursorrules) 文件了解项目的编码规范和最佳实践。

## 常用命令

```bash
# 开发
pnpm dev              # 启动所有服务
pnpm dev:web          # 启动前端
pnpm dev:cms          # 启动 CMS

# 构建
pnpm build            # 构建所有项目
pnpm build:web        # 构建前端
pnpm build:cms        # 构建 CMS

# 代码质量
pnpm lint             # 运行 ESLint
pnpm type-check       # TypeScript 类型检查
pnpm format           # 代码格式化
```

## 部署

### 前端 (Vercel)

推荐使用 Vercel 部署 Next.js 应用：

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

### CMS (Railway/Render)

Strapi CMS 可以部署到 Railway、Render 或其他支持 Node.js 的平台。

## 联系方式

- **Email**: support@boostvision.com.cn
- **Website**: https://www.boostvision.tv

## License

Private - All rights reserved.
