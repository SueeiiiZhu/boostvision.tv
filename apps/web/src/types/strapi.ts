/**
 * Generic Strapi Data Structure (Strapi 6)
 */
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

export interface StrapiImage {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
  name: string;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

/**
 * App Content Type
 */
export interface App {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  type: 'screen-mirroring' | 'tv-remote';
  shortDescription: string;
  description: string;
  icon: StrapiImage;
  screenshots: StrapiImage[];
  heroImage: StrapiImage;
  appStoreUrl: string;
  googlePlayUrl: string;
  amazonUrl: string;
  downloadCount: string;
  rating: number;
  features: Feature[];
  isFeatured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Feature {
  id: number;
  title: string;
  description: string;
  icon: StrapiImage;
}

/**
 * Blog Post Content Type
 */
export interface BlogPost {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: StrapiImage;
  category: BlogCategory;
  author: Author;
  publishedAt: string;
  readTime: number;
  isFeatured: boolean;
}

export interface BlogCategory {
  id: number;
  documentId: string;
  name: string;
  slug: string;
}

export interface Author {
  id: number;
  documentId: string;
  name: string;
  avatar: StrapiImage;
  bio: string;
}

/**
 * Global Settings
 */
export interface GlobalSetting {
  siteName: string;
  siteDescription: string;
  logo: StrapiImage;
  favicon: StrapiImage;
  contactEmail: string;
  supportEmail: string;
  socialLinks: SocialLink[];
  statistics: Statistics;
}

export interface SocialLink {
  id: number;
  platform: 'facebook' | 'twitter' | 'youtube' | 'instagram' | 'linkedin' | 'tiktok';
  url: string;
}

export interface Statistics {
  downloads: string;
  countries: string;
  customers: string;
  supportHours: string;
}
