'use client';

import { useEffect } from 'react';

const AD_SCRIPT_ID = 'deferred-adsense-script';
const FALLBACK_DELAY_MS = 4000;
const ADSENSE_SCRIPT_BASE_URL = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
const INTERACTION_EVENTS: Array<keyof WindowEventMap> = ['scroll', 'mousemove', 'touchstart', 'keydown'];

declare global {
  interface Window {
    __boostvisionAdSenseScriptLoaded?: boolean;
  }
}

export function AdScriptLoader() {
  const adSenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (!adSenseClientId) {
      return;
    }

    let done = false;

    const loadAds = () => {
      if (done || window.__boostvisionAdSenseScriptLoaded) {
        return;
      }
      done = true;
      cleanup();

      if (document.getElementById(AD_SCRIPT_ID)) {
        window.__boostvisionAdSenseScriptLoaded = true;
        return;
      }

      const script = document.createElement('script');
      script.id = AD_SCRIPT_ID;
      script.src = `${ADSENSE_SCRIPT_BASE_URL}?client=${encodeURIComponent(adSenseClientId)}`;
      script.async = true;
      script.crossOrigin = 'anonymous';

      script.onload = () => {
        window.__boostvisionAdSenseScriptLoaded = true;
      };

      document.head.appendChild(script);
    };

    // Schedule load via idle callback (non-blocking, INP-safe)
    const scheduleLoad = () => {
      if (done) return;
      if ('requestIdleCallback' in window) {
        requestIdleCallback(loadAds, { timeout: 500 });
      } else {
        loadAds();
      }
    };

    // 1. Primary: idle callback fires when browser is free
    let idleId: number | undefined;
    if ('requestIdleCallback' in window) {
      idleId = requestIdleCallback(loadAds, { timeout: FALLBACK_DELAY_MS });
    }

    // 2. Secondary: interaction events schedule an idle load (not sync, INP-safe)
    INTERACTION_EVENTS.forEach((event) => {
      window.addEventListener(event, scheduleLoad, { once: true, passive: true });
    });

    // 3. Fallback: guarantee load within timeout
    const timeout = setTimeout(loadAds, FALLBACK_DELAY_MS);

    function cleanup() {
      INTERACTION_EVENTS.forEach((event) => {
        window.removeEventListener(event, scheduleLoad);
      });
      clearTimeout(timeout);
      if (idleId !== undefined) cancelIdleCallback(idleId);
    }

    return cleanup;
  }, [adSenseClientId]);

  return null;
}
