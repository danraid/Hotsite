---
id: SPEC-011
title: SEO, metadata social e favicon
category: quality
status: ready
---

# Objective

Configurar metadata HTML completa, Open Graph, Twitter Card, favicon e estrutura semântica de headings para a homepage, usando valores da config central com placeholders documentados para URL canônica e imagem OG.

# Context and traceability

- Design document: `docs/designs/2026-07-10-janaina-hollanda-hotsite-design.md`
- Design sections: §15 SEO and social metadata
- Design requirements: SEO-001
- Depends on: SPEC-001, SPEC-003

# Scope

- Componente ou partial `SeoHead.astro` consumindo `site.config.ts` `metadata`.
- Campos obrigatórios:
  - `<title>`
  - `<meta name="description">`
  - `<link rel="canonical">`
  - `<html lang="pt-BR">` (já em BaseLayout — validar)
  - Open Graph: `og:title`, `og:description`, `og:image`, `og:url`, `og:locale`, `og:type`
  - Twitter: `summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`
- Valores default de title/description baseados no design (editáveis na config).
- Favicon: `public/favicon.svg` placeholder minimal (inicial tipográfica "JH" ou folha estilizada — sem logo final).
- `public/og-image.jpg` placeholder ou instrução README até asset aprovado — dimensões recomendadas 1200×630.
- JSON-LD **omitido na v1** até credenciais verificadas (design §15); preparar arquivo comentado `src/config/structured-data.ts` vazio com TODO.
- Integrar `SeoHead` em `BaseLayout`.

# Out of scope

- JSON-LD Person/ProfessionalService ativo (credenciais não verificadas).
- Pesquisa de keywords.
- Sitemap e robots.txt (pode ser SPEC futura de release).
- Blog ou páginas adicionais além de privacidade.

# User experience

Visitante não vê metadata diretamente; impacto em compartilhamento social e resultados de busca — preview card coerente com tom profissional.

# Functional requirements

### SPEC-011-FR-001 — Title e description

- **Priority:** Must
- **Source:** SEO-001

Default title: `Janaína Hollanda — Acompanhamento terapêutico e desenvolvimento pessoal`

Default description: derivada do parágrafo de apoio do hero, truncada a ≤ 160 caracteres com reticências unicode `…` se necessário.

**Validation:** Inspeção do `<head>` gerado.

### SPEC-011-FR-002 — Canonical

- **Priority:** Must
- **Source:** SEO-001

`metadata.canonical` na config; placeholder `https://example.com` com comentário TODO até domínio definido.

**Validation:** Tag presente; valor vem da config.

### SPEC-011-FR-003 — Open Graph

- **Priority:** Must
- **Source:** SEO-001

Todas as tags OG listadas no escopo; `og:locale` = `pt_BR`.

**Validation:** Ferramenta de debug OG ou inspeção manual.

### SPEC-011-FR-004 — Favicon

- **Priority:** Should
- **Source:** design §10 assets

`<link rel="icon">` apontando para favicon em `public/`.

**Validation:** Favicon carrega sem 404.

# Non-functional requirements

### SPEC-011-NFR-001 — Sem claims extras em metadata

- **Priority:** Must
- **Source:** legal-and-compliance

Description não deve adicionar garantias ou claims não presentes no copy aprovado.

**Validation:** Revisão textual da description vs hero copy.

# Content contract

`site.config.ts` `metadata`:

| Campo | Default |
|---|---|
| title | Janaína Hollanda — Acompanhamento terapêutico e desenvolvimento pessoal |
| description | (truncado do hero support copy) |
| canonical | https://example.com (TODO) |
| ogImage | /og-image.jpg |
| siteName | Janaína Hollanda |

# Visual and responsive behavior

N/A — metadata não afeta layout visual.

# Technical contract

- `src/components/SeoHead.astro`
- `src/config/site.config.ts` (metadata block)
- `public/favicon.svg`
- `public/og-image.jpg` ou placeholder SVG
- `src/config/structured-data.ts` (stub comentado)

Astro: usar API de `Astro.props` ou import direto da config no layout.

# Expected file changes

- `src/components/SeoHead.astro`
- `src/layouts/BaseLayout.astro`
- `src/config/site.config.ts`
- `public/favicon.svg`
- `public/og-image.jpg` (ou placeholder)
- `src/config/structured-data.ts` (stub)

# Analytics and SEO impact

- Impacto direto em indexação e compartilhamento.
- Canonical incorreto prejudica SEO — destacar TODO até domínio real.

# Accessibility requirements

- `title` descritivo e único.
- `lang="pt-BR"` no html.
- N/A para contraste.

# Acceptance criteria

1. **Given** build de produção, **when** HTML da homepage é inspecionado, **then** title, description, canonical e tags OG estão presentes.
2. **Given** config metadata alterada, **then** head reflete novos valores sem editar SeoHead.
3. **Given** structured-data stub, **then** nenhum JSON-LD inválido ou com credenciais não verificadas é emitido.
4. **Given** favicon path, **then** navegador carrega ícone sem 404.

# Test plan

- Inspeção do HTML gerado em `dist/`
- Validador de meta tags (manual ou ferramenta)
- Verificar length da description ≤ 160
- Build

# Risks and open questions

- `canonical` e `og-image` finais `[OPEN]` até domínio e asset aprovados.
- JSON-LD adiado — spec futura quando credenciais verificadas.

# Definition of done

- [ ] SeoHead integrado no layout
- [ ] Metadata configurável
- [ ] OG e Twitter tags completas
- [ ] Favicon placeholder
- [ ] JSON-LD não publicado prematuramente
- [ ] Build passa
