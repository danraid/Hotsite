---
id: SPEC-003
title: Seção Hero
category: section
status: ready
---

# Objective

Implementar a seção hero com headline, copy de apoio, CTA primário de agendamento e CTA secundário de exploração de atendimentos, como único `<h1>` da página.

# Context and traceability

- Design document: `docs/designs/2026-07-10-janaina-hollanda-hotsite-design.md`
- Design sections: SEC-hero
- Design requirements: PROD-001, CONTENT-001, UX-001
- Depends on: SPEC-001, SPEC-002

# Scope

- Componente `HeroSection.astro` com `id="hero"`.
- Headline como `<h1>` com `text-wrap: balance`.
- Parágrafo de apoio via `Prose`.
- CTA primário: `Agendar uma conversa` → `site.config.ts` `primaryCta`.
- CTA secundário: `Conhecer os atendimentos` → `#atendimentos`.
- Layout desktop: headline + copy + CTAs; imagem ambiental opcional apenas se asset aprovado existir (omitir na v1 se ausente).
- Integrar na `index.astro` como primeira seção dentro de `<main>`.

# Out of scope

- Imagem hero obrigatória (omitir se asset não fornecido).
- Analytics `cta_click` (SPEC-012).
- Metadata SEO (SPEC-011).

# User experience

**Desktop:** headline serifada grande, copy com largura máxima ~65ch, CTAs lado a lado com espaçamento confortável.

**Mobile:** stack vertical; CTAs full-width ou empilhados; sem imagem pesada above-the-fold.

Tom calmo; nenhum elemento de urgência ou animação chamativa.

# Functional requirements

### SPEC-003-FR-001 — Headline única

- **Priority:** Must
- **Source:** SEC-hero

A página deve conter exatamente um `<h1>` nesta seção.

**Validation:** Auditoria DOM confirma um único `h1`.

### SPEC-003-FR-002 — Copy fornecido

- **Priority:** Must
- **Source:** CONTENT-001, `content-inventory.md`

Textos exatos do inventário:

- **Headline:** Cuidar da mente também é aprender a olhar para si com mais consciência.
- **Apoio:** Um espaço terapêutico, reservado, de acolhimento, escuta e desenvolvimento pessoal para quem deseja ter mais saúde mental, compreender suas emoções, reconhecer padrões e construir uma vida com mais sentido, equilíbrio e autenticidade.

**Validation:** Diff de conteúdo contra `content-inventory.md` sem alterações não autorizadas.

### SPEC-003-FR-003 — CTAs

- **Priority:** Must
- **Source:** PROD-001

- Primário: label `Agendar uma conversa`, destino `primaryCta.href`.
- Secundário: label `Conhecer os atendimentos`, destino `#atendimentos`.

**Validation:** Labels exatos; primário usa config; secundário é âncora interna.

# Non-functional requirements

### SPEC-003-NFR-001 — LCP

- **Priority:** Must
- **Source:** PERF-001

Sem imagem hero na v1, LCP deve ser o texto/heading. Não carregar JS adicional nesta seção.

**Validation:** Seção não adiciona islands hidratados.

### SPEC-003-NFR-002 — Mobile legibility

- **Priority:** Must
- **Source:** UX-001

Headline legível a 320px sem truncamento que perca significado.

**Validation:** Smoke 320px.

# Content contract

Conteúdo em `src/content/hero.ts` ou `hero.json` importado pelo componente — não hard-coded no markup sem arquivo de conteúdo.

| Campo | Status | Fonte |
|---|---|---|
| headline | provided | content-inventory |
| supportingCopy | provided | content-inventory |
| primaryCtaLabel | provided | content-inventory |
| secondaryCtaLabel | provided | content-inventory |

# Visual and responsive behavior

- Fundo: `--color-background-primary`.
- Headline: fonte heading (Cormorant), `--color-brand-primary`.
- Body: `--color-text-primary`.
- CTAs: `PrimaryButton` + `SecondaryButton`.
- Padding vertical: `--space-section-y`.
- Desktop ≥768px: CTAs em linha com gap 1rem.
- Mobile: CTAs empilhados, largura 100%.

# Technical contract

- `src/components/sections/HeroSection.astro`
- `src/content/hero.ts`
- Consumo de `site.config.ts` para CTA primário
- Atributo `data-cta-location="hero"` nos CTAs (para SPEC-012)
- Atributo `data-section-id="hero"` na section

# Expected file changes

- `src/components/sections/HeroSection.astro`
- `src/content/hero.ts`
- `src/pages/index.astro` (import HeroSection)

# Analytics and SEO impact

- `data-cta-location="hero"` preparado para `cta_click`.
- `<h1>` contribui para SEO on-page (metadata em SPEC-011).

# Accessibility requirements

- Hierarquia: `h1` seguido de parágrafo em `Prose`.
- CTAs com texto visível (não icon-only).
- Contraste AA em headline e body.
- Se imagem futura for decorativa: `alt=""` e dimensões explícitas.

# Acceptance criteria

1. **Given** homepage carregada, **when** inspecionada, **then** hero exibe headline e copy exatos do inventário.
2. **Given** visitante clica CTA primário, **then** navega para `primaryCta.href` da config.
3. **Given** visitante clica CTA secundário, **then** viewport move para `#atendimentos`.
4. **Given** viewport 320px, **then** conteúdo hero é legível sem overflow horizontal.
5. **Given** auditoria a11y, **then** existe exatamente um `h1`.

# Test plan

- Comparação literal do copy com `content-inventory.md`
- Smoke responsivo
- Navegação por teclado até ambos CTAs
- `npm run build`

# Risks and open questions

- Imagem ambiental pode ser adicionada em spec futura quando asset for aprovado.
- Termo "saúde mental" no copy está `provided`; revisão profissional é gate de lançamento, não de implementação.

# Definition of done

- [ ] HeroSection renderizada na homepage
- [ ] Copy correto e externalizado em arquivo de conteúdo
- [ ] CTAs funcionais
- [ ] Um único h1 na página
- [ ] Build passa
