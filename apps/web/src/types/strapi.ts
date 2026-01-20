import { type BlocksContent } from "@strapi/blocks-react-renderer";

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
  description: BlocksContent;
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
  content: BlocksContent;
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

/**
 * Tutorial Content Type
 */
export interface Tutorial {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  content: BlocksContent;
  videoUrl?: string;
  videoEmbed?: string;
  app?: App;
  steps: TutorialStep[];
  order: number;
}

export interface TutorialStep {
  id: number;
  stepNumber: number;
  title: string;
  description: BlocksContent;
  image?: StrapiImage;
}

/**
 * FAQ Content Type
 */
export interface FAQ {
  id: number;
  documentId: string;
  question: string;
  answer: BlocksContent;
  app?: App;
  category: string;
  order: number;
}

/**
 * Generic Page Content Type
 */
export interface Page {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  content: BlocksContent;
  seo?: any;
  sections?: Section[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

/**
 * Page Sections (Dynamic Zones)
 */
export type Section = 
  | HeroSection 
  | FeatureHighlightSection 
  | CTASection 
  | WhyChooseSection 
  | StatisticsSection 
  | ReviewsSection
  | AppsGridSection
  | BrandsGridSection;

export interface HeroSection {
  id: number;
  __component: 'sections.hero';
  title: string;
  subtitle: string;
  backgroundImage?: StrapiImage;
  image?: StrapiImage; // The device mockup image
  ctaText?: string;
  ctaLink?: string;
  ctaSubtext?: string;
  statistics?: Statistics;
}

export interface FeatureHighlightSection {
  id: number;
  __component: 'sections.feature-highlight';
  title: string;
  description: string;
  image: StrapiImage;
  imagePosition: 'left' | 'right';
  labelColor: 'green' | 'blue';
}

export interface CTASection {
  id: number;
  __component: 'sections.cta';
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export interface WhyChooseSection {
  id: number;
  __component: 'sections.why-choose';
  title: string;
  features: Feature[];
}

export interface StatisticsSection {
  id: number;
  __component: 'sections.statistics';
  title?: string;
  stats: Statistics;
}

export interface ReviewsSection {
  id: number;
  __component: 'sections.reviews';
  title: string;
  rating: string;
  reviews: Review[];
}

export interface AppsGridSection {
  id: number;
  __component: 'sections.apps-grid';
  title: string;
  type: 'screen-mirroring' | 'tv-remote';
  limit: number;
  backgroundColor: 'white' | 'section-bg';
}

export interface BrandsGridSection {
  id: number;
  __component: 'sections.brands-grid';
  title: string;
  description: string;
  brands: Feature[];
}

export interface Review {
  id: number;
  name: string;
  text: string;
}
