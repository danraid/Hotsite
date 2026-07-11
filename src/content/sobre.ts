/**
 * Seção Sobre — conteúdo biográfico de Janaína Hollanda
 * Fonte: docs/inputs/content-inventory.md — About Janaína Hollanda
 *
 * Publicação bloqueada até verificação de credenciais (pós-graduações,
 * Instituto Português de Logoterapia, Constelações Familiares).
 */

export type SobrePortrait = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export const sobreContent = {
  contentStatus: 'needs-review' as const,
  heading:
    'Uma trajetória dedicada ao estudo da mente, do comportamento humano e dos caminhos de transformação.',
  paragraphs: [
    'Sou Janaína Hollanda, pós-graduada em Neurociências, Terapia Cognitivo-Comportamental e Terapia Transpessoal. Possuo também pós-graduação em Logoterapia pelo Instituto Português de Logoterapia, em Lisboa, e formação em Constelações Familiares.',
    'Ao longo da minha trajetória, compreendi que cuidar da saúde mental vai além de buscar o alívio dos sintomas.',
    'É preciso olhar para a pessoa por inteiro: sua história, seus vínculos, seus pensamentos, suas emoções, seus valores e a forma como aprendeu a ocupar o próprio lugar na vida.',
    'Uma transformação consistente não acontece apenas quando compreendemos racionalmente aquilo que vivemos. Ela acontece quando conseguimos integrar consciência, emoção, história, escolhas e significado.',
    'Meu propósito é oferecer um espaço reservado, seguro e respeitoso, no qual cada pessoa possa compreender a si mesma com mais clareza, desenvolver recursos internos e construir novas possibilidades de escolha.',
  ],
  ctaLabel: 'Conhecer minha trajetória',
  ctaHref: '#sobre',
  portrait: null as SobrePortrait | null,
};

export default sobreContent;
