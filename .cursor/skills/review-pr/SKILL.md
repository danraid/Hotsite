---
name: review-pr
description: >
  Review a hotsite pull request against its approved design document, implementation spec, repository conventions, and production quality standards. Use when the user asks for PR review, code review, design compliance review, acceptance verification, accessibility review, SEO review, analytics/privacy review, performance review, or merge readiness assessment.
---

# Review a Hotsite Pull Request

Perform an evidence-based review. Prioritize correctness and user impact over stylistic preference.

## Workflow

1. Identify the PR base and head, active spec, approved design document, `AGENTS.md`, and changed files. Load `web-design-guidelines` for every PR that changes visual UI, page composition, responsive behavior, interaction, typography, spacing, or motion.
2. Read the complete current spec and relevant design sections before judging the code.
3. Inspect the diff and surrounding code, not isolated snippets only.
4. Run or inspect available validation evidence.
5. Review each dimension below.
6. Report findings ordered by severity, each with file/line evidence, impact, and a concrete correction.
7. Distinguish blockers, important improvements, and optional suggestions.
8. Conclude with merge readiness and any checks that could not be performed.

## Review dimensions

### 1. Spec compliance
- Every acceptance criterion is satisfied.
- No hidden scope expansion occurred.
- Required states and edge cases exist.

### 2. Design and content fidelity
- Section order, hierarchy, messaging slots, CTAs, and visual behavior match the design.
- No fabricated claims, testimonials, prices, logos, or legal copy were introduced.

### 3. Functional correctness
- Navigation, forms, validation, success/error states, links, and integrations work.
- Failure handling is safe and understandable.

### 4. Responsive UX
- Desktop, tablet, and mobile behavior are intentional.
- No overflow, clipped content, inaccessible controls, or unusable tap targets.

### 5. Accessibility
- Semantic landmarks and heading order.
- Keyboard operation and focus visibility.
- Labels, names, instructions, errors, contrast, alt text, and reduced motion.

### 6. SEO and social sharing
- Metadata, canonical behavior, headings, indexability, structured data, and social cards are correct when in scope.

### 7. Analytics, privacy, and security
- Events are named and triggered as specified.
- Consent rules are respected.
- User input is validated, sanitized, and protected against abuse.
- No secrets or sensitive data are exposed.

### 8. Performance
- JavaScript, images, fonts, embeds, and third-party scripts are justified.
- Loading priority, dimensions, caching, and layout stability are appropriate.

### 9. Maintainability and tests
- Code follows repository patterns without needless abstraction.
- Tests cover meaningful behavior and regressions.
- Documentation and configuration changes are complete.

## Severity

- `BLOCKER`: unsafe, broken, non-compliant, or cannot meet the spec.
- `HIGH`: material user, business, accessibility, SEO, privacy, or maintainability risk.
- `MEDIUM`: valid issue with limited impact or practical workaround.
- `LOW`: small defect or clarity improvement.
- `SUGGESTION`: optional improvement, not required for merge.

## Output format

For each finding:

`[SEVERITY] Short title — path:line`

- Evidence
- Impact
- Required correction
- Related spec/design requirement

Then include:

- acceptance criteria matrix;
- checks observed or run;
- unresolved review gaps;
- final verdict: `APPROVE`, `REQUEST CHANGES`, or `BLOCK`.
