# Implementation Specs — Janaína Hollanda Hotsite

Especificações derivadas de [`docs/designs/2026-07-10-janaina-hollanda-hotsite-design.md`](../designs/2026-07-10-janaina-hollanda-hotsite-design.md).

Implementar **uma spec por vez**, na ordem abaixo, usando `implement-spec`.

## Ordem de implementação

| Ordem | Spec | Status | Depende de |
|---:|---|---|---|
| 1 | [SPEC-001-foundation](./SPEC-001-foundation/spec.md) | `ready` | — |
| 2 | [SPEC-002-header-navigation](./SPEC-002-header-navigation/spec.md) | `ready` | SPEC-001 |
| 3 | [SPEC-003-hero](./SPEC-003-hero/spec.md) | `ready` | SPEC-001, SPEC-002 |
| 4 | [SPEC-004-contexto](./SPEC-004-contexto/spec.md) | `ready` | SPEC-001 |
| 5 | [SPEC-005-como-posso-ajudar](./SPEC-005-como-posso-ajudar/spec.md) | `ready` | SPEC-001 |
| 6 | [SPEC-006-abordagem](./SPEC-006-abordagem/spec.md) | `ready` | SPEC-001 |
| 7 | [SPEC-007-sobre](./SPEC-007-sobre/spec.md) | `ready` | SPEC-001 |
| 8 | [SPEC-008-atendimentos](./SPEC-008-atendimentos/spec.md) | `ready` | SPEC-001 |
| 9 | [SPEC-009-conversao-final](./SPEC-009-conversao-final/spec.md) | `ready` | SPEC-001 |
| 10 | [SPEC-010-footer-legal](./SPEC-010-footer-legal/spec.md) | `blocked` | SPEC-001 |
| 11 | [SPEC-011-seo-metadata](./SPEC-011-seo-metadata/spec.md) | `ready` | SPEC-001, SPEC-003 |
| 12 | [SPEC-012-integrations](./SPEC-012-integrations/spec.md) | `blocked` | SPEC-001, SPEC-002, SPEC-009 |

Specs 004–008 podem ser implementadas em paralelo após SPEC-001, desde que `index.astro` seja coordenado para evitar conflitos de merge.

## Paralelismo seguro

Após **SPEC-001** e **SPEC-002**:

- SPEC-004, SPEC-005, SPEC-006, SPEC-007, SPEC-008 — `parallel_safe: true`
- SPEC-003, SPEC-009, SPEC-011 — sequenciais ou com coordenação em `index.astro`

## Bloqueadores de lançamento (não de implementação estrutural)

1. Destino do CTA primário e URL de agendamento
2. Número/link WhatsApp
3. Credenciais e titulação verificadas (SPEC-007, SPEC-010)
4. Política de privacidade aprovada (SPEC-010)
5. Plataforma de analytics e consent (SPEC-012)
6. Domínio canônico e imagem OG finais (SPEC-011)

## Design doc status

O design document permanece `ready-for-review`. A solicitação de `create-spec` trata a estrutura e decomposição como aprovadas para planejamento de implementação; bloqueadores de contato/legal devem ser resolvidos antes do deploy público.

## Próximo passo

```
implement-spec SPEC-001-foundation
```
