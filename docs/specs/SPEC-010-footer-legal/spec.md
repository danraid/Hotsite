---
id: SPEC-010
title: Footer, identificação profissional e superfícies legais
category: section
status: blocked
---

# Objective

Implementar rodapé com identificação profissional, contato, navegação repetida, links legais e aviso de cuidado integrado, preparando rotas para políticas de privacidade e cookies.

# Context and traceability

- Design document: `docs/designs/2026-07-10-janaina-hollanda-hotsite-design.md`
- Design sections: SEC-footer
- Design requirements: PRIVACY-001, CONTENT-002
- Depends on: SPEC-001

# Scope

- Componente `SiteFooter.astro`.
- Colunas desktop / stack mobile:
  - Identidade: nome profissional, titulação (quando fornecida na config)
  - Navegação: repetição dos links do header
  - Legal: link Privacidade, link Cookies (condicional)
  - Contato: e-mail e/ou telefone/WhatsApp em texto legível
- CTA discreto de agendamento (link textual, não botão dominante).
- Resumo de aviso: acompanhamento não substitui cuidado indicado (1–2 frases da config).
- Página placeholder `src/pages/privacidade.astro` com mensagem "Conteúdo pendente de aprovação legal" — **não inventar política**.
- Integrar footer em `BaseLayout` ou `index.astro`.

# Out of scope

- Redação de política de privacidade ou cookies (owner/legal).
- Titulação ou registro profissional não verificados.
- Analytics (SPEC-012).

# User experience

**Desktop:** 4 colunas legíveis, tom discreto, fundo levemente diferenciado.

**Mobile:** stack com links legais sempre acessíveis sem scroll excessivo.

Informação de contato em texto — não apenas ícones.

# Functional requirements

### SPEC-010-FR-001 — Identificação

- **Priority:** Must
- **Source:** SEC-footer

Exibir `site.config.ts` `footer.professionalName` e `footer.professionalTitle` quando definidos; omitir title se vazio.

**Validation:** Nenhum título regulado inventado.

### SPEC-010-FR-002 — Link privacidade

- **Priority:** Must
- **Source:** PRIVACY-001

Link "Privacidade" → `/privacidade`. Página existe mesmo como placeholder.

**Validation:** Link não retorna 404 em build estático.

### SPEC-010-FR-003 — Contato

- **Priority:** Must
- **Source:** SEC-footer

Exibir email e/ou telefone da config quando definidos.

**Validation:** Contato visível como texto.

### SPEC-010-FR-004 — Aviso integrado

- **Priority:** Must
- **Source:** CONTENT-002

Texto curto de disclaimer em `footer.integratedCareNotice` — default: frase derivada do design, não nova redação legal longa.

**Validation:** Aviso presente no footer.

# Non-functional requirements

### SPEC-010-NFR-001 — Bloqueio de lançamento

- **Priority:** Must
- **Source:** design approval blockers

`meta.yaml` status `blocked` até: política de privacidade aprovada, titulação verificada, contato real definido.

Implementação estrutural pode prosseguir com placeholders; **deploy público bloqueado**.

**Validation:** Checklist de lançamento documentado na spec.

# Content contract

`site.config.ts` `footer`:

```ts
{
  professionalName: 'Janaína Hollanda',
  professionalTitle: '', // OPEN — não preencher sem verificação
  email: '', // OPEN
  phone: '', // OPEN
  region: '', // OPEN — presencial
  privacyPolicyPath: '/privacidade',
  cookiesPolicyPath: '/cookies', // opcional
  integratedCareNotice: '...', // texto curto do design
}
```

Não inventar CRP, CRM ou registros.

# Visual and responsive behavior

- Fundo: `--color-surface-warm` ou tom mais escuro sutil do background.
- Texto: `--color-text-primary` e `--color-text-muted` para auxiliar (validar contraste).
- Links: hover com sublinhado ou cor primária.
- Padding vertical: 3rem mobile / 4rem desktop.

# Technical contract

- `src/components/SiteFooter.astro`
- `src/pages/privacidade.astro` (placeholder)
- `src/pages/cookies.astro` (opcional placeholder)
- Extensão de `site.config.ts` com bloco `footer`

# Expected file changes

- `src/components/SiteFooter.astro`
- `src/pages/privacidade.astro`
- `src/config/site.config.ts`
- `src/layouts/BaseLayout.astro`

# Analytics and SEO impact

- Links legais indexáveis quando conteúdo real for adicionado.
- `noindex` em placeholder de privacidade até conteúdo aprovado `[RECOMMENDATION]`.

# Accessibility requirements

- `<footer>` semântico.
- Links com texto descritivo ("Política de privacidade", não "Clique aqui").
- Informação de contato legível por screen reader.

# Acceptance criteria

1. **Given** footer renderizado, **then** link Privacidade leva a `/privacidade`.
2. **Given** config sem professionalTitle, **then** título regulado não aparece inventado.
3. **Given** placeholder privacidade, **then** página indica conteúdo pendente sem texto legal inventado.
4. **Given** aviso integrado na config, **then** visível no footer.

# Test plan

- Build inclui rota `/privacidade`
- Navegação ao link do footer
- Verificar ausência de credenciais inventadas
- Contraste no footer

# Risks and open questions

- **Bloqueador:** política de privacidade, titulação, contato — owner deve fornecer antes de `status: ready` e lançamento.
- Página `/cookies` só necessária se tracking exigir (SPEC-012).

# Definition of done

- [ ] SiteFooter integrado
- [ ] Config footer tipada
- [ ] Rota privacidade placeholder
- [ ] Aviso integrado configurável
- [ ] Status muda para `ready` quando inputs legais forem fornecidos
- [ ] Build passa
