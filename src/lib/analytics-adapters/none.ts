import type { AnalyticsAdapter } from '../analytics-types';

export function createNoneAdapter(): AnalyticsAdapter {
  return {
    track(): void {
      // Intentionally empty — default no-op provider.
    },
    async load(): Promise<void> {
      // No third-party script to load.
    },
  };
}
