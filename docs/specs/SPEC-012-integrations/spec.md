---
id: SPEC-012
title: Integrações — agendamento, WhatsApp, analytics e consentimento
category: integration
status: blocked
---

# Objective

Conectar destinos de conversão configuráveis, instrumentar eventos de analytics conforme taxonomia do design, e implementar camada de consentimento de cookies quando a plataforma de tracking for definida.

# Context and traceability

- Design document: `docs/designs/2026-07-10-janaina-hollanda-hotsite-design.md`
- Design sections: §5 Conversion, §14 Forms, §16 Analytics, §17 Privacy
- Design requirements: PROD-002, ANALYTICS-001, PRIVACY-001
- Depends on: SPEC-001, SPEC-002, SPEC-009

# Scope

### Conversão

- Validar que todos os CTAs primários e WhatsApp usam `site.config.ts` (auditoria cross-spec).
- Documentar em `site.config.ts` schema final de `primaryCta`, `whatsapp`, `booking` (tipo: `url | whatsapp | form`).

### Analytics abstraction

- `src/lib/analytics.ts` com interface:

```ts
track(event: string, properties?: Record<string, string>): void
```

- Implementação default **no-op** (console.debug em dev apenas).
- Adapter placeholder para plataforma `[OPEN]` (GA4, Plausible, Matomo) selecionável via `site.config.ts` `analytics.provider: 'none' | 'plausible' | 'ga4' | 'matomo'`.

### Eventos instrumentados

| Evento | Trigger |
|---|---|
| `cta_click` | Clique em qualquer CTA com `data-cta-location` |
| `booking_start` | Clique em CTA primário de agendamento |
| `whatsapp_start` | Clique em link WhatsApp |
| `nav_click` | Clique em link de navegação do header |

Propriedades: `cta_label`, `cta_location`, `destination_type` (anchor | external | whatsapp).

### Consent

- `CookieConsent.astro` renderizado apenas quando `analytics.provider !== 'none'` e `analytics.requiresConsent === true`.
- Estados: hidden, visible, accepted, rejected.
- Persistência em `localStorage` key `cookie-consent`.
- Analytics não dispara antes de `accepted` quando consent exigido.

### Script client mínimo

- Um único script delegado de cliques (`event delegation`) em `document` para CTAs e nav — evitar múltiplos listeners por componente.

# Out of scope

- Escolha final da plataforma analytics (owner decision).
- Formulário de lead/backend.
- Pixels de advertising.
- `booking_complete` (requer integração com calendário).
- `section_view` / Intersection Observer (spec de qualidade futura opcional).
- Redação do banner de cookies (texto mínimo placeholder até legal).

# User experience

Visitante não percebe analytics. Consent banner discreto, alinhado à paleta, sem bloquear leitura — posição inferior, botões "Aceitar" / "Recusar" com contraste AA.

CTAs continuam funcionando independentemente do consent.

# Functional requirements

### SPEC-012-FR-001 — Destinos finais na config

- **Priority:** Must
- **Source:** PROD-002

Quando owner fornecer URLs/número, atualizar apenas `site.config.ts` — nenhum componente de seção deve precisar de edição.

**Validation:** Teste de alteração de config reflete em header, hero, como-funciona e cta-final.

### SPEC-012-FR-002 — cta_click

- **Priority:** Should
- **Source:** ANALYTICS-001

Todo elemento com `data-cta-location` e clique dispara `cta_click` com propriedades definidas.

**Validation:** Em dev com provider `none`, console.debug mostra payload; com adapter mock, spy recebe evento.

### SPEC-012-FR-003 — whatsapp_start

- **Priority:** Should
- **Source:** analytics-and-conversion.md

Clique em link WhatsApp dispara evento separado.

**Validation:** Payload inclui `cta_location`.

### SPEC-012-FR-004 — Consent gate

- **Priority:** Must (when tracking enabled)
- **Source:** PRIVACY-001, §16

Com `requiresConsent: true`, `track()` é no-op até consent accepted.

**Validation:** Antes de aceitar, nenhuma chamada ao adapter; após aceitar, chamadas funcionam.

### SPEC-012-FR-005 — Dados sensíveis

- **Priority:** Must
- **Source:** analytics-and-conversion.md

Propriedades de evento não incluem dados de saúde, mensagens de formulário ou PII além de labels genéricos.

**Validation:** Revisão do tipo `properties` limita chaves permitidas.

# Non-functional requirements

### SPEC-012-NFR-001 — JS mínimo

- **Priority:** Must
- **Source:** TECH-001

Script de analytics < 5KB minificado excluindo adapter de terceiros (carregados lazy após consent).

**Validation:** Medição do bundle client desta spec.

### SPEC-012-NFR-002 — Terceiros lazy

- **Priority:** Must
- **Source:** PERF-001

Scripts de GA4/Plausible carregados apenas após consent aceito, via dynamic import ou inject script.

**Validation:** Network tab sem requests analytics antes do consent.

# Content contract

`site.config.ts` `analytics`:

```ts
{
  provider: 'none', // OPEN
  requiresConsent: true,
  plausibleDomain: '',
  ga4MeasurementId: '',
}
```

Texto do banner: placeholder até revisão legal — "Este site usa cookies de análise para melhorar a experiência. [Política de privacidade]"

# Visual and responsive behavior

- Banner fixo inferior, fundo `--color-surface-warm`, botões Primary/Secondary.
- `z-index` abaixo do drawer mobile do header.
- Mobile: botões full-width.

# Technical contract

- `src/lib/analytics.ts`
- `src/lib/analytics-adapters/` (stubs por provider)
- `src/components/CookieConsent.astro` + minimal client script
- `src/scripts/track-clicks.ts` (ou inline em layout)
- Integração em `BaseLayout.astro`

# Expected file changes

- `src/lib/analytics.ts`
- `src/lib/analytics-adapters/*.ts`
- `src/components/CookieConsent.astro`
- `src/config/site.config.ts`
- `src/layouts/BaseLayout.astro`

# Analytics and SEO impact

- Esta spec **é** a camada de analytics; não afeta SEO diretamente.
- Consent afeta conformidade LGPD.

# Accessibility requirements

- Banner com `role="dialog"` ou `region` com `aria-label="Consentimento de cookies"`.
- Botões focáveis; trap de foco opcional (não obrigatório para banner inferior).
- Contraste AA no banner.

# Acceptance criteria

1. **Given** provider `none`, **when** CTA clicado, **then** no external analytics request e debug log opcional em dev.
2. **Given** provider `plausible` e consent não dado, **when** CTA clicado, **then** Plausible script não carregado.
3. **Given** consent aceito, **when** CTA primário clicado, **then** `cta_click` e `booking_start` disparados.
4. **Given** propriedades de evento, **then** nenhum campo de saúde ou PII presente.
5. **Given** owner atualiza primaryCta na config, **then** todos os pontos de conversão refletem mudança.

# Test plan

- Unit test de `buildWhatsAppUrl` e `track()` no-op/consent gate
- Teste manual de cliques com devtools
- Verificar lazy load de script terceiro
- Build com provider `none` (default)

# Risks and open questions

- **Bloqueador:** plataforma analytics `[OPEN]`, número WhatsApp `[OPEN]`, URL agendamento `[OPEN]`.
- Spec permanece `blocked` para `ready` até owner definir provider e destinos — implementação estrutural com no-op pode ser feita antecipadamente.
- Texto do consent banner requer revisão legal.

# Definition of done

- [ ] Camada analytics com no-op e adapters stub
- [ ] Eventos cta_click, booking_start, whatsapp_start, nav_click instrumentados
- [ ] CookieConsent condicional implementado
- [ ] Consent gate funcional
- [ ] Config única para destinos de conversão validada
- [ ] Status `ready` após owner fornecer provider e destinos reais
- [ ] Build passa com provider `none`
