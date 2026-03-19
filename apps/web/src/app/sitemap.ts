import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { MetadataRoute } from 'next';
import { getAppSlugs } from '@/lib/strapi/api/apps';
import { getAuthorSlugs } from '@/lib/strapi/api/author';
import { getBlogPostSlugs } from '@/lib/strapi/api/blog';
import { getTutorialSlugs } from '@/lib/strapi/api/tutorials';
import { getFAQSlugs } from '@/lib/strapi/api/faqs';

const DOMAIN = 'https://www.boostvision.tv';
const TRANSLATION_CSV_PATH = path.join(process.cwd(), 'public', 'translation_refine_success_table.csv');

async function getTranslationRefinedUrls() {
  try {
    const csv = await readFile(TRANSLATION_CSV_PATH, 'utf8');
    const lines = csv.replace(/^\uFEFF/, '').split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return [];

    const headers = lines[0].split(',');
    const inputUrlIndex = headers.findIndex((header) => header.trim() === 'current_url');
    if (inputUrlIndex === -1) return [];

    const urls = new Set<string>();

    for (const line of lines.slice(1)) {
      const columns = line.split(',');
      const rawUrl = columns[inputUrlIndex]?.trim();
      if (!rawUrl) continue;

      try {
        const url = new URL(rawUrl);
        urls.add(url.toString());
      } catch {
        // Ignore malformed URLs so sitemap generation remains stable.
      }
    }

    return Array.from(urls);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes = [
    '',
    '/app',
    '/authors',
    '/blog',
    '/tutorial',
    '/faq',
    '/about-us',
    '/contact-us',
    '/privacy-policy',
    '/terms-of-use',
  ].map((route) => ({
    url: `${DOMAIN}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic routes
  const [appSlugs, authorSlugs, blogSlugs, tutorialSlugs, faqSlugs, translationRefinedUrls] = await Promise.all([
    getAppSlugs().catch(() => []),
    getAuthorSlugs().catch(() => []),
    getBlogPostSlugs().catch(() => []),
    getTutorialSlugs().catch(() => []),
    getFAQSlugs().catch(() => []),
    getTranslationRefinedUrls(),
  ]);

  const appRoutes = appSlugs.map((slug) => ({
    url: `${DOMAIN}/app/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const authorRoutes = authorSlugs.map((slug) => ({
    url: `${DOMAIN}/authors/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const blogRoutes = blogSlugs.map((slug) => ({
    url: `${DOMAIN}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const tutorialRoutes = tutorialSlugs.map((slug) => ({
    url: `${DOMAIN}/tutorial/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const faqRoutes = faqSlugs.map((slug) => ({
    url: `${DOMAIN}/faq/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  const translationRefinedRoutes = translationRefinedUrls.map((url) => ({
    url,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...appRoutes,
    ...authorRoutes,
    ...blogRoutes,
    ...tutorialRoutes,
    ...faqRoutes,
    ...translationRefinedRoutes,
  ];
}
