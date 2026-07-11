import { describe, expect, it } from 'vitest';
import { comoFuncionaContent } from './como-funciona';

const EXPECTED_STEPS = [
  'O primeiro passo é uma conversa inicial.',
  'Nesse encontro, você poderá compartilhar o momento que está vivendo, compreender como funciona o acompanhamento e avaliar qual caminho faz mais sentido para as suas necessidades e objetivos.',
  'A partir dessa conversa, o processo é estruturado de forma individualizada, considerando sua história, seu momento atual e a profundidade do trabalho que deseja realizar.',
  'Os atendimentos podem ocorrer presencialmente ou on-line, de acordo com a modalidade escolhida e a disponibilidade.',
  'Todo o percurso é conduzido com discrição, confidencialidade, presença e respeito à singularidade de cada pessoa.',
  'Quando a situação exigir acompanhamento médico, psicológico ou de outro profissional de saúde, o processo terapêutico deverá ser compreendido como parte de um cuidado integrado, e não como substituição da assistência indicada.',
];

describe('comoFuncionaContent', () => {
  it('marca copy como needs-review', () => {
    expect(comoFuncionaContent.contentStatus).toBe('needs-review');
  });

  it('expõe passos sequenciais verbatim do content-inventory', () => {
    expect(comoFuncionaContent.steps).toEqual(EXPECTED_STEPS);
  });

  it('expõe label exato do CTA primário', () => {
    expect(comoFuncionaContent.primaryCtaLabel).toBe('Agendar uma conversa inicial');
  });
});
