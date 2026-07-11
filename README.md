# Hotsite Cursor Skills Framework

This package provides a spec-driven workflow for building a marketing hotsite in Cursor.

## Included skills

1. `design-doc` — creates the foundational design document.
2. `create-spec` — converts approved design intent into atomic specs.
3. `implement-spec` — implements one approved spec at a time.
4. `create-pr` — prepares and creates a traceable pull request.
5. `review-pr` — reviews the PR across spec, design, accessibility, SEO, privacy, performance, and maintainability.

## Installation

Copy `.cursor`, `docs`, and `AGENTS.md` into the root of your repository. Keep design documents in `docs/designs/` and specs in `docs/specs/`.

Install the external visual-quality skill used by this framework:

```bash
npx skills add https://github.com/antfu/skills --skill web-design-guidelines
```

The repository skills load it explicitly for Design Doc creation, visual implementation, and PR review. Project requirements, approved specs, brand rules, legal constraints, and the approved Design Document always take precedence.

## Suggested prompts

- `Use design-doc to design a conversion-focused hotsite for <offer>.`
- `Use create-spec to decompose the approved design into implementation specs.`
- `Use implement-spec to execute SPEC-001 only.`
- `Use create-pr to open a PR for SPEC-001.`
- `Use review-pr to review the current PR against its spec and design document.`

## Lifecycle

Design approval → Spec approval → One-spec implementation → Validation → PR → Review.

## Design Doc input files

The `design-doc` skill reads project inputs from `docs/inputs/` in a controlled order. Start by reviewing and completing:

- `project-brief.md`
- `brand-guidelines.md`
- `content-inventory.md`
- `audience-and-offer.md`
- `business-requirements.md`
- `technical-constraints.md`
- `analytics-and-conversion.md`
- `legal-and-compliance.md`
- `research.md`

The skill records missing or unverified information instead of silently inventing it.
