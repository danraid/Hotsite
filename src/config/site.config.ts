/**
 * Central site configuration — Janaína Hollanda hotsite
 *
 * IMPORTANT: Replace all #TODO-* placeholder values before launch.
 * CTAs, contact details, and metadata must be verified with the client.
 */

import { heroContent } from '../content/hero';
import { truncateMetaDescription } from '../utils/truncate-meta-description';

export interface CtaLink {
  label: string;
  href: string;
  external: boolean;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface FooterConfig {
  professionalName: string;
  /** Omit from UI when empty — do not invent regulated titles */
  professionalTitle: string;
  email: string;
  phone: string;
  /** Optional in-person service region */
  region: string;
  privacyPolicyPath: string;
  /** When set, exposes a cookies policy link in the footer */
  cookiesPolicyPath?: string;
  integratedCareNotice: string;
}

export interface SiteConfig {
  siteName: string;
  /** URL externa de calendário de vivências; quando ausente, CTA usa âncora #vivencias */
  workshopsUrl?: string;
  primaryCta: CtaLink;
  whatsapp: {
    number: string;
    prefillMessage: string;
    enabled: boolean;
  };
  contact: {
    email: string;
    phone: string;
  };
  metadata: {
    title: string;
    description: string;
    canonical: string;
    ogImage: string;
  };
  navigation: NavItem[];
  footer: FooterConfig;
}

export const siteConfig: SiteConfig = {
  siteName: 'Janaína Hollanda',

  // #TODO-booking-url — replace with confirmed scheduling URL before launch
  primaryCta: {
    label: 'Agendar uma conversa',
    href: '#TODO-booking-url',
    external: true,
  },

  whatsapp: {
    // #TODO-whatsapp-number — replace with verified WhatsApp number (digits only, country code)
    number: '#TODO-whatsapp-number',
    prefillMessage: 'Olá, gostaria de agendar uma conversa inicial.',
    enabled: false,
  },

  contact: {
    // #TODO-contact-email — replace before launch
    email: '#TODO-contact-email',
    // #TODO-contact-phone — replace before launch
    phone: '#TODO-contact-phone',
  },

  metadata: {
    title: 'Janaína Hollanda — Acompanhamento terapêutico e desenvolvimento pessoal',
    description: truncateMetaDescription(heroContent.supportingCopy),
    // #TODO-canonical-url — replace with production domain before launch
    canonical: 'https://example.com',
    // #TODO-og-image — replace with approved 1200×630 asset before launch
    ogImage: '/og-image.jpg',
  },

  navigation: [
    { label: 'Início', href: '#hero' },
    { label: 'Atendimentos', href: '#atendimentos' },
    { label: 'Abordagem', href: '#abordagem' },
    { label: 'Sobre', href: '#sobre' },
    { label: 'Como funciona', href: '#como-funciona' },
  ],

  footer: {
    professionalName: 'Janaína Hollanda',
    // OPEN — não preencher sem verificação
    professionalTitle: '',
    // OPEN — substituir antes do lançamento
    email: '',
    phone: '',
    // OPEN — região de atendimento presencial
    region: '',
    privacyPolicyPath: '/privacidade',
    cookiesPolicyPath: '/cookies',
    integratedCareNotice:
      'Quando a situação exigir acompanhamento médico, psicológico ou de outro profissional de saúde, o processo terapêutico deverá ser compreendido como parte de um cuidado integrado, e não como substituição da assistência indicada.',
  },
};

export default siteConfig;
