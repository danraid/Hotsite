---
id: SPEC-001
title: Fundação do projeto — scaffold, tokens e primitivos compartilhados
category: scaffold
status: ready
---

# Objective

Estabelecer a base técnica e visual do hotsite Janaína Hollanda: scaffold Astro com TypeScript, tokens de design, layout raiz, configuração central de site e componentes UI compartilhados reutilizáveis pelas specs de seção.

# Context and traceability

- Design document: `docs/designs/2026-07-10-janaina-hollanda-hotsite-design.md`
- Design sections: §11 Visual direction, §12 Component inventory, §13 Technical architecture
- Design decisions: DEC-002 (stack), DEC-003 (tipografia), DEC-004 (config central)
- Design requirements: TECH-001, TECH-002, VISUAL-001, VISUAL-002, UX-001, PROD-002
- Depends on: nenhuma

# Scope

- Inicializar projeto **Astro 5** com TypeScript e build estático (`output: 'static'`).
- Configurar tooling mínimo: ESLint, Prettier, scripts `dev`, `build`, `preview`, `lint`, `typecheck`.
- Definir tokens CSS em `src/styles/tokens.css` conforme paleta aprovada.
- Definir estilos globais em `src/styles/global.css` (reset mínimo, tipografia base, `prefers-reduced-motion`).
- Carregar fontes **Cormorant Garamond** e **Source Sans 3** via `@fontsource` ou link aprovado com `font-display: swap`.
- Criar `src/config/site.config.ts` com destinos de CTA, contato e metadata (valores placeholder documentados).
- Criar layout raiz `src/layouts/BaseLayout.astro` com `<html lang="pt-BR">`, slot para conteúdo e import de estilos globais.
- Criar página esqueleto `src/pages/index.astro` que compõe `<main id="main">` vazio (seções adicionadas por specs posteriores).
- Implementar primitivos compartilhados:
  - `PrimaryButton`
  - `SecondaryButton`
  - `Section` (variantes: `default`, `warm-surface`, `emphasis`)
  - `Prose` (tipografia long-form, max-width 65ch)
  - `Container` (max-width 72rem)
- Estrutura de conteúdo em `src/content/` preparada para arquivos por seção.

# Out of scope

- Header, navegação e skip link (SPEC-002).
- Qualquer seção de conteúdo da homepage (SPEC-003 a SPEC-009).
- Footer e páginas legais (SPEC-010).
- Metadata SEO completa e OG (SPEC-011).
- Integrações de analytics, WhatsApp wiring e consent (SPEC-012).
- Imagens finais, logo e favicon.

# User experience

O visitante ainda não vê conteúdo de negócio nesta spec. O resultado é uma página esqueleto com tipografia, cores e espaçamento corretos — fundo off-white quente, texto legível, ritmo calmo. Botões compartilhados devem transmitir confiança e sobriedade (verde oliva primário, sem animações chamativas).

# Functional requirements

### SPEC-001-FR-001 — Scaffold Astro estático

- **Priority:** Must
- **Source:** DEC-002, `technical-constraints.md`

O projeto deve inicializar com Astro 5, TypeScript e geração estática, produzindo build de produção sem erros.

**Validation:** `npm run build` conclui com exit code 0.

### SPEC-001-FR-002 — Configuração central de site

- **Priority:** Must
- **Source:** PROD-002, DEC-004

`site.config.ts` deve exportar: `siteName`, `primaryCta` (`label`, `href`, `external`), `whatsapp` (`number`, `prefillMessage`, `enabled`), `contact` (`email`, `phone`), `metadata` (`title`, `description`, `canonical`, `ogImage`), `navigation` (âncoras futuras).

Valores placeholder devem usar strings claramente marcadas (`#TODO-booking-url`) e comentário indicando substituição obrigatória antes do lançamento.

**Validation:** Alterar `primaryCta.href` em config reflete em qualquer componente que consuma a config em specs posteriores sem editar o componente.

### SPEC-001-FR-003 — Primitivos de botão

- **Priority:** Must
- **Source:** §12 Component inventory

`PrimaryButton` e `SecondaryButton` devem aceitar `href`, `label`, `external` (boolean) e renderizar `<a>` estilizado como botão (não `<button>` para navegação).

**Validation:** Story ou página de prova renderiza ambos os botões com estados hover/focus visíveis.

### SPEC-001-FR-004 — Section e Prose

- **Priority:** Must
- **Source:** §12 Component inventory

`Section` aceita `id`, `title` (opcional), `variant` e slot de conteúdo. `Prose` limita largura a 65ch e aplica escala tipográfica de corpo.

**Validation:** Section com `id="test"` renderiza elemento `<section>` semântico com padding vertical conforme token `space-section-y`.

# Non-functional requirements

### SPEC-001-NFR-001 — Tokens de paleta aprovada

- **Priority:** Must
- **Source:** VISUAL-001, `brand-guidelines.md`

Todas as cores devem ser expostas como custom properties CSS com nomes do design doc (`--color-brand-primary`, etc.). Nenhum valor HEX solto em componentes.

**Validation:** Busca por `#3E4A36` fora de `tokens.css` retorna zero ocorrências.

### SPEC-001-NFR-002 — Contraste WCAG AA

- **Priority:** Must
- **Source:** VISUAL-002

Combinações texto primário/fundo primário e texto em botão primário devem atingir contraste ≥ 4.5:1.

**Validation:** Ferramenta de contraste confirma AA para pares usados na v1.

### SPEC-001-NFR-003 — Reduced motion

- **Priority:** Must
- **Source:** `brand-guidelines.md`, `technical-constraints.md`

`@media (prefers-reduced-motion: reduce)` deve desabilitar transições decorativas globais.

**Validation:** Inspeção de `global.css` confirma regra presente.

### SPEC-001-NFR-004 — Payload JS mínimo

- **Priority:** Must
- **Source:** TECH-001

Primitivos devem ser componentes Astro estáticos sem hidratação client-side, salvo necessidade futura documentada.

**Validation:** Build não inclui islands/hidratação para primitivos desta spec.

### SPEC-001-NFR-005 — Mobile-first base

- **Priority:** Must
- **Source:** UX-001

Container e tipografia devem ser legíveis a 320px sem scroll horizontal.

**Validation:** Smoke em 320px sem overflow-x.

# Content contract

Nenhum copy de marketing nesta spec. Apenas strings de config placeholder em `site.config.ts`.

# Visual and responsive behavior

| Token | Valor |
|---|---|
| `--space-section-y` | 5rem desktop / 3.5rem mobile |
| `--space-block` | 1.5rem |
| `--container-max` | 72rem |
| `--content-max` | 65ch |

| Elemento | Desktop | Mobile |
|---|---|---|
| `h1` (base) | 2.5rem | 2rem |
| `h2` (base) | 2rem | 1.75rem |
| Body | 1.125rem / lh 1.7 | 1rem / lh 1.65 |

Estados de botão: hover escurece ~8%, focus com anel `color-accent-gold` 2px, active ~12%, disabled opacidade 50%.

# Technical contract

- **Stack:** Astro 5 + TypeScript + CSS custom properties (sem Tailwind na v1).
- **Package manager:** npm (lockfile commitado).
- **Diretórios:**

```text
src/
  components/ui/       # PrimaryButton, SecondaryButton, Section, Prose, Container
  config/site.config.ts
  content/             # vazio; populado por specs de seção
  layouts/BaseLayout.astro
  pages/index.astro
  styles/tokens.css
  styles/global.css
public/
astro.config.mjs
tsconfig.json
package.json
```

- Fontes via `@fontsource/cormorant-garamond` e `@fontsource/source-sans-3` (pesos 400, 500, 600 apenas).
- `color-scheme: light` no `:root`.
- Sem secrets no repositório.

# Expected file changes

- `package.json`, `package-lock.json`, `astro.config.mjs`, `tsconfig.json`
- `.eslintrc` ou `eslint.config.js`, `.prettierrc` (se não existirem)
- `src/styles/tokens.css`, `src/styles/global.css`
- `src/config/site.config.ts`
- `src/layouts/BaseLayout.astro`
- `src/pages/index.astro`
- `src/components/ui/*.astro`
- `public/` (vazio ou `.gitkeep`)

# Analytics and SEO impact

Nenhum evento nesta spec. Layout define `lang="pt-BR"` apenas. Metadata completa em SPEC-011.

# Accessibility requirements

- `BaseLayout` prepara estrutura para skip link (SPEC-002 insere antes de `<header>`).
- Foco visível em botões via `:focus-visible`.
- `touch-action: manipulation` em controles interativos.
- Sem `outline: none` sem substituto.

# Acceptance criteria

1. **Given** o repositório sem aplicação, **when** SPEC-001 é implementada, **then** `npm install && npm run build` conclui sem erro.
2. **Given** tokens definidos, **when** um componente usa cor de marca, **then** referencia `var(--color-brand-primary)` e não HEX literal.
3. **Given** viewport 320px, **when** a página esqueleto é aberta, **then** não há scroll horizontal.
4. **Given** `prefers-reduced-motion: reduce`, **when** a página carrega, **then** transições decorativas globais estão desativadas.
5. **Given** `site.config.ts` com novo `primaryCta.href`, **when** um botão consome a config, **then** o href atualiza sem alterar o componente.

# Test plan

- `npm run lint` — sem erros
- `npm run typecheck` — sem erros
- `npm run build` — artefato estático gerado
- Inspeção manual de contraste nos pares primários
- Smoke responsivo: 320px, 768px, 1280px
- Verificar ausência de hidratação desnecessária no build output

# Risks and open questions

- DEC-002 ainda `Proposed` no design doc; esta spec **fixa Astro** como decisão de implementação. Rejeição exige revisão da spec.
- Licença futura de Canela/Avenir pode exigir spec de migração tipográfica.
- Placeholders de CTA devem ser substituídos antes do lançamento (SPEC-012).

# Definition of done

- [ ] Projeto Astro inicializado e buildável
- [ ] Tokens e estilos globais aplicados
- [ ] `site.config.ts` com schema tipado e placeholders documentados
- [ ] `BaseLayout` e `index.astro` esqueleto funcionais
- [ ] Primitivos UI compartilhados implementados e reutilizáveis
- [ ] Lint, typecheck e build passam localmente
- [ ] Nenhum copy de negócio inventado
