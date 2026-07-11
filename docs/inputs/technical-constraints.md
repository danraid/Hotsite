# Technical Constraints

## Current status

The implementation stack has not been approved. The Design Doc must inspect the repository before making technical decisions.

## Required technical principles

- Use the existing framework, package manager, coding conventions, and deployment model when a repository already exists.
- Prefer server-rendered or statically generated content where supported.
- Keep JavaScript payload low.
- Avoid dependencies for behavior that can be implemented reliably with platform or framework primitives.
- Optimize images and fonts.
- Keep CTA destinations and contact details configurable.
- Use semantic HTML and progressive enhancement.
- Support keyboard navigation and visible focus.
- Respect `prefers-reduced-motion`.
- Do not place secrets or sensitive personal data in the client bundle.

## Required browser/device behavior

- Mobile-first responsive layout
- Current major evergreen browsers
- Usable at 320px width and above
- Touch targets appropriate for mobile interaction
- No content loss under text zoom

## Performance direction

Initial targets, subject to Design Doc confirmation:

- LCP ≤ 2.5s at the 75th percentile
- INP ≤ 200ms at the 75th percentile
- CLS ≤ 0.1 at the 75th percentile
- Avoid layout shifts from fonts and images
- Lazy-load non-critical media
- Keep third-party scripts minimal

## Font constraints

- Use Canela or Avenir only with confirmed web licensing and available files/services.
- Otherwise use Cormorant Garamond and Lato or Source Sans 3 from an approved source.
- Do not expose proprietary font files in public repositories without permission.

## Integration details still required

- Hosting provider
- Domain and DNS ownership
- Deployment environments
- CMS or content ownership model
- Scheduling provider
- WhatsApp destination
- Analytics provider
- Consent manager
- Error monitoring
- Form provider/backend
