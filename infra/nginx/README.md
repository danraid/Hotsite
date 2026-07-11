# Nginx security headers — Janaína Hollanda hotsite

Versioned snippets for HTTP security headers (SPEC-013, DEC-007). Headers are emitted by **nginx** on the VPS; the Astro build remains static (`output: 'static'`).

## Files

| File | Purpose |
|---|---|
| `security-headers-base.conf` | Common headers: nosniff, Referrer-Policy, Permissions-Policy, X-Frame-Options, `server_tokens off` |
| `csp-none.conf` | CSP when `analytics.provider: none` |
| `csp-plausible.conf` | CSP when `analytics.provider: plausible` |
| `csp-ga4.conf` | CSP when `analytics.provider: ga4` |
| `csp-matomo.conf.template` | CSP template — replace `MATOMO_ORIGIN` with your Matomo instance URL |

## Analytics provider → CSP include

Read `analytics.provider` from `src/config/site.config.ts` and include **one** CSP file:

| `analytics.provider` | Include file |
|---|---|
| `none` | `csp-none.conf` |
| `plausible` | `csp-plausible.conf` |
| `ga4` | `csp-ga4.conf` |
| `matomo` | Copy `csp-matomo.conf.template` → `csp-matomo.conf`, substitute `MATOMO_ORIGIN` |

**Important:** After changing `analytics.provider`, update the nginx CSP include and reload nginx **before** enabling tracking in production.

## Example `server {}` block

Adjust paths, `root`, and TLS certificate paths for your VPS. Production example:

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    root /var/www/hotsite;
    index index.html;

    ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    # Path to this repository on the VPS (or copy snippets to /etc/nginx/snippets/)
    include /path/to/repo/infra/nginx/security-headers-base.conf;
    include /path/to/repo/infra/nginx/csp-none.conf;

    # Production HTTPS only — do NOT send HSTS on dev/staging without stable TLS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Development / staging (`/var/www/hotsite-dev`)

- Include `security-headers-base.conf` and the CSP variant matching dev analytics config.
- **Omit** `Strict-Transport-Security` unless HTTPS with a validated certificate is stable.
- Optional rollout phase 1: rename CSP header to Report-Only:

```nginx
# Staging phase 1 — observe violations without blocking
add_header Content-Security-Policy-Report-Only "..." always;
```

Phase 2: switch to enforce (`Content-Security-Policy` via the versioned `.conf` files).

## Apply and reload

```bash
sudo nginx -t
sudo nginx -s reload
```

## Verify after deploy

```bash
npm run verify:headers -- https://example.com/
```

See `docs/ops/security-headers.md` for full rollout, rollback, and SEC requirement index.

## Non-nginx reverse proxies

If the VPS uses Caddy, Apache, or a CDN instead of nginx, translate the same header names and values. The repository artifacts remain the source of truth for expected values.
