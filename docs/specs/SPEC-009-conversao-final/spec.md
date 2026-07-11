---
id: SPEC-009
title: Seções de conversão final — Transição, Como funciona e CTA final
category: section
status: ready
---

# Objective

Implementar as três seções finais da narrativa — declaração de transição, processo "Como funciona" com CTA de agendamento, e bloco de CTA final com WhatsApp — completando o funil de conversão da homepage.

# Context and traceability

- Design document: `docs/designs/2026-07-10-janaina-hollanda-hotsite-design.md`
- Design sections: SEC-transicao, SEC-como-funciona, SEC-cta-final
- Design requirements: PROD-001, CONTENT-001, CONTENT-002, PROD-002
- Depends on: SPEC-001

# Scope

### TransitionSection (`id="transicao"`)

- Pull-quote centralizado com as duas frases do inventário.
- Tipografia serifada maior; fundo alternado sutil (`variant="warm-surface"` ou emphasis).
- Sem CTA.

### HowItWorksSection (`id="como-funciona"`)

- Copy do inventário estruturado como `<ol>` de passos lógicos (extrair sequência do texto fornecido).
- CTA primário `Agendar uma conversa inicial` → `site.config.ts` `primaryCta`.
- Incluir menção a presencial/on-line e cuidado integrado do copy.

### FinalCtaSection (`id="cta-final"`)

- Copy do inventário (3 parágrafos).
- CTA primário `Agendar uma conversa` → `primaryCta`.
- CTA secundário `Entrar em contato pelo WhatsApp` → URL derivada de `site.config.ts` `whatsapp`.
- Bloco de destaque visual (`variant="emphasis"`).

Integrar as três seções em `index.astro` após Atendimentos, nesta ordem.

# Out of scope

- Formulário de contato.
- Analytics events (SPEC-012).
- Pop-ups ou urgência.

# User experience

**Transição:** pausa reflexiva; visitante respira na narrativa antes do processo prático.

**Como funciona:** passos claros reduzem fricção; CTA após lista.

**CTA final:** convite gentil sem pressão; WhatsApp como alternativa de menor comprometimento.

**Mobile:** CTAs full-width empilhados no bloco final.

# Functional requirements

### SPEC-009-FR-001 — Transição verbatim

- **Priority:** Must
- **Source:** content-inventory — Transition

> Nem tudo o que você carrega começou em você.
>
> Mas pode ser a partir de você que uma nova história comece.

**Validation:** Texto exato renderizado.

### SPEC-009-FR-002 — Como funciona

- **Priority:** Must
- **Source:** content-inventory — How it works

Todo o copy da seção, incluindo conversa inicial, individualização, presencial/on-line, discrição e cuidado integrado.

**Validation:** Diff contra inventário; presença de `<ol>` ou estrutura sequencial equivalente.

### SPEC-009-FR-003 — CTA como funciona

- **Priority:** Must
- **Source:** PROD-001

`Agendar uma conversa inicial` usando `primaryCta` da config (mesmo destino do CTA primário global).

**Validation:** Label exato; href da config.

### SPEC-009-FR-004 — CTA final

- **Priority:** Must
- **Source:** PROD-001, content-inventory

- Primário: `Agendar uma conversa` → `primaryCta`
- Secundário: `Entrar em contato pelo WhatsApp` → `whatsapp` URL builder

**Validation:** Ambos CTAs visíveis e acionáveis.

### SPEC-009-FR-005 — WhatsApp URL

- **Priority:** Must
- **Source:** design §14

Formato `https://wa.me/{number}?text={encodedPrefill}` quando `whatsapp.enabled` e `number` definidos; se não definido, CTA secundário renderiza desabilitado ou oculto com comentário TODO — **não inventar número**.

**Validation:** Sem número placeholder falso em produção; usar `#TODO` desabilita link.

# Non-functional requirements

### SPEC-009-NFR-001 — Terceiro CTA primário

- **Priority:** Must
- **Source:** PROD-001, design §5

Página deve ter instâncias de CTA primário em hero (SPEC-003), como-funciona e cta-final — máximo 3 conforme design.

**Validation:** Contagem de `data-cta-type="primary"` na página = 3.

# Content contract

- `src/content/transicao.ts`
- `src/content/como-funciona.ts` (`contentStatus: needs-review`)
- `src/content/cta-final.ts`

# Visual and responsive behavior

| Seção | Tratamento |
|---|---|
| Transição | Centralizado, serif, padding generoso |
| Como funciona | Lista ordenada, CTA após lista |
| CTA final | Fundo `--color-surface-warm` ou inversão com primário; botões empilhados mobile |

# Technical contract

- `src/components/sections/TransitionSection.astro`
- `src/components/sections/HowItWorksSection.astro`
- `src/components/sections/FinalCtaSection.astro`
- `src/components/ProcessSteps.astro` (opcional wrapper para `<ol>`)
- Helper `buildWhatsAppUrl(config)` em `src/utils/whatsapp.ts`
- `data-cta-location` em cada CTA: `como-funciona`, `cta-final`

# Expected file changes

- `src/components/sections/TransitionSection.astro`
- `src/components/sections/HowItWorksSection.astro`
- `src/components/sections/FinalCtaSection.astro`
- `src/components/ProcessSteps.astro`
- `src/utils/whatsapp.ts`
- `src/content/transicao.ts`, `como-funciona.ts`, `cta-final.ts`
- `src/pages/index.astro`

# Analytics and SEO impact

- Preparado para `cta_click`, `booking_start`, `whatsapp_start` (SPEC-012).

# Accessibility requirements

- `<ol>` para passos em como-funciona.
- Contraste verificado no bloco final (ambos botões).
- WhatsApp link com texto visível, não só ícone.
- `blockquote` ou `p` para transição com contraste AA.

# Acceptance criteria

1. **Given** homepage completa até esta spec, **then** transição exibe copy exato.
2. **Given** como-funciona, **then** copy completo e CTA "Agendar uma conversa inicial" funcional.
3. **Given** cta-final, **then** ambos CTAs presentes com labels exatos.
4. **Given** whatsapp.number vazio na config, **then** CTA WhatsApp não aponta para número inventado.
5. **Given** contagem de CTAs primários, **then** total = 3 na página.

# Test plan

- Diff de copy das três seções
- Teste de buildWhatsAppUrl com número de teste em dev only
- Verificar CTAs com config placeholder
- Smoke mobile nos botões finais

# Risks and open questions

- WhatsApp number `[OPEN]` — spec implementa mecânica, não o número.
- Processo descrito `needs-review` — gate de lançamento.

# Definition of done

- [ ] Três seções integradas na ordem correta
- [ ] Copy externalizado
- [ ] CTAs de agendamento usam config
- [ ] Helper WhatsApp implementado
- [ ] Build passa
