import type { AnalyticsAdapter, AnalyticsProperties } from '../analytics-types';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function injectScript(measurementId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-analytics="ga4"]`)) {
      resolve();
      return;
    }

    const loader = document.createElement('script');
    loader.async = true;
    loader.dataset.analytics = 'ga4';
    loader.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    loader.onload = () => {
      window.dataLayer = window.dataLayer ?? [];
      window.gtag = function gtag(...args: unknown[]) {
        window.dataLayer?.push(args);
      };
      window.gtag('js', new Date());
      window.gtag('config', measurementId);
      resolve();
    };
    loader.onerror = () => reject(new Error('Failed to load GA4 script'));
    document.head.appendChild(loader);
  });
}

export function createGa4Adapter(measurementId: string): AnalyticsAdapter {
  return {
    track(event: string, properties?: AnalyticsProperties): void {
      window.gtag?.('event', event, properties ?? {});
    },
    async load(): Promise<void> {
      if (!measurementId.trim()) {
        return;
      }

      await injectScript(measurementId.trim());
    },
  };
}
