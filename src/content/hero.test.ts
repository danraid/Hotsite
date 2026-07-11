import { describe, expect, it } from 'vitest';
import { heroContent } from './hero';

const EXPECTED_HEADLINE = 'Cuidar da mente também é aprender a olhar para si com mais consciência.';

const EXPECTED_SUPPORTING_COPY =
  'Um espaço terapêutico, reservado, de acolhimento, escuta e desenvolvimento pessoal para quem deseja ter mais saúde mental, compreender suas emoções, reconhecer padrões e construir uma vida com mais sentido, equilíbrio e autenticidade.';

describe('heroContent', () => {
  it('expõe headline exata do content-inventory', () => {
    expect(heroContent.headline).toBe(EXPECTED_HEADLINE);
  });

  it('expõe copy de apoio exata do content-inventory', () => {
    expect(heroContent.supportingCopy).toBe(EXPECTED_SUPPORTING_COPY);
  });

  it('expõe labels dos CTAs conforme inventário', () => {
    expect(heroContent.primaryCtaLabel).toBe('Agendar uma conversa');
    expect(heroContent.secondaryCtaLabel).toBe('Conhecer os atendimentos');
  });

  it('aponta CTA secundário para âncora de atendimentos', () => {
    expect(heroContent.secondaryCtaHref).toBe('#atendimentos');
  });
});
