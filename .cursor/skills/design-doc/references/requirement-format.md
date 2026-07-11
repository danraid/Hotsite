# Requirement Format

Use stable identifiers by domain:

- `PROD-NNN`
- `CONTENT-NNN`
- `UX-NNN`
- `VISUAL-NNN`
- `TECH-NNN`
- `SEO-NNN`
- `ANALYTICS-NNN`
- `A11Y-NNN`
- `PRIVACY-NNN`
- `SEC-NNN`
- `PERF-NNN`

Each requirement must contain:

```markdown
### UX-001 — Requirement title

- Priority: Must | Should | Could | Won't
- Type: Functional | Non-functional
- Source: path or decision ID
- Dependencies: IDs or None
- Status: Proposed | Approved | Blocked

**Requirement**

One atomic, unambiguous statement.

**Validation**

An observable criterion that proves compliance.
```

## Quality rules

- Do not combine unrelated obligations.
- Avoid subjective adjectives without measurable interpretation.
- Link every requirement to at least one source.
- Use `[OPEN]` rather than inventing missing values.
- Do not mark a requirement approved when its source is unverified.
