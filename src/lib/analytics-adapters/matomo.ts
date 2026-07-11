import type { AnalyticsAdapter, AnalyticsProperties } from '../analytics-types';

declare global {
  interface Window {
    _paq?: unknown[][];
  }
}

function injectScript(siteUrl: string, siteId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-analytics="matomo"]`)) {
      resolve();
      return;
    }

    window._paq = window._paq ?? [];
    window._paq.push(['trackPageView']);
    window._paq.push(['enableLinkTracking']);

    const script = document.createElement('script');
    script.async = true;
    script.dataset.analytics = 'matomo';
    script.src = `${siteUrl.replace(/\/$/, '')}/matomo.js`;
    script.onload = () => {
      window._paq?.push(['setTrackerUrl', `${siteUrl.replace(/\/$/, '')}/matomo.php`]);
      window._paq?.push(['setSiteId', siteId]);
      resolve();
    };
    script.onerror = () => reject(new Error('Failed to load Matomo script'));
    document.head.appendChild(script);
  });
}

export function createMatomoAdapter(siteUrl: string, siteId: string): AnalyticsAdapter {
  return {
    track(event: string, properties?: AnalyticsProperties): void {
      window._paq?.push(['trackEvent', 'hotsite', event, JSON.stringify(properties ?? {})]);
    },
    async load(): Promise<void> {
      if (!siteUrl.trim() || !siteId.trim()) {
        return;
      }

      await injectScript(siteUrl.trim(), siteId.trim());
    },
  };
}
