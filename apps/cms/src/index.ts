import type { Core } from '@strapi/strapi';
import { createHash } from 'crypto';

const PAGE_UID = 'api::page.page';
const DEFAULT_LOCALE = 'en';
const PROTECTED_PAGE_SLUG = 'home';
const LOCALIZED_PAGE_FIELDS = ['title', 'content', 'sections', 'seo'];

function isLocalized(config: any) {
  return config?.pluginOptions?.i18n?.localized === true;
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }

  if (value && typeof value === 'object') {
    return `{${Object.entries(value)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, nested]) => `${JSON.stringify(key)}:${stableStringify(nested)}`)
      .join(',')}}`;
  }

  return JSON.stringify(value);
}

function hashSnapshot(value: unknown): string {
  return createHash('sha256').update(stableStringify(value)).digest('hex');
}

function getComponentTables(strapi: Core.Strapi) {
  return new Map(
    Object.entries(strapi.components).map(([uid, schema]) => [
      uid,
      schema.collectionName,
    ])
  );
}

async function tableRows(strapi: Core.Strapi, table: string, where: Record<string, unknown>) {
  return strapi.db.connection(table).select('*').where(where).orderBy('id');
}

async function optionalTableRows(strapi: Core.Strapi, table: string, where: Record<string, unknown>) {
  try {
    return await tableRows(strapi, table, where);
  } catch {
    return [];
  }
}

async function componentSnapshot(
  strapi: Core.Strapi,
  componentTables: Map<string, string | undefined>,
  componentType: string,
  componentId: number,
  depth = 0
): Promise<unknown> {
  const table = componentTables.get(componentType);
  if (!table) return { componentType, componentId, missingTable: true };

  const rows = await optionalTableRows(strapi, table, { id: componentId });
  const nestedLinks = depth >= 2
    ? []
    : await optionalTableRows(strapi, `${table}_cmps`, { entity_id: componentId });

  const nested = await Promise.all(
    nestedLinks.map((link) =>
      componentSnapshot(
        strapi,
        componentTables,
        link.component_type,
        link.cmp_id,
        depth + 1
      ).then((snapshot) => ({
        field: link.field,
        order: link.order,
        componentType: link.component_type,
        componentId: link.cmp_id,
        snapshot,
      }))
    )
  );

  return { componentType, componentId, rows, nested };
}

async function pageLocaleSnapshot(
  strapi: Core.Strapi,
  componentTables: Map<string, string | undefined>,
  documentId: string,
  locale: string
) {
  const pageRows = await strapi.db.connection('pages')
    .select('*')
    .where({ document_id: documentId, locale })
    .orderBy('published_at')
    .orderBy('id');

  const pageIds = pageRows.map((row) => row.id);
  const links = pageIds.length > 0
    ? await strapi.db.connection('pages_cmps')
        .select('*')
        .whereIn('entity_id', pageIds)
        .orderBy('entity_id')
        .orderBy('field')
        .orderBy('order')
    : [];

  const components = await Promise.all(
    links.map((link) =>
      componentSnapshot(
        strapi,
        componentTables,
        link.component_type,
        link.cmp_id
      ).then((snapshot) => ({
        entityId: link.entity_id,
        field: link.field,
        order: link.order,
        componentType: link.component_type,
        componentId: link.cmp_id,
        snapshot,
      }))
    )
  );

  return { pageRows, links, components };
}

async function pageComponentRefs(strapi: Core.Strapi, documentId: string, locale: string) {
  const pageRows = await strapi.db.connection('pages')
    .select('id')
    .where({ document_id: documentId, locale });

  const pageIds = pageRows.map((row) => row.id);
  if (pageIds.length === 0) return [];

  return strapi.db.connection('pages_cmps')
    .select('component_type', 'cmp_id')
    .whereIn('entity_id', pageIds);
}

async function resolveTargetPage(strapi: Core.Strapi, params: any) {
  const where = params?.where ?? {};
  const data = params?.data ?? {};
  const explicitLocale = params?.locale ?? where.locale ?? data.locale;

  if (where.id) {
    return strapi.db.connection('pages')
      .select('*')
      .where({ id: where.id })
      .first();
  }

  const documentId = where.documentId ?? where.document_id ?? data.documentId ?? data.document_id;
  if (!documentId) return null;

  const query = strapi.db.connection('pages')
    .select('*')
    .where({ document_id: documentId });

  if (explicitLocale) {
    query.andWhere({ locale: explicitLocale });
  }

  return query.orderBy('published_at').first();
}

function registerHomepageLocaleGuard(strapi: Core.Strapi) {
  const componentTables = getComponentTables(strapi);

  strapi.db.lifecycles.subscribe({
    models: [PAGE_UID],

    async beforeUpdate(event: any) {
      const targetPage = await resolveTargetPage(strapi, event.params);
      if (
        !targetPage ||
        targetPage.slug !== PROTECTED_PAGE_SLUG ||
        !targetPage.locale ||
        targetPage.locale === DEFAULT_LOCALE
      ) {
        return;
      }

      const [defaultRefs, targetRefs, defaultSnapshot] = await Promise.all([
        pageComponentRefs(strapi, targetPage.document_id, DEFAULT_LOCALE),
        pageComponentRefs(strapi, targetPage.document_id, targetPage.locale),
        pageLocaleSnapshot(strapi, componentTables, targetPage.document_id, DEFAULT_LOCALE),
      ]);

      const defaultRefKeys = new Set(
        defaultRefs.map((ref) => `${ref.component_type}:${ref.cmp_id}`)
      );
      const sharedRefs = targetRefs
        .map((ref) => `${ref.component_type}:${ref.cmp_id}`)
        .filter((key) => defaultRefKeys.has(key));

      if (sharedRefs.length > 0) {
        throw new Error(
          `[i18n guard] Refusing to update ${PROTECTED_PAGE_SLUG}:${targetPage.locale}; it shares components with ${DEFAULT_LOCALE}: ${sharedRefs.join(', ')}`
        );
      }

      event.state = {
        ...(event.state ?? {}),
        homepageLocaleGuard: {
          documentId: targetPage.document_id,
          locale: targetPage.locale,
          beforeHash: hashSnapshot(defaultSnapshot),
        },
      };
    },

    async afterUpdate(event: any) {
      const guard = event.state?.homepageLocaleGuard;
      if (!guard) return;

      const afterSnapshot = await pageLocaleSnapshot(
        strapi,
        componentTables,
        guard.documentId,
        DEFAULT_LOCALE
      );
      const afterHash = hashSnapshot(afterSnapshot);

      if (afterHash !== guard.beforeHash) {
        throw new Error(
          `[i18n guard] ${PROTECTED_PAGE_SLUG}:${guard.locale} update changed ${DEFAULT_LOCALE}; update aborted`
        );
      }
    },
  });
}

async function getDefaultLocale(strapi: Core.Strapi) {
  const row = await strapi.db.connection('strapi_core_store_settings')
    .select('value')
    .where({ key: 'plugin_i18n_default_locale' })
    .first();

  if (!row?.value) return DEFAULT_LOCALE;

  try {
    return JSON.parse(row.value);
  } catch {
    return String(row.value).replace(/^"|"$/g, '') || DEFAULT_LOCALE;
  }
}

async function ensurePageI18nLocaleIntegrity(strapi: Core.Strapi) {
  const schema = strapi.contentTypes[PAGE_UID];
  const schemaIssues: string[] = [];

  if (!isLocalized(schema)) {
    schemaIssues.push(`${PAGE_UID} is not localized`);
  }

  for (const field of LOCALIZED_PAGE_FIELDS) {
    if (!isLocalized(schema?.attributes?.[field])) {
      schemaIssues.push(`${PAGE_UID}.${field} is not localized`);
    }
  }

  if (schemaIssues.length > 0) {
    throw new Error(`[i18n guard] Invalid Page i18n schema: ${schemaIssues.join('; ')}`);
  }

  const defaultLocale = await getDefaultLocale(strapi);
  const nullLocaleRows = await strapi.db.connection('pages')
    .count({ count: '*' })
    .whereNull('locale')
    .orWhere('locale', '')
    .first();
  const nullLocaleCount = Number(nullLocaleRows?.count ?? 0);

  if (nullLocaleCount === 0) {
    strapi.log.info('[i18n guard] Page locale integrity ok');
    return;
  }

  await strapi.db.connection('pages')
    .whereNull('locale')
    .orWhere('locale', '')
    .update({ locale: defaultLocale });

  strapi.log.warn(
    `[i18n guard] Repaired ${nullLocaleCount} Page rows with empty locale to ${defaultLocale}`
  );
}

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    registerHomepageLocaleGuard(strapi);
  },

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    strapi.log.info('[bootstrap] starting bootstrap...');
    await ensurePageI18nLocaleIntegrity(strapi);

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
