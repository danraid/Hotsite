# Project Agent Instructions

## Hotsite delivery workflow

Use the repository skills in this order:

1. `design-doc`
2. `create-spec`
3. `implement-spec`
4. `create-pr`
5. `review-pr`

Do not implement from an unapproved design document or an unapproved spec.

## Web design standards

For any task involving visual design, page composition, UI components, responsive behavior, interaction design, implementation of visual interfaces, or visual review, load and follow the `web-design-guidelines` skill.

Install it once in the repository with:

```bash
npx skills add https://github.com/antfu/skills --skill web-design-guidelines
```

Apply this precedence when instructions conflict:

1. Explicit user decisions and applicable legal or professional constraints
2. Approved implementation spec for the active unit of work
3. Approved Design Document
4. Project brand guidelines, content inputs, and design tokens
5. Repository rules and established architecture
6. `web-design-guidelines`
7. General framework conventions

The external skill improves interface quality but must not override approved brand, content, accessibility, privacy, legal, product, or technical decisions.

When a recommendation from `web-design-guidelines` conflicts with a higher-priority source, follow the higher-priority source and record the conflict or deviation.
