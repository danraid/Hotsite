---
id: SPEC-006
title: Seção Abordagem terapêutica
category: section
status: ready
---

# Objective

Implementar a seção "Conhecimento, escuta e profundidade" descrevendo a integração metodológica do trabalho, com texto long-form estruturado por perspectivas.

# Context and traceability

- Design document: `docs/designs/2026-07-10-janaina-hollanda-hotsite-design.md`
- Design sections: SEC-abordagem
- Design requirements: CONTENT-001
- Depends on: SPEC-001

# Scope

- Componente `ApproachSection.astro` com `id="abordagem"`.
- `<h2>`: Conhecimento, escuta e profundidade
- Corpo long-form com parágrafos do inventário, incluindo menções a TCC, Logoterapia, abordagem transpessoal e sistêmica.
- CTA secundário `Conhecer minha abordagem` — na v1: scroll suave para topo da própria seção (`#abordagem`) ou link in-page sem destino externo; comportamento equivalente a "permanecer na seção".
- Separadores visuais discretos com `--color-accent-gold` entre blocos de perspectiva (opcional se parágrafos já fluem).
- Integrar em `index.astro` após Como posso ajudar.

# Out of scope

- Accordion mobile (preferir texto contínuo na v1).
- Analytics (SPEC-012).
- Subpáginas de detalhe de método.

# User experience

**Desktop:** texto longo legível com subtítulos `h3` implícitos ou parágrafos fortes para cada perspectiva; detalhes dourados em regras/separadores.

**Mobile:** texto contínuo, sem colapso — leitura vertical calma.

# Functional requirements

### SPEC-006-FR-001 — Copy completo

- **Priority:** Must
- **Source:** `content-inventory.md` — Approach

Todos os parágrafos do inventário, do primeiro ("Meu trabalho integra…") ao último ("…compreender ou transformar.").

**Validation:** Diff contra inventário sem omissões.

### SPEC-006-FR-002 — CTA secundário

- **Priority:** Should
- **Source:** SEC-abordagem

Link/botão `Conhecer minha abordagem` visível ao final da seção.

**Validation:** Label exato; não usa CTA primário de agendamento.

### SPEC-006-FR-003 — Métodos mencionados

- **Priority:** Must
- **Source:** content-inventory

Texto deve mencionar: Neurociência, Terapia Cognitivo-Comportamental, Logoterapia, Terapia Transpessoal, abordagem sistêmica — conforme copy fornecido.

**Validation:** Strings presentes no conteúdo renderizado.

# Non-functional requirements

### SPEC-006-NFR-001 — Hierarquia h2 > conteúdo

- **Priority:** Must
- **Source:** SEC-abordagem

Um `h2` na seção; sem `h3` obrigatórios unless copy structure benefits — se usados, devem ser sequenciais sem saltos.

**Validation:** Outline de headings válido na página acumulada.

# Content contract

`src/content/abordagem.ts`:

- `heading`
- `paragraphs[]` (todos os blocos do inventário)
- `ctaLabel`: Conhecer minha abordagem
- `contentStatus`: needs-review

# Visual and responsive behavior

- `Prose` com max-width 65ch.
- Separador: linha 1px `--color-accent-gold`, max-width 4rem, entre grupos de parágrafos (máximo 3 separadores).
- Section padding padrão.

# Technical contract

- `src/components/sections/ApproachSection.astro`
- `src/content/abordagem.ts`
- `data-section-id="abordagem"`
- `data-cta-location="abordagem"` no CTA

# Expected file changes

- `src/components/sections/ApproachSection.astro`
- `src/content/abordagem.ts`
- `src/pages/index.astro`

# Analytics and SEO impact

- Preparado para `cta_click` e `section_view` em SPEC-012.

# Accessibility requirements

- Contraste AA em texto longo.
- CTA com texto visível.
- Sem animação obrigatória para ler conteúdo.

# Acceptance criteria

1. **Given** seção abordagem, **then** h2 e todos os parágrafos do inventário estão presentes.
2. **Given** CTA "Conhecer minha abordagem", **then** está visível e é acionável.
3. **Given** 320px, **then** texto legível sem perda de conteúdo.

# Test plan

- Diff vs content-inventory
- Outline de headings
- Smoke responsivo

# Risks and open questions

- Claims metodológicos `needs-review` — gate de lançamento.
- CTA "Conhecer minha abordagem" sem página destino — comportamento in-page aceito na v1.

# Definition of done

- [ ] Seção abordagem na homepage
- [ ] Copy completo externalizado
- [ ] CTA secundário presente
- [ ] Build passa
