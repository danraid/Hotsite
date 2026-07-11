import type { SiteConfig } from '../config/site.config';

export type WhatsAppConfig = SiteConfig['whatsapp'];

function isPlaceholderValue(value: string): boolean {
  return value.startsWith('#TODO');
}

/**
 * Returns true when the number contains only digits (optional whitespace stripped).
 */
export function isValidWhatsAppNumber(number: string): boolean {
  if (!number.trim() || isPlaceholderValue(number)) {
    return false;
  }

  return /^\d+$/.test(number.replace(/\s/g, ''));
}

/**
 * Builds a wa.me URL when WhatsApp is enabled and a real number is configured.
 * Returns null when unavailable — callers must not invent fallback numbers.
 */
export function buildWhatsAppUrl(config: WhatsAppConfig): string | null {
  const { number, prefillMessage, enabled } = config;

  if (!enabled || !isValidWhatsAppNumber(number)) {
    return null;
  }

  const digits = number.replace(/\D/g, '');
  const text = encodeURIComponent(prefillMessage);

  return `https://wa.me/${digits}?text=${text}`;
}

export function isWhatsAppAvailable(config: WhatsAppConfig): boolean {
  return buildWhatsAppUrl(config) !== null;
}
