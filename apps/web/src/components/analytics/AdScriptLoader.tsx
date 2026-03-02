'use client';

import { useEffect } from 'react';

const AD_SCRIPT_ID = 'deferred-adsense-script';
const FALLBACK_DELAY_MS = 5000;
const ADSENSE_SCRIPT_BASE_URL = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
const INTERACTION_EVENTS: Array<keyof WindowEventMap> = [
  'scroll',
  'mousemove',
  'touchstart',
  'keydown',
];

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

    const loadAds = () => {
      if (window.__boostvisionAdSenseScriptLoaded) {
        return;
      }

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

    const triggerLoad = () => {
      loadAds();
      cleanup();
    };

    INTERACTION_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, triggerLoad, { once: true, passive: true });
    });

    const timeout = setTimeout(triggerLoad, FALLBACK_DELAY_MS);

    function cleanup() {
      INTERACTION_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, triggerLoad);
      });
      clearTimeout(timeout);
    }

    return cleanup;
  }, [adSenseClientId]);

  return null;
}
