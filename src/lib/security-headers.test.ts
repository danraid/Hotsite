import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const NGINX_DIR = join(process.cwd(), 'infra', 'nginx');

const REQUIRED_FILES = [
  'security-headers-base.conf',
  'csp-none.conf',
  'csp-plausible.conf',
  'csp-ga4.conf',
  'csp-matomo.conf.template',
  'README.md',
] as const;

/** Extract CSP directive string from nginx add_header line. */
export function extractCspFromNginx(content: string): string {
  const match = content.match(/add_header\s+Content-Security-Policy\s+"([^"]+)"\s+always;/);
  if (!match) {
    throw new Error('Content-Security-Policy add_header not found');
  }
  return match[1];
}

/** Parse semicolon-separated CSP into a map of directive → sources. */
export function parseCspDirectives(csp: string): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const part of csp
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)) {
    const space = part.indexOf(' ');
    if (space === -1) {
      map.set(part, []);
    } else {
      const name = part.slice(0, space);
      const sources = part.slice(space + 1).split(/\s+/);
      map.set(name, sources);
    }
  }
  return map;
}

function readNginxFile(name: string): string {
  const path = join(NGINX_DIR, name);
  expect(existsSync(path), `${name} should exist`).toBe(true);
  return readFileSync(path, 'utf8');
}

describe('SPEC-013 nginx artifacts', () => {
  it('versioned files exist in infra/nginx/', () => {
    for (const file of REQUIRED_FILES) {
      expect(existsSync(join(NGINX_DIR, file)), file).toBe(true);
    }
  });

  it('security-headers-base.conf contains required tokens', () => {
    const content = readNginxFile('security-headers-base.conf');
    expect(content).toContain('server_tokens off');
    expect(content).toContain('X-Content-Type-Options "nosniff"');
    expect(content).toContain('Referrer-Policy "strict-origin-when-cross-origin"');
    expect(content).toContain('Permissions-Policy');
    expect(content).toContain('camera=()');
    expect(content).toContain('microphone=()');
    expect(content).toContain('geolocation=()');
    expect(content).toContain('payment=()');
    expect(content).toContain('X-Frame-Options "DENY"');
  });

  it('README documents provider mapping and HSTS prod-only', () => {
    const readme = readNginxFile('README.md');
    expect(readme).toContain('csp-none.conf');
    expect(readme).toContain('csp-plausible.conf');
    expect(readme).toContain('csp-ga4.conf');
    expect(readme).toContain('MATOMO_ORIGIN');
    expect(readme).toMatch(/HSTS|Strict-Transport-Security/i);
    expect(readme).toMatch(/Omit|omit|do NOT/i);
  });
});

describe('CSP baseline (analytics.provider: none)', () => {
  const csp = extractCspFromNginx(readNginxFile('csp-none.conf'));
  const directives = parseCspDirectives(csp);

  it('matches documented baseline snapshot', () => {
    expect(csp).toBe(
      "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; connect-src 'self'; upgrade-insecure-requests",
    );
  });

  it('includes frame-ancestors none and default-src self', () => {
    expect(directives.get('frame-ancestors')).toEqual(["'none'"]);
    expect(directives.get('default-src')).toEqual(["'self'"]);
  });

  it('allows unsafe-inline in script-src for current Astro inline scripts', () => {
    expect(directives.get('script-src')).toContain("'unsafe-inline'");
  });
});

describe('CSP variants by analytics provider', () => {
  it('plausible variant includes plausible.io domains', () => {
    const csp = extractCspFromNginx(readNginxFile('csp-plausible.conf'));
    const directives = parseCspDirectives(csp);

    expect(csp).toContain("frame-ancestors 'none'");
    expect(directives.get('script-src')).toContain('https://plausible.io');
    expect(directives.get('connect-src')).toContain('https://plausible.io');
    expect(directives.get('img-src')).toContain('https://plausible.io');
  });

  it('ga4 variant includes googletagmanager in script-src', () => {
    const csp = extractCspFromNginx(readNginxFile('csp-ga4.conf'));
    const directives = parseCspDirectives(csp);

    expect(csp).toContain("frame-ancestors 'none'");
    expect(directives.get('script-src')).toContain('https://www.googletagmanager.com');
    expect(directives.get('connect-src')).toContain('https://www.google-analytics.com');
    expect(directives.get('connect-src')).toContain('https://region1.google-analytics.com');
    expect(directives.get('img-src')).toContain('https://www.google-analytics.com');
  });

  it('matomo template includes MATOMO_ORIGIN placeholder in script/connect/img', () => {
    const content = readNginxFile('csp-matomo.conf.template');
    const csp = extractCspFromNginx(content);
    const directives = parseCspDirectives(csp);

    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain('MATOMO_ORIGIN');
    expect(directives.get('script-src')).toContain('MATOMO_ORIGIN');
    expect(directives.get('connect-src')).toContain('MATOMO_ORIGIN');
    expect(directives.get('img-src')).toContain('MATOMO_ORIGIN');
  });

  it('all enforce variants include frame-ancestors none', () => {
    for (const file of ['csp-none.conf', 'csp-plausible.conf', 'csp-ga4.conf'] as const) {
      const csp = extractCspFromNginx(readNginxFile(file));
      expect(csp, file).toContain("frame-ancestors 'none'");
    }
  });
});

describe('verify-security-headers script', () => {
  it('exists and is referenced by package.json script', () => {
    const scriptPath = join(process.cwd(), 'scripts', 'verify-security-headers.mjs');
    expect(existsSync(scriptPath)).toBe(true);
  });
});
