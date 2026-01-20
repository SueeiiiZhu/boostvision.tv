import type { Schema, Struct } from '@strapi/strapi';

export interface SectionsAppsGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_apps_grids';
  info: {
    description: 'Displays a grid of apps filtered by type';
    displayName: 'Apps Grid';
    icon: 'apps';
  };
  attributes: {
    backgroundColor: Schema.Attribute.Enumeration<['white', 'section-bg']> &
      Schema.Attribute.DefaultTo<'white'>;
    limit: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<4>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    type: Schema.Attribute.Enumeration<['screen-mirroring', 'tv-remote']> &
      Schema.Attribute.DefaultTo<'screen-mirroring'>;
  };
}

export interface SectionsBrandsGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_brands_grids';
  info: {
    description: 'Displays supported device brands';
    displayName: 'Brands Grid';
    icon: 'apps';
  };
  attributes: {
    brands: Schema.Attribute.Component<'shared.feature', true>;
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SectionsCta extends Struct.ComponentSchema {
  collectionName: 'components_sections_ctas';
  info: {
    displayName: 'CTA Section';
    icon: 'cursor';
  };
  attributes: {
    buttonLink: Schema.Attribute.String;
    buttonText: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    showAppStoreLinks: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsFeatureHighlight extends Struct.ComponentSchema {
  collectionName: 'components_sections_feature_highlights';
  info: {
    displayName: 'Feature Highlight';
    icon: 'star';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    imagePosition: Schema.Attribute.Enumeration<['left', 'right']> &
      Schema.Attribute.DefaultTo<'left'>;
    labelColor: Schema.Attribute.Enumeration<['green', 'blue']> &
      Schema.Attribute.DefaultTo<'green'>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_heroes';
  info: {
    displayName: 'Hero Section';
    icon: 'picture';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<'images'>;
    ctaLink: Schema.Attribute.String;
    ctaSubtext: Schema.Attribute.String;
    ctaText: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    statistics: Schema.Attribute.Component<'shared.statistics', false>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SectionsReviews extends Struct.ComponentSchema {
  collectionName: 'components_sections_reviews_sections';
  info: {
    displayName: 'Reviews Section';
    icon: 'star';
  };
  attributes: {
    rating: Schema.Attribute.String;
    reviews: Schema.Attribute.Component<'shared.review', true>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsStatistics extends Struct.ComponentSchema {
  collectionName: 'components_sections_statistics';
  info: {
    displayName: 'Statistics Section';
    icon: 'chartPie';
  };
  attributes: {
    stats: Schema.Attribute.Component<'shared.statistics', false>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsWhyChoose extends Struct.ComponentSchema {
  collectionName: 'components_sections_why_chooses';
  info: {
    displayName: 'Why Choose Section';
    icon: 'bulletList';
  };
  attributes: {
    features: Schema.Attribute.Component<'shared.feature', true>;
    title: Schema.Attribute.String;
  };
}

export interface SharedFeature extends Struct.ComponentSchema {
  collectionName: 'components_shared_features';
  info: {
    description: 'Feature item with icon';
    displayName: 'Feature';
    icon: 'star';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedHeaderItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_header_items';
  info: {
    description: 'Can be a single link or a dropdown with multiple links';
    displayName: 'Header Item';
    icon: 'menu';
  };
  attributes: {
    href: Schema.Attribute.String;
    links: Schema.Attribute.Component<'shared.link', true>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_links';
  info: {
    displayName: 'Link';
    icon: 'link';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedNavSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_nav_sections';
  info: {
    description: 'A group of links with a title';
    displayName: 'Navigation Section';
    icon: 'listUl';
  };
  attributes: {
    links: Schema.Attribute.Component<'shared.link', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedReview extends Struct.ComponentSchema {
  collectionName: 'components_shared_reviews';
  info: {
    displayName: 'Review';
    icon: 'comment';
  };
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: 'SEO meta information';
    displayName: 'SEO';
    icon: 'search';
  };
  attributes: {
    canonicalUrl: Schema.Attribute.String;
    keywords: Schema.Attribute.String;
    metaDescription: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    metaImage: Schema.Attribute.Media<'images'>;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    noIndex: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    displayName: 'Social Link';
    icon: 'link';
  };
  attributes: {
    platform: Schema.Attribute.Enumeration<
      ['facebook', 'twitter', 'youtube', 'instagram', 'linkedin', 'tiktok']
    > &
      Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedStatistics extends Struct.ComponentSchema {
  collectionName: 'components_shared_statistics';
  info: {
    displayName: 'Statistics';
    icon: 'chartLine';
  };
  attributes: {
    countries: Schema.Attribute.String;
    customers: Schema.Attribute.String;
    downloads: Schema.Attribute.String;
    supportHours: Schema.Attribute.String;
  };
}

export interface SharedTutorialStep extends Struct.ComponentSchema {
  collectionName: 'components_shared_tutorial_steps';
  info: {
    displayName: 'Tutorial Step';
    icon: 'list';
  };
  attributes: {
    description: Schema.Attribute.RichText;
    image: Schema.Attribute.Media<'images'>;
    stepNumber: Schema.Attribute.Integer;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'sections.apps-grid': SectionsAppsGrid;
      'sections.brands-grid': SectionsBrandsGrid;
      'sections.cta': SectionsCta;
      'sections.feature-highlight': SectionsFeatureHighlight;
      'sections.hero': SectionsHero;
      'sections.reviews': SectionsReviews;
      'sections.statistics': SectionsStatistics;
      'sections.why-choose': SectionsWhyChoose;
      'shared.feature': SharedFeature;
      'shared.header-item': SharedHeaderItem;
      'shared.link': SharedLink;
      'shared.nav-section': SharedNavSection;
      'shared.review': SharedReview;
      'shared.seo': SharedSeo;
      'shared.social-link': SharedSocialLink;
      'shared.statistics': SharedStatistics;
      'shared.tutorial-step': SharedTutorialStep;
    }
  }
}
