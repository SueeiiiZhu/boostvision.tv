/**
 * Shared UI Components for BoostVision
 * 
 * Note: This package contains reusable UI components.
 * For now, the main UI components are in apps/web/src/components/ui
 * as they are tightly coupled with Next.js and TailwindCSS 4.
 * 
 * Move components here when they need to be shared across multiple apps.
 */

export { cn } from "@boostvision/utils";

// Re-export types that might be useful for UI components
export type { 
  StrapiMedia,
  App,
  BlogPost,
  Feature,
  Testimonial 
} from "@boostvision/types";

