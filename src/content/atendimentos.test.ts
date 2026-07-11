import { describe, expect, it } from 'vitest';
import { atendimentosContent } from './atendimentos';

const EXPECTED_HEADING = 'Caminhos diferentes para momentos distintos';

const EXPECTED_SERVICES = [
  {
    id: 'atendimento-individual',
    title: 'Atendimento individual',
    ctaLabel: 'Conhecer o atendimento individual',
    ctaHref: '#atendimento-individual',
    paragraphs: [
      'As sessões oferecem um espaço reservado de escuta e acompanhamento para compreender questões emocionais, reconhecer padrões e desenvolver recursos internos para lidar com os desafios da vida.',
      'O atendimento pode contribuir tanto para processos de autoconhecimento e desenvolvimento pessoal quanto para o cuidado de sintomas relacionados à ansiedade, tristeza, desânimo, estresse, insegurança, sobrecarga emocional e dificuldades nos relacionamentos.',
      'Cada processo é conduzido de forma individualizada, respeitando a história, o ritmo e os objetivos de cada pessoa.',
    ],
  },
  {
    id: 'constelacao-familiar',
    title: 'Constelação Familiar',
    ctaLabel: 'Conhecer a Constelação Familiar',
    ctaHref: '#constelacao-familiar',
    paragraphs: [
      'Um olhar sistêmico para vínculos, padrões e dinâmicas familiares que podem continuar influenciando relacionamentos, escolhas, conflitos e dificuldades atuais.',
      'A Constelação Familiar permite ampliar a percepção sobre determinadas situações e reconhecer movimentos de repetição, pertencimento, lealdade e exclusão que podem atravessar a história familiar.',
    ],
  },
  {
    id: 'vivencias',
    title: 'Vivências e workshops',
    ctaLabel: 'Conhecer as próximas vivências',
    ctaHref: '#vivencias',
    paragraphs: [
      'Encontros em grupo cuidadosamente estruturados para aprofundar temas relacionados ao autoconhecimento, aos relacionamentos, à prosperidade, ao pertencimento, à consciência emocional e à construção de uma vida com mais sentido.',
      'Experiências que integram conhecimento, reflexão e práticas de desenvolvimento pessoal.',
    ],
  },
];

describe('atendimentosContent', () => {
  it('marca copy como needs-review', () => {
    expect(atendimentosContent.contentStatus).toBe('needs-review');
  });

  it('expõe heading exato do content-inventory', () => {
    expect(atendimentosContent.heading).toBe(EXPECTED_HEADING);
  });

  it('expõe três serviços com copy verbatim do inventário', () => {
    expect(atendimentosContent.services).toHaveLength(3);

    for (let i = 0; i < EXPECTED_SERVICES.length; i++) {
      const expected = EXPECTED_SERVICES[i];
      const service = atendimentosContent.services[i];

      expect(service.id).toBe(expected.id);
      expect(service.title).toBe(expected.title);
      expect(service.paragraphs).toEqual(expected.paragraphs);
      expect(service.ctaLabel).toBe(expected.ctaLabel);
      expect(service.ctaHref).toBe(expected.ctaHref);
    }
  });

  it('define âncoras in-page para individual e constelação', () => {
    const [individual, constelacao] = atendimentosContent.services;

    expect(individual.ctaHref).toBe('#atendimento-individual');
    expect(constelacao.ctaHref).toBe('#constelacao-familiar');
  });

  it('usa âncora in-page para vivências quando workshopsUrl não está definido', () => {
    const vivencias = atendimentosContent.services[2];
    expect(vivencias.ctaHref).toBe('#vivencias');
  });
});
