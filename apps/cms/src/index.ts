import type { Core } from '@strapi/strapi';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    strapi.log.info('[bootstrap] starting bootstrap...');

    // In local/dev, ensure public read permissions so web can render without admin setup friction.
    // Set STRAPI_AUTO_PUBLIC_READ=false to disable this behavior.
    const autoPublicRead = process.env.STRAPI_AUTO_PUBLIC_READ !== 'false';

    if (autoPublicRead) {
      try {
        const publicRole = await strapi.db
          .query('plugin::users-permissions.role')
          .findOne({ where: { type: 'public' } });

        if (publicRole?.id) {
          const actions = [
            'api::global-setting.global-setting.find',
            'api::global-setting.global-setting.findOne',
            'api::navigation.navigation.find',
            'api::navigation.navigation.findOne',
            'api::page.page.find',
            'api::page.page.findOne',
            'api::app.app.find',
            'api::app.app.findOne',
            'api::blog-post.blog-post.find',
            'api::blog-post.blog-post.findOne',
            'api::tutorial.tutorial.find',
            'api::tutorial.tutorial.findOne',
            'api::faq.faq.find',
            'api::faq.faq.findOne',
            'api::author.author.find',
            'api::author.author.findOne',
            'api::blog-category.blog-category.find',
            'api::blog-category.blog-category.findOne',
            'api::device-brand.device-brand.find',
            'api::device-brand.device-brand.findOne',
            'api::review.review.find',
            'api::review.review.findOne',
          ];

          for (const action of actions) {
            let permission = await strapi.db
              .query('plugin::users-permissions.permission')
              .findOne({ where: { action } });

            if (!permission) {
              permission = await strapi.db
                .query('plugin::users-permissions.permission')
                .create({ data: { action } });
            }

            const existingLink = await strapi.db
              .connection('up_permissions_role_lnk')
              .where({ permission_id: permission.id, role_id: publicRole.id })
              .first();

            if (!existingLink) {
              await strapi.db.connection('up_permissions_role_lnk').insert({
                permission_id: permission.id,
                role_id: publicRole.id,
                permission_ord: 1,
              });
            }
          }

          strapi.log.info('[bootstrap] ensured public read permissions for local preview');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        strapi.log.warn(`[bootstrap] failed to ensure public read permissions: ${message}`);
      }
    }

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
