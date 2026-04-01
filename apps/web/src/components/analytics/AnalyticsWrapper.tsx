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

/**
 * Analytics Wrapper
 * - Defers loading of analytics scripts until after initial page load
 * - Only loads after user interaction or timeout
 * - Reduces initial bundle size and improves Core Web Vitals
 */
export function AnalyticsWrapper() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Load analytics after user interaction or after 3 seconds
    const timeout: ReturnType<typeof setTimeout> = setTimeout(() => {
      setShouldLoad(true);
      cleanup();
    }, 3000);

    const handleInteraction = () => {
      setShouldLoad(true);
      cleanup();
    };

    const events = ['mousedown', 'touchstart', 'keydown', 'scroll'];
    events.forEach((event) => {
      window.addEventListener(event, handleInteraction, { once: true, passive: true });
    });

    // Fallback: load after 3 seconds if no interaction
    function cleanup() {
      events.forEach((event) => {
        window.removeEventListener(event, handleInteraction);
      });
      clearTimeout(timeout);
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
