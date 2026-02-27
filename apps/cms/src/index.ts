import type { Core } from '@strapi/strapi';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    strapi.log.info('[bootstrap] starting bootstrap...');

    // Optional one-time cleanup for stale online content-manager/type-builder config.
    // Enable by setting STRAPI_CLEAR_BLOG_POST_CONFIG=true in target environment.
    const shouldClearBlogPostConfig =
      process.env.STRAPI_CLEAR_BLOG_POST_CONFIG === 'true';

    if (!shouldClearBlogPostConfig) return;

    try {
      const deleted = await strapi.db.query('strapi::core-store').deleteMany({
        where: {
          key: {
            $contains: 'api::blog-post.blog-post',
          },
        },
      });

      strapi.log.info(
        `[bootstrap] cleared stale blog-post core-store config (count=${deleted?.count ?? 'unknown'})`
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      strapi.log.error(`[bootstrap] clear blog-post config failed: ${message}`);
    }
  },
};
