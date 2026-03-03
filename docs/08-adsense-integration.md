# Google AdSense 接入说明（Web）

本文档描述 `apps/web` 当前的 AdSense 基础能力与接入方式。

## 1. 已实现能力

- **延迟加载 AdSense 脚本**  
  组件：`apps/web/src/components/analytics/AdScriptLoader.tsx`  
  行为：
  - 首次用户交互（`scroll`/`mousemove`/`touchstart`/`keydown`）触发加载
  - 若无交互，5 秒后兜底加载
  - 只注入一次，避免重复脚本请求

- **自定义广告位组件（未默认挂载页面）**  
  组件：`apps/web/src/components/analytics/GoogleAdSenseSlot.tsx`  
  行为：
  - 使用 `<ins class="adsbygoogle" ... />` 渲染广告位
  - 挂载后执行一次 `adsbygoogle.push({})`
  - 支持 `adSlot`、`format`、`responsive`、`minHeight` 参数
  - 通过 `minHeight` 预留空间，降低 CLS 风险

## 2. 环境变量

在 `apps/web/.env.local` 中配置：

```bash
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
```

说明：
- 未配置 `NEXT_PUBLIC_ADSENSE_CLIENT_ID` 时，脚本与广告位都不会生效（安全降级）。

## 3. 页面接入示例

当前仓库尚未把广告位接入任何页面。后续接入时可按如下方式使用：

```tsx
import { GoogleAdSenseSlot } from "@/components/analytics";

<GoogleAdSenseSlot
  adSlot="1234567890"
  minHeight={280}
  format="auto"
  responsive
/>
```

## 4. 建议接入策略

- 首次接入先放 1-2 个高流量稳定位置（如博客正文中段、列表底部）。
- 保留广告容器固定高度或最小高度，避免内容加载后抖动。
- 每次新增广告位后，关注 CrUX 与 RUM 的 LCP/INP/CLS 变化。
