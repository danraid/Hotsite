import { isBookingCta, resolveDestinationType, track } from '../lib/analytics';

function getLinkLabel(link: HTMLAnchorElement): string {
  return link.textContent?.trim() || link.getAttribute('aria-label') || '';
}

function handleCtaClick(link: HTMLAnchorElement): void {
  if (link.getAttribute('aria-disabled') === 'true' || !link.href) {
    return;
  }

  const ctaLocation = link.dataset.ctaLocation ?? 'unknown';
  const ctaType = link.dataset.ctaType;
  const href = link.getAttribute('href') ?? '';
  const destinationType = resolveDestinationType(href, ctaType);

  track('cta_click', {
    cta_label: getLinkLabel(link),
    cta_location: ctaLocation,
    destination_type: destinationType,
  });

  if (destinationType === 'whatsapp') {
    track('whatsapp_start', {
      cta_location: ctaLocation,
    });
  }

  if (isBookingCta(ctaType)) {
    track('booking_start', {
      cta_label: getLinkLabel(link),
      cta_location: ctaLocation,
      destination_type: destinationType,
    });
  }
}

function handleNavClick(link: HTMLAnchorElement): void {
  track('nav_click', {
    nav_label: link.dataset.navLabel ?? getLinkLabel(link),
  });
}

function isHeaderNavLink(link: HTMLAnchorElement): boolean {
  return Boolean(link.closest('.site-header__nav') || link.closest('.mobile-nav-drawer__nav'));
}

export function initTrackClicks(): void {
  document.addEventListener(
    'click',
    (event) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const link = target.closest('a');

      if (!link || link.getAttribute('aria-disabled') === 'true') {
        return;
      }

      if (link.hasAttribute('data-cta-location')) {
        handleCtaClick(link);
        return;
      }

      if (link.classList.contains('nav-link') && isHeaderNavLink(link)) {
        handleNavClick(link);
      }
    },
    { capture: true },
  );
}
