#!/usr/bin/env node
/**
 * Post-deploy verification for HTTP security headers (SPEC-013 / SEC-009).
 *
 * Usage:
 *   node scripts/verify-security-headers.mjs <base-url>
 *   VERIFY_HEADERS_URL=https://example.com node scripts/verify-security-headers.mjs
 */

const args = process.argv.slice(2).filter((a) => !a.startsWith('-'));
const baseUrl = args[0] ?? process.env.VERIFY_HEADERS_URL;

if (!baseUrl) {
  console.error('Usage: npm run verify:headers -- <base-url>');
  console.error('   or: VERIFY_HEADERS_URL=<url> npm run verify:headers');
  process.exit(1);
}

let origin;
try {
  origin = new URL(baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`);
} catch {
  console.error(`Invalid URL: ${baseUrl}`);
  process.exit(1);
}

const isHttps = origin.protocol === 'https:';

/** @param {Record<string, string>} headers */
function getHeader(headers, name) {
  const key = Object.keys(headers).find((k) => k.toLowerCase() === name.toLowerCase());
  return key ? headers[key] : undefined;
}

/** @param {Response} response */
async function readHeaders(response) {
  /** @type {Record<string, string>} */
  const out = {};
  response.headers.forEach((value, key) => {
    out[key] = value;
  });
  return out;
}

/**
 * @param {Record<string, string>} headers
 * @param {string} name
 * @param {(value: string) => boolean} predicate
 * @param {string} label
 * @returns {string | null}
 */
function checkHeader(headers, name, predicate, label) {
  const value = getHeader(headers, name);
  if (!value) return `Missing ${label} (${name})`;
  if (!predicate(value)) return `Invalid ${label}: ${value}`;
  return null;
}

/** @param {string} csp */
function cspIncludes(csp, token) {
  return csp.includes(token);
}

/** @param {Record<string, string>} headers */
function validateMustHeaders(headers, context) {
  /** @type {string[]} */
  const failures = [];

  const nosniff = checkHeader(
    headers,
    'x-content-type-options',
    (v) => v.toLowerCase() === 'nosniff',
    `X-Content-Type-Options [${context}]`,
  );
  if (nosniff) failures.push(nosniff);

  const referrer = checkHeader(
    headers,
    'referrer-policy',
    (v) => v.toLowerCase() === 'strict-origin-when-cross-origin',
    `Referrer-Policy [${context}]`,
  );
  if (referrer) failures.push(referrer);

  const permissions = getHeader(headers, 'permissions-policy');
  if (!permissions) {
    failures.push(`Missing Permissions-Policy [${context}]`);
  } else {
    for (const api of ['camera=()', 'microphone=()', 'geolocation=()', 'payment=()']) {
      if (!permissions.includes(api)) {
        failures.push(`Permissions-Policy missing ${api} [${context}]`);
      }
    }
  }

  const xfo = checkHeader(
    headers,
    'x-frame-options',
    (v) => v.toUpperCase() === 'DENY',
    `X-Frame-Options [${context}]`,
  );
  if (xfo) failures.push(xfo);

  const csp = getHeader(headers, 'content-security-policy');
  if (!csp) {
    failures.push(`Missing Content-Security-Policy [${context}]`);
  } else {
    if (!cspIncludes(csp, "frame-ancestors 'none'")) {
      failures.push(`CSP missing frame-ancestors 'none' [${context}]`);
    }
    if (!cspIncludes(csp, "default-src 'self'")) {
      failures.push(`CSP missing default-src 'self' [${context}]`);
    }
  }

  if (isHttps) {
    const hsts = getHeader(headers, 'strict-transport-security');
    if (!hsts) {
      failures.push(`Missing Strict-Transport-Security [${context}] (required for HTTPS)`);
    } else {
      if (!/max-age=\d+/i.test(hsts)) {
        failures.push(`HSTS missing max-age [${context}]`);
      }
      if (!hsts.toLowerCase().includes('includesubdomains')) {
        failures.push(`HSTS missing includeSubDomains [${context}]`);
      }
      const maxAgeMatch = hsts.match(/max-age=(\d+)/i);
      if (maxAgeMatch && Number(maxAgeMatch[1]) < 31536000) {
        failures.push(`HSTS max-age below 31536000 [${context}]`);
      }
    }
  }

  return failures;
}

/** @param {string} path */
async function fetchHeaders(path) {
  const url = new URL(path, origin);
  const response = await fetch(url, { method: 'HEAD', redirect: 'follow' });
  return readHeaders(response);
}

/** @param {string} htmlPath */
async function findAssetPath(htmlPath) {
  const pageUrl = new URL(htmlPath, origin);
  const response = await fetch(pageUrl, { redirect: 'follow' });
  if (!response.ok) return null;
  const html = await response.text();
  const match = html.match(/\/_astro\/[^"'\s>]+\.(?:js|css)/);
  return match ? match[0] : null;
}

async function main() {
  console.log(`Verifying security headers at ${origin.origin}`);

  /** @type {string[]} */
  const failures = [];

  try {
    const homeHeaders = await fetchHeaders('/');
    failures.push(...validateMustHeaders(homeHeaders, '/'));

    let assetPath = await findAssetPath('/');
    if (!assetPath) {
      assetPath = '/favicon.svg';
    }

    const assetHeaders = await fetchHeaders(assetPath);
    const assetNosniff = checkHeader(
      assetHeaders,
      'x-content-type-options',
      (v) => v.toLowerCase() === 'nosniff',
      `X-Content-Type-Options [${assetPath}]`,
    );
    if (assetNosniff) failures.push(assetNosniff);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Request failed: ${message}`);
    process.exit(1);
  }

  if (failures.length > 0) {
    console.error('\nFAIL — missing or invalid headers:\n');
    for (const f of failures) {
      console.error(`  • ${f}`);
    }
    process.exit(1);
  }

  console.log('\nPASS — all required security headers present.');
  process.exit(0);
}

main();
