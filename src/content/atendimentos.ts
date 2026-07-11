/**
 * Seção Atendimentos — modalidades de serviço
 * Fonte: docs/inputs/content-inventory.md — Service modalities
 *
 * Copy status: needs-review (descrições pendentes de revisão profissional)
 */

import { siteConfig } from '../config/site.config';

export type AtendimentoService = {
  id: string;
  title: string;
  paragraphs: string[];
  ctaLabel: string;
  ctaHref: string;
};

const vivenciasHref = siteConfig.workshopsUrl ?? '#vivencias';

export const atendimentosContent = {
  contentStatus: 'needs-review' as const,
  heading: 'Caminhos diferentes para momentos distintos',
  services: [
    {
      id: 'atendimento-individual',
      title: 'Atendimento individual',
      paragraphs: [
        'As sessões oferecem um espaço reservado de escuta e acompanhamento para compreender questões emocionais, reconhecer padrões e desenvolver recursos internos para lidar com os desafios da vida.',
        'O atendimento pode contribuir tanto para processos de autoconhecimento e desenvolvimento pessoal quanto para o cuidado de sintomas relacionados à ansiedade, tristeza, desânimo, estresse, insegurança, sobrecarga emocional e dificuldades nos relacionamentos.',
        'Cada processo é conduzido de forma individualizada, respeitando a história, o ritmo e os objetivos de cada pessoa.',
      ],
      ctaLabel: 'Conhecer o atendimento individual',
      ctaHref: '#atendimento-individual',
    },
    {
      id: 'constelacao-familiar',
      title: 'Constelação Familiar',
      paragraphs: [
        'Um olhar sistêmico para vínculos, padrões e dinâmicas familiares que podem continuar influenciando relacionamentos, escolhas, conflitos e dificuldades atuais.',
        'A Constelação Familiar permite ampliar a percepção sobre determinadas situações e reconhecer movimentos de repetição, pertencimento, lealdade e exclusão que podem atravessar a história familiar.',
      ],
      ctaLabel: 'Conhecer a Constelação Familiar',
      ctaHref: '#constelacao-familiar',
    },
    {
      id: 'vivencias',
      title: 'Vivências e workshops',
      paragraphs: [
        'Encontros em grupo cuidadosamente estruturados para aprofundar temas relacionados ao autoconhecimento, aos relacionamentos, à prosperidade, ao pertencimento, à consciência emocional e à construção de uma vida com mais sentido.',
        'Experiências que integram conhecimento, reflexão e práticas de desenvolvimento pessoal.',
      ],
      ctaLabel: 'Conhecer as próximas vivências',
      ctaHref: vivenciasHref,
    },
  ] satisfies AtendimentoService[],
} as const;

export default atendimentosContent;
