import type { AnalyticsAdapter, AnalyticsProperties } from '../analytics-types';

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
  }
}

function injectScript(domain: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-analytics="plausible"]`)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.dataset.analytics = 'plausible';
    script.defer = true;
    script.src = 'https://plausible.io/js/script.js';
    script.setAttribute('data-domain', domain);
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Plausible script'));
    document.head.appendChild(script);
  });
}

export function createPlausibleAdapter(domain: string): AnalyticsAdapter {
  return {
    track(event: string, properties?: AnalyticsProperties): void {
      window.plausible?.(event, properties ? { props: { ...properties } } : undefined);
    },
    async load(): Promise<void> {
      if (!domain.trim()) {
        return;
      }

      await injectScript(domain.trim());
    },
  };
}
