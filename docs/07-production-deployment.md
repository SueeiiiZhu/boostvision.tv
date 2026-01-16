# BoostVision.tv 生产环境部署指南

本文档介绍如何将 BoostVision.tv 项目部署到生产环境（推荐使用 Vercel）。

## 1. 部署架构

- **前端**: Next.js 16 (App Router)，部署在 **Vercel**。
- **后端**: Strapi 6 (Headless CMS)，部署在云服务器或 PaaS（如 Railway, Render, DigitalOcean）。
- **数据库**: PostgreSQL。
- **存储**: AWS S3 或 Cloudinary（用于图片资源）。

## 2. 环境变量配置

在 Vercel 控制台中，需要为 `web` 项目设置以下环境变量：

| 变量名 | 说明 | 示例值 |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_STRAPI_URL` | Strapi 后端的 API 地址 | `https://cms.boostvision.tv` |
| `STRAPI_API_TOKEN` | Strapi 的只读 API Token | `xxxxxxxxxxxx...` |
| `NEXT_PUBLIC_SITE_URL` | 官网的正式域名 | `https://www.boostvision.tv` |

## 3. Vercel 部署步骤

1.  **关联仓库**: 在 Vercel 中导入此 Monorepo。
2.  **框架预设**: 选择 `Next.js`。
3.  **根目录**: 设置为 `apps/web`（或者在根目录使用 `vercel.json` 自动识别）。
4.  **构建命令**: `pnpm build`（Monorepo 下通常为 `cd ../.. && pnpm build:web`）。
5.  **环境变量**: 填入上述生产环境配置。

## 4. Strapi 生产环境注意事项

1.  **域名白名单**: 在 Strapi 的 `config/server.ts` 中配置生产环境域名。
2.  **CORS 配置**: 确保 `config/middlewares.ts` 中的 CORS 允许来自 Vercel 的请求。
3.  **Webhook**: 在 Strapi 后台配置 Webhook，当内容更新时触发 Vercel 的重新构建（如果使用了 ISR）。

## 5. 域名与 SEO

1.  **主域名**: `www.boostvision.tv`。
2.  **多语言 SEO**: Vercel 会自动处理 `[locale]` 路径下的路由。确保 `sitemap.xml` 能够正常生成并提交至 Google Search Console。
