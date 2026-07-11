# Cabeçalhos HTTP de segurança — operação e rollout

Documentação operacional para SPEC-013. Design de referência: `docs/designs/2026-07-11-http-security-headers-design.md`.

## Índice de requisitos (SEC-001–SEC-009)

| ID | Cabeçalho / controle | Dev/staging | Produção HTTPS | Artefato |
|---|---|---|---|---|
| SEC-001 | `Strict-Transport-Security` | **Omitir** (sem TLS estável) | `max-age=31536000; includeSubDomains` | Manual no `server {}` — ver `infra/nginx/README.md` |
| SEC-002 | `Content-Security-Policy` | Enforce ou Report-Only (fase 1) | Enforce com variante do provedor | `infra/nginx/csp-*.conf` |
| SEC-003 | `X-Content-Type-Options: nosniff` | Sim | Sim | `security-headers-base.conf` |
| SEC-004 | `Referrer-Policy: strict-origin-when-cross-origin` | Sim | Sim | `security-headers-base.conf` |
| SEC-005 | `Permissions-Policy` (APIs não usadas desabilitadas) | Sim | Sim | `security-headers-base.conf` |
| SEC-006 | Anti-clickjacking (`frame-ancestors 'none'` + `X-Frame-Options: DENY`) | Sim | Sim | CSP + `security-headers-base.conf` |
| SEC-007 | Cookies HTTP (`Secure`, `SameSite`, `HttpOnly`) | **N/A** — site não emite `Set-Cookie` | N/A até introdução de cookies | Consentimento usa `localStorage` key `cookie-consent` (SPEC-012) |
| SEC-008 | Ocultar metadados (`server_tokens off`) | Sim | Sim | `security-headers-base.conf` |
| SEC-009 | Verificação repetível pós-deploy | `npm run verify:headers` | `npm run verify:headers` | `scripts/verify-security-headers.mjs` |

### SEC-007 — estado atual (N/A)

O hotsite **não define cookies HTTP** (`Set-Cookie`). A persistência do banner de consentimento usa `localStorage` com a chave `cookie-consent` (ver `src/components/CookieConsent.astro` e SPEC-012).

Quando cookies HTTP forem introduzidos:

- Produção: `Secure; SameSite=Lax` (ou `Strict` se compatível); `HttpOnly` quando o script client não precisar ler.
- Atualizar `src/pages/cookies.astro` com os atributos aplicados.
- Revalidar com inspeção de `Set-Cookie` no browser ou `curl -sI`.

## Cabeçalhos esperados por ambiente

### Desenvolvimento / staging (`/var/www/hotsite-dev`)

| Cabeçalho | Esperado |
|---|---|
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | APIs não usadas desabilitadas (ver snippet base) |
| `X-Frame-Options` | `DENY` |
| `Content-Security-Policy` ou `-Report-Only` | Variante conforme `analytics.provider` |
| `Strict-Transport-Security` | **Ausente** (HTTP ou TLS instável) |
| `Server` | Genérico ou sem versão (`server_tokens off`) |

### Produção (`/var/www/hotsite`, HTTPS validado)

Todos os cabeçalhos de staging, mais:

| Cabeçalho | Esperado |
|---|---|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` |
| `Content-Security-Policy` | Enforce (não Report-Only) |

## Seleção da variante CSP

1. Abrir `src/config/site.config.ts` → `analytics.provider`.
2. Incluir o arquivo correspondente no `server {}` nginx (ver tabela em `infra/nginx/README.md`).
3. Para Matomo: copiar `csp-matomo.conf.template`, substituir `MATOMO_ORIGIN`, incluir o arquivo gerado.
4. `nginx -t && nginx -s reload`.

## Rollout (DEC-008)

| Fase | Ambiente | Ação |
|---|---|---|
| 1 | `hotsite-dev` | Deploy snippets base + CSP (Report-Only opcional) |
| 2 | `hotsite-dev` | CSP enforce; smoke da jornada principal |
| 3 | Produção | Headers completos + HSTS |
| 4 | Pós-launch | Revisar CSP ao alterar `analytics.provider` |

### Smoke manual (fase 2 e 3)

- [ ] Homepage, `/privacidade`, `/cookies` carregam sem erro CSP bloqueante
- [ ] Menu mobile abre/fecha (teclado e toque)
- [ ] Navegação por âncora funciona
- [ ] CTAs externos (WhatsApp, calendário) abrem em nova aba quando configurados
- [ ] Banner de consentimento exibe e persiste escolha (quando `analytics.provider !== 'none'`)
- [ ] Com consent aceito: requests ao domínio do provedor **não** bloqueados por CSP
- [ ] Skip link alcançável por teclado; foco visível no banner
- [ ] Iframe cross-origin: página **não** renderiza (teste abaixo)

#### Teste manual de iframe (SEC-006)

Criar HTML local com:

```html
<iframe src="https://SEU-DOMINIO/" width="800" height="600"></iframe>
```

Com CSP enforce, o browser deve bloquear a renderização (`frame-ancestors 'none'`).

## Rollback

1. Restaurar snippet nginx anterior (git checkout ou backup).
2. `sudo nginx -t && sudo nginx -s reload`
3. **Não** é necessário rebuild do site Astro.

## Verificação

### Script automatizado

```bash
# URL via argumento
npm run verify:headers -- https://example.com/

# URL via variável de ambiente
VERIFY_HEADERS_URL=https://staging.example.com npm run verify:headers
```

Exit code `0` = pass; `1` = fail com lista de ausências.

O script verifica cabeçalhos Must em `/` e `X-Content-Type-Options` em um asset `.js` ou `.css`. Em URLs `https://`, exige HSTS (SEC-001).

### Inspeção manual com curl

```bash
curl -sI https://example.com/
curl -sI https://example.com/_astro/client.js   # ajuste path se necessário
```

### Scanners externos (produção pós-launch)

- [securityheaders.com](https://securityheaders.com)
- [Mozilla Observatory](https://observatory.mozilla.org)

## Critério HSTS (SEC-001)

Aplicar **somente** quando:

- Ambiente de **produção**;
- TLS com certificado válido e renovação estável;
- Confirmado que subdomínios também servem HTTPS (por causa de `includeSubDomains`).

**Nunca** enviar HSTS em dev HTTP ou staging sem TLS confiável — risco de lockout temporário.

HSTS preload list: decisão `[OPEN]` — não incluir `preload` sem validação em [hstspreload.org](https://hstspreload.org).

## Referências

- Snippets: `infra/nginx/`
- Spec: `docs/specs/SPEC-013-security-headers/spec.md`
- Analytics / consent: SPEC-012, `src/config/site.config.ts`
