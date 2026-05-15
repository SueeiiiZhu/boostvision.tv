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
      totalCount: number;
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
  displayTitle?: string;
  sections?: Section[];
  downloadLinks?: DownloadLink[];
  slug: string;
  type: 'screen-mirroring' | 'tv-remote';
  shortDescription: string;
  description: BlocksContent | string; // 兼容旧数据（string）和新数据（BlocksContent）
  icon: StrapiImage;
  screenshots: StrapiImage[];
  heroImage: StrapiImage;
  downloadCount: string;
  rating?: number | string;
  ratingCount?: number;
  appStoreRating?: number | string;
  appStoreRatingCount?: number;
  googlePlayRating?: number | string;
  googlePlayRatingCount?: number;
  ratingSyncedAt?: string;
  features: Feature[];
  isFeatured: boolean;
  order: number;
  seo?: SEO;
  createdAt: string;
  updatedAt?: string;
  publishedAt: string;
}

export interface DownloadLink {
  id: number;
  platform: 'Google Play' | 'App Store' | 'Amazon';
  url: string;
  badge: StrapiImage;
  isClickable: boolean;
  generateQRCode: boolean;
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
  content: BlocksContent | string;
  excerpt: string;
  coverImage: StrapiImage;
  category: BlogCategory;
  author: Author;
  postDate: string;
  createdAt: string;
  publishedAt: string;
  updatedAt?: string;
  readTime: number;
  isFeatured: boolean;
  relatedPosts?: BlogPost[];
  seo?: SEO;
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
  slug: string;
  avatar?: StrapiImage;
  bio?: string;
  jobTitle?: string;
  expertise?: string;
  socialLinks?: SocialLink[];
  blogPosts?: Array<{ id: number }>;
}

/**
 * Global Settings
 */
export interface GlobalSetting {
  siteName: string;
  siteDescription: string;
  googlePlayBadge?: StrapiImage;
  appStoreBadge?: StrapiImage;
  logo: StrapiImage;
  footerLogo: StrapiImage;
  favicon: StrapiImage;
  contactEmail: string;
  supportEmail: string;
  socialLinks: SocialLink[];
  statistics: Statistics;
  footerText?: string;
  trademarkDisclaimer?: string;
  tryForFreeText?: string;
  tryForFreeLink?: string;
  tocTitle?: string;
  relatedPostsTitle?: string;
  appStoreRateLabel?: string;
  defaultSeo?: SEO;
}

export interface SEO {
  metaTitle?: string;
  metaDescription?: string;
  metaImage?: StrapiImage;
  keywords?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
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
  content: BlocksContent | string;
  videoUrl?: string;
  videoEmbed?: string;
  app?: App;
  steps: TutorialStep[];
  sections?: Section[];
  seo?: SEO;
  order: number;
}

export interface TutorialStep {
  id: number;
  stepNumber: number;
  title: string;
  description: BlocksContent | string;
  image?: StrapiImage;
}

export interface TutorialItem {
  id: number;
  title: string;
  content: BlocksContent;
  showDownloadButtons: boolean;
}

export interface TutorialAccordionSection {
  id: number;
  __component: 'sections.tutorial-accordion';
  items: TutorialItem[];
}

/**
 * FAQ Content Type
 */
export interface FAQ {
  id: number;
  documentId: string;
  question: string;
  slug: string;
  answer: BlocksContent | string;
  app?: App;
  category: string;
  sections?: Section[];
  seo?: SEO;
  order: number;
}

/**
 * Navigation Components
 */
export interface NavLink {
  id: number;
  name: string;
  href: string;
}

export interface HeaderItem {
  id: number;
  name: string;
  href?: string;
  links: NavLink[];
}

export interface NavSection {
  id: number;
  title: string;
  links: NavLink[];
}

/**
 * Navigation Single Type
 */
export interface Navigation {
  headerMenu: HeaderItem[];
  footerColumns: NavSection[];
  bottomMenu: NavLink[];
}

/**
 * Generic Page Content Type
 */
export interface Page {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  content: BlocksContent | string;
  seo?: SEO;
  sections?: Section[];
  createdAt: string;
  updatedAt?: string;
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
  | BrandsGridSection
  | AppsFilterSection
  | TutorialAccordionSection;

export interface HeroSection {
  id: number;
  __component: 'sections.hero';
  title: string;
  subtitle: string;
  backgroundImage?: StrapiImage;
  image?: StrapiImage;
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
  richText?: BlocksContent;
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
  links?: NavLink[];
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

export interface AppsFilterSection {
  id: number;
  __component: 'sections.apps-filter';
  screenMirroringLabel: string;
  screenMirroringIcon?: StrapiImage;
  tvRemoteLabel: string;
  tvRemoteIcon?: StrapiImage;
}

export interface Review {
  id: number;
  name: string;
  text: string;
}
