import { describe, expect, it } from 'vitest';
import { ctaFinalContent } from './cta-final';

const EXPECTED_PARAGRAPHS = [
  'Você não precisa ter todas as respostas para começar.',
  'Às vezes, o primeiro movimento é apenas reconhecer que existe algo em sua vida que merece ser olhado com mais presença, cuidado e profundidade.',
  'Permita-se compreender o que sente, acolher a sua história e construir uma relação mais consciente consigo, com os outros e com a vida.',
];

describe('ctaFinalContent', () => {
  it('expõe três parágrafos verbatim do content-inventory', () => {
    expect(ctaFinalContent.paragraphs).toEqual(EXPECTED_PARAGRAPHS);
  });

  it('expõe labels exatos dos CTAs', () => {
    expect(ctaFinalContent.primaryCtaLabel).toBe('Agendar uma conversa');
    expect(ctaFinalContent.secondaryCtaLabel).toBe('Entrar em contato pelo WhatsApp');
  });
});
