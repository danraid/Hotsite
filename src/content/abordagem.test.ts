import { describe, expect, it } from 'vitest';
import { abordagemContent } from './abordagem';

const EXPECTED_HEADING = 'Conhecimento, escuta e profundidade';

const EXPECTED_PARAGRAPHS = [
  'Meu trabalho integra conhecimentos da Neurociência, Terapia Cognitivo-Comportamental, Logoterapia, Terapia Transpessoal e abordagem sistêmica.',
  'Essas diferentes perspectivas permitem compreender não apenas o que você está sentindo, mas também a maneira como interpreta suas experiências, estabelece vínculos, reage aos desafios e constrói significado para aquilo que vive.',
  'A Terapia Cognitivo-Comportamental contribui para a identificação de pensamentos, comportamentos e respostas emocionais que podem estar associados a quadros de ansiedade, sintomas depressivos, insegurança, medo e autocobrança.',
  'A Logoterapia amplia o olhar para os valores, o propósito, a liberdade de escolha e a construção de sentido, especialmente em momentos de sofrimento, perda ou transição.',
  'A abordagem transpessoal e o olhar sistêmico permitem considerar dimensões mais amplas da experiência humana, incluindo a história familiar, os vínculos, o pertencimento e os padrões que podem atravessar diferentes gerações.',
  'Não se trata de enquadrar a sua história em um único método.',
  'Trata-se de construir um caminho terapêutico personalizado, que respeite quem você é, o que viveu e aquilo que deseja compreender ou transformar.',
];

const REQUIRED_METHODS = [
  'Neurociência',
  'Terapia Cognitivo-Comportamental',
  'Logoterapia',
  'Terapia Transpessoal',
  'abordagem sistêmica',
];

describe('abordagemContent', () => {
  it('marca copy como needs-review', () => {
    expect(abordagemContent.contentStatus).toBe('needs-review');
  });

  it('expõe heading exato do content-inventory', () => {
    expect(abordagemContent.heading).toBe(EXPECTED_HEADING);
  });

  it('expõe todos os parágrafos exatos do content-inventory', () => {
    expect(abordagemContent.paragraphs).toHaveLength(7);
    expect(abordagemContent.paragraphs).toEqual(EXPECTED_PARAGRAPHS);
  });

  it('menciona todos os métodos do content-inventory', () => {
    const fullText = abordagemContent.paragraphs.join(' ');
    for (const method of REQUIRED_METHODS) {
      expect(fullText).toContain(method);
    }
  });

  it('expõe CTA secundário com label e âncora in-page', () => {
    expect(abordagemContent.ctaLabel).toBe('Conhecer minha abordagem');
    expect(abordagemContent.ctaHref).toBe('#abordagem');
  });
});
