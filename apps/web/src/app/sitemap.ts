import { MetadataRoute } from 'next';
import { getAppSlugs } from '@/lib/strapi/api/apps';
import { getAuthorSlugs } from '@/lib/strapi/api/author';
import { getBlogPostSlugs } from '@/lib/strapi/api/blog';
import { getTutorialSlugs } from '@/lib/strapi/api/tutorials';
import { getFAQSlugs } from '@/lib/strapi/api/faqs';

const DOMAIN = 'https://www.boostvision.tv';

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
  const [appSlugs, authorSlugs, blogSlugs, tutorialSlugs, faqSlugs] = await Promise.all([
    getAppSlugs().catch(() => []),
    getAuthorSlugs().catch(() => []),
    getBlogPostSlugs().catch(() => []),
    getTutorialSlugs().catch(() => []),
    getFAQSlugs().catch(() => []),
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

  return [
    ...staticRoutes,
    ...appRoutes,
    ...authorRoutes,
    ...blogRoutes,
    ...tutorialRoutes,
    ...faqRoutes,
  ];
}
