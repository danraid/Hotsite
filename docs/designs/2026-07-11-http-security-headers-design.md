# Design Document — Cabeçalhos HTTP e endurecimento de segurança

## Document control

| Campo | Valor |
|---|---|
| **Título** | Cabeçalhos HTTP, CSP e política de cookies — Hotsite Janaína Hollanda |
| **Status** | `ready-for-review` |
| **Owner** | `[OPEN]` |
| **Data** | 2026-07-11 |
| **Documento pai** | `docs/designs/2026-07-10-janaina-hollanda-hotsite-design.md` |
| **Tipo** | Addendum técnico (infraestrutura e segurança) |

### Inventário de fontes

| Fonte | Caminho | Papel |
|---|---|---|
| Design principal | `docs/designs/2026-07-10-janaina-hollanda-hotsite-design.md` | Contexto do produto, privacidade, analytics |
| Restrições técnicas | `docs/inputs/technical-constraints.md` | Princípios de stack e deploy |
| Legal e compliance | `docs/inputs/legal-and-compliance.md` | Transmissão segura, cookies, consentimento |
| Deploy CI | `.github/workflows/deploy.yml` | Build estático + SCP para VPS |
| Config Astro | `astro.config.mjs` | `output: 'static'` |
| Analytics | `src/lib/analytics*.ts`, `src/config/site.config.ts` | Provedores e consentimento |
| Consentimento | `src/components/CookieConsent.astro` | Persistência atual em `localStorage` |

### Tabela de status de inputs

| Input | Encontrado | Status | Conflitos | Ação |
|---|---|---|---|---|
| Design principal | Sim | `usable` | Nenhum | Referenciar requisitos de privacidade e analytics |
| Stack implementada | Sim | `usable` | Design §13 desatualizado | Tratar inspeção do repositório como fonte primária |
| Config de deploy VPS | Sim | `partial` | Nginx não versionado no repo | Propor artefato de infra em SPEC-013 |
| Domínio e TLS | Não | `missing` | Nenhum | Marcar HSTS preload como `[OPEN]` |
| Provedor de analytics | Não | `partial` | Default `none` | CSP parametrizável por ambiente/provedor |
| Config nginx existente | Não | `missing` | Nenhum | Bloqueador de implementação em produção |

---

## 1. Executive summary

Este addendum define **requisitos verificáveis** para reduzir riscos de XSS, clickjacking, MIME sniffing, vazamento de referrer, fingerprinting por APIs do browser e exposição de metadados de servidor/framework no hotsite estático Astro implantado em VPS.

A implementação recomendada concentra cabeçalhos HTTP no **reverse proxy (nginx)** na frente de arquivos estáticos em `/var/www/hotsite` (produção) e `/var/www/hotsite-dev` (desenvolvimento), conforme `.github/workflows/deploy.yml`. Cabeçalhos não substituem validação de conteúdo, revisão legal ou hardening do servidor — complementam-nos.

**Estado atual (inspeção 2026-07-11):** nenhum cabeçalho de segurança está configurado no repositório; consentimento de cookies usa `localStorage`, não cookies HTTP; scripts inline existem em `BaseLayout.astro`, `SiteHeader.astro` e `CookieConsent.astro`; fontes são self-hosted via `@fontsource`.

**Próximo passo após aprovação:** invocar `create-spec` para **SPEC-013-security-headers**.

---

## 2. Business objective and success metrics

### Objetivo

Proteger visitantes e a reputação da prática profissional reduzindo superfície de ataque do site de marketing sem degradar conversão, analytics aprovados ou acessibilidade.

### Métricas de sucesso

| Métrica | Meta | Validação |
|---|---|---|
| Grade de segurança de cabeçalhos | A ou equivalente | [securityheaders.com](https://securityheaders.com) ou Mozilla Observatory em produção |
| CSP em modo enforce | Ativo em produção | Resposta HTTP inclui `Content-Security-Policy` sem `Report-Only` após período de teste |
| Clickjacking | Bloqueado | Página não renderiza em `<iframe>` externo |
| HSTS | Ativo em HTTPS prod | Presença de `Strict-Transport-Security` com `max-age` ≥ 31536000 |
| Cookies HTTP (se existirem) | Atributos corretos | Inspeção de `Set-Cookie` em produção |
| Cabeçalhos reveladores | Removidos ou ofuscados | Ausência de `Server`, `X-Powered-By` expostos quando controlável |

Metas numéricas de tráfego/conversão permanecem no design principal.

---

## 3. Audience and awareness level

Visitantes do hotsite não interagem com estes controles diretamente. Stakeholders relevantes:

- **Owner / profissional** — confiança e conformidade (LGPD, imagem profissional)
- **Operador de infra** — nginx, TLS, deploy
- **Implementador** — Astro, analytics, consentimento

---

## 4. Problem, offer, positioning, and value proposition

### Problema

Sites estáticos servidos sem cabeçalhos de segurança ficam expostos a:

- injeção de script via recursos de terceiros ou XSS refletido/armazenado;
- clickjacking (site embutido em iframe malicioso);
- MIME confusion attacks;
- vazamento de URL completa via `Referer` em links externos;
- uso não autorizado de câmera, microfone, geolocalização via APIs do browser;
- fingerprinting do stack (nginx/Astro) facilitando exploits direcionados.

### Oferta deste addendum

Política de cabeçalhos HTTP, CSP com `frame-ancestors`, regras de cookies e checklist de verificação alinhados ao repositório existente.

---

## 5. Conversion strategy

Cabeçalhos de segurança **não devem** bloquear:

- CTAs externos (calendário, WhatsApp);
- analytics aprovados após consentimento (SPEC-012);
- fontes self-hosted;
- navegação por âncora e menu mobile.

CSP e `Permissions-Policy` devem ser testados contra a jornada completa de conversão antes do enforce em produção.

---

## 6. Goals, non-goals, assumptions, and constraints

### Goals

- Definir cabeçalhos obrigatórios em produção (e baseline em dev).
- Incluir `frame-ancestors 'none'` na CSP para anti-clickjacking.
- Garantir política para cookies HTTP futuros ou atuais.
- Remover ou ocultar cabeçalhos que revelem servidor/framework.
- Documentar verificação automatizável.

### Non-goals

- WAF, rate limiting ou DDoS mitigation (fora do escopo).
- Pentest ou auditoria legal completa.
- Subresource Integrity (SRI) para todos os assets — `[RECOMMENDATION]` futura se scripts de terceiros forem inlined.
- Migração de `localStorage` para cookie de consentimento — opcional; ver SEC-007.

### Assumptions

- `[ASSUMPTION]` Produção será servida exclusivamente via **HTTPS** com certificado válido (Let's Encrypt ou equivalente).
- `[ASSUMPTION]` nginx (ou equivalente) termina TLS na VPS referenciada pelo workflow de deploy.
- `[ASSUMPTION]` Não há iframes de terceiros embutidos na v1 do hotsite.

### Constraints

- Astro `output: 'static'` — cabeçalhos HTTP não são emitidos pelo framework em build; dependem do servidor web.
- Scripts client inline/hoisted em componentes `.astro` exigem `'unsafe-inline'`, nonces ou hashes na CSP até refatoração.
- CSP deve variar conforme `analytics.provider` (`none`, `plausible`, `ga4`, `matomo`).

---

## 7. Information architecture and page narrative

Não aplicável — addendum de infraestrutura transversal a todas as rotas (`/`, `/privacidade`, `/cookies`).

---

## 8. Section contracts

Não aplicável.

---

## 9. User journeys and interaction model

| Jornada | Requisito de segurança |
|---|---|
| Primeira visita | HSTS (se revisit); CSP não quebra layout/scripts essenciais |
| Consentimento de cookies | Banner funciona com CSP; storage conforme SEC-007 |
| Clique em CTA externo | `Referrer-Policy` não impede conversão; link abre normalmente |
| Analytics pós-consentimento | Domínios do provedor permitidos em `connect-src` / `script-src` |
| Tentativa de iframe externo | Browser recusa renderização (`frame-ancestors 'none'`) |

---

## 10. Content inventory and missing assets

| Artefato | Status | Ação |
|---|---|---|
| Snippet nginx versionado | `missing` | Criar em SPEC-013 (`infra/nginx/` ou `docs/ops/`) |
| CSP por provedor de analytics | `partial` | Templates parametrizados |
| Endpoint CSP report `[RECOMMENDATION]` | `missing` | Opcional: `report-uri` / `report-to` |

---

## 11. Visual direction and design tokens

Não aplicável.

---

## 12. Component inventory and states

Não aplicável — impacto indireto em scripts de `CookieConsent`, `SiteHeader`, `BaseLayout` e bootstrap de analytics.

---

## 13. Technical architecture

### Modelo de deploy atual

```text
GitHub Actions (push main / tag v*)
  → npm ci && npm run build
  → dist/* via SCP → VPS:/var/www/hotsite[-dev]
  → nginx (presumido) serve arquivos estáticos
```

### Camada de responsabilidade

| Controle | Onde implementar | Prioridade |
|---|---|---|
| HSTS, CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy | nginx `add_header` | Must |
| `frame-ancestors` | Dentro da CSP | Must |
| Remoção `Server` / `X-Powered-By` | nginx (`server_tokens off`; sem headers upstream) | Should |
| Cookies `Secure`/`HttpOnly`/`SameSite` | Aplicação ou nginx (se cookies forem introduzidos) | Must quando houver `Set-Cookie` |
| Meta CSP | `<meta http-equiv>` | Won't — insuficiente para HSTS e limitado; usar HTTP headers |

### DEC-007 — Cabeçalhos no nginx vs middleware Astro

- **Status:** Proposed
- **Decisão:** Configurar cabeçalhos de segurança no **nginx** da VPS; manter Astro estático sem SSR middleware.
- **Rationale:** Deploy atual copia apenas `dist/`; nginx já é o ponto natural de TLS e headers; evita dependência de adapter serverless.
- **Alternativas consideradas:**
  - Middleware Astro + adapter node — rejeitado: aumenta complexidade sem benefício para site estático.
  - CDN (Cloudflare) — válido se adotado depois; documentar regras equivalentes.
- **Consequências:** Operador deve aplicar config nginx fora do pipeline SCP atual até artefato ser versionado.
- **Validação:** `curl -I https://<domínio>/` lista cabeçalhos exigidos.

### DEC-008 — CSP baseline vs strict

- **Status:** Proposed
- **Decisão:** Rollout em duas fases: (1) `Content-Security-Policy-Report-Only` em staging; (2) enforce em produção após smoke tests.
- **Rationale:** Scripts inline atuais e analytics configurável aumentam risco de quebra silenciosa.
- **Alternativas:** CSP strict imediata com refatoração total de scripts — preferível a longo prazo; adiar para sub-tarefa da SPEC-013 se tempo limitado.
- **Validação:** Zero erros CSP no console durante jornada principal em staging.

---

## 14. Forms and integrations

### Domínios CSP por provedor de analytics `[RECOMMENDATION]`

| Provedor | `script-src` adicional | `connect-src` adicional | `img-src` adicional |
|---|---|---|---|
| `none` | — | — | — |
| `plausible` | `https://plausible.io` | `https://plausible.io` | `https://plausible.io` |
| `ga4` | `https://www.googletagmanager.com` | `https://www.google-analytics.com` `https://region1.google-analytics.com` | `https://www.google-analytics.com` |
| `matomo` | `[OPEN: URL da instância]` | mesma origem Matomo | mesma origem Matomo |

CTAs externos (WhatsApp, calendário) usam navegação top-level — **não** exigem `frame-src`. Manter `frame-src 'none'` ou `'self'`.

### Integrações não afetadas

Links `target="_blank"` com `rel="noopener noreferrer"` (SPEC-002) permanecem compatíveis com `Referrer-Policy: strict-origin-when-cross-origin`.

---

## 15. SEO and social metadata

CSP não deve bloquear crawlers de preview (`img-src` deve permitir self; OG tags são meta, não afetadas). `X-Robots-Tag` permanece opcional e separado.

---

## 16. Analytics and consent

- Tracking continua gated por consentimento (SPEC-012).
- Cabeçalhos **não** substituem banner ou base legal.
- Se analytics carregar scripts de terceiros, CSP correspondente deve estar ativa **antes** de ativar provedor em produção.
- `localStorage` para `cookie-consent` não é cookie HTTP — política de cookies do site deve declarar ambos quando aplicável.

---

## 17. Accessibility, privacy, and security

### Cabeçalhos obrigatórios (produção)

#### SEC-001 — Strict-Transport-Security

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

- `preload` somente após validação explícita em [hstspreload.org](https://hstspreload.org) — `[OPEN]`.
- Enviar **apenas** em respostas HTTPS.
- Não enviar em `hotsite-dev` sem TLS estável.

#### SEC-002 — Content-Security-Policy (com frame-ancestors)

Baseline `[RECOMMENDATION]` para `analytics.provider: none`:

```http
Content-Security-Policy: default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; connect-src 'self'; upgrade-insecure-requests
```

Notas:

- `'unsafe-inline'` em `script-src`/`style-src` reflete scripts/styles inline atuais do Astro. **Meta de endurecimento:** externalizar scripts e substituir por hashes ou nonces.
- `frame-ancestors 'none'` cumpre proteção contra carregamento em frames externos (substitui necessidade de `X-Frame-Options` em browsers modernos; manter ambos é aceitável).
- `upgrade-insecure-requests` apenas quando todo asset e subresource for servido em HTTPS.

#### SEC-003 — X-Content-Type-Options

```http
X-Content-Type-Options: nosniff
```

#### SEC-004 — Referrer-Policy

```http
Referrer-Policy: strict-origin-when-cross-origin
```

Alternativa mais restritiva `[RECOMMENDATION]` se analytics não depender de referrer completo: `same-origin`.

#### SEC-005 — Permissions-Policy

```http
Permissions-Policy: accelerometer=(), autoplay=(), camera=(), cross-origin-isolated=(), display-capture=(), encrypted-media=(), fullscreen=(self), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), usb=(), web-share=()
```

Ajustar `fullscreen=(self)` se experiência exigir fullscreen em embed — improvável neste hotsite.

#### SEC-006 — Anti-clickjacking complementar

Preferir CSP `frame-ancestors 'none'`. Opcionalmente, defesa em profundidade:

```http
X-Frame-Options: DENY
```

`SAMEORIGIN` **não** atende o requisito de bloquear frames externos.

#### SEC-007 — Cookies com Secure, HttpOnly e SameSite

| Contexto | Regra |
|---|---|
| Cookies de sessão/admin futuros | `Secure; HttpOnly; SameSite=Lax` (ou `Strict` se não quebrar fluxos) |
| Cookie de consentimento legível por JS | `Secure; SameSite=Lax` — sem `HttpOnly` se o script client precisar ler |
| Persistência atual em `localStorage` | Documentar na política de cookies; ao migrar para cookie, aplicar atributos acima |
| Ambiente dev HTTP | `Secure` omitido apenas em localhost explícito — nunca em produção |

#### SEC-008 — Remoção de cabeçalhos reveladores

| Cabeçalho | Ação |
|---|---|
| `Server` | `server_tokens off;` no nginx |
| `X-Powered-By` | Não emitir (Astro estático não envia por padrão; verificar upstream) |
| `X-Astro-*` | Garantir ausência em respostas de produção |

### Cabeçalhos adicionais `[RECOMMENDATION]`

```http
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
```

Adotar após confirmar que não há assets cross-origin necessários além de analytics aprovado.

---

## 18. Performance budgets

Cabeçalhos HTTP têm impacto desprezível no tamanho da resposta. CSP strict pode exigir refatoração de scripts — custo de engenharia, não de bytes.

Nenhuma alteração às metas LCP/INP/CLS do design principal.

---

## 19. Test and release strategy

### Quality gates (SPEC-013)

1. Arquivo nginx (ou equivalente) versionado e revisado.
2. Script ou doc de verificação: `curl -sI` contra dev e prod.
3. Scan [securityheaders.com](https://securityheaders.com) ou Mozilla Observatory.
4. Smoke manual: homepage, menu mobile, banner de consentimento (quando analytics ativo), clique CTA, navegação âncora.
5. Console do browser sem violações CSP bloqueantes na jornada principal.
6. Teste de iframe: página em `<iframe src="https://domínio">` deve falhar.

### Rollout

| Fase | Ambiente | Ação |
|---|---|---|
| 1 | `hotsite-dev` | Deploy headers; CSP Report-Only opcional |
| 2 | `hotsite-dev` | CSP enforce; corrigir violações |
| 3 | produção (`/var/www/hotsite`) | Headers completos + HSTS |
| 4 | pós-launch | Revisar CSP ao mudar `analytics.provider` |

### Rollback

Reverter snippet nginx para versão anterior e `nginx -s reload` — sem rebuild do site.

---

## 20. Risks and mitigations

| Risco | Impacto | Mitigação |
|---|---|---|
| CSP quebra analytics ou menu mobile | Médio — perda de dados/conversão | Report-Only primeiro; matriz por provedor |
| HSTS prematuro em dev sem HTTPS | Alto — lockout temporário | HSTS só em prod com TLS validado |
| `'unsafe-inline'` mantém risco XSS residual | Médio | Roadmap para externalizar scripts |
| Config nginx fora do repo | Médio — drift | Versionar em `infra/nginx/` |
| Operador não aplica headers | Alto | Checklist no deploy; verificação CI opcional contra URL staging |

---

## 21. Decisions and open questions

### Decisions

| ID | Título | Status |
|---|---|---|
| DEC-007 | Cabeçalhos no nginx | Proposed |
| DEC-008 | CSP rollout Report-Only → enforce | Proposed |

### Open questions

1. **`[OPEN]`** Domínio final e emissor do certificado TLS?
2. **`[OPEN]`** nginx é o reverse proxy confirmado na VPS?
3. **`[OPEN]`** Provedor de analytics no launch — impacta CSP?
4. **`[OPEN]`** URL da instância Matomo, se selecionada?
5. **`[OPEN]`** Incluir domínio em HSTS preload list?
6. **`[RECOMMENDATION]`** Endpoint para relatórios CSP (`report-uri`)?

---

## 22. Out of scope

- Certificado TLS e renovação automatizada (certbot)
- Hardening SSH, firewall, fail2ban
- SRI em tags `<script src>`
- Subresource de CDN externo para fontes (fontes são self-hosted)

---

## 23. Recommended spec decomposition

| Spec | Escopo | Dependências |
|---|---|---|
| **SPEC-013** | Cabeçalhos HTTP, snippet nginx, CSP parametrizada, testes de verificação, doc operacional | SPEC-001, SPEC-012 (para matriz analytics) |

### Entregáveis SPEC-013 `[RECOMMENDATION]`

- `infra/nginx/security-headers.conf` (ou caminho acordado)
- Variantes CSP: `none.conf`, `plausible.conf`, `ga4.conf`
- Script `npm run verify:headers` ou doc em `docs/ops/security-headers.md`
- Testes automatizados mínimos (snapshot de política ou parse de config)
- Atualização da política de cookies se cookies HTTP forem introduzidos

---

## 24. Requirements index

### SEC-001 — HSTS em produção

- **Priority:** Must
- **Type:** Non-functional
- **Source:** Solicitação de endurecimento 2026-07-11; `legal-and-compliance.md` (transmissão segura)
- **Dependencies:** TLS operacional
- **Status:** Proposed

**Requirement:** Respostas HTTPS de produção devem incluir `Strict-Transport-Security` com `max-age` de pelo menos 31536000 segundos e `includeSubDomains`.

**Validation:** `curl -sI https://<prod>/` contém o cabeçalho com valores esperados.

---

### SEC-002 — Content-Security-Policy com frame-ancestors

- **Priority:** Must
- **Type:** Non-functional
- **Source:** Solicitação 2026-07-11
- **Dependencies:** SEC-003; matriz analytics
- **Status:** Proposed

**Requirement:** Produção deve enviar `Content-Security-Policy` incluindo `frame-ancestors 'none'`, `default-src 'self'`, e diretivas compatíveis com scripts/styles self-hosted e provedor de analytics configurado.

**Validation:** Cabeçalho presente; iframe externo bloqueado; jornada principal sem violações bloqueantes no console.

---

### SEC-003 — X-Content-Type-Options nosniff

- **Priority:** Must
- **Type:** Non-functional
- **Source:** Solicitação 2026-07-11
- **Dependencies:** None
- **Status:** Proposed

**Requirement:** Todas as respostas HTML e assets estáticos devem incluir `X-Content-Type-Options: nosniff`.

**Validation:** `curl -sI` confirma presença em `/` e em um asset `.js` ou `.css`.

---

### SEC-004 — Referrer-Policy

- **Priority:** Must
- **Type:** Non-functional
- **Source:** Solicitação 2026-07-11
- **Dependencies:** None
- **Status:** Proposed

**Requirement:** Respostas devem incluir `Referrer-Policy: strict-origin-when-cross-origin` ou política mais restritiva aprovada.

**Validation:** Cabeçalho presente em resposta da homepage.

---

### SEC-005 — Permissions-Policy

- **Priority:** Must
- **Type:** Non-functional
- **Source:** Solicitação 2026-07-11
- **Dependencies:** None
- **Status:** Proposed

**Requirement:** Respostas devem incluir `Permissions-Policy` desabilitando APIs do browser não utilizadas pelo hotsite (câmera, microfone, geolocalização, payment, etc.).

**Validation:** Cabeçalho presente; diretivas listadas na documentação operacional.

---

### SEC-006 — Proteção contra framing externo

- **Priority:** Must
- **Type:** Non-functional
- **Source:** Solicitação 2026-07-11
- **Dependencies:** SEC-002
- **Status:** Proposed

**Requirement:** O site não deve ser exibível em frames de origens externas.

**Validation:** Teste manual ou automatizado com iframe cross-origin falha; CSP inclui `frame-ancestors 'none'`.

---

### SEC-007 — Atributos de cookies HTTP

- **Priority:** Must (condicional)
- **Type:** Non-functional
- **Source:** Solicitação 2026-07-11; `legal-and-compliance.md`
- **Dependencies:** Qualquer feature que emita `Set-Cookie`
- **Status:** Proposed

**Requirement:** Todo cookie definido pelo site em produção deve usar `Secure` e `SameSite=Lax` ou `Strict`; cookies não legíveis por script devem incluir `HttpOnly`.

**Validation:** Inspeção de `Set-Cookie` no browser ou `curl` quando cookies existirem; se ausentes, documentar N/A com evidência.

---

### SEC-008 — Ocultar metadados de servidor/framework

- **Priority:** Should
- **Type:** Non-functional
- **Source:** Solicitação 2026-07-11
- **Dependencies:** Acesso à config nginx
- **Status:** Proposed

**Requirement:** Respostas de produção não devem expor versão do servidor ou cabeçalhos `X-Powered-By` quando controlável na infraestrutura.

**Validation:** `curl -sI` não revela versão nginx; `Server` genérico ou ausente conforme config.

---

### SEC-009 — Verificação contínua de cabeçalhos

- **Priority:** Should
- **Type:** Non-functional
- **Source:** Este documento §19
- **Dependencies:** SEC-001–SEC-008
- **Status:** Proposed

**Requirement:** O repositório deve incluir procedimento repetível (script ou doc) para validar cabeçalhos após deploy.

**Validation:** Comando documentado executa com sucesso e reporta pass/fail.

---

## 25. Approval checklist

### Para marcar como `approved`

- [ ] Owner ou operador confirma nginx (ou equivalente) na VPS
- [ ] Domínio e TLS de produção definidos
- [ ] Matriz CSP acordada para provedor de analytics no launch
- [ ] DEC-007 e DEC-008 aprovadas
- [ ] Requisitos Must SEC-001–SEC-006 aceitos
- [ ] Plano de rollout staging → produção aceito

### Status atual

**`ready-for-review`** — addendum completo para revisão; **independente** da aprovação do design principal de conteúdo, mas implementação em produção depende de acesso à VPS.

### Próximo passo recomendado

1. Revisar e aprovar explicitamente este addendum.
2. Invocar `create-spec` para **SPEC-013-security-headers**.
3. Não marcar launch de produção como completo sem verificação SEC-001–SEC-006.

---

*Documento gerado pelo workflow `design-doc` em 2026-07-11. Nenhum código de produção ou config de servidor foi alterado.*
