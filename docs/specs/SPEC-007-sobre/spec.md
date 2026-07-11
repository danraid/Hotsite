---
id: SPEC-007
title: Seção Sobre — trajetória de Janaína Hollanda
category: section
status: ready
---

# Objective

Implementar a seção biográfica que estabelece credibilidade humana e profissional, com copy fornecido e slot opcional para retrato quando asset for aprovado.

# Context and traceability

- Design document: `docs/designs/2026-07-10-janaina-hollanda-hotsite-design.md`
- Design sections: SEC-sobre
- Design requirements: CONTENT-001
- Depends on: SPEC-001

# Scope

- Componente `AboutSection.astro` com `id="sobre"`.
- `<h2>`: Uma trajetória dedicada ao estudo da mente, do comportamento humano e dos caminhos de transformação.
- Parágrafos biográficos verbatim do inventário.
- CTA secundário `Conhecer minha trajetória` (in-page na v1).
- Layout editorial: texto + slot imagem opcional (`portraitSrc` em content — null na v1).
- Integrar em `index.astro` após Abordagem.

# Out of scope

- Publicação em produção sem verificação de credenciais (gate explícito).
- Retrato obrigatório na v1.
- Analytics (SPEC-012).

# User experience

**Desktop:** duas colunas quando retrato existir (texto ~60%, imagem ~40%); uma coluna só texto na v1.

**Mobile:** texto primeiro; retrato abaixo se presente.

Evitar pose direta à câmera quando imagem for adicionada.

# Functional requirements

### SPEC-007-FR-001 — Copy biográfico

- **Priority:** Must
- **Source:** `content-inventory.md` — About

Heading e quatro parágrafos do inventário verbatim.

**Validation:** Diff contra inventário.

### SPEC-007-FR-002 — CTA secundário

- **Priority:** Should
- **Source:** SEC-sobre

`Conhecer minha trajetória` ao final da seção.

**Validation:** Label exato.

### SPEC-007-FR-003 — Slot de retrato opcional

- **Priority:** Could
- **Source:** SEC-sobre

Componente aceita `portrait?: { src, alt, width, height }` — renderiza `<img>` apenas quando definido.

**Validation:** Sem portrait em content, nenhuma `<img>` renderizada.

# Non-functional requirements

### SPEC-007-NFR-001 — Gate de credenciais

- **Priority:** Must
- **Source:** design §8 SEC-sobre bloqueador

Arquivo de conteúdo deve incluir `contentStatus: 'needs-review'` e comentário: publicação bloqueada até verificação de credenciais.

**Validation:** Flag presente no source.

# Content contract

`src/content/sobre.ts`:

- `heading`
- `paragraphs[]` (4 itens)
- `ctaLabel`
- `portrait: null` (v1)
- `contentStatus: 'needs-review'`

Credenciais no copy (pós-graduações, Instituto Português de Logoterapia, Constelações Familiares) são **fornecidas mas não verificadas**.

# Visual and responsive behavior

- Layout grid 1fr / 1fr desktop quando imagem presente; gap `--space-block`.
- Imagem: `border-radius` sutil, tratamento warm, dimensões explícitas, `loading="lazy"`.
- Texto em `Prose`.

# Technical contract

- `src/components/sections/AboutSection.astro`
- `src/content/sobre.ts`
- `data-section-id="sobre"`

# Expected file changes

- `src/components/sections/AboutSection.astro`
- `src/content/sobre.ts`
- `src/pages/index.astro`

# Analytics and SEO impact

- Biografia contribui para E-E-A-T; JSON-LD Person em SPEC-011 depende de dados verificados.

# Accessibility requirements

- Quando retrato presente: `alt` descritivo aprovado (não genérico "foto").
- Contraste AA no texto.
- Layout não depende de imagem para compreensão.

# Acceptance criteria

1. **Given** seção sobre, **then** heading e 4 parágrafos correspondem ao inventário.
2. **Given** sem portrait em content, **then** seção renderiza apenas texto sem imagem quebrada.
3. **Given** content file, **then** `contentStatus` é `needs-review`.

# Test plan

- Diff vs inventário
- Render sem imagem
- Smoke layout mobile/desktop

# Risks and open questions

- **Bloqueador de lançamento:** credenciais devem ser verificadas pelo owner antes de deploy público.
- Retrato profissional `[OPEN]` — adicionar quando aprovado sem spec separada se slot já existir.

# Definition of done

- [ ] Seção sobre na homepage
- [ ] Copy externalizado com flag needs-review
- [ ] Slot de retrato opcional implementado
- [ ] CTA secundário presente
- [ ] Build passa
