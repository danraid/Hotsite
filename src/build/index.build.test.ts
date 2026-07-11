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
});
