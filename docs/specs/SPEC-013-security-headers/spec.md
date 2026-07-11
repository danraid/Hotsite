---
id: SPEC-013
title: Cabeçalhos HTTP, CSP e hardening de infraestrutura
category: quality
status: ready
---

# Objective

Versionar e documentar a política de cabeçalhos HTTP de segurança para o hotsite estático Astro implantado em VPS, incluindo snippet nginx parametrizável, matriz CSP por provedor de analytics, verificação repetível pós-deploy e regras para cookies HTTP futuros — sem degradar conversão, navegação ou consentimento (SPEC-012).

# Context and traceability

- Design document: `docs/designs/2026-07-11-http-security-headers-design.md`
- Design document (pai): `docs/designs/2026-07-10-janaina-hollanda-hotsite-design.md` (§17, SPEC-013)
- Design sections: §13 Technical architecture, §14 Forms and integrations, §17 Security, §19 Test and release
- Design requirements: SEC-001–SEC-009
- Design decisions: DEC-007 (headers no nginx), DEC-008 (CSP Report-Only → enforce)
- Depends on: SPEC-001 (stack Astro estática), SPEC-012 (matriz CSP ↔ `analytics.provider`)

# Scope

### Artefatos versionados no repositório

1. **Snippet nginx reutilizável** em `infra/nginx/`:
   - `security-headers-base.conf` — cabeçalhos comuns (nosniff, Referrer-Policy, Permissions-Policy, X-Frame-Options, `server_tokens off`)
   - `csp-none.conf` — CSP baseline para `analytics.provider: none`
   - `csp-plausible.conf` — extensão para Plausible
   - `csp-ga4.conf` — extensão para GA4
   - `csp-matomo.conf.template` — template com placeholder `MATOMO_ORIGIN` para instância Matomo
   - `README.md` — instruções de inclusão no `server {}` nginx e rollout staging → produção

2. **Documentação operacional** em `docs/ops/security-headers.md`:
   - Checklist de deploy e rollback
   - Tabela de cabeçalhos esperados por ambiente (dev vs prod)
   - Quando aplicar HSTS (somente HTTPS prod estável)
   - Como selecionar variante CSP conforme `site.config.ts` → `analytics.provider`

3. **Verificação repetível**:
   - Script `scripts/verify-security-headers.mjs` invocável via `npm run verify:headers`
   - Aceita URL base via argumento ou env `VERIFY_HEADERS_URL`
   - Valida presença e valores mínimos dos cabeçalhos Must (SEC-001–SEC-006, SEC-003–SEC-005)
   - Exit code 0 = pass; 1 = fail com mensagens legíveis

4. **Testes automatizados** (Vitest):
   - Parse/snapshot das diretivas CSP baseline (`frame-ancestors 'none'`, `default-src 'self'`, etc.)
   - Garantir que arquivos nginx versionados existem e contêm tokens obrigatórios documentados

5. **Política de cookies HTTP** (condicional):
   - Se a implementação introduzir `Set-Cookie`, documentar atributos exigidos em `docs/ops/security-headers.md` e atualizar `src/pages/cookies.astro` com nota sobre atributos
   - Estado atual (`localStorage` key `cookie-consent`): registrar como N/A para SEC-007 com evidência no doc operacional — **não migrar** storage nesta spec

### Cabeçalhos obrigatórios (produção, após rollout enforce)

| Cabeçalho | Valor mínimo |
|---|---|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` (HTTPS prod apenas) |
| `Content-Security-Policy` | Inclui `frame-ancestors 'none'`; compatível com provedor analytics ativo |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Desabilita câmera, microfone, geolocalização, payment e demais APIs listadas no design §17 |
| `X-Frame-Options` | `DENY` (defesa em profundidade; CSP `frame-ancestors` permanece autoritativo) |

### CSP baseline (`analytics.provider: none`)

Valores exatos a versionar em `csp-none.conf`:

```http
Content-Security-Policy: default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; connect-src 'self'; upgrade-insecure-requests
```

### Extensões CSP por provedor (design §14)

| Provedor | Adições |
|---|---|
| `plausible` | `script-src`, `connect-src`, `img-src`: `https://plausible.io` |
| `ga4` | `script-src`: `https://www.googletagmanager.com`; `connect-src`: `https://www.google-analytics.com` `https://region1.google-analytics.com`; `img-src`: `https://www.google-analytics.com` |
| `matomo` | Origem configurável (`MATOMO_ORIGIN`) em `script-src`, `connect-src`, `img-src` |

### Rollout (DEC-008)

1. **Staging** (`/var/www/hotsite-dev`): cabeçalhos base + CSP `Content-Security-Policy-Report-Only` opcional na primeira iteração
2. **Staging enforce**: trocar para `Content-Security-Policy`; smoke da jornada principal
3. **Produção**: cabeçalhos completos incluindo HSTS
4. **Pós-launch**: revisar variante CSP ao alterar `analytics.provider` em `site.config.ts`

# Out of scope

- Provisionamento ou renovação de certificado TLS (certbot)
- Hardening SSH, firewall, fail2ban, WAF
- Middleware Astro ou adapter serverless para emitir headers
- Meta tag CSP (`<meta http-equiv>`)
- Subresource Integrity (SRI) em scripts de terceiros
- Migração de consentimento de `localStorage` para cookie HTTP
- HSTS preload list (decisão `[OPEN]` do design)
- Endpoint de relatório CSP (`report-uri` / `report-to`) — futuro opcional
- Aplicação automática da config nginx no pipeline GitHub Actions (operador aplica manualmente até automação aprovada)
- Cross-Origin-Opener-Policy / Cross-Origin-Resource-Policy (recomendação futura do design)

# User experience

Visitante **não** vê cabeçalhos HTTP. A jornada principal deve permanecer funcional:

- Homepage, `/privacidade`, `/cookies` carregam sem erro bloqueante de CSP
- Menu mobile (drawer) abre e fecha
- Navegação por âncora rola corretamente
- CTAs externos (WhatsApp, calendário) abrem em nova aba quando configurados
- Banner de consentimento (quando `analytics.provider !== 'none'` e `requiresConsent: true`) exibe e persiste escolha
- Analytics dispara apenas após consentimento aceito (SPEC-012), sem violação CSP do provedor selecionado

# Functional requirements

### SPEC-013-FR-001 — Snippet nginx versionado

- **Priority:** Must
- **Source:** SEC-002, SEC-003, SEC-004, SEC-005, SEC-006, SEC-008; design §23

Arquivos em `infra/nginx/` conforme escopo, incluindo README com exemplo de `include` dentro de bloco `server {}` servindo `root` estático.

**Validation:** Arquivos existem no repositório; README descreve passos de aplicação e reload nginx.

### SPEC-013-FR-002 — Matriz CSP por analytics.provider

- **Priority:** Must
- **Source:** SEC-002; design §14; SPEC-012

Variantes CSP separadas para `none`, `plausible`, `ga4` e template Matomo. README documenta qual arquivo incluir para cada valor de `site.config.ts` → `analytics.provider`.

**Validation:** Testes Vitest confirmam presença de `frame-ancestors 'none'` em todas as variantes e domínios do provedor na variante correspondente.

### SPEC-013-FR-003 — Script de verificação pós-deploy

- **Priority:** Must
- **Source:** SEC-009

`npm run verify:headers -- <url>` (ou env `VERIFY_HEADERS_URL`) verifica cabeçalhos Must em resposta GET/HEAD da URL informada.

**Validation:** Script retorna exit 0 quando cabeçalhos mockados ou staging real estão corretos; exit 1 com diagnóstico quando ausentes.

### SPEC-013-FR-004 — Documentação operacional

- **Priority:** Must
- **Source:** SEC-009; design §19

`docs/ops/security-headers.md` cobre rollout, rollback, ambientes dev/prod, seleção de CSP, critério HSTS e verificação com `curl -sI`.

**Validation:** Documento referencia todos os requisitos SEC-001–SEC-009 e comando `npm run verify:headers`.

# Non-functional requirements

### SPEC-013-NFR-001 — HSTS apenas em produção HTTPS

- **Priority:** Must
- **Source:** SEC-001

`Strict-Transport-Security` documentado e configurado **somente** para ambiente de produção com TLS validado. Dev sem TLS estável **não** recebe HSTS.

**Validation:** README e doc ops distinguem claramente dev vs prod; snippet prod inclui HSTS; snippet dev omite HSTS.

### SPEC-013-NFR-002 — Anti-clickjacking

- **Priority:** Must
- **Source:** SEC-002, SEC-006

CSP inclui `frame-ancestors 'none'`. `X-Frame-Options: DENY` presente como defesa em profundidade.

**Validation:** Teste Vitest parseia ambos; doc ops descreve teste manual com iframe cross-origin.

### SPEC-013-NFR-003 — MIME sniffing

- **Priority:** Must
- **Source:** SEC-003

`X-Content-Type-Options: nosniff` em respostas HTML e assets estáticos servidos pelo nginx.

**Validation:** Script verify confirma cabeçalho em `/` e em path de asset `.js` ou `.css`.

### SPEC-013-NFR-004 — Referrer e Permissions-Policy

- **Priority:** Must
- **Source:** SEC-004, SEC-005

`Referrer-Policy: strict-origin-when-cross-origin` e `Permissions-Policy` com APIs não utilizadas desabilitadas conforme design §17.

**Validation:** Script verify confirma presença; valores documentados em doc ops.

### SPEC-013-NFR-005 — Ocultar metadados de servidor

- **Priority:** Should
- **Source:** SEC-008

Config nginx inclui `server_tokens off;` e instrução para não propagar `X-Powered-By`.

**Validation:** Doc ops descreve inspeção `curl -sI` esperada (sem versão nginx exposta).

### SPEC-013-NFR-006 — Cookies HTTP endurecidos (condicional)

- **Priority:** Must (when Set-Cookie exists)
- **Source:** SEC-007; `legal-and-compliance.md`

Se qualquer feature emitir cookie HTTP: `Secure` + `SameSite=Lax` ou `Strict`; `HttpOnly` quando script client não precisar ler.

**Validation:** Enquanto site não emite cookies, doc ops registra N/A com referência ao uso atual de `localStorage`; teste aplicável quando cookie for introduzido.

### SPEC-013-NFR-007 — Sem regressão de conversão ou analytics

- **Priority:** Must
- **Source:** design §5, §16

Após CSP enforce em staging, jornada principal completa sem erros CSP bloqueantes no console; com analytics ativo e consentimento aceito, requests ao domínio do provedor não são bloqueados.

**Validation:** Checklist manual documentado em doc ops; opcionalmente automatizável em spec futura de E2E.

# Content contract

N/A para copy de marketing. Conteúdo técnico versionado:

| Artefato | Conteúdo mínimo |
|---|---|
| `infra/nginx/README.md` | Include paths, mapa provider → arquivo CSP, HSTS prod-only |
| `docs/ops/security-headers.md` | Rollout 4 fases, rollback, verify, SEC index |
| `src/pages/cookies.astro` | Atualizar **somente se** cookies HTTP forem introduzidos nesta ou outra spec |

# Visual and responsive behavior

N/A — cabeçalhos HTTP não alteram layout, tipografia ou breakpoints. Regressão visual indireta (CSP bloqueando CSS) é coberta por smoke test da jornada principal.

# Technical contract

### Decisão arquitetural (DEC-007)

Cabeçalhos emitidos pelo **nginx** na VPS; Astro permanece `output: 'static'` sem middleware.

### Estrutura de arquivos

```text
infra/nginx/
  security-headers-base.conf
  csp-none.conf
  csp-plausible.conf
  csp-ga4.conf
  csp-matomo.conf.template
  README.md
docs/ops/
  security-headers.md
scripts/
  verify-security-headers.mjs
src/lib/security-headers.test.ts   # ou scripts/*.test.ts — parse CSP
package.json                       # script verify:headers
```

### Integração nginx (exemplo)

```nginx
server_tokens off;

include /path/to/repo/infra/nginx/security-headers-base.conf;
include /path/to/repo/infra/nginx/csp-none.conf;  # trocar conforme analytics.provider

# Produção HTTPS apenas:
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

Operador substitui paths e variante CSP após deploy SCP.

### Compatibilidade com scripts inline atuais

Até refatoração futura, CSP baseline mantém `'unsafe-inline'` em `script-src` e `style-src` conforme design §17 — reflete `BaseLayout.astro`, `SiteHeader.astro`, `CookieConsent.astro`.

# Expected file changes

- `infra/nginx/security-headers-base.conf` (novo)
- `infra/nginx/csp-none.conf` (novo)
- `infra/nginx/csp-plausible.conf` (novo)
- `infra/nginx/csp-ga4.conf` (novo)
- `infra/nginx/csp-matomo.conf.template` (novo)
- `infra/nginx/README.md` (novo)
- `docs/ops/security-headers.md` (novo)
- `scripts/verify-security-headers.mjs` (novo)
- `src/lib/security-headers.test.ts` ou `scripts/verify-security-headers.test.ts` (novo)
- `package.json` — adicionar `"verify:headers": "node scripts/verify-security-headers.mjs"`

Opcional condicional:

- `src/pages/cookies.astro` — somente se cookies HTTP forem adicionados

# Analytics and SEO impact

- **Analytics:** CSP deve permitir domínios do provedor configurado antes de ativar tracking em produção. Alterar `analytics.provider` exige trocar include CSP no nginx.
- **SEO:** Cabeçalhos não bloqueiam crawlers; `Referrer-Policy` não impede indexação. OG/meta tags inalteradas (SPEC-011).
- **Consent:** Independente de cabeçalhos; persistência continua em `localStorage` nesta spec.

# Accessibility requirements

Cabeçalhos HTTP não substituem requisitos WCAG. Smoke test pós-CSP enforce deve incluir:

- Skip link alcançável por teclado
- Menu mobile operável por teclado
- Banner de consentimento com foco visível e botões acionáveis

Nenhuma alteração de contraste ou semântica HTML exigida por esta spec.

# Acceptance criteria

1. **Given** repositório após implementação, **when** listado `infra/nginx/`, **then** existem snippets base, variantes CSP (`none`, `plausible`, `ga4`, template Matomo) e README.
2. **Given** `csp-none.conf`, **when** parseado por teste, **then** contém `frame-ancestors 'none'`, `default-src 'self'` e `'unsafe-inline'` em `script-src`.
3. **Given** variante `csp-ga4.conf`, **when** parseada, **then** inclui `https://www.googletagmanager.com` em `script-src`.
4. **Given** URL de staging/prod configurada, **when** `npm run verify:headers -- https://<host>/`, **then** script reporta pass para cabeçalhos Must presentes ou fail com lista de ausências.
5. **Given** doc ops publicado, **when** operador segue rollout staging → prod, **then** consegue aplicar headers, executar smoke e reverter via reload nginx sem rebuild.
6. **Given** homepage em staging com CSP enforce, **when** visitante percorre nav, menu mobile e clique CTA, **then** nenhuma violação CSP bloqueante no console.
7. **Given** tentativa de embed em iframe cross-origin, **when** página carregada com CSP enforce, **then** browser bloqueia renderização (frame-ancestors).
8. **Given** site sem `Set-Cookie`, **when** doc ops revisado, **then** SEC-007 documentado como N/A com referência a `localStorage`.

# Test plan

### Automatizado (CI)

- `npm test` — testes Vitest de parse/snapshot CSP e existência de artefatos nginx
- `npm run verify:headers` — opcional em CI apenas se `VERIFY_HEADERS_URL` secret configurado; caso contrário, testes unitários do parser bastam

### Manual (staging/prod)

- `curl -sI https://<host>/` — inspecionar cabeçalhos
- [securityheaders.com](https://securityheaders.com) ou Mozilla Observatory em produção pós-launch
- Smoke: homepage, `/privacidade`, menu mobile, âncoras, CTA externo, consent banner (analytics ativo)
- Iframe cross-origin bloqueado
- Com analytics + consent aceito: network tab sem bloqueio CSP ao provedor

### Quality gates do repositório

- lint, typecheck, test, build — inalterados e passando após adição de scripts/testes

# Risks and open questions

| Item | Tipo | Mitigação |
|---|---|---|
| Design addendum `ready-for-review` (não `approved`) | Processo | Spec derivada explicitamente; aprovação formal pendente |
| nginx na VPS não confirmado | `[OPEN]` | README deve notar adaptação para reverse proxy equivalente |
| Domínio/TLS prod indefinidos | `[OPEN]` | HSTS e verify:headers usam URL parametrizável |
| URL Matomo indefinida | `[OPEN]` | Template com placeholder `MATOMO_ORIGIN` |
| CSP `'unsafe-inline'` — XSS residual | Risco aceito v1 | Roadmap documentado para externalizar scripts |
| Operador não aplica config nginx | Risco operacional | Doc ops + verify:headers como gate de launch |
| Provedor analytics muda pós-launch | Risco | README mapeia provider → arquivo CSP |

# Definition of done

- [ ] Snippets nginx versionados em `infra/nginx/` com README
- [ ] Variantes CSP para `none`, `plausible`, `ga4` e template Matomo
- [ ] `docs/ops/security-headers.md` com rollout, rollback e mapeamento SEC-001–SEC-009
- [ ] `scripts/verify-security-headers.mjs` + `npm run verify:headers`
- [ ] Testes Vitest de parse CSP passando
- [ ] Smoke staging documentado e executado (CSP enforce, jornada principal, iframe)
- [ ] Produção: cabeçalhos Must verificados via `verify:headers` ou `curl -sI` após operador aplicar nginx
- [ ] SEC-007 documentado (N/A ou atributos de cookie se aplicável)
- [ ] lint, typecheck, test, build passam
