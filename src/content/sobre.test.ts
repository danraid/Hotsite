import { describe, expect, it } from 'vitest';
import { sobreContent } from './sobre';

const EXPECTED_HEADING =
  'Uma trajetória dedicada ao estudo da mente, do comportamento humano e dos caminhos de transformação.';

const EXPECTED_PARAGRAPHS = [
  'Sou Janaína Hollanda, pós-graduada em Neurociências, Terapia Cognitivo-Comportamental e Terapia Transpessoal. Possuo também pós-graduação em Logoterapia pelo Instituto Português de Logoterapia, em Lisboa, e formação em Constelações Familiares.',
  'Ao longo da minha trajetória, compreendi que cuidar da saúde mental vai além de buscar o alívio dos sintomas.',
  'É preciso olhar para a pessoa por inteiro: sua história, seus vínculos, seus pensamentos, suas emoções, seus valores e a forma como aprendeu a ocupar o próprio lugar na vida.',
  'Uma transformação consistente não acontece apenas quando compreendemos racionalmente aquilo que vivemos. Ela acontece quando conseguimos integrar consciência, emoção, história, escolhas e significado.',
  'Meu propósito é oferecer um espaço reservado, seguro e respeitoso, no qual cada pessoa possa compreender a si mesma com mais clareza, desenvolver recursos internos e construir novas possibilidades de escolha.',
];

const REQUIRED_CREDENTIALS = [
  'Neurociências',
  'Terapia Cognitivo-Comportamental',
  'Instituto Português de Logoterapia',
  'Constelações Familiares',
];

describe('sobreContent', () => {
  it('marca copy como needs-review (credenciais pendentes de verificação)', () => {
    expect(sobreContent.contentStatus).toBe('needs-review');
  });

  it('expõe heading exato do content-inventory', () => {
    expect(sobreContent.heading).toBe(EXPECTED_HEADING);
  });

  it('expõe parágrafos exatos do content-inventory', () => {
    expect(sobreContent.paragraphs).toHaveLength(5);
    expect(sobreContent.paragraphs).toEqual(EXPECTED_PARAGRAPHS);
  });

  it('menciona credenciais do content-inventory (needs-review)', () => {
    const fullText = sobreContent.paragraphs.join(' ');
    for (const credential of REQUIRED_CREDENTIALS) {
      expect(fullText).toContain(credential);
    }
  });

  it('expõe CTA secundário com label e âncora in-page', () => {
    expect(sobreContent.ctaLabel).toBe('Conhecer minha trajetória');
    expect(sobreContent.ctaHref).toBe('#sobre');
  });

  it('não define retrato na v1', () => {
    expect(sobreContent.portrait).toBeNull();
  });
});
