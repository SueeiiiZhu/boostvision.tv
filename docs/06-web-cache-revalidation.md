# Web 缓存失效（ISR + Strapi Webhook）

本文档说明 `apps/web` 的缓存策略与 Strapi 发布触发的失效机制。

## 1. 目标

- 通过 ISR/Data Cache 降低回源请求，减少 TTFB。
- 通过 Strapi Webhook 在内容发布后立即触发缓存失效，避免等待 ISR 窗口。
- 通过环境变量开关控制失效粒度与是否启用 webhook 失效。

## 2. 相关环境变量（apps/web）

在 `apps/web/.env.local` 中配置：

```bash
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-domain.com
STRAPI_API_TOKEN=your_production_read_only_token

# Strapi fetch 默认 ISR 秒数（默认 600）
STRAPI_REVALIDATE_SECONDS=600

# Webhook 鉴权密钥（必填，只有 /api/revalidate 用到）
STRAPI_REVALIDATE_SECRET=your_strapi_webhook_secret

# 总开关：false 时 webhook 不执行任何 revalidateTag
STRAPI_WEBHOOK_REVALIDATE_ENABLED=true

# 精准标签开关：false 时只保留集合级标签，不触发 blog-post:slug 这类标签
STRAPI_PRECISE_REVALIDATE_ENABLED=true
```

## 3. Webhook 接口

- 路径：`POST /api/revalidate`
- 文件：`apps/web/src/app/api/revalidate/route.ts`
- 鉴权方式（任选其一）：
  - Header: `x-revalidate-secret: <STRAPI_REVALIDATE_SECRET>`
  - Header: `Authorization: Bearer <STRAPI_REVALIDATE_SECRET>`
  - Query: `?secret=<STRAPI_REVALIDATE_SECRET>`

## 4. 开关行为

- `STRAPI_WEBHOOK_REVALIDATE_ENABLED=false`
  - 接口返回 `skipped: true`
  - 不执行任何缓存失效
- `STRAPI_WEBHOOK_REVALIDATE_ENABLED=true` 且 `STRAPI_PRECISE_REVALIDATE_ENABLED=false`
  - 只触发集合级标签（如 `blog-posts`、`pages`）
  - 不触发精准标签（如 `blog-post:some-slug`、`page:home`）
- `STRAPI_WEBHOOK_REVALIDATE_ENABLED=true` 且 `STRAPI_PRECISE_REVALIDATE_ENABLED=true`
  - 同时触发集合级 + 精准标签（推荐）

## 5. Strapi 后台配置建议

在 Strapi Settings -> Webhooks 新建：

- URL: `https://<your-domain>/api/revalidate`
- Header: `x-revalidate-secret: <your-secret>`
- 事件建议：
  - `entry.publish`
  - `entry.unpublish`
  - 按需：`entry.create` / `entry.update` / `entry.delete`

建议最小化触发范围时，只开 `publish/unpublish`。

## 6. 常见问题

- 未配置 `STRAPI_REVALIDATE_SECRET` 会怎样？
  - 仅 `/api/revalidate` 返回 500，站点访问不受影响，页面仍按 ISR 周期更新。
- 不使用 webhook 可以吗？
  - 可以。关闭或不配置 Strapi webhook 即可，只依赖 ISR 周期刷新。

## 7. AdSense 脚本延迟加载（P1-2）

前端已支持 Google AdSense 脚本延迟注入（`apps/web/src/components/analytics/AdScriptLoader.tsx`）：

- 触发时机：首次用户交互（`scroll`/`mousemove`/`touchstart`/`keydown`）或 5 秒超时兜底。
- 注入策略：只注入一次，避免重复加载。
- 配置项：
  - `NEXT_PUBLIC_ADSENSE_CLIENT_ID`：例如 `ca-pub-xxxxxxxxxxxxxxxx`。未配置则不加载脚本。
