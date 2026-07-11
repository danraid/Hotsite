import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const PRIVACIDADE_HTML_PATH = resolve(process.cwd(), 'dist/privacidade/index.html');

function readBuiltPrivacidadeHtml(): string {
  return readFileSync(PRIVACIDADE_HTML_PATH, 'utf8');
}

describe('privacidade build output', () => {
  it('gera rota estática sem inventar política legal', () => {
    const html = readBuiltPrivacidadeHtml();

    expect(html).toContain('Política de privacidade');
    expect(html).toContain('Conteúdo pendente de aprovação legal');
    expect(html).toContain('name="robots" content="noindex"');
  });
});
