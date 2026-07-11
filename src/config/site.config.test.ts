import { describe, expect, it } from 'vitest';
import { siteConfig } from './site.config';

const EXPECTED_NAV = [
  { label: 'Início', href: '#hero' },
  { label: 'Atendimentos', href: '#atendimentos' },
  { label: 'Abordagem', href: '#abordagem' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Como funciona', href: '#como-funciona' },
];

describe('siteConfig.navigation', () => {
  it('expõe os cinco links de navegação do header com âncoras corretas', () => {
    expect(siteConfig.navigation).toEqual(EXPECTED_NAV);
  });

  it('usa labels reais em cada item', () => {
    for (const item of siteConfig.navigation) {
      expect(item.label.trim().length).toBeGreaterThan(0);
      expect(item.href.startsWith('#')).toBe(true);
    }
  });
});

describe('siteConfig.primaryCta', () => {
  it('fornece o CTA primário do header sem hard-code no componente', () => {
    expect(siteConfig.primaryCta.label).toBe('Agendar uma conversa');
    expect(siteConfig.primaryCta.href.length).toBeGreaterThan(0);
    expect(typeof siteConfig.primaryCta.external).toBe('boolean');
  });
});

describe('siteConfig.siteName', () => {
  it('fornece identidade tipográfica placeholder do header', () => {
    expect(siteConfig.siteName).toBe('Janaína Hollanda');
  });
});

describe('siteConfig.footer', () => {
  it('expõe identificação profissional sem titulação inventada', () => {
    expect(siteConfig.footer.professionalName).toBe('Janaína Hollanda');
    expect(siteConfig.footer.professionalTitle).toBe('');
  });

  it('define rota de privacidade e aviso integrado', () => {
    expect(siteConfig.footer.privacyPolicyPath).toBe('/privacidade');
    expect(siteConfig.footer.integratedCareNotice.length).toBeGreaterThan(0);
    expect(siteConfig.footer.integratedCareNotice).toContain('cuidado integrado');
  });

  it('não preenche contato antes da verificação do cliente', () => {
    expect(siteConfig.footer.email).toBe('');
    expect(siteConfig.footer.phone).toBe('');
  });
});
