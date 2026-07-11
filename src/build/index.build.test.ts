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
});
