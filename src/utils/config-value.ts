/**
 * Returns true when a config string is a real value (non-empty, not a #TODO placeholder).
 */
export function isConfiguredValue(value: string | undefined): boolean {
  if (!value?.trim()) {
    return false;
  }

  return !value.startsWith('#TODO');
}
