# SEO 团队待办事项 — BoostVision.tv

> 基于 2026 年 3-4 月审计报告，以下为需要 CMS 运营/市场团队处理的事项。
> 技术代码层面的修复由开发团队单独处理，不在此文档范围内。

---

## 一、CMS 内容创作 (P1 - 高优先级)

### 1.1 缺失的高转化意图文章

| 目标关键词 | 月搜索量 | 搜索意图 | 需创作的内容类型 | 竞品排名参考 |
|-----------|-------:|---------|---------------|------------|
| **how to mirror iphone to tv without apple tv** | 27,100 | How-to 教程 | 详细教程 + Featured Snippet 优化 | YouTube/Apple 占据 Top 3，4-10 位有机会 |
| **best screen mirroring app 2026** | 590 | 商业对比 | "Best of" 对比评测文章 | Reddit #1 |
| **best tv remote app for iphone** | 110 | 商业对比 | 对比评测文章 | controlmeister.com #2, Reddit #1 |
| **screen mirroring app** | 5,400 | 导航 | App 落地页优化 | 1001tvs.com #7, airbeam.tv #11 |
| **lg tv remote app** | 9,900 | 导航 | App 页面优化 + 外链 | airbeam.tv #14 |
| **universal tv remote app** | 4,400 | 导航 | App 页面优化 | airbeam.tv #11 |
| **cast phone to tv without wifi** | 110 | How-to | 教程文章 | airdroid.com #7 |

### 1.2 竞品必备内容策略

| 内容类型 | 参考竞品 | BV 当前状态 | 建议行动 |
|---------|---------|-----------|---------|
| "Without [竞品]" 系列 | airbeam.tv 的核心策略 | 缺失 | 创作 3 篇："Without AirPlay"、"Without Apple TV"、"Without Chromecast" |
| "Best [设备] Remote App" 对比 | controlmeister.com 霸占此类关键词 | 缺失 | 创作 "Best Samsung TV Remote App"、"Best Fire TV Remote App 2026" |
| "AirPlay Alternative" 专题页 | airbeam.tv 有专门落地页 | 仅通用覆盖 | 创建专题落地页 |
| Question 格式 H2 标题 | airbeam.tv 自然 FAQ 结构 | 描述性标题 | 改为问题格式以争取 PAA 展示 |

---

## 二、CMS SEO 字段优化 (P1)

### 2.1 快速见效优化（在 Strapi SEO 组件中修改）

| 页面 | 当前问题 | 优化建议 | 预估影响 |
|------|---------|---------|---------|
| `/es/downloader-codes-for-firestick` | 24,061 展示量，1.1% CTR，排名 11.3 | 优化 metaTitle + metaDescription，加入西班牙语搜索意图关键词变体 | **预估 +938 organic clicks/月（进入 Top 10）** |
| Blog Hub `/blog` | Title 47 字符（最优 55-60）、Description 120 字符（最优 150-160） | 扩展标题加入 "2026"、"Guide" 修饰词 | CTR 提升 |
| App 页面通用 | Title 缺少行动词 | 在 metaTitle 中加入 "Free"、"Best"、"Download" | CTR 提升 |

### 2.2 App 页面 SEO 组件检查清单

在 Strapi 后台逐个检查以下 App 的 SEO 组件：
- [ ] metaTitle：是否包含品牌关键词 + 修饰词（如 "Free Remote for Samsung TV - BoostVision"）
- [ ] metaDescription：是否包含 CTA 和差异化描述，150-160 字符
- [ ] metaImage：是否设置了 1200×630 的 OG 图片
- [ ] `/app/apple-tv-remote` 特别检查：当前只有 Google Play CTA，缺少 App Store 链接

---

## 三、CMS 多语言翻译 (P1)

### 3.1 葡萄牙语市场（巴西）— 最大未开发机会

| 关键词 | 月搜索量 | 当前状态 |
|--------|-------:|---------|
| **espelhar celular na tv** | 22,200 | `/pt/app/*` 页面仍为英文 |
| **espelhamento de tela** | 8,100 | 无翻译内容 |

**行动项：**
- [ ] 翻译全部 `/pt/app/*` App 页面为葡萄牙语（含 name、shortDescription、description、features）
- [ ] 创作葡萄牙语 Blog 文章 `/pt/blog/espelhar-celular-na-tv/`
- [ ] 翻译 App 页面的 SEO 组件（metaTitle、metaDescription）

### 3.2 西班牙语市场

- [ ] 翻译全部 `/es/app/*` App 页面为西班牙语
- [ ] 翻译 SEO 组件

### 3.3 其他语言市场维护

| 语言 | GSC 90 天点击 | 策略 |
|------|----------:|------|
| 法语 (FR) | 4,738 | ✅ 表现好，继续扩展内容 |
| 日语 (JA) | 4,591（CTR 最高 2.0%） | ✅ 表现好，扩展至 250+ JP 文章 |
| 德语 (DE) | — | 评估后决定 |

---

## 四、CMS Schema 扩展 (P2 - 为未来功能准备)

以下 Strapi Schema 变更需由开发+内容团队协商后实施：

| 变更 | 目的 | 依赖 |
|------|------|------|
| Blog Post 添加 `relatedApps` 关系字段（多对多关联到 App） | 在文章页展示"相关应用"推荐区 | 前端代码配合渲染 |
| 首页 Page 配置 "推荐文章" section | 首页展示精选 Blog，传递权重 | Page sections 动态配置 |

---

## 五、外链建设 (P1)

### 5.1 优先目标网站

| 目标域名 | 类型 | 原因 | 竞品引用数 | BV 当前状态 |
|---------|------|------|-------:|-----------|
| **techidaily.com** | 科技媒体 | airbeam.tv 最大外链来源 | 324 条 | ❌ 零 |
| **androidtvboxreview.com** | Android TV 评测 | 强话题相关性 | 67 条 | ❌ 零 |
| **firesticktricks.com** | Fire TV 垂直媒体 | 与 firestick remote app 关键词高度相关 | — | ❌ 零 |
| **tomsguide.com** | 权威科技媒体 | "Best [类别] apps" 文章高 SERP 可见性 | — | ❌ 零 |
| **digitaltrends.com** | 主流科技媒体 | 历史竞品覆盖 | — | ❌ 零 |

### 5.2 社区存在建设

- [ ] Reddit: r/AndroidTV、r/Roku、r/fireTV — 以有价值的回答建立存在
- [ ] XDA Developers 论坛 — 技术社区参与
- [ ] Quora — screen mirroring 和 TV remote 相关问题

### 5.3 当前外链质量审计

- 考虑 Disavow `fpvbox.com`（spam score 59）
- 监控 APK 下载站外链（apkzed、downloadapk 等）— 零 SEO 价值
- 确保旧 `.html` URL 的 301 重定向正常工作（339 条历史外链在这些 URL 上）

---

## 六、GA4 分析配置 (P1)

### 6.1 转化事件配置

- [ ] 设置 GA4 转化事件：用户点击 App Store / Google Play 下载按钮
- [ ] 归因到 source/medium/campaign
- [ ] 与 Firebase 交叉验证（如 App 使用了 Firebase）

### 6.2 转化漏斗建设

```
Landing Page → Scroll Depth → CTA Click → Store Navigate
```

### 6.3 当前数据解读

| 指标 | 值 | 说明 |
|------|-----|------|
| 总月会话 | 181,633 | |
| 直接流量（App WebView） | 170,419 (93.7%) | 已被 App 捕获的用户，SEO ROI = 0 |
| **真实有机搜索** | **10,129 (5.6%)** | **SEO 可影响的核心指标** |
| 有机流量跳出率 | 43.3% | 所有渠道中最低，质量最高 |
| 当前转化数 | 0 | ⚠️ 未配置转化事件 |

---

## 七、竞品监控

### 7.1 主要竞品对比

| 指标 | boostvision.tv | airbeam.tv | 差距 |
|------|---------------|-----------|------|
| 内容量 | 200 Blog | 511 Blog + 545 KB | -2.5x Blog, -545 KB |
| 引荐域名 | 1,002 | 2,039 | -2x |
| 编辑类外链 | 2 个高质量 (cnet, techbullion) | 多个 (techidaily 324, info-tv.fr 135, 等) | 大幅落后 |
| 内容标签分类 | 无 | 40+ 主题标签 | 缺失 |
| 视频整合 | 无 | YouTube 教程嵌入 | 缺失 |

### 7.2 新兴竞品

- **letsview.com** — 2,926 引荐域名，增长迅速，需密切监控
- **airdroid.com** — 10,760 引荐域名（含大量自链接网络），2/20 核心关键词进入 Top 20

---

## 八、App Store 优化 (P2)

| 平台 | 问题 | 行动 |
|------|------|------|
| Amazon Appstore | 3 个 App 已上架但网站未链接 | 在对应产品页添加 Amazon 下载按钮 |
| Microsoft Store | 4 个 App 已上架但产品页未提及 Windows | 添加 PC 相关内容和下载入口 |
| Amazon 评分 | 平均 2.7/5（vs Google Play 4.8/5） | 需要声誉管理 |
