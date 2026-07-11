# Status and Handoff

## Design Document statuses

- `draft`: initial synthesis in progress
- `needs-input`: critical information is missing
- `ready-for-review`: complete enough for stakeholder review
- `approved`: explicit stakeholder approval recorded
- `blocked`: legal, professional, technical, or business conflict prevents progress
- `superseded`: replaced by a newer approved document

## Approval blockers

Do not mark the Design Document `approved` when any of these remain unresolved:

- Primary conversion destination
- Professional title/scope ambiguity
- Unverified public credentials
- Unresolved regulated or health-related claims
- Unknown personal-data flow
- Contradictory business requirements
- Architecture incompatible with the repository
- Missing legal/privacy requirements for the selected tracking or form stack

## Handoff to `create-spec`

Only recommend `create-spec` when:

- status is `approved`;
- all Must requirements are approved or explicitly deferred;
- section contracts are complete;
- open questions are non-blocking;
- source traceability exists;
- spec boundaries can be independently implemented and tested.

Include in the handoff:

- Design Document path
- Approval record
- Decision log
- Requirement index
- Open non-blocking questions
- Recommended spec order
