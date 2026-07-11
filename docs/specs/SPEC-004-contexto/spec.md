---
id: SPEC-004
title: Seção Contexto / Apresentação
category: section
status: ready
---

# Objective

Implementar a seção de apresentação que gera reconhecimento emocional e introduz o valor do processo terapêutico, com copy long-form editorial e ritmo de leitura calmo.

# Context and traceability

- Design document: `docs/designs/2026-07-10-janaina-hollanda-hotsite-design.md`
- Design sections: SEC-contexto
- Design requirements: CONTENT-001, UX-001
- Depends on: SPEC-001

# Scope

- Componente `ContextSection.astro` com `id="contexto"`.
- `<h2>` de seção (título editorial derivado do propósito ou omitido se copy autoexplicativo — usar título visualmente discreto ou primeira linha como pull-quote).
- Abertura em destaque (pull-quote) com as duas frases de abertura do inventário.
- Corpo com três parágrafos fornecidos via `Prose`.
- Link textual opcional "Como funciona" → `#como-funciona` ao final.
- Integrar em `index.astro` após Hero.

# Out of scope

- CTA primário de agendamento.
- Analytics `section_view` (SPEC-012).
- Imagens decorativas (opcional futuro).

# User experience

**Desktop:** bloco editorial com whitespace generoso; pull-quote com tipografia serifada maior; largura máxima 65ch no corpo.

**Mobile:** parágrafos com espaçamento vertical amplo; pull-quote legível sem overflow.

Sem pressão de conversão — ritmo de leitura reflexivo.

# Functional requirements

### SPEC-004-FR-001 — Copy de abertura

- **Priority:** Must
- **Source:** `content-inventory.md` — Presentation

Exibir verbatim:

> Talvez você não precise apenas continuar seguindo em frente.
>
> Talvez seja o momento de compreender o que tem carregado, por que determinados padrões se repetem e o que, dentro de você, está pedindo uma nova direção.

**Validation:** Texto idêntico ao inventário.

### SPEC-004-FR-002 — Copy de corpo

- **Priority:** Must
- **Source:** `content-inventory.md`

Três parágrafos do inventário (desde "Em muitos momentos…" até "…mais consciente, consistente e integrada.").

**Validation:** Conteúdo em arquivo `src/content/contexto.ts` correspondente ao inventário.

### SPEC-004-FR-003 — Link opcional

- **Priority:** Should
- **Source:** SEC-contexto

Link textual ao final: label sugerido `Como funciona` → `#como-funciona`.

**Validation:** Link presente, não estilizado como botão primário.

# Non-functional requirements

### SPEC-004-NFR-001 — Hierarquia semântica

- **Priority:** Must
- **Source:** TECH-002

Section com `<section id="contexto">`; pull-quote em `<blockquote>` ou `<p>` com classe de destaque; corpo em `Prose`.

**Validation:** Markup semântico validado por inspeção.

# Content contract

| Campo | Status |
|---|---|
| opening | provided |
| paragraphs[] | provided (3 itens) |
| optionalLinkLabel | design default: Como funciona |

# Visual and responsive behavior

- Pull-quote: fonte heading, tamanho entre h2 e body, `--color-brand-primary` ou `--color-text-primary`.
- Separador opcional com linha `--color-accent-gold` (1px, largura curta).
- Section padding: `--space-section-y`.

# Technical contract

- `src/components/sections/ContextSection.astro`
- `src/content/contexto.ts`
- `data-section-id="contexto"`

# Expected file changes

- `src/components/sections/ContextSection.astro`
- `src/content/contexto.ts`
- `src/pages/index.astro`

# Analytics and SEO impact

- `data-section-id="contexto"` para futuro `section_view`.
- Conteúdo long-form contribui para palavras-chave informacionais.

# Accessibility requirements

- Pull-quote não deve ser único `h2` se não for título — usar `<h2 class="visually-hidden">` ou título explícito "Apresentação" para estrutura.
- Contraste AA em pull-quote e body.
- Link com texto descritivo.

# Acceptance criteria

1. **Given** homepage, **when** seção contexto renderiza, **then** abertura e três parágrafos correspondem ao inventário.
2. **Given** visitante clica link "Como funciona", **then** navega para `#como-funciona`.
3. **Given** 320px viewport, **then** texto legível sem overflow horizontal.

# Test plan

- Diff de conteúdo vs `content-inventory.md`
- Smoke responsivo
- Verificar hierarquia de headings na página acumulada

# Risks and open questions

- Título visível da seção não fornecido no inventário; usar `<h2>` "Apresentação" ou similar apenas se necessário para a11y — preferir pull-quote como elemento visual sem quebrar hierarquia (h2 genérico visually-hidden aceitável).

# Definition of done

- [ ] Seção renderizada após hero
- [ ] Copy correto e externalizado
- [ ] Link opcional para como-funciona
- [ ] Build passa
