# Analytics and Conversion

## Primary conversion

A visitor starts or completes the initial-conversation scheduling/contact flow.

## Secondary conversions

- Clicks to explore services
- Clicks to learn about the approach
- Clicks to learn about Janaína's trajectory
- Clicks to individual service details
- Clicks to workshop information
- WhatsApp contact starts

## Suggested event taxonomy

Final names must follow the selected analytics platform and repository conventions.

| Event | Trigger | Suggested properties |
|---|---|---|
| `cta_click` | Any primary or secondary CTA click | `cta_label`, `cta_location`, `destination_type` |
| `booking_start` | Visitor enters scheduling flow | `cta_location`, `service_interest` |
| `booking_complete` | Confirmed by supported integration | `service_interest`, `channel` |
| `whatsapp_start` | WhatsApp link activated | `cta_location`, `service_interest` |
| `service_view` | Service detail viewed or expanded | `service_name` |
| `section_view` | Meaningful section visibility | `section_id` |
| `form_start` | First form interaction | `form_id` |
| `form_submit` | Successful form submission | `form_id` |
| `form_error` | Submission or validation error | `form_id`, `error_type` |

## Measurement rules

- Do not collect sensitive health details in analytics properties.
- Do not send free-text form content to analytics.
- Do not fire non-essential tracking before required consent.
- Do not treat CTA clicks as completed appointments.
- Separate starts, submissions, and confirmed outcomes.
- Document each event owner, trigger, payload, and validation method.

## Funnel hypothesis

1. Landing/entry
2. Hero engagement
3. Trust/approach/service exploration
4. Booking or WhatsApp start
5. Booking/contact completion

## Open decisions

- Analytics platform
- Tag manager
- Advertising pixels
- Consent requirements
- Booking completion signal
- Conversion attribution model
- Campaign UTM conventions
- Reporting owner
