/**
 * Central site configuration — Janaína Hollanda hotsite
 *
 * IMPORTANT: Replace all #TODO-* placeholder values before launch.
 * CTAs, contact details, and metadata must be verified with the client.
 */

export interface CtaLink {
  label: string;
  href: string;
  external: boolean;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteConfig {
  siteName: string;
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
    title: 'Janaína Hollanda — Terapia',
    description: '#TODO-metadata-description',
    canonical: '#TODO-canonical-url',
    ogImage: '#TODO-og-image-path',
  },

  navigation: [
    { label: 'Início', href: '#hero' },
    { label: 'Atendimentos', href: '#atendimentos' },
    { label: 'Abordagem', href: '#abordagem' },
    { label: 'Sobre', href: '#sobre' },
    { label: 'Como funciona', href: '#como-funciona' },
  ],
};

export default siteConfig;
