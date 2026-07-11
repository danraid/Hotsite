---
name: implement-spec
description: >
  Implement one approved hotsite specification end to end with strict scope control, repository-aware coding, validation, and traceability. Use when a SPEC is ready and the user asks Cursor to execute it, scaffold the project, build a page section, add an integration, or complete quality work without expanding beyond the approved contract.
---

# Execute a Hotsite Spec

Implement exactly one ready spec at a time.

## Preconditions

- The spec exists and is marked `ready` or explicitly authorized.
- Its dependencies are satisfied or the user accepts the risk.
- The repository working tree is understood before changes begin.

## Workflow

1. Read the active spec, its metadata, the approved design document, `AGENTS.md`, and applicable `.cursor/rules/`. Load `web-design-guidelines` before implementing any visual interface, layout, responsive behavior, interaction, typography, spacing, or motion.
2. Inspect current branch, working tree, recent commits, package scripts, architecture, tests, and related files.
3. Restate the intended outcome, files likely affected, validation commands, and blockers.
4. Create or switch to a dedicated branch when the repository workflow requires it.
5. Implement the smallest coherent solution that satisfies all acceptance criteria.
6. Keep content and visual decisions aligned with the design document.
7. Add or update tests while implementing.
8. Run formatter, lint, type checks, tests, production build, and relevant accessibility/responsive checks.
9. Review the diff for scope drift, placeholders, secrets, dead code, unnecessary dependencies, and accidental asset changes.
10. Update spec status and implementation notes only if the repository workflow expects it.
11. Report completed criteria, changed files, validation results, deviations, and remaining risks.
12. Stop. Do not automatically begin another spec or create a PR unless requested or invoked through `create-pr`.

## Hotsite-specific implementation rules

- Preserve semantic heading hierarchy.
- Ensure all interactive elements work by keyboard.
- Implement visible focus and reduced-motion behavior.
- Treat mobile layout as a first-class implementation, not a shrink of desktop.
- Avoid layout shift from images, fonts, banners, and embeds.
- Do not fabricate content. Use approved content or explicit temporary markers allowed by the spec.
- Do not add tracking before consent when consent is required.
- Do not weaken security or validation to make a demo pass.

## Completion report

Include:

- spec ID and outcome;
- acceptance criteria status;
- files created, changed, and removed;
- dependencies added and rationale;
- commands executed and results;
- screenshots or preview notes when available;
- deviations and unresolved risks;
- recommended next action.
