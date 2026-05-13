'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { AdScriptLoader } from './AdScriptLoader';

// Dynamically import Analytics components with no SSR
const GoogleAnalytics = dynamic(
  () => import('./GoogleAnalytics').then((mod) => mod.GoogleAnalytics),
  { ssr: false }
);

const VercelAnalytics = dynamic(
  () => import('@vercel/analytics/react').then((mod) => mod.Analytics),
  { ssr: false }
);

const FALLBACK_DELAY_MS = 3000;
const INTERACTION_EVENTS: Array<keyof WindowEventMap> = ['mousedown', 'touchstart', 'keydown', 'scroll'];

/**
 * Analytics Wrapper
 * - Primary: loads during browser idle time (requestIdleCallback)
 * - Secondary: interaction events schedule an idle load (not synchronous, so INP-safe)
 * - Fallback: timeout guarantees scripts load within FALLBACK_DELAY_MS
 */
export function AnalyticsWrapper() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    let done = false;

    const load = () => {
      if (done) return;
      done = true;
      setShouldLoad(true);
      cleanup();
    };

    // Schedule load via requestIdleCallback (non-blocking)
    const scheduleLoad = () => {
      if (done) return;
      if ('requestIdleCallback' in window) {
        requestIdleCallback(load, { timeout: 500 });
      } else {
        load();
      }
    };

    // 1. Primary: idle callback fires when browser is free
    let idleId: number | undefined;
    if ('requestIdleCallback' in window) {
      idleId = requestIdleCallback(load, { timeout: FALLBACK_DELAY_MS });
    }

    // 2. Secondary: interaction events schedule an idle load (not sync, INP-safe)
    INTERACTION_EVENTS.forEach((event) => {
      window.addEventListener(event, scheduleLoad, { once: true, passive: true });
    });

    // 3. Fallback: guarantee load within timeout
    const timeout = setTimeout(load, FALLBACK_DELAY_MS);

    function cleanup() {
      INTERACTION_EVENTS.forEach((event) => {
        window.removeEventListener(event, scheduleLoad);
      });
      clearTimeout(timeout);
      if (idleId !== undefined) cancelIdleCallback(idleId);
    }

    return cleanup;
  }, []);

  return (
    <>
      <AdScriptLoader />
      {shouldLoad ? (
        <>
          <GoogleAnalytics />
          <VercelAnalytics />
        </>
      ) : null}
    </>
  );
}
