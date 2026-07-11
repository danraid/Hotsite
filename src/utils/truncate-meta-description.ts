const META_DESCRIPTION_MAX_LENGTH = 160;
const UNICODE_ELLIPSIS = '…';

/**
 * Truncates copy for HTML meta description (≤ 160 characters with unicode ellipsis).
 */
export function truncateMetaDescription(
  text: string,
  maxLength = META_DESCRIPTION_MAX_LENGTH,
): string {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1).trimEnd()}${UNICODE_ELLIPSIS}`;
}
