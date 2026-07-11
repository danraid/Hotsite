import { describe, expect, it } from 'vitest';
import { truncateMetaDescription } from './truncate-meta-description';
import { heroContent } from '../content/hero';

describe('truncateMetaDescription', () => {
  it('retorna o texto intacto quando cabe no limite', () => {
    expect(truncateMetaDescription('Texto curto.')).toBe('Texto curto.');
  });

  it('trunca com reticências unicode quando excede 160 caracteres', () => {
    const result = truncateMetaDescription(heroContent.supportingCopy);

    expect(result.length).toBeLessThanOrEqual(160);
    expect(result.endsWith('…')).toBe(true);
    expect(heroContent.supportingCopy.startsWith(result.slice(0, -1))).toBe(true);
  });
});
