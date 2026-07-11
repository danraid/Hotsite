---
name: create-pr
description: >
  Prepare and create a high-quality pull request for a completed hotsite spec. Use when implementation and local validation are complete and the user wants commits, push, PR title, body, evidence, screenshots, traceability, risk notes, and reviewer guidance prepared without hiding failures or unrelated changes.
---

# Create Hotsite Pull Request

Create a reviewable PR that connects the implementation to its approved design and spec.

## Preconditions

- The active spec implementation is complete.
- Applicable validation has passed, or failures are explicitly documented.
- The branch contains no unintended or unrelated changes.

## Workflow

1. Read the active spec, design document, repository contribution guidance, and current diff.
2. Reconcile branch state and confirm the intended base branch.
3. Review commits and split or clean them only when safe and requested by repository conventions.
4. Re-run critical validation if results are stale after the last code change.
5. Collect visual evidence for desktop and mobile when the change affects UI.
6. Push the branch.
7. Create the PR using `references/pr-template.md`.
8. Link the spec and design document with repo-relative paths.
9. State exact validation commands and results.
10. Disclose skipped checks, known issues, follow-ups, migrations, environment changes, and rollout concerns.
11. Request review focus on the highest-risk dimensions.

## PR title

Use a concise conventional title when the repository supports it:

`feat(hotsite): implement SPEC-### <outcome>`

Choose `fix`, `refactor`, `test`, `docs`, or `chore` when more accurate.

## Hard rules

- Never claim a check passed unless it was run successfully.
- Never hide scope drift or unrelated changes.
- Never include secrets, local absolute paths, or sensitive environment values.
- Do not merge the PR unless the user explicitly asks and repository policy permits it.
