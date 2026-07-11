---
name: design-doc
description: >
  Create and refine an implementation-ready foundational design document for a marketing hotsite or landing page. Use when the user wants to define product intent, audience, conversion strategy, information architecture, UX, visual direction, technical architecture, SEO, analytics, accessibility, privacy, security, and delivery constraints before specifications or coding begin.
---

# Hotsite Design Document

Create a complete, reviewable design document before implementation begins.

## Hard rules

- Do not write production code or scaffold the application.
- Inspect repository instructions, project inputs, source code, and deployment context before proposing architecture.
- Never invent business facts, claims, testimonials, prices, credentials, legal statements, professional scope, or brand assets.
- Mark missing information as `[OPEN]`, provisional interpretations as `[ASSUMPTION]`, and non-binding proposals as `[RECOMMENDATION]`.
- Treat supplied copy as source material, not automatic legal or professional approval.
- Present meaningful alternatives when a decision has material trade-offs.
- Obtain explicit approval before marking the design ready for specs.

## Required references

Read these references as needed:

- `references/input-checklist.md`
- `references/input-precedence.md`
- `references/design-document-template.md`
- `references/section-framework.md`
- `references/decision-framework.md`
- `references/requirement-format.md`
- `references/design-quality-checklist.md`
- `references/status-and-handoff.md`

## Workflow

1. Read all applicable `.cursor/rules`, `AGENTS.md`, repository instructions, and project documentation. Load `web-design-guidelines` before making visual, layout, responsive, interaction, typography, spacing, or motion recommendations.
2. Follow `references/input-checklist.md` and inspect `docs/inputs/` in the prescribed order.
3. Create an input-status table before drafting.
4. Resolve source conflicts using `references/input-precedence.md`.
5. Inspect package manifests, routes, components, design tokens, integrations, tests, and deployment configuration.
6. Identify the business objective, primary audience, offer, primary conversion, secondary conversions, traffic assumptions, and success metrics.
7. Determine whether the project is a single-page hotsite, campaign microsite, or multi-page marketing experience.
8. Define the page narrative using `references/section-framework.md`; retain only sections with a clear visitor or conversion purpose.
9. Define UX behavior, responsive behavior, content needs, visual direction, technical constraints, SEO, analytics, accessibility, privacy, security, and performance.
10. Assign stable requirement IDs using `references/requirement-format.md`.
11. Record material choices using `references/decision-framework.md`.
12. Surface risks, assumptions, open questions, verification needs, and out-of-scope items.
13. Write the document to `docs/designs/YYYY-MM-DD-<topic>-design.md` using `references/design-document-template.md`.
14. Self-review against `references/design-quality-checklist.md`.
15. Set document status according to `references/status-and-handoff.md`.
16. Recommend spec decomposition and invoke `create-spec` only after explicit approval.

## Required output

The Design Document must contain:

- document status and source inventory;
- executive summary;
- goals and non-goals;
- audience and awareness level;
- positioning, offer, and value proposition;
- conversion strategy;
- content strategy and information architecture;
- section-by-section contracts;
- user journeys and interaction model;
- responsive behavior;
- visual direction, tokens, typography, imagery, and motion;
- component inventory and states;
- technical architecture;
- CMS/content ownership decision;
- integrations and forms;
- SEO and metadata strategy;
- analytics event map;
- accessibility target;
- privacy, professional, legal, and security requirements;
- performance budgets;
- testing and release strategy;
- requirements with IDs and sources;
- decisions, assumptions, risks, verification needs, and open questions;
- recommended spec breakdown;
- approval blockers and checklist.
