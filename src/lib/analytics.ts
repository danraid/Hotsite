import { createAnalyticsAdapter } from './analytics-adapters';
import type {
  AnalyticsAdapter,
  AnalyticsProperties,
  AnalyticsPropertyKey,
  AnalyticsRuntimeConfig,
  CookieConsentState,
  DestinationType,
} from './analytics-types';
import { COOKIE_CONSENT_STORAGE_KEY } from './analytics-types';

const ALLOWED_PROPERTY_KEYS = new Set<AnalyticsPropertyKey>([
  'cta_label',
  'cta_location',
  'destination_type',
  'nav_label',
]);

let runtimeConfig: AnalyticsRuntimeConfig | null = null;
let adapter: AnalyticsAdapter | null = null;
let adapterLoadPromise: Promise<void> | null = null;
let consentState: CookieConsentState | null = null;
let isDevEnvironment = false;

function sanitizeProperties(properties?: AnalyticsProperties): AnalyticsProperties | undefined {
  if (!properties) {
    return undefined;
  }

  const sanitized: AnalyticsProperties = {};

  for (const [key, value] of Object.entries(properties)) {
    if (!ALLOWED_PROPERTY_KEYS.has(key as AnalyticsPropertyKey)) {
      continue;
    }

    if (typeof value === 'string' && value.trim()) {
      sanitized[key as AnalyticsPropertyKey] = value.trim();
    }
  }

  return Object.keys(sanitized).length > 0 ? sanitized : undefined;
}

function readStoredConsent(): CookieConsentState | null {
  if (typeof localStorage === 'undefined') {
    return null;
  }

  const stored = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);

  if (stored === 'accepted' || stored === 'rejected') {
    return stored;
  }

  return null;
}

function canTrack(): boolean {
  if (!runtimeConfig || runtimeConfig.provider === 'none') {
    return false;
  }

  if (runtimeConfig.requiresConsent && consentState !== 'accepted') {
    return false;
  }

  return true;
}

async function ensureAdapterLoaded(): Promise<void> {
  if (!adapter || !canTrack()) {
    return;
  }

  if (!adapterLoadPromise) {
    adapterLoadPromise = adapter.load().catch(() => {
      adapterLoadPromise = null;
    });
  }

  await adapterLoadPromise;
}

export function initAnalytics(config: AnalyticsRuntimeConfig, options?: { dev?: boolean }): void {
  runtimeConfig = config;
  consentState = readStoredConsent();
  isDevEnvironment = options?.dev ?? false;
  adapter = createAnalyticsAdapter(config);

  if (consentState === 'accepted' && config.provider !== 'none') {
    void ensureAdapterLoaded();
  }
}

export function getConsentState(): CookieConsentState | null {
  return consentState ?? readStoredConsent();
}

export function setConsentState(state: CookieConsentState): void {
  consentState = state;

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, state);
  }

  if (state === 'accepted' && runtimeConfig && runtimeConfig.provider !== 'none') {
    void ensureAdapterLoaded();
  }
}

export function shouldRenderCookieConsent(config: AnalyticsRuntimeConfig): boolean {
  return config.provider !== 'none' && config.requiresConsent;
}

export function shouldShowCookieConsent(config: AnalyticsRuntimeConfig): boolean {
  return shouldRenderCookieConsent(config) && getConsentState() === null;
}

export function resolveDestinationType(href: string, ctaType?: string | null): DestinationType {
  if (ctaType === 'whatsapp' || href.includes('wa.me/')) {
    return 'whatsapp';
  }

  if (href.startsWith('#')) {
    return 'anchor';
  }

  return 'external';
}

export function isBookingCta(ctaType?: string | null): boolean {
  return ctaType === 'primary' || ctaType === 'header' || ctaType === 'text';
}

export function track(event: string, properties?: AnalyticsProperties): void {
  const sanitized = sanitizeProperties(properties);

  if (isDevEnvironment && runtimeConfig?.provider === 'none') {
    console.debug('[analytics]', event, sanitized ?? {});
  }

  if (!canTrack() || !adapter) {
    return;
  }

  void ensureAdapterLoaded().then(() => {
    adapter?.track(event, sanitized);
  });
}

export function resetAnalyticsForTests(): void {
  runtimeConfig = null;
  adapter = null;
  adapterLoadPromise = null;
  consentState = null;
  isDevEnvironment = false;
}

export function getAnalyticsAdapterForTests(): AnalyticsAdapter | null {
  return adapter;
}

export function setAnalyticsAdapterForTests(nextAdapter: AnalyticsAdapter | null): void {
  adapter = nextAdapter;
}

export function setRuntimeConfigForTests(config: AnalyticsRuntimeConfig | null): void {
  runtimeConfig = config;
}

export function setConsentStateForTests(state: CookieConsentState | null): void {
  consentState = state;
}

export function setDevEnvironmentForTests(dev: boolean): void {
  isDevEnvironment = dev;
}
