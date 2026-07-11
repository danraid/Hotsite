/** Allowed analytics event property keys — no health data or PII beyond generic labels. */
export type AnalyticsPropertyKey = 'cta_label' | 'cta_location' | 'destination_type' | 'nav_label';

export type AnalyticsProperties = Partial<Record<AnalyticsPropertyKey, string>>;

export type DestinationType = 'anchor' | 'external' | 'whatsapp';

export type AnalyticsProvider = 'none' | 'plausible' | 'ga4' | 'matomo';

export type CookieConsentState = 'accepted' | 'rejected';

export const COOKIE_CONSENT_STORAGE_KEY = 'cookie-consent';

export interface AnalyticsRuntimeConfig {
  provider: AnalyticsProvider;
  requiresConsent: boolean;
  plausibleDomain: string;
  ga4MeasurementId: string;
}

export interface AnalyticsAdapter {
  track(event: string, properties?: AnalyticsProperties): void;
  load(): Promise<void>;
}
