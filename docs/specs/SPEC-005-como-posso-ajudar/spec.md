---
id: SPEC-005
title: Seção Como posso ajudar
category: section
status: ready
---

# Objective

Implementar a seção "Um olhar para além do sintoma" com lista de tópicos de adequação e disclaimer de cuidado integrado, ajudando o visitante a reconhecer se o acompanhamento se aplica à sua experiência.

# Context and traceability

- Design document: `docs/designs/2026-07-10-janaina-hollanda-hotsite-design.md`
- Design sections: SEC-como-posso-ajudar
- Design requirements: CONTENT-001, CONTENT-002
- Depends on: SPEC-001

# Scope

- Componente `HowICanHelpSection.astro` com `id="como-posso-ajudar"`.
- `<h2>`: Um olhar para além do sintoma
- Dois parágrafos introdutórios do inventário.
- Lista de 18 tópicos via componente `TopicList` (`<ul>`).
- Parágrafo de disclaimer de cuidado integrado.
- Integrar em `index.astro` após Contexto.

# Out of scope

- CTA primário.
- Revisão legal/profissional do copy (gate de lançamento; implementar texto fornecido).
- Analytics (SPEC-012).

# User experience

**Desktop:** intro + lista em uma ou duas colunas com marcadores discretos (bullet customizado em `--color-accent-sage`).

**Mobile:** lista em coluna única com espaçamento entre itens.

Tom informativo, sem alarmismo. Lista escaneável sem perder profundidade.

# Functional requirements

### SPEC-005-FR-001 — Heading e intro

- **Priority:** Must
- **Source:** `content-inventory.md`

Heading e parágrafos introdutórios verbatim do inventário.

**Validation:** Diff contra inventário.

### SPEC-005-FR-002 — Lista de tópicos

- **Priority:** Must
- **Source:** `content-inventory.md`

18 itens exatos da lista fornecida (ansiedade… até maturidade emocional).

**Validation:** Contagem de 18 `<li>`; texto de cada item corresponde ao inventário.

### SPEC-005-FR-003 — Disclaimer integrado

- **Priority:** Must
- **Source:** CONTENT-002

Exibir parágrafo de cuidado integrado do inventário após a lista.

**Validation:** Texto presente verbatim.

# Non-functional requirements

### SPEC-005-NFR-001 — Lista semântica

- **Priority:** Must
- **Source:** SEC-como-posso-ajudar

Usar `<ul>` / `<li>`, não divs estilizadas como lista.

**Validation:** Inspeção de markup.

# Content contract

Arquivo `src/content/como-posso-ajudar.ts`:

- `heading`
- `intro[]` (2 parágrafos)
- `topics[]` (18 strings)
- `integratedCareDisclaimer`

Status do copy: `needs-review` — implementar como fornecido; flag `contentStatus: 'needs-review'` no arquivo.

# Visual and responsive behavior

- Grid de lista: 1 coluna mobile; 2 colunas ≥768px se largura permitir sem comprometer legibilidade.
- Disclaimer em `Prose` com estilo levemente diferenciado (borda esquerda `--color-accent-gold` ou fundo sutil).
- Section variant `default`.

# Technical contract

- `src/components/sections/HowICanHelpSection.astro`
- `src/components/TopicList.astro` (reutilizável)
- `src/content/como-posso-ajudar.ts`
- `data-section-id="como-posso-ajudar"`

# Expected file changes

- `src/components/sections/HowICanHelpSection.astro`
- `src/components/TopicList.astro`
- `src/content/como-posso-ajudar.ts`
- `src/pages/index.astro`

# Analytics and SEO impact

- Conteúdo rico em termos informacionais; sem eventos nesta spec.

# Accessibility requirements

- `h2` seguido de parágrafos e `ul`.
- Itens de lista com pontuação legível por screen reader.
- Contraste AA.
- Linguagem de saúde apresentada de forma informativa, não diagnóstica.

# Acceptance criteria

1. **Given** seção renderizada, **then** heading é "Um olhar para além do sintoma".
2. **Given** lista, **then** contém exatamente 18 tópicos do inventário.
3. **Given** final da seção, **then** disclaimer de cuidado integrado está visível.
4. **Given** 320px, **then** lista legível sem overflow.

# Test plan

- Contagem de itens da lista
- Diff textual vs inventário
- axe scan na seção
- Smoke responsivo

# Risks and open questions

- Copy `needs-review` para terminologia clínica — **não publicar em produção** até aprovação profissional/legal do owner.
- Lista longa em mobile — monitorar altura; sem accordion na v1 conforme design.

# Definition of done

- [ ] Seção com heading, intro, 18 tópicos e disclaimer
- [ ] TopicList reutilizável criado
- [ ] Conteúdo externalizado com flag needs-review
- [ ] Build passa
