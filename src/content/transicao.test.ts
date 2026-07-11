import { describe, expect, it } from 'vitest';
import { transicaoContent } from './transicao';

const EXPECTED_QUOTES = [
  'Nem tudo o que você carrega começou em você.',
  'Mas pode ser a partir de você que uma nova história comece.',
];

describe('transicaoContent', () => {
  it('expõe copy exato do content-inventory — Transition statement', () => {
    expect(transicaoContent.quotes).toEqual(EXPECTED_QUOTES);
  });
});
