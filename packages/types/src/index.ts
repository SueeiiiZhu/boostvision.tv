/**
 * Shared TypeScript types for BoostVision
 */

// Strapi base types
export interface StrapiEntity {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface StrapiMedia {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail?: StrapiMediaFormat;
    small?: StrapiMediaFormat;
    medium?: StrapiMediaFormat;
    large?: StrapiMediaFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
}

export interface StrapiMediaFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  url: string;
}

// App types
export type AppType = "screen-mirroring" | "tv-remote";

export interface App extends StrapiEntity {
  name: string;
  slug: string;
  type: AppType;
  description: string;
  shortDescription: string;
  icon?: StrapiMedia;
  appStoreUrl?: string;
  googlePlayUrl?: string;
  amazonUrl?: string;
  features?: Feature[];
  supportedDevices?: string[];
  screenshots?: StrapiMedia[];
  seo?: SEO;
}

// Blog types
export interface BlogCategory extends StrapiEntity {
  name: string;
  slug: string;
  description?: string;
}

export interface Author extends StrapiEntity {
  name: string;
  bio?: string;
  avatar?: StrapiMedia;
}

export interface BlogPost extends StrapiEntity {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: StrapiMedia;
  category?: BlogCategory;
  author?: Author;
  readingTime?: number;
  seo?: SEO;
}

// Tutorial & FAQ types
export interface Tutorial extends StrapiEntity {
  title: string;
  slug: string;
  content: string;
  app?: App;
  order: number;
  seo?: SEO;
}

export interface FAQ extends StrapiEntity {
  title: string;
  slug: string;
  app?: App;
  items: FAQItem[];
  seo?: SEO;
}

// Component types
export interface SEO {
  metaTitle: string;
  metaDescription: string;
  metaImage?: StrapiMedia;
  keywords?: string;
  canonicalURL?: string;
}

export interface Feature {
  id: number;
  title: string;
  description: string;
  icon?: StrapiMedia;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export interface Testimonial {
  id: number;
  name: string;
  content: string;
  rating: number;
  avatar?: StrapiMedia;
}

// Page types
export interface Page extends StrapiEntity {
  title: string;
  slug: string;
  content: string;
  seo?: SEO;
}

// Single types
export interface Homepage extends StrapiEntity {
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: StrapiMedia;
  stats: {
    downloads: string;
    countries: string;
    customers: string;
  };
  featuredApps?: App[];
  testimonials?: Testimonial[];
  seo?: SEO;
}

export interface GlobalSettings extends StrapiEntity {
  siteName: string;
  siteDescription: string;
  logo?: StrapiMedia;
  favicon?: StrapiMedia;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  footer?: {
    copyright: string;
    links: {
      title: string;
      url: string;
    }[];
  };
}

// API Response types
export interface StrapiResponse<T> {
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

