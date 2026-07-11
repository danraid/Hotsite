---
id: SPEC-002
title: Header, skip link e navegação por âncoras
category: section
status: ready
---

# Objective

Implementar cabeçalho sticky com identidade de marca, skip link, navegação principal por âncoras internas e menu mobile acessível, integrando CTA primário configurável.

# Context and traceability

- Design document: `docs/designs/2026-07-10-janaina-hollanda-hotsite-design.md`
- Design sections: SEC-header, §7 Navegação do header, §9 Interaction model
- Design requirements: UX-002, PROD-001, PROD-002, A11Y-001
- Depends on: SPEC-001

# Scope

- Componente `SkipLink` apontando para `#main`.
- Componente `SiteHeader` com logo/identidade tipográfica placeholder (`siteName` da config).
- Navegação desktop com links: Início (`#hero`), Atendimentos (`#atendimentos`), Abordagem (`#abordagem`), Sobre (`#sobre`), Como funciona (`#como-funciona`).
- Botão CTA `Agendar uma conversa` usando `primaryCta` de `site.config.ts`.
- Menu mobile: botão hamburger com `aria-expanded`, drawer/panel com trap de foco, fechamento por Esc e ao navegar.
- Comportamento sticky com fundo `color-background-primary` (ou translúcido com fallback sólido).
- `scroll-margin-top` global em elementos com `id` de seção para compensar header sticky.
- Scroll suave para âncoras com fallback sem animação em `prefers-reduced-motion`.
- Integrar `SiteHeader` e `SkipLink` em `BaseLayout` ou `index.astro`.

# Out of scope

- Seções de conteúdo alvo das âncoras (SPEC-003 a SPEC-009).
- Analytics de `cta_click` e `nav_click` (SPEC-012).
- Logo em imagem (usar placeholder tipográfico até asset aprovado).
- Detecção de seção ativa com Intersection Observer (pode ser adicionada em spec de qualidade futura).

# User experience

**Desktop:** logo à esquerda, links de navegação legíveis, CTA destacado à direita. Header permanece visível ao rolar.

**Mobile (≤767px):** logo + CTA compacto visível; links em drawer. CTA primário acessível sem abrir menu. Touch targets ≥ 44px.

Ao clicar um link de navegação, a página rola suavemente até a seção com offset do header. O visitante nunca perde o contexto de onde está.

# Functional requirements

### SPEC-002-FR-001 — Skip link

- **Priority:** Must
- **Source:** A11Y-001, SEC-header

Primeiro elemento focável deve ser link "Ir para o conteúdo" visível apenas em `:focus-visible`, apontando para `#main`.

**Validation:** Tab a partir do carregamento foca skip link; Enter move foco para `<main>`.

### SPEC-002-FR-002 — Links de navegação

- **Priority:** Must
- **Source:** UX-002

Cada item de nav deve usar `<a href="#...">` real (não `onClick` sem link). Destinos: `#hero`, `#atendimentos`, `#abordagem`, `#sobre`, `#como-funciona`.

**Validation:** Cmd/Ctrl+click abre âncora em nova aba; middle-click funciona.

### SPEC-002-FR-003 — CTA no header

- **Priority:** Must
- **Source:** PROD-001, PROD-002

Botão `Agendar uma conversa` no header consome `site.config.ts` `primaryCta`. Se `external: true`, usar `target="_blank"` e `rel="noopener noreferrer"`.

**Validation:** Label exato conforme config; href não hard-coded no componente.

### SPEC-002-FR-004 — Menu mobile

- **Priority:** Must
- **Source:** SEC-header

Botão menu com `aria-label="Abrir menu"` / `aria-label="Fechar menu"` e `aria-expanded`. Drawer fecha com Esc, clique fora e após seleção de link.

**Validation:** Navegação por teclado completa no drawer; foco não escapa para conteúdo atrás quando aberto.

### SPEC-002-FR-005 — Scroll margin

- **Priority:** Must
- **Source:** §9 Interaction model

Seções com `id` devem ter `scroll-margin-top` ≥ altura do header sticky.

**Validation:** Ao clicar nav link, heading da seção não fica oculto sob o header.

# Non-functional requirements

### SPEC-002-NFR-001 — Sticky sem layout shift

- **Priority:** Must
- **Source:** PERF-001

Header sticky não deve causar CLS ao fixar. Altura do header deve ser estável.

**Validation:** CLS do header ≈ 0 em Lighthouse após implementação completa.

### SPEC-002-NFR-002 — Reduced motion

- **Priority:** Must
- **Source:** SEC-header

Scroll suave desativado quando `prefers-reduced-motion: reduce`.

**Validation:** Com reduced motion, navegação por âncora é instantânea.

# Content contract

| Elemento | Fonte | Texto |
|---|---|---|
| Skip link | Design / A11Y-001 | Ir para o conteúdo |
| Nav: Início | Design §7 | Início |
| Nav: Atendimentos | Design §7 | Atendimentos |
| Nav: Abordagem | Design §7 | Abordagem |
| Nav: Sobre | Design §7 | Sobre |
| Nav: Como funciona | Design §7 | Como funciona |
| CTA header | `content-inventory.md` | Agendar uma conversa |
| Logo placeholder | `site.config.ts` `siteName` | Janaína Hollanda |

Não inventar labels adicionais.

# Visual and responsive behavior

- Fundo: `--color-background-primary`; borda inferior sutil opcional com `--color-accent-sage`.
- Links nav: `--color-text-primary`; hover/focus com `--color-brand-primary`.
- CTA: `PrimaryButton` do SPEC-001.
- Breakpoint drawer: 768px.
- `z-index` do header documentado; drawer acima do conteúdo.

# Technical contract

- `SiteHeader.astro` — componente principal.
- `SkipLink.astro` — componente isolado.
- `NavLink.astro` — link reutilizável com variantes inline/drawer.
- Script mínimo client-side **apenas** para menu mobile (vanilla JS ou `<script>` Astro); preferir progressive enhancement.
- Itens de navegação definidos em `site.config.ts` `navigation[]` com `{ label, href }`.
- Nenhuma dependência de routing client-side.

# Expected file changes

- `src/components/SiteHeader.astro`
- `src/components/SkipLink.astro`
- `src/components/NavLink.astro`
- `src/config/site.config.ts` (adicionar `navigation`)
- `src/styles/global.css` (scroll-margin-top, scroll-behavior condicional)
- `src/layouts/BaseLayout.astro` ou `src/pages/index.astro` (integração)

# Analytics and SEO impact

- Preparar atributos `data-cta-location="header"` e `data-nav-label` nos links para SPEC-012.
- Navegação por âncora não altera URL (aceitável na v1); não indexa fragmentos separadamente.

# Accessibility requirements

- `<header>` e `<nav aria-label="Principal">`.
- Botão menu: `aria-controls` apontando para id do drawer.
- Foco visível em todos os controles.
- Drawer: `role="dialog"` ou `nav` com `aria-modal="true"` se overlay.
- Informação de contato não pertence ao header nesta spec.

# Acceptance criteria

1. **Given** página com header implementado, **when** visitante pressiona Tab, **then** skip link é o primeiro foco visível.
2. **Given** viewport desktop, **when** clica "Atendimentos", **then** viewport rola para `#atendimentos` com heading visível abaixo do header.
3. **Given** viewport mobile, **when** abre menu e pressiona Esc, **then** menu fecha e foco retorna ao botão menu.
4. **Given** `prefers-reduced-motion: reduce`, **when** clica link de nav, **then** scroll é instantâneo.
5. **Given** `primaryCta.href` alterado na config, **when** página recarrega, **then** CTA do header aponta para novo destino.

# Test plan

- Navegação exclusiva por teclado: skip link → nav → drawer mobile → CTA
- Smoke 320px / 768px / 1280px
- Verificar `aria-expanded` ao abrir/fechar menu
- `npm run build` sem erros

# Risks and open questions

- Altura exata do header depende do logo final; `scroll-margin-top` pode precisar ajuste quando logo imagem for adicionada.
- Destino do CTA primário ainda `[OPEN]`; placeholder aceitável até SPEC-012.

# Definition of done

- [ ] Skip link funcional e acessível
- [ ] Header sticky com nav desktop e drawer mobile
- [ ] Todos os links de nav apontam para âncoras corretas
- [ ] CTA consome config central
- [ ] `scroll-margin-top` aplicado
- [ ] Build e lint passam
