---
id: SPEC-008
title: Seção Atendimentos — três modalidades de serviço
category: section
status: ready
---

# Objective

Implementar a seção de serviços com três cards (Atendimento individual, Constelação Familiar, Vivências e workshops), cada um com descrição e CTA de exploração.

# Context and traceability

- Design document: `docs/designs/2026-07-10-janaina-hollanda-hotsite-design.md`
- Design sections: SEC-atendimentos
- Design requirements: CONTENT-001, PROD-002
- Depends on: SPEC-001

# Scope

- Componente `ServicesSection.astro` com `id="atendimentos"`.
- `<h2>`: Caminhos diferentes para momentos distintos
- Três `ServiceCard` com âncoras:
  - `id="atendimento-individual"`
  - `id="constelacao-familiar"`
  - `id="vivencias"`
- Copy e CTAs verbatim do inventário por serviço.
- Destinos CTA na v1:
  - Individual → `#atendimento-individual` (scroll in-page)
  - Constelação → `#constelacao-familiar`
  - Vivências → `#vivencias` ou `site.config.ts` `workshopsUrl` se definido
- Integrar em `index.astro` após Sobre.

# Out of scope

- Páginas de detalhe separadas por serviço.
- Calendário dinâmico de workshops.
- Preços.
- Analytics (SPEC-012).

# User experience

**Desktop:** grid de 3 cards em `--color-surface-warm`; 3 colunas iguais ≥1024px; 1+2 ou stack conforme espaço.

**Mobile:** cards empilhados; touch targets ≥ 44px nos links.

Cards com hover sutil (elevação ou borda — sem bounce).

# Functional requirements

### SPEC-008-FR-001 — Três serviços

- **Priority:** Must
- **Source:** `content-inventory.md`

Cada card contém: título (h3), parágrafos descritivos e CTA com label exato:

| Serviço | CTA |
|---|---|
| Atendimento individual | Conhecer o atendimento individual |
| Constelação Familiar | Conhecer a Constelação Familiar |
| Vivências e workshops | Conhecer as próximas vivências |

**Validation:** Três `<article>` com conteúdo completo do inventário.

### SPEC-008-FR-002 — Âncoras

- **Priority:** Must
- **Source:** SEC-atendimentos

IDs de âncora nos cards conforme design.

**Validation:** Links `#atendimentos` do hero e header rolam para seção; sub-âncoras existem.

### SPEC-008-FR-003 — ServiceCard reutilizável

- **Priority:** Must
- **Source:** §12 Component inventory

`ServiceCard` aceita `id`, `title`, `description[]`, `ctaLabel`, `ctaHref`.

**Validation:** Três instâncias sem duplicar markup.

# Non-functional requirements

### SPEC-008-NFR-001 — Semântica article

- **Priority:** Must
- **Source:** SEC-atendimentos

Cada card é `<article>` com `h3` único por card.

**Validation:** Inspeção de markup.

# Content contract

`src/content/atendimentos.ts`:

- `heading`
- `services[]`: `{ id, title, paragraphs[], ctaLabel, ctaHref }`
- `contentStatus: 'needs-review'`

Copy descritivo verbatim do inventário para cada serviço.

# Visual and responsive behavior

- Cards: fundo `--color-surface-warm`, padding `--space-block`, border-radius sutil.
- Grid gap: 1.5rem.
- CTA em cada card: `SecondaryButton` ou link estilizado.
- Section `variant="default"`.

# Technical contract

- `src/components/sections/ServicesSection.astro`
- `src/components/ServiceCard.astro`
- `src/content/atendimentos.ts`
- `site.config.ts`: campo opcional `workshopsUrl` para vivências
- `data-section-id="atendimentos"`

# Expected file changes

- `src/components/sections/ServicesSection.astro`
- `src/components/ServiceCard.astro`
- `src/content/atendimentos.ts`
- `src/config/site.config.ts` (workshopsUrl opcional)
- `src/pages/index.astro`

# Analytics and SEO impact

- `data-service-name` em cada card para futuro `service_view`.

# Accessibility requirements

- Links com texto descritivo (não "Saiba mais").
- Contraste AA em cards.
- Foco visível nos CTAs dos cards.

# Acceptance criteria

1. **Given** seção atendimentos, **then** h2 e 3 cards com copy do inventário.
2. **Given** hero CTA "Conhecer os atendimentos", **then** scroll para `#atendimentos`.
3. **Given** cada card, **then** CTA label corresponde à tabela do design.
4. **Given** 320px, **then** cards empilhados sem overflow.

# Test plan

- Diff de copy por serviço
- Navegação âncora do hero
- Touch target size check
- Build

# Risks and open questions

- `Conhecer as próximas vivências` — destino externo `[OPEN]`; usar `#vivencias` até `workshopsUrl` definido.
- Descrições de serviço `needs-review` antes de lançamento.

# Definition of done

- [ ] ServicesSection com 3 cards
- [ ] ServiceCard reutilizável
- [ ] Âncoras corretas
- [ ] Conteúdo externalizado
- [ ] Build passa
