import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const INDEX_HTML_PATH = resolve(process.cwd(), 'dist/index.html');

function readBuiltIndexHtml(): string {
  return readFileSync(INDEX_HTML_PATH, 'utf8');
}

describe('index build output', () => {
  it('renderiza seção sobre sem imagem quando portrait é null', () => {
    const html = readBuiltIndexHtml();

    expect(html).toContain('id="sobre"');
    expect(html).toContain('data-section-id="sobre"');
    expect(html).toContain('Uma trajetória dedicada ao estudo da mente');
    expect(html).toContain('Conhecer minha trajetória');
    expect(html).not.toContain('<img');
  });

  it('mantém hierarquia semântica com h2 na seção sobre', () => {
    const html = readBuiltIndexHtml();
    const sobreSection = html.match(/<section[^>]*id="sobre"[\s\S]*?<\/section>/)?.[0];

    expect(sobreSection).toBeDefined();
    expect(sobreSection).toMatch(/<h2[^>]*id="sobre-title"/);
    expect(sobreSection).not.toContain('<img');
  });

  it('renderiza seção atendimentos com três cards e copy do inventário', () => {
    const html = readBuiltIndexHtml();

    expect(html).toContain('id="atendimentos"');
    expect(html).toContain('data-section-id="atendimentos"');
    expect(html).toContain('Caminhos diferentes para momentos distintos');
    expect(html).toContain('id="atendimento-individual"');
    expect(html).toContain('id="constelacao-familiar"');
    expect(html).toContain('id="vivencias"');
    expect(html).toContain('Conhecer o atendimento individual');
    expect(html).toContain('Conhecer a Constelação Familiar');
    expect(html).toContain('Conhecer as próximas vivências');
  });

  it('mantém hierarquia semântica com article e h3 por serviço', () => {
    const html = readBuiltIndexHtml();
    const atendimentosSection = html.match(
      /<section[^>]*id="atendimentos"[\s\S]*?<\/section>/,
    )?.[0];

    expect(atendimentosSection).toBeDefined();
    expect(atendimentosSection).toMatch(/<h2[^>]*id="atendimentos-title"/);
    expect(atendimentosSection?.match(/<article/g)?.length).toBe(3);
    expect(atendimentosSection?.match(/<h3/g)?.length).toBe(3);
  });

  it('renderiza seções de conversão final com copy e CTAs do inventário', () => {
    const html = readBuiltIndexHtml();

    expect(html).toContain('id="transicao"');
    expect(html).toContain('Nem tudo o que você carrega começou em você.');
    expect(html).toContain('Mas pode ser a partir de você que uma nova história comece.');

    expect(html).toContain('id="como-funciona"');
    expect(html).toContain('Como funciona');
    expect(html).toContain('Agendar uma conversa inicial');
    expect(html).toContain('<ol');

    expect(html).toContain('id="cta-final"');
    expect(html).toContain('Você não precisa ter todas as respostas para começar.');
    expect(html).toContain('Entrar em contato pelo WhatsApp');
  });

  it('expõe exatamente três CTAs primários na homepage', () => {
    const html = readBuiltIndexHtml();
    const primaryCtas = html.match(/data-cta-type="primary"/g);

    expect(primaryCtas?.length).toBe(3);
  });

  it('desabilita WhatsApp quando número é placeholder na config', () => {
    const html = readBuiltIndexHtml();
    const ctaFinalSection = html.match(/<section[^>]*id="cta-final"[\s\S]*?<\/section>/)?.[0];

    expect(ctaFinalSection).toBeDefined();
    expect(ctaFinalSection).toContain('Entrar em contato pelo WhatsApp');
    expect(ctaFinalSection).toContain('aria-disabled="true"');
    expect(ctaFinalSection).not.toMatch(/href="https:\/\/wa\.me\//);
  });
});
