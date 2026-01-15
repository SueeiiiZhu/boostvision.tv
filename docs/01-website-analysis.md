# BoostVision.tv 网站分析文档

## 1. 网站概述

**网站名称**: BoostVision  
**网站地址**: https://www.boostvision.tv/  
**核心业务**: 手机屏幕镜像和电视遥控应用开发  
**目标用户**: iOS 和 Android 用户，需要将手机屏幕投射到智能电视或使用手机控制电视的用户

### 核心数据统计

- 28,000,000+ 下载量
- 200+ 国家和地区
- 10,000,000+ 满意客户
- 24/7/365 客户服务

---

## 2. 网站页面结构

### 2.1 主要页面列表

| 页面类型     | URL 模式               | 描述                         |
| ------------ | ---------------------- | ---------------------------- |
| 首页         | `/`                    | 品牌展示、产品介绍、用户评价 |
| App 下载中心 | `/app`                 | 所有应用下载入口             |
| App 详情页   | `/app/{app-slug}`      | 单个应用详细介绍             |
| 博客列表     | `/blog`                | 博客文章列表                 |
| 博客分类     | `/blog/{category}`     | 按分类浏览博客               |
| 博客文章     | `/{article-slug}.html` | 博客文章详情                 |
| 教程中心     | `/tutorial`            | 使用教程入口                 |
| 教程详情     | `/tutorial/{app-slug}` | 单个应用教程                 |
| FAQ 中心     | `/faq`                 | 常见问题入口                 |
| FAQ 详情     | `/faq/{app-slug}`      | 单个应用 FAQ                 |
| 关于我们     | `/about-us`            | 公司介绍                     |
| 联系我们     | `/contact-us`          | 联系方式                     |
| 使用条款     | `/terms-of-use`        | 法律条款                     |
| 隐私政策     | `/privacy-policy`      | 隐私政策                     |

### 2.2 导航结构

```
Header 导航
├── Screen Mirroring (下拉菜单)
│   ├── TV Cast for Chromecast
│   ├── Smart TV Cast
│   ├── Screen Mirroring App
│   └── Miracast App
├── TV Remote (下拉菜单)
│   ├── Remote for Fire TV
│   ├── Remote for LG TV
│   ├── Remote for Roku TV
│   ├── Remote for Samsung TV
│   └── Universal TV Remote
├── Blog
├── Support (下拉菜单)
│   ├── How to (Tutorial)
│   └── F.A.Q.
├── 语言切换 (en/pt/es/fr/de/ja)
└── Try For Free (CTA 按钮)
```

---

## 3. 产品分类

### 3.1 Screen Mirroring Apps（屏幕镜像应用）

| 应用名称                      | URL Slug                        | 目标设备             |
| ----------------------------- | ------------------------------- | -------------------- |
| TV Cast for Chromecast        | `tv-cast-for-chromecast`        | Google Chromecast    |
| Smart TV Cast                 | `universal-tv-cast`             | 多品牌智能电视       |
| Screen Mirroring App          | `screen-mirroring`              | 支持 DLNA 协议的电视 |
| Miracast App                  | `miracast`                      | 支持 Miracast 的电视 |
| Samsung TV Screen Mirroring   | `screen-mirroring-samsung-tv`   | Samsung TV           |
| Roku Screen Mirroring         | `screen-mirroring-for-roku`     | Roku TV/Stick        |
| LG TV Screen Mirroring        | `lg-tv-screen-mirroring`        | LG WebOS TV          |
| Firestick Screen Mirroring    | `screen-mirroring-firestick`    | Fire TV Stick        |
| Hisense TV Screen Mirroring   | `hisense-tv-screen-mirroring`   | Hisense TV           |
| TCL TV Screen Mirroring       | `tcl-tv-screen-mirroring`       | TCL TV               |
| Sony TV Screen Mirroring      | `sony-tv-screen-mirroring`      | Sony TV              |
| Vizio TV Screen Mirroring     | `vizio-tv-screen-mirroring`     | Vizio TV             |
| Philips TV Screen Mirroring   | `philips-tv-screen-mirroring`   | Philips TV           |
| Toshiba TV Screen Mirroring   | `toshiba-tv-screen-mirroring`   | Toshiba TV           |
| Sharp TV Screen Mirroring     | `sharp-tv-screen-mirroring`     | Sharp TV             |
| Hitachi TV Screen Mirroring   | `hitachi-tv-screen-mirroring`   | Hitachi TV           |
| Panasonic TV Screen Mirroring | `panasonic-tv-screen-mirroring` | Panasonic TV         |
| Beko TV Screen Mirroring      | `beko-tv-screen-mirroring`      | Beko TV              |
| Grundig TV Screen Mirroring   | `grundig-tv-screen-mirroring`   | Grundig TV           |
| Haier TV Screen Mirroring     | `haier-tv-screen-mirroring`     | Haier TV             |
| Onn TV Screen Mirroring       | `onn-tv-screen-mirroring`       | Onn TV               |

### 3.2 TV Remote Apps（电视遥控应用）

| 应用名称               | URL Slug                   | 目标设备              |
| ---------------------- | -------------------------- | --------------------- |
| Remote for Fire TV     | `fire-tv-remote`           | Fire TV & Fire Stick  |
| Remote for Roku TV     | `roku-tv-remote`           | Roku TV & Roku Stick  |
| Remote for Samsung TV  | `samsung-tv-remote`        | Samsung Smart TV      |
| Remote for LG TV       | `lg-tv-remote`             | LG WebOS TV           |
| Universal TV Remote    | `universal-tv-remote`      | 多品牌智能电视        |
| Remote for Sony TV     | `sony-tv-remote`           | Sony Smart TV         |
| Remote for Vizio TV    | `vizio-tv-remote`          | Vizio Smart TV        |
| Remote for Apple TV    | `apple-tv-remote`          | Apple TV (仅 Android) |
| Hisense TV Remote      | `hisense-tv-remote`        | Hisense TV            |
| Insignia TV Remote     | `insignia-tv-remote`       | Insignia TV           |
| Philips TV Remote      | `philips-universal-remote` | Philips TV            |
| TCL TV Remote          | `tcl-remote`               | TCL TV                |
| Hitachi TV Remote      | `hitachi-tv-remote`        | Hitachi TV            |
| Panasonic TV Remote    | `panasonic-tv-remote`      | Panasonic TV          |
| Element TV Remote      | `element-tv-remote`        | Element TV            |
| Toshiba TV Remote      | `toshiba-tv-remote`        | Toshiba TV            |
| Haier TV Remote        | `haier-tv-remote`          | Haier TV              |
| JVC TV Remote          | `jvc-tv-remote`            | JVC TV                |
| RCA TV Remote          | `rca-tv-remote`            | RCA TV                |
| Seiki TV Remote        | `seiki-tv-remote`          | Seiki TV              |
| Sanyo TV Remote        | `sanyo-tv-remote`          | Sanyo TV              |
| Sharp TV Remote        | `sharp-tv-remote`          | Sharp TV              |
| Magnavox TV Remote     | `magnavox-tv-remote`       | Magnavox TV           |
| Onn TV Remote          | `onn-tv-remote`            | Onn TV                |
| Westinghouse TV Remote | `westinghouse-tv-remote`   | Westinghouse TV       |

---

## 4. 页面组件分析

### 4.1 通用组件

#### Header（头部导航）

- Logo
- 主导航菜单（带下拉菜单）
- 语言切换器
- CTA 按钮 (Try For Free)

#### Footer（页脚）

- Logo
- Screen Mirroring Apps 链接列表
- TV Remote Apps 链接列表
- Resources 链接列表（Knowledge Base, TV Remote, Screen Mirroring, Manual）
- Support 链接列表（How to, F.A.Q.）
- 法律链接（Terms of Use, Privacy Policy, Contact us, About us）
- 社交媒体链接（YouTube, Twitter, Facebook）

### 4.2 首页组件

1. **Hero Section（英雄区域）**

   - 主标题：Screen Mirroring & TV Remote Apps
   - 副标题描述
   - CTA 按钮
   - 统计数据展示（下载量、国家、客户、服务）

2. **Why Choose Section（为什么选择我们）**

   - 四个特性卡片：
     - TV Cast via Wi-Fi Network
     - High Quality Screen Mirroring
     - Physical Remote Replacements
     - Multiple TV Compatibility

3. **Screen Mirroring Apps Section**

   - 应用卡片网格展示
   - 每个卡片包含：图标、标题、描述、链接

4. **TV Remote Apps Section**

   - 应用卡片网格展示
   - 每个卡片包含：图标、标题、描述、链接

5. **Device Support Section（设备支持）**

   - 支持的品牌 Logo 展示

6. **Feature Highlight Section（功能亮点）**

   - Screen Mirroring & TV Cast 介绍
   - Smart TV Remote Apps 介绍

7. **Reviews Section（用户评价）**

   - 评分展示（4.8/5.0）
   - 用户评价轮播

8. **Blog Section（博客）**

   - 最新博客文章卡片

9. **CTA Section（行动召唤）**
   - 下载提示
   - App Store / Google Play 链接

### 4.3 App 详情页组件

1. **Hero Section**

   - 应用标题
   - 应用描述
   - 下载量和评分
   - App Store / Google Play 下载按钮
   - 应用截图

2. **Features Section**

   - 多个功能卡片
   - 图标 + 标题 + 描述

3. **Feature Highlight Sections**

   - 左右交替布局
   - 图片 + 功能列表 + 下载按钮

4. **Device Support Section**

   - 支持的设备列表

5. **CTA Section**
   - 下载提示
   - Tutorial / FAQ 链接

### 4.4 博客列表页组件

1. **Header Section**

   - 页面标题
   - 描述

2. **Category Tabs**

   - All / Knowledge Base / Screen Mirroring / TV Remote / Manual

3. **Article Grid**

   - 文章卡片：图片、标题、分类、日期

4. **Support Links**
   - Tutorial / FAQ 链接

### 4.5 博客文章页组件

1. **Article Header**

   - 文章标题
   - 作者信息
   - 发布日期

2. **Table of Contents**

   - 目录导航

3. **Article Content**

   - 富文本内容
   - 图片
   - 代码块
   - 下载按钮组件

4. **Related Blogs**

   - 相关文章推荐

5. **Author Bio**
   - 作者头像
   - 作者介绍

### 4.6 Tutorial/FAQ 页组件

1. **Header Section**

   - 页面标题
   - 描述

2. **Tab Navigation**

   - Screen Mirroring / TV Remote App

3. **App Grid**
   - 应用图标卡片

---

## 5. 博客分类

| 分类名称         | URL Slug           | 描述         |
| ---------------- | ------------------ | ------------ |
| Knowledge Base   | `news`             | 知识库       |
| Screen Mirroring | `screen-mirroring` | 屏幕镜像相关 |
| TV Remote        | `tv-remote`        | 电视遥控相关 |
| Manual           | `manual`           | 使用手册     |

---

## 6. 多语言支持

| 语言       | 代码 |
| ---------- | ---- |
| English    | en   |
| Portuguese | pt   |
| Spanish    | es   |
| French     | fr   |
| German     | de   |
| Japanese   | ja   |

---

## 7. 外部链接

### 应用商店链接

- **Google Play**: `https://play.google.com/store/apps/details?id={package_id}`
- **App Store**: `https://apps.apple.com/app/apple-store/id{app_id}`
- **Amazon**: `https://amzn.to/419PvR7`

### 社交媒体

- **YouTube**: https://www.youtube.com/@boostvision1021
- **Twitter**: https://www.twitter.com/BoostVisio86997
- **Facebook**: https://www.facebook.com/boostvisionapps

### 联系方式

- **Email**: support@boostvision.com.cn

---

## 8. SEO 结构

### Meta 信息

- 每个页面都有独立的 Title 和 Description
- 结构化数据标记

### URL 结构

- 应用页面：`/app/{app-slug}`
- 博客文章：`/{article-slug}.html`
- 教程页面：`/tutorial/{app-slug}`
- FAQ 页面：`/faq/{app-slug}`

---

## 9. 技术栈分析

### 原网站技术栈

- **CMS**: WordPress
- **JavaScript**: jQuery（包含 jQuery Migrate 3.4.1）
- **其他**: 标准 WordPress 主题结构

### 重构目标技术栈

| 技术        | 版本                | 文档链接                                                         |
| ----------- | ------------------- | ---------------------------------------------------------------- |
| Next.js     | 16.1.2 (App Router) | [官方文档](https://nextjs.org/docs)                              |
| TailwindCSS | 4.1                 | [官方文档](https://tailwindcss.com/docs/installation/using-vite) |
| Strapi      | 6.14.1              | [官方文档](https://docs.strapi.io/cms/quick-start)               |
| TypeScript  | 5                   | -                                                                |
| pnpm        | 9+                  | -                                                                |
| Turborepo   | -                   | -                                                                |

---

## 10. 内容类型总结

### 需要在 Strapi 中创建的内容类型

1. **App（应用）**

   - 名称、Slug、描述、图标、类型（Screen Mirroring/TV Remote）
   - App Store 链接、Google Play 链接、Amazon 链接
   - 功能列表、支持设备列表

2. **Blog Post（博客文章）**

   - 标题、Slug、内容、封面图
   - 分类、作者、发布日期

3. **Blog Category（博客分类）**

   - 名称、Slug

4. **Author（作者）**

   - 姓名、头像、简介

5. **Tutorial（教程）**

   - 标题、内容、关联应用

6. **FAQ（常见问题）**

   - 问题、答案、关联应用

7. **Review（用户评价）**

   - 用户名、评价内容

8. **Device Brand（设备品牌）**

   - 名称、Logo

9. **Page（页面）**

   - 关于我们、联系我们等静态页面

10. **Global Settings（全局设置）**
    - 网站标题、Logo、联系信息、社交媒体链接
