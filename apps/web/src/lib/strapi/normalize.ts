import type {
  App,
  CTASection,
  DownloadLink,
  FAQ,
  Feature,
  GlobalSetting,
  HeaderItem,
  NavLink,
  Navigation,
  Page,
  Section,
  SocialLink,
  StrapiImage,
  Tutorial,
} from "../../types/strapi";

type MaybeDownloadLink = Partial<DownloadLink> | null | undefined;
type MaybeImage = Partial<StrapiImage> | null | undefined;
type MaybeFeature = Partial<Feature> | null | undefined;
type MaybeNavLink = Partial<NavLink> | null | undefined;
type MaybeHeaderItem = Partial<HeaderItem> | null | undefined;
type MaybeSocialLink = Partial<SocialLink> | null | undefined;

function hasUrl(value: { url?: string | null } | null | undefined): value is { url: string } {
  return Boolean(value && typeof value.url === "string" && value.url.trim());
}

export function normalizeImage<T extends MaybeImage>(image: T): T | undefined {
  return hasUrl(image) ? image : undefined;
}

function normalizeFeature<T extends MaybeFeature>(feature: T): T {
  if (!feature || typeof feature !== "object") {
    return feature;
  }

  return {
    ...feature,
    icon: normalizeImage(feature.icon),
  } as T;
}

function normalizeFeatures<T extends MaybeFeature[]>(features: T | null | undefined): T | undefined {
  if (!Array.isArray(features)) {
    return undefined;
  }

  return features.filter(Boolean).map((feature) => normalizeFeature(feature)) as T;
}

function hasRenderableNavLink(link: MaybeNavLink): link is NavLink {
  return Boolean(
    link &&
      typeof link.id === "number" &&
      typeof link.name === "string" &&
      typeof link.href === "string" &&
      link.href.trim()
  );
}

function normalizeNavLinks(links: MaybeNavLink[] | null | undefined): NavLink[] | undefined {
  if (!Array.isArray(links)) {
    return undefined;
  }

  return links.filter(hasRenderableNavLink);
}

function normalizeHeaderItems(items: MaybeHeaderItem[] | null | undefined): HeaderItem[] | undefined {
  if (!Array.isArray(items)) {
    return undefined;
  }

  return items
    .filter((item): item is HeaderItem => Boolean(item && typeof item.id === "number" && typeof item.name === "string"))
    .map((item) => ({
      ...item,
      links: normalizeNavLinks(item.links) ?? [],
    }));
}

function hasRenderableSocialLink(link: MaybeSocialLink): link is SocialLink {
  return Boolean(
    link &&
      typeof link.id === "number" &&
      typeof link.platform === "string" &&
      typeof link.url === "string" &&
      link.url.trim()
  );
}

function normalizeSocialLinks(links: MaybeSocialLink[] | null | undefined): SocialLink[] | undefined {
  if (!Array.isArray(links)) {
    return undefined;
  }

  return links.filter(hasRenderableSocialLink);
}

function hasRenderableBadge(link: MaybeDownloadLink): link is DownloadLink {
  return Boolean(
    link &&
      typeof link.id === "number" &&
      typeof link.platform === "string" &&
      typeof link.url === "string" &&
      link.url.trim() &&
      link.badge &&
      typeof link.badge.url === "string" &&
      link.badge.url.trim()
  );
}

export function normalizeDownloadLinks(links: MaybeDownloadLink[] | null | undefined): DownloadLink[] | undefined {
  if (!Array.isArray(links)) {
    return undefined;
  }

  return links.filter(hasRenderableBadge);
}

export function normalizeApp<T extends Partial<App> | null | undefined>(app: T): T {
  if (!app || typeof app !== "object") {
    return app;
  }

  return {
    ...app,
    icon: normalizeImage(app.icon),
    heroImage: normalizeImage(app.heroImage),
    screenshots: (app.screenshots ?? []).filter(hasUrl),
    features: normalizeFeatures(app.features),
    downloadLinks: normalizeDownloadLinks(app.downloadLinks),
    sections: normalizeSections(app.sections),
  } as T;
}

export function normalizeApps<T extends Partial<App>>(apps: T[] | null | undefined): T[] {
  if (!Array.isArray(apps)) {
    return [];
  }

  return apps.map((app) => normalizeApp(app));
}

export function normalizeFaq<T extends FAQ | null | undefined>(faq: T): T {
  if (!faq || typeof faq !== "object") {
    return faq;
  }

  return {
    ...faq,
    app: normalizeApp(faq.app),
    sections: normalizeSections(faq.sections),
  } as T;
}

export function normalizeTutorial<T extends Tutorial | null | undefined>(tutorial: T): T {
  if (!tutorial || typeof tutorial !== "object") {
    return tutorial;
  }

  return {
    ...tutorial,
    app: normalizeApp(tutorial.app),
    sections: normalizeSections(tutorial.sections),
    steps: (tutorial.steps ?? []).filter(Boolean).map((step) => ({
      ...step,
      image: normalizeImage(step.image),
    })),
  } as T;
}

export function normalizePage<T extends Page | null | undefined>(page: T): T {
  if (!page || typeof page !== "object") {
    return page;
  }

  return {
    ...page,
    sections: normalizeSections(page.sections),
  } as T;
}

export function normalizeGlobalSetting<T extends GlobalSetting | null | undefined>(globalSetting: T): T {
  if (!globalSetting || typeof globalSetting !== "object") {
    return globalSetting;
  }

  return {
    ...globalSetting,
    logo: normalizeImage(globalSetting.logo),
    footerLogo: normalizeImage(globalSetting.footerLogo),
    favicon: normalizeImage(globalSetting.favicon),
    googlePlayBadge: normalizeImage(globalSetting.googlePlayBadge),
    appStoreBadge: normalizeImage(globalSetting.appStoreBadge),
    socialLinks: normalizeSocialLinks(globalSetting.socialLinks) ?? [],
    defaultSeo: globalSetting.defaultSeo
      ? {
          ...globalSetting.defaultSeo,
          metaImage: normalizeImage(globalSetting.defaultSeo.metaImage),
        }
      : globalSetting.defaultSeo,
  } as T;
}

export function normalizeNavigation<T extends Navigation | null | undefined>(navigation: T): T {
  if (!navigation || typeof navigation !== "object") {
    return navigation;
  }

  return {
    ...navigation,
    headerMenu: normalizeHeaderItems(navigation.headerMenu) ?? [],
    footerColumns: (navigation.footerColumns ?? [])
      .filter((column): column is Navigation["footerColumns"][number] => Boolean(column && typeof column.id === "number" && typeof column.title === "string"))
      .map((column) => ({
        ...column,
        links: normalizeNavLinks(column.links) ?? [],
      })),
    bottomMenu: normalizeNavLinks(navigation.bottomMenu) ?? [],
  } as T;
}

function normalizeCTASection(section: CTASection): CTASection {
  return {
    ...section,
    links: normalizeNavLinks(section.links),
  };
}

export function normalizeSections<T extends Section[] | null | undefined>(sections: T): T | undefined {
  if (!Array.isArray(sections)) {
    return undefined;
  }

  return sections
    .filter(Boolean)
    .map((section) => {
      switch (section.__component) {
        case "sections.hero":
          return {
            ...section,
            image: normalizeImage(section.image),
            backgroundImage: normalizeImage(section.backgroundImage),
          };
        case "sections.feature-highlight":
          return {
            ...section,
            image: normalizeImage(section.image),
          };
        case "sections.why-choose":
          return {
            ...section,
            features: normalizeFeatures(section.features) ?? [],
          };
        case "sections.brands-grid":
          return {
            ...section,
            brands: normalizeFeatures(section.brands) ?? [],
          };
        case "sections.apps-filter":
          return {
            ...section,
            screenMirroringIcon: normalizeImage(section.screenMirroringIcon),
            tvRemoteIcon: normalizeImage(section.tvRemoteIcon),
          };
        case "sections.cta":
          return normalizeCTASection(section);
        default:
          return section;
      }
    }) as T;
}
