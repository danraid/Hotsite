import { describe, expect, it } from 'vitest';
import { comoPossoAjudarContent } from './como-posso-ajudar';

const EXPECTED_HEADING = 'Um olhar para além do sintoma';

const EXPECTED_INTRO = [
  'Cada pessoa chega com uma história, uma forma própria de sentir e diferentes maneiras de enfrentar suas dificuldades.',
  'Por isso, o acompanhamento é individualizado e considera não apenas os sintomas apresentados, mas também os pensamentos, as emoções, os vínculos, as experiências e os padrões que podem estar relacionados ao momento vivido.',
];

const EXPECTED_TOPICS = [
  'ansiedade, preocupação excessiva e crises de ansiedade;',
  'tristeza persistente, desânimo e sintomas depressivos;',
  'esgotamento emocional e sensação de sobrecarga;',
  'alterações emocionais relacionadas ao estresse;',
  'dificuldade para desacelerar ou descansar sem culpa;',
  'baixa autoestima, insegurança e autocrítica excessiva;',
  'dificuldade para reconhecer e expressar emoções;',
  'medo, angústia e sensação de perda de controle;',
  'dificuldades relacionadas ao sono, quando associadas a questões emocionais;',
  'processos de luto, separação e perdas importantes;',
  'conflitos familiares, afetivos ou profissionais;',
  'dificuldade para estabelecer limites e se posicionar;',
  'autocobrança e necessidade de dar conta de tudo;',
  'repetição de padrões nos relacionamentos e nas escolhas;',
  'momentos de mudança, transição ou tomada de decisões;',
  'busca por autoconhecimento, propósito e sentido;',
  'dificuldade para prosperar, receber ou sustentar conquistas;',
  'desejo de desenvolver maior consciência e maturidade emocional.',
];

const EXPECTED_DISCLAIMER =
  'O acompanhamento terapêutico também pode fazer parte de um cuidado integrado em situações de ansiedade, depressão e outros sofrimentos emocionais, respeitando as necessidades de cada pessoa e, quando indicado, o acompanhamento de outros profissionais.';

describe('comoPossoAjudarContent', () => {
  it('marca copy como needs-review', () => {
    expect(comoPossoAjudarContent.contentStatus).toBe('needs-review');
  });

  it('expõe heading exato do content-inventory', () => {
    expect(comoPossoAjudarContent.heading).toBe(EXPECTED_HEADING);
  });

  it('expõe dois parágrafos introdutórios exatos do content-inventory', () => {
    expect(comoPossoAjudarContent.intro).toEqual(EXPECTED_INTRO);
  });

  it('expõe exatamente 18 tópicos do content-inventory', () => {
    expect(comoPossoAjudarContent.topics).toHaveLength(18);
    expect(comoPossoAjudarContent.topics).toEqual(EXPECTED_TOPICS);
  });

  it('expõe disclaimer de cuidado integrado verbatim', () => {
    expect(comoPossoAjudarContent.integratedCareDisclaimer).toBe(EXPECTED_DISCLAIMER);
  });
});
