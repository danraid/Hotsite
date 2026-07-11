import { describe, expect, it } from 'vitest';
import { isConfiguredValue } from './config-value';

describe('isConfiguredValue', () => {
  it('rejeita valores vazios', () => {
    expect(isConfiguredValue('')).toBe(false);
    expect(isConfiguredValue('   ')).toBe(false);
    expect(isConfiguredValue(undefined)).toBe(false);
  });

  it('rejeita placeholders #TODO', () => {
    expect(isConfiguredValue('#TODO-contact-email')).toBe(false);
    expect(isConfiguredValue('#TODO-whatsapp-number')).toBe(false);
  });

  it('aceita valores reais', () => {
    expect(isConfiguredValue('contato@exemplo.com')).toBe(true);
    expect(isConfiguredValue('CRP 00/00000')).toBe(true);
  });
});
