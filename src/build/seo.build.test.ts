import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { siteConfig } from '../config/site.config';

const INDEX_HTML_PATH = resolve(process.cwd(), 'dist/index.html');

function readBuiltIndexHtml(): string {
  return readFileSync(INDEX_HTML_PATH, 'utf8');
}

function readHead(html: string): string {
  return html.match(/<head[^>]*>[\s\S]*?<\/head>/)?.[0] ?? '';
}

describe('homepage SEO metadata build output', () => {
  it('expõe title, description, canonical e tags Open Graph', () => {
    const head = readHead(readBuiltIndexHtml());

    expect(head).toContain(`<title>${siteConfig.metadata.title}</title>`);
    expect(head).toContain(`name="description" content="${siteConfig.metadata.description}"`);
    expect(head).toContain(`rel="canonical" href="${siteConfig.metadata.canonical}"`);
    expect(head).toContain(`property="og:title" content="${siteConfig.metadata.title}"`);
    expect(head).toContain(
      `property="og:description" content="${siteConfig.metadata.description}"`,
    );
    expect(head).toContain('property="og:image" content="https://example.com/og-image.jpg"');
    expect(head).toContain(`property="og:url" content="${siteConfig.metadata.canonical}"`);
    expect(head).toContain('property="og:locale" content="pt_BR"');
    expect(head).toContain('property="og:type" content="website"');
  });

  it('expõe Twitter Card summary_large_image com title, description e image', () => {
    const head = readHead(readBuiltIndexHtml());

    expect(head).toContain('name="twitter:card" content="summary_large_image"');
    expect(head).toContain(`name="twitter:title" content="${siteConfig.metadata.title}"`);
    expect(head).toContain(
      `name="twitter:description" content="${siteConfig.metadata.description}"`,
    );
    expect(head).toContain('name="twitter:image" content="https://example.com/og-image.jpg"');
  });

  it('referencia favicon sem emitir JSON-LD', () => {
    const head = readHead(readBuiltIndexHtml());

    expect(head).toContain('rel="icon" href="/favicon.svg"');
    expect(head).not.toContain('application/ld+json');
  });

  it('mantém lang pt-BR e um único h1 no hero', () => {
    const html = readBuiltIndexHtml();

    expect(html).toMatch(/<html[^>]*lang="pt-BR"/);
    expect(html.match(/<h1\b/g)?.length).toBe(1);
    expect(html).toContain('id="hero"');
  });
});
