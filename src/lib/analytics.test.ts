import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import {
  getAnalyticsAdapterForTests,
  initAnalytics,
  resetAnalyticsForTests,
  resolveDestinationType,
  setAnalyticsAdapterForTests,
  setConsentState,
  setConsentStateForTests,
  setDevEnvironmentForTests,
  shouldRenderCookieConsent,
  track,
} from './analytics';
import type { AnalyticsAdapter, AnalyticsRuntimeConfig } from './analytics-types';

const DEFAULT_CONFIG: AnalyticsRuntimeConfig = {
  provider: 'plausible',
  requiresConsent: true,
  plausibleDomain: 'example.com',
  ga4MeasurementId: '',
};

describe('resolveDestinationType', () => {
  it('identifica whatsapp por tipo ou URL', () => {
    expect(resolveDestinationType('https://wa.me/5511999999999', null)).toBe('whatsapp');
    expect(resolveDestinationType('#contato', 'whatsapp')).toBe('whatsapp');
  });

  it('identifica âncora e link externo', () => {
    expect(resolveDestinationType('#hero', null)).toBe('anchor');
    expect(resolveDestinationType('https://cal.com/agenda', null)).toBe('external');
  });
});

describe('track consent gate', () => {
  beforeEach(() => {
    resetAnalyticsForTests();
    vi.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    resetAnalyticsForTests();
  });

  it('é no-op com provider none e loga em dev', () => {
    initAnalytics(
      { ...DEFAULT_CONFIG, provider: 'none' },
      { dev: true },
    );
    setDevEnvironmentForTests(true);

    track('cta_click', {
      cta_label: 'Agendar',
      cta_location: 'hero',
      destination_type: 'external',
    });

    expect(console.debug).toHaveBeenCalledWith('[analytics]', 'cta_click', {
      cta_label: 'Agendar',
      cta_location: 'hero',
      destination_type: 'external',
    });
  });

  it('não chama adapter antes do consent aceito', () => {
    const adapterTrack = vi.fn();
    const mockAdapter: AnalyticsAdapter = {
      track: adapterTrack,
      load: vi.fn().mockResolvedValue(undefined),
    };

    initAnalytics(DEFAULT_CONFIG);
    setAnalyticsAdapterForTests(mockAdapter);
    setConsentStateForTests(null);

    track('cta_click', { cta_location: 'header' });

    expect(adapterTrack).not.toHaveBeenCalled();
  });

  it('chama adapter após consent aceito', async () => {
    const adapterTrack = vi.fn();
    const mockAdapter: AnalyticsAdapter = {
      track: adapterTrack,
      load: vi.fn().mockResolvedValue(undefined),
    };

    initAnalytics(DEFAULT_CONFIG);
    setAnalyticsAdapterForTests(mockAdapter);
    setConsentState('accepted');

    track('booking_start', { cta_location: 'hero' });

    await vi.waitFor(() => {
      expect(adapterTrack).toHaveBeenCalledWith('booking_start', { cta_location: 'hero' });
    });
  });

  it('remove chaves de propriedade não permitidas', async () => {
    const adapterTrack = vi.fn();
    const mockAdapter: AnalyticsAdapter = {
      track: adapterTrack,
      load: vi.fn().mockResolvedValue(undefined),
    };

    initAnalytics({ ...DEFAULT_CONFIG, requiresConsent: false });
    setAnalyticsAdapterForTests(mockAdapter);

    track('cta_click', {
      cta_location: 'hero',
      // @ts-expect-error — propriedade proibida para teste de sanitização
      patient_name: 'Maria',
    });

    await vi.waitFor(() => {
      expect(adapterTrack).toHaveBeenCalledWith('cta_click', { cta_location: 'hero' });
    });
  });
});

describe('shouldRenderCookieConsent', () => {
  it('oculta banner quando provider é none', () => {
    expect(
      shouldRenderCookieConsent({
        provider: 'none',
        requiresConsent: true,
        plausibleDomain: '',
        ga4MeasurementId: '',
      }),
    ).toBe(false);
  });

  it('exibe banner quando tracking exige consent', () => {
    expect(shouldRenderCookieConsent(DEFAULT_CONFIG)).toBe(true);
  });
});

describe('initAnalytics adapter wiring', () => {
  beforeEach(() => {
    resetAnalyticsForTests();
  });

  afterEach(() => {
    resetAnalyticsForTests();
  });

  it('registra adapter após init', () => {
    initAnalytics(DEFAULT_CONFIG);
    expect(getAnalyticsAdapterForTests()).not.toBeNull();
  });
});
