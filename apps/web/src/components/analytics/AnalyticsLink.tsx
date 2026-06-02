'use client';

import * as React from 'react';
import { Link } from '@/i18n/routing';
import type { AnalyticsEventName } from '@/lib/analytics/events';

type AnchorProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;
type IntlLinkProps = React.ComponentProps<typeof Link>;

interface AnalyticsLinkProps extends AnchorProps {
  href: string;
  children: React.ReactNode;
  event?: AnalyticsEventName;
  placement?: string;
  ctaType?: string;
  appSlug?: string;
  appName?: string;
  label?: string;
  navArea?: string;
  navLevel?: string;
  parentLabel?: string;
}

function isExternalHref(href: string) {
  return /^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');
}

function getAnalyticsAttributes({
  event,
  placement,
  ctaType,
  appSlug,
  appName,
  label,
  navArea,
  navLevel,
  parentLabel,
}: Pick<
  AnalyticsLinkProps,
  'event' | 'placement' | 'ctaType' | 'appSlug' | 'appName' | 'label' | 'navArea' | 'navLevel' | 'parentLabel'
>) {
  return {
    ...(event ? { 'data-analytics-event': event } : {}),
    ...(placement ? { 'data-analytics-placement': placement } : {}),
    ...(ctaType ? { 'data-analytics-cta-type': ctaType } : {}),
    ...(appSlug ? { 'data-analytics-app-slug': appSlug } : {}),
    ...(appName ? { 'data-analytics-app-name': appName } : {}),
    ...(label ? { 'data-analytics-label': label } : {}),
    ...(navArea ? { 'data-analytics-nav-area': navArea } : {}),
    ...(navLevel ? { 'data-analytics-nav-level': navLevel } : {}),
    ...(parentLabel ? { 'data-analytics-parent-label': parentLabel } : {}),
  };
}

export function AnalyticsLink({
  href,
  children,
  event,
  placement,
  ctaType,
  appSlug,
  appName,
  label,
  navArea,
  navLevel,
  parentLabel,
  ...anchorProps
}: AnalyticsLinkProps) {
  const linkChildren = children as IntlLinkProps['children'];
  const analyticsAttributes = getAnalyticsAttributes({
    event,
    placement,
    ctaType,
    appSlug,
    appName,
    label,
    navArea,
    navLevel,
    parentLabel,
  });

  if (isExternalHref(href)) {
    return (
      <a href={href} {...analyticsAttributes} {...anchorProps}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} {...analyticsAttributes} {...anchorProps}>
      {linkChildren}
    </Link>
  );
}
