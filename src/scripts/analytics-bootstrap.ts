import { initAnalytics } from '../lib/analytics';
import { initTrackClicks } from './track-clicks';
import type { AnalyticsRuntimeConfig } from '../lib/analytics-types';

export function bootstrapAnalytics(config: AnalyticsRuntimeConfig): void {
  initAnalytics(config, { dev: import.meta.env.DEV });
  initTrackClicks();
}
