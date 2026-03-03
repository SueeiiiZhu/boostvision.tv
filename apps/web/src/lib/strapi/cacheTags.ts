export const CACHE_TAGS = {
  apps: "apps",
  authors: "authors",
  blogPosts: "blog-posts",
  blogCategories: "blog-categories",
  faqs: "faqs",
  globalSetting: "global-setting",
  navigation: "navigation",
  pages: "pages",
  tutorials: "tutorials",
} as const;

export function appTag(slug: string) {
  return `app:${slug}`;
}

export function authorTag(slug: string) {
  return `author:${slug}`;
}

export function blogPostTag(slug: string) {
  return `blog-post:${slug}`;
}

export function faqTag(slug: string) {
  return `faq:${slug}`;
}

export function navigationLocaleTag(locale: string) {
  return `navigation:${locale}`;
}

export function pageTag(slug: string) {
  return `page:${slug}`;
}

export function globalSettingLocaleTag(locale: string) {
  return `global-setting:${locale}`;
}

export function tutorialTag(slug: string) {
  return `tutorial:${slug}`;
}
