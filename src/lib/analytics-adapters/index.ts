import type {
  AnalyticsAdapter,
  AnalyticsProvider,
  AnalyticsRuntimeConfig,
} from '../analytics-types';
import { createGa4Adapter } from './ga4';
import { createMatomoAdapter } from './matomo';
import { createNoneAdapter } from './none';
import { createPlausibleAdapter } from './plausible';

export function createAnalyticsAdapter(config: AnalyticsRuntimeConfig): AnalyticsAdapter {
  switch (config.provider) {
    case 'plausible':
      return createPlausibleAdapter(config.plausibleDomain);
    case 'ga4':
      return createGa4Adapter(config.ga4MeasurementId);
    case 'matomo':
      // Matomo site URL and ID share config fields until owner defines dedicated keys.
      return createMatomoAdapter(config.plausibleDomain, config.ga4MeasurementId);
    case 'none':
    default:
      return createNoneAdapter();
  }
}

export function isKnownProvider(provider: string): provider is AnalyticsProvider {
  return (
    provider === 'none' || provider === 'plausible' || provider === 'ga4' || provider === 'matomo'
  );
}
