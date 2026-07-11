---
name: create-spec
description: >
  Convert an approved hotsite design document into small, traceable, implementation-ready specifications. Use when the design is approved and the user wants scaffold, page-section, integration, SEO, analytics, accessibility, performance, testing, or release specs that an agent-coding workflow can execute without making product or design decisions.
---

# Create Hotsite Specs

Transform approved design intent into atomic implementation contracts.

## Preconditions

- An approved design document exists in `docs/designs/`.
- Critical product, content, UX, and architecture decisions are resolved.
- If critical decisions remain open, stop and list them.

## Workflow

1. Read `.cursor/rules/hotsite-spec-format.mdc` and the approved design document.
2. Inspect existing specs and allocate the next sequential ID.
3. Decompose work by independently testable outcome, not by arbitrary file count.
4. Create `docs/specs/SPEC-###-slug/spec.md` and `meta.yaml` from the templates.
5. Add traceability to design sections and requirement IDs.
6. Define exact scope, exclusions, states, responsive behavior, accessibility, SEO/analytics impact, expected files, tests, and acceptance criteria.
7. Identify dependencies and implementation order.
8. Run a self-review for ambiguity, duplication, hidden design decisions, and untestable language.
9. Mark a spec `ready` only when an implementation agent can execute it without choosing content, UX, architecture, or libraries.

## Recommended decomposition order

1. Project scaffold and tooling
2. Global tokens and styles
3. Root layout, metadata, fonts, and shell
4. Shared UI primitives
5. Header and navigation
6. Hero
7. Credibility and proof sections
8. Problem, value proposition, and benefits
9. How-it-works and feature sections
10. Demonstration/media sections
11. Use cases, testimonials, and comparison
12. Offer/pricing
13. FAQ
14. Lead/contact form and integrations
15. Footer and legal surfaces
16. SEO and structured data
17. Analytics and consent
18. Accessibility hardening
19. Performance hardening
20. End-to-end QA and release

Merge tiny adjacent sections only when they share one coherent testable outcome.

## Requirement rules

- Functional IDs: `SPEC-###-FR-001`.
- Non-functional IDs: `SPEC-###-NFR-001`.
- Acceptance criteria use Given/When/Then or an equally testable form.
- Do not prescribe implementation details unless architecture or interoperability requires them.
- Do not leave “responsive,” “accessible,” “fast,” or “SEO-friendly” undefined.
