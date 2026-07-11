import { describe, expect, it } from 'vitest';
import { contextoContent } from './contexto';

const EXPECTED_OPENING = [
  'Talvez você não precise apenas continuar seguindo em frente.',
  'Talvez seja o momento de compreender o que tem carregado, por que determinados padrões se repetem e o que, dentro de você, está pedindo uma nova direção.',
];

const EXPECTED_PARAGRAPHS = [
  'Em muitos momentos, aprendemos a dar conta de tudo, corresponder às expectativas e permanecer fortes, mesmo quando internamente já estamos cansados, ansiosos ou desconectados de nós mesmos.',
  'O processo terapêutico oferece um espaço para desacelerar, organizar pensamentos e emoções, compreender a própria história e encontrar formas mais conscientes de se relacionar consigo, com os outros e com a vida.',
  'Mais do que aliviar um desconforto imediato, trata-se de construir recursos internos para lidar com os desafios da vida de maneira mais consciente, consistente e integrada.',
];

describe('contextoContent', () => {
  it('expõe abertura exata do content-inventory', () => {
    expect(contextoContent.opening).toEqual(EXPECTED_OPENING);
  });

  it('expõe três parágrafos exatos do content-inventory', () => {
    expect(contextoContent.paragraphs).toEqual(EXPECTED_PARAGRAPHS);
  });

  it('expõe link opcional para como-funciona', () => {
    expect(contextoContent.optionalLinkLabel).toBe('Como funciona');
    expect(contextoContent.optionalLinkHref).toBe('#como-funciona');
  });
});
