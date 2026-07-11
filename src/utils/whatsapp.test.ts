import { describe, expect, it } from 'vitest';
import { buildWhatsAppUrl, isValidWhatsAppNumber, isWhatsAppAvailable } from './whatsapp';

describe('isValidWhatsAppNumber', () => {
  it('rejeita placeholders #TODO', () => {
    expect(isValidWhatsAppNumber('#TODO-whatsapp-number')).toBe(false);
  });

  it('rejeita string vazia', () => {
    expect(isValidWhatsAppNumber('')).toBe(false);
  });

  it('aceita número só com dígitos', () => {
    expect(isValidWhatsAppNumber('5511999999999')).toBe(true);
  });
});

describe('buildWhatsAppUrl', () => {
  it('retorna null quando disabled', () => {
    expect(
      buildWhatsAppUrl({
        number: '5511999999999',
        prefillMessage: 'Olá',
        enabled: false,
      }),
    ).toBeNull();
  });

  it('retorna null para placeholder #TODO', () => {
    expect(
      buildWhatsAppUrl({
        number: '#TODO-whatsapp-number',
        prefillMessage: 'Olá',
        enabled: true,
      }),
    ).toBeNull();
  });

  it('monta URL wa.me com número e mensagem codificada', () => {
    expect(
      buildWhatsAppUrl({
        number: '5511999999999',
        prefillMessage: 'Olá, gostaria de agendar uma conversa inicial.',
        enabled: true,
      }),
    ).toBe(
      'https://wa.me/5511999999999?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20conversa%20inicial.',
    );
  });
});

describe('isWhatsAppAvailable', () => {
  it('reflete disponibilidade do helper', () => {
    expect(
      isWhatsAppAvailable({
        number: '5511999999999',
        prefillMessage: 'Olá',
        enabled: true,
      }),
    ).toBe(true);

    expect(
      isWhatsAppAvailable({
        number: '#TODO-whatsapp-number',
        prefillMessage: 'Olá',
        enabled: true,
      }),
    ).toBe(false);
  });
});
