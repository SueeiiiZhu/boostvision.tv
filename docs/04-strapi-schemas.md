# Strapi 6 Content Types Schema 文档

本文档定义了 Strapi 6 CMS 中所有 Content Types 的完整 Schema。

> 📚 **官方文档**: [https://docs.strapi.io/cms/quick-start](https://docs.strapi.io/cms/quick-start)

## Strapi 6 重要变化

1. **扁平化 API 响应**: 不再有 `data.attributes` 嵌套，直接访问属性
2. **Document Service API**: 新的数据操作 API
3. **Blocks 编辑器**: 推荐使用 `blocks` 类型替代 `richtext`
4. **documentId**: 每个文档都有唯一的 `documentId` 标识符

> 参考 Strapi 官方 API 响应示例：
> ```json
> {
>   "data": [{
>     "id": 3,
>     "documentId": "wf7m1n3g8g22yr5k50hsryhk",
>     "Name": "Biscotte Restaurant",
>     "createdAt": "2024-09-10T12:49:32.350Z",
>     "publishedAt": "2024-09-10T13:14:18.280Z"
>   }],
>   "meta": { "pagination": { "page": 1, "pageSize": 25, "total": 1 } }
> }
> ```

---

## Collection Types

### 1. App (应用)

**API ID**: `app`  
**Collection Name**: `apps`

```json
{
  "kind": "collectionType",
  "collectionName": "apps",
  "info": {
    "singularName": "app",
    "pluralName": "apps",
    "displayName": "App",
    "description": "Screen mirroring and TV remote applications"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "name": {
      "type": "string",
      "required": true,
      "maxLength": 100
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
      "type": "string",
      "maxLength": 255
    },
    "description": {
      "type": "text"
    },
    "icon": {
      "type": "media",
      "multiple": false,
      "required": false,
      "allowedTypes": ["images"]
    },
    "screenshots": {
      "type": "media",
      "multiple": true,
      "required": false,
      "allowedTypes": ["images"]
    },
    "heroImage": {
      "type": "media",
      "multiple": false,
      "required": false,
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
      "type": "decimal",
      "min": 0,
      "max": 5
    },
    "features": {
      "type": "component",
      "repeatable": true,
      "component": "shared.feature"
    },
    "featureHighlights": {
      "type": "component",
      "repeatable": true,
      "component": "sections.feature-highlight"
    },
    "supportedDevices": {
      "type": "json"
    },
    "targetBrands": {
      "type": "relation",
      "relation": "manyToMany",
      "target": "api::device-brand.device-brand",
      "mappedBy": "apps"
    },
    "tutorials": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::tutorial.tutorial",
      "mappedBy": "app"
    },
    "faqs": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::faq.faq",
      "mappedBy": "app"
    },
    "order": {
      "type": "integer",
      "default": 0
    },
    "isFeatured": {
      "type": "boolean",
      "default": false
    },
    "seo": {
      "type": "component",
      "repeatable": false,
      "component": "shared.seo"
    }
  }
}
```

---

### 2. Blog Post (博客文章)

**API ID**: `blog-post`  
**Collection Name**: `blog_posts`

```json
{
  "kind": "collectionType",
  "collectionName": "blog_posts",
  "info": {
    "singularName": "blog-post",
    "pluralName": "blog-posts",
    "displayName": "Blog Post",
    "description": "Blog articles and news"
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "title": {
      "type": "string",
      "required": true,
      "maxLength": 200
    },
    "slug": {
      "type": "uid",
      "targetField": "title",
      "required": true
    },
    "content": {
      "type": "richtext"
    },
    "excerpt": {
      "type": "text",
      "maxLength": 500
    },
    "coverImage": {
      "type": "media",
      "multiple": false,
      "required": false,
      "allowedTypes": ["images"]
    },
    "category": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::blog-category.blog-category",
      "inversedBy": "blogPosts"
    },
    "author": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::author.author",
      "inversedBy": "blogPosts"
    },
    "relatedApps": {
      "type": "relation",
      "relation": "manyToMany",
      "target": "api::app.app"
    },
    "relatedPosts": {
      "type": "relation",
      "relation": "manyToMany",
      "target": "api::blog-post.blog-post"
    },
    "tags": {
      "type": "json"
    },
    "publishedAt": {
      "type": "datetime"
    },
    "readTime": {
      "type": "integer"
    },
    "isFeatured": {
      "type": "boolean",
      "default": false
    },
    "seo": {
      "type": "component",
      "repeatable": false,
      "component": "shared.seo"
    }
  }
}
```

---

### 3. Blog Category (博客分类)

**API ID**: `blog-category`  
**Collection Name**: `blog_categories`

```json
{
  "kind": "collectionType",
  "collectionName": "blog_categories",
  "info": {
    "singularName": "blog-category",
    "pluralName": "blog-categories",
    "displayName": "Blog Category"
  },
  "options": {
    "draftAndPublish": false
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
    "description": {
      "type": "text"
    },
    "blogPosts": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::blog-post.blog-post",
      "mappedBy": "category"
    },
    "order": {
      "type": "integer",
      "default": 0
    }
  }
}
```

---

### 4. Author (作者)

**API ID**: `author`  
**Collection Name**: `authors`

```json
{
  "kind": "collectionType",
  "collectionName": "authors",
  "info": {
    "singularName": "author",
    "pluralName": "authors",
    "displayName": "Author"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "name": {
      "type": "string",
      "required": true
    },
    "avatar": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["images"]
    },
    "bio": {
      "type": "text"
    },
    "email": {
      "type": "email"
    },
    "blogPosts": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::blog-post.blog-post",
      "mappedBy": "author"
    }
  }
}
```

---

### 5. Tutorial (教程)

**API ID**: `tutorial`  
**Collection Name**: `tutorials`

```json
{
  "kind": "collectionType",
  "collectionName": "tutorials",
  "info": {
    "singularName": "tutorial",
    "pluralName": "tutorials",
    "displayName": "Tutorial"
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "title": {
      "type": "string",
      "required": true
    },
    "content": {
      "type": "richtext"
    },
    "videoUrl": {
      "type": "string"
    },
    "videoEmbed": {
      "type": "text"
    },
    "app": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::app.app",
      "inversedBy": "tutorials"
    },
    "steps": {
      "type": "component",
      "repeatable": true,
      "component": "shared.tutorial-step"
    },
    "order": {
      "type": "integer",
      "default": 0
    }
  }
}
```

---

### 6. FAQ (常见问题)

**API ID**: `faq`  
**Collection Name**: `faqs`

```json
{
  "kind": "collectionType",
  "collectionName": "faqs",
  "info": {
    "singularName": "faq",
    "pluralName": "faqs",
    "displayName": "FAQ"
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "question": {
      "type": "string",
      "required": true
    },
    "answer": {
      "type": "richtext"
    },
    "app": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::app.app",
      "inversedBy": "faqs"
    },
    "category": {
      "type": "string"
    },
    "order": {
      "type": "integer",
      "default": 0
    }
  }
}
```

---

### 7. Review (用户评价)

**API ID**: `review`  
**Collection Name**: `reviews`

```json
{
  "kind": "collectionType",
  "collectionName": "reviews",
  "info": {
    "singularName": "review",
    "pluralName": "reviews",
    "displayName": "Review"
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "userName": {
      "type": "string",
      "required": true
    },
    "content": {
      "type": "text",
      "required": true
    },
    "rating": {
      "type": "integer",
      "required": true,
      "min": 1,
      "max": 5
    },
    "app": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::app.app"
    },
    "isVerified": {
      "type": "boolean",
      "default": false
    },
    "source": {
      "type": "enumeration",
      "enum": ["app-store", "google-play", "website", "other"]
    },
    "order": {
      "type": "integer",
      "default": 0
    }
  }
}
```

---

### 8. Device Brand (设备品牌)

**API ID**: `device-brand`  
**Collection Name**: `device_brands`

```json
{
  "kind": "collectionType",
  "collectionName": "device_brands",
  "info": {
    "singularName": "device-brand",
    "pluralName": "device-brands",
    "displayName": "Device Brand"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "name": {
      "type": "string",
      "required": true,
      "unique": true
    },
    "slug": {
      "type": "uid",
      "targetField": "name"
    },
    "logo": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["images"]
    },
    "apps": {
      "type": "relation",
      "relation": "manyToMany",
      "target": "api::app.app",
      "inversedBy": "targetBrands"
    },
    "order": {
      "type": "integer",
      "default": 0
    },
    "isActive": {
      "type": "boolean",
      "default": true
    }
  }
}
```

---

### 9. Page (静态页面)

**API ID**: `page`  
**Collection Name**: `pages`

```json
{
  "kind": "collectionType",
  "collectionName": "pages",
  "info": {
    "singularName": "page",
    "pluralName": "pages",
    "displayName": "Page"
  },
  "options": {
    "draftAndPublish": true
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
      "type": "richtext"
    },
    "sections": {
      "type": "dynamiczone",
      "components": [
        "sections.hero",
        "sections.feature-list",
        "sections.cta",
        "sections.content-block",
        "sections.image-text"
      ]
    },
    "seo": {
      "type": "component",
      "repeatable": false,
      "component": "shared.seo"
    }
  }
}
```

---

## Single Types

### 1. Global Settings (全局设置)

**API ID**: `global-setting`

```json
{
  "kind": "singleType",
  "collectionName": "global_settings",
  "info": {
    "singularName": "global-setting",
    "pluralName": "global-settings",
    "displayName": "Global Settings"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "siteName": {
      "type": "string",
      "required": true
    },
    "siteDescription": {
      "type": "text"
    },
    "logo": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["images"]
    },
    "favicon": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["images"]
    },
    "contactEmail": {
      "type": "email"
    },
    "supportEmail": {
      "type": "email"
    },
    "socialLinks": {
      "type": "component",
      "repeatable": true,
      "component": "shared.social-link"
    },
    "footerText": {
      "type": "text"
    },
    "statistics": {
      "type": "component",
      "repeatable": false,
      "component": "shared.statistics"
    },
    "defaultSeo": {
      "type": "component",
      "repeatable": false,
      "component": "shared.seo"
    }
  }
}
```

### 2. Navigation (导航)

**API ID**: `navigation`

```json
{
  "kind": "singleType",
  "collectionName": "navigations",
  "info": {
    "singularName": "navigation",
    "pluralName": "navigations",
    "displayName": "Navigation"
  },
  "attributes": {
    "mainMenu": {
      "type": "component",
      "repeatable": true,
      "component": "navigation.menu-item"
    },
    "footerMenus": {
      "type": "component",
      "repeatable": true,
      "component": "navigation.footer-menu"
    }
  }
}
```

---

## Components

### Shared Components

#### shared.seo

```json
{
  "collectionName": "components_shared_seos",
  "info": {
    "displayName": "SEO",
    "icon": "search",
    "description": "SEO meta information"
  },
  "attributes": {
    "metaTitle": {
      "type": "string",
      "maxLength": 60
    },
    "metaDescription": {
      "type": "text",
      "maxLength": 160
    },
    "metaImage": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["images"]
    },
    "keywords": {
      "type": "string"
    },
    "canonicalUrl": {
      "type": "string"
    },
    "noIndex": {
      "type": "boolean",
      "default": false
    }
  }
}
```

#### shared.feature

```json
{
  "collectionName": "components_shared_features",
  "info": {
    "displayName": "Feature",
    "icon": "star",
    "description": "Feature item with icon"
  },
  "attributes": {
    "title": {
      "type": "string",
      "required": true
    },
    "description": {
      "type": "text"
    },
    "icon": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["images"]
    }
  }
}
```

#### shared.social-link

```json
{
  "collectionName": "components_shared_social_links",
  "info": {
    "displayName": "Social Link",
    "icon": "link"
  },
  "attributes": {
    "platform": {
      "type": "enumeration",
      "enum": ["facebook", "twitter", "youtube", "instagram", "linkedin", "tiktok"],
      "required": true
    },
    "url": {
      "type": "string",
      "required": true
    }
  }
}
```

#### shared.statistics

```json
{
  "collectionName": "components_shared_statistics",
  "info": {
    "displayName": "Statistics",
    "icon": "chartLine"
  },
  "attributes": {
    "downloads": {
      "type": "string"
    },
    "countries": {
      "type": "string"
    },
    "customers": {
      "type": "string"
    },
    "supportHours": {
      "type": "string"
    }
  }
}
```

#### shared.tutorial-step

```json
{
  "collectionName": "components_shared_tutorial_steps",
  "info": {
    "displayName": "Tutorial Step",
    "icon": "list"
  },
  "attributes": {
    "stepNumber": {
      "type": "integer"
    },
    "title": {
      "type": "string"
    },
    "description": {
      "type": "richtext"
    },
    "image": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["images"]
    }
  }
}
```

### Section Components

#### sections.hero

```json
{
  "collectionName": "components_sections_heroes",
  "info": {
    "displayName": "Hero Section",
    "icon": "picture"
  },
  "attributes": {
    "title": {
      "type": "string"
    },
    "subtitle": {
      "type": "text"
    },
    "backgroundImage": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["images"]
    },
    "ctaText": {
      "type": "string"
    },
    "ctaLink": {
      "type": "string"
    }
  }
}
```

#### sections.feature-highlight

```json
{
  "collectionName": "components_sections_feature_highlights",
  "info": {
    "displayName": "Feature Highlight",
    "icon": "star"
  },
  "attributes": {
    "title": {
      "type": "string"
    },
    "features": {
      "type": "json"
    },
    "image": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["images"]
    },
    "imagePosition": {
      "type": "enumeration",
      "enum": ["left", "right"],
      "default": "left"
    },
    "labelColor": {
      "type": "enumeration",
      "enum": ["green", "blue"],
      "default": "green"
    }
  }
}
```

#### sections.cta

```json
{
  "collectionName": "components_sections_ctas",
  "info": {
    "displayName": "CTA Section",
    "icon": "cursor"
  },
  "attributes": {
    "title": {
      "type": "string"
    },
    "description": {
      "type": "text"
    },
    "buttonText": {
      "type": "string"
    },
    "buttonLink": {
      "type": "string"
    },
    "showAppStoreLinks": {
      "type": "boolean",
      "default": true
    }
  }
}
```

### Navigation Components

#### navigation.menu-item

```json
{
  "collectionName": "components_navigation_menu_items",
  "info": {
    "displayName": "Menu Item",
    "icon": "link"
  },
  "attributes": {
    "label": {
      "type": "string",
      "required": true
    },
    "url": {
      "type": "string"
    },
    "children": {
      "type": "component",
      "repeatable": true,
      "component": "navigation.submenu-item"
    }
  }
}
```

#### navigation.submenu-item

```json
{
  "collectionName": "components_navigation_submenu_items",
  "info": {
    "displayName": "Submenu Item",
    "icon": "link"
  },
  "attributes": {
    "label": {
      "type": "string",
      "required": true
    },
    "url": {
      "type": "string",
      "required": true
    },
    "description": {
      "type": "string"
    },
    "icon": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["images"]
    }
  }
}
```

#### navigation.footer-menu

```json
{
  "collectionName": "components_navigation_footer_menus",
  "info": {
    "displayName": "Footer Menu",
    "icon": "list"
  },
  "attributes": {
    "title": {
      "type": "string",
      "required": true
    },
    "items": {
      "type": "component",
      "repeatable": true,
      "component": "navigation.submenu-item"
    }
  }
}
```

---

## API 权限配置

### Public 角色权限

| Content Type | find | findOne | create | update | delete |
|--------------|------|---------|--------|--------|--------|
| App | ✅ | ✅ | ❌ | ❌ | ❌ |
| Blog Post | ✅ | ✅ | ❌ | ❌ | ❌ |
| Blog Category | ✅ | ✅ | ❌ | ❌ | ❌ |
| Author | ✅ | ✅ | ❌ | ❌ | ❌ |
| Tutorial | ✅ | ✅ | ❌ | ❌ | ❌ |
| FAQ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Review | ✅ | ❌ | ❌ | ❌ | ❌ |
| Device Brand | ✅ | ✅ | ❌ | ❌ | ❌ |
| Page | ✅ | ✅ | ❌ | ❌ | ❌ |
| Global Setting | ✅ | - | ❌ | ❌ | ❌ |
| Navigation | ✅ | - | ❌ | ❌ | ❌ |

---

## 常用 API 查询示例

### 获取所有应用（带分页）

```
GET /api/apps?populate=*&pagination[page]=1&pagination[pageSize]=20
```

### 按类型筛选应用

```
GET /api/apps?filters[type][$eq]=screen-mirroring&populate=*
```

### 获取单个应用（深度填充）

```
GET /api/apps?filters[slug][$eq]=fire-tv-remote&populate=deep
```

### 获取博客文章列表

```
GET /api/blog-posts?populate=*&sort[0]=publishedAt:desc&pagination[pageSize]=10
```

### 按分类获取博客

```
GET /api/blog-posts?filters[category][slug][$eq]=tv-remote&populate=*
```

### 获取全局设置

```
GET /api/global-setting?populate=deep
```

