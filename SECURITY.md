# Security Policy

OlamideVerse is a fan archive. We take security, privacy, and rights-holder
requests seriously — and we keep a hard line between **Fan Zone accounts** and
**admin** access.

## Supported versions

| Version | Supported |
| --- | --- |
| `main` (current deploy) | Yes |
| Older deploys / forks | Best effort only |

## Reporting a vulnerability

Please **do not** open a public GitHub issue for security bugs (auth bypass,
RLS holes, XSS, secret exposure, etc.).

Instead, email the site takedown / ops contact published on the deployed
site’s **/legal#takedown** page (or the address configured via
`TAKEDOWN_EMAIL` / CMS `general.takedownEmail`).

Include:

- Description and impact
- Steps to reproduce (PoC welcome; no destructive testing on production)
- Affected URL(s) or commit if known
- Whether you need coordinated disclosure timing

We’ll acknowledge when we can and prioritize fixes that affect auth, Fan Zone
data, or admin.

### Out of scope (usually)

- Issues that only reproduce with browser extensions mutating the DOM
- Reports that require physical access or a compromised user password
- Missing security headers already intentional for static CSP trade-offs
  (see `next.config.ts`) — suggest improvements via a normal PR if you prefer

## Rights-holder & takedown requests

Copyright or publicity concerns (embeds, images, copy):

1. Use the contact on `/legal#takedown`.
2. Identify the URL(s) and the material.
3. We aim to remove or disable disputed embeds/assets promptly for good-faith
   notices.

Admin tooling for embed removals / image rights lives under `/admin` for
maintainers — not a public API.

## Hardening already in place (context for reporters)

- CSP, frame denial, referrer policy, production HSTS (`next.config.ts`)
- Rate limiting on analytics collect and Fan Zone sign-up/sign-in
- Validated analytics IDs; takedown email not exposed to anon settings reads
- Fan Zone handles cannot reach the admin console
- Service worker registers in **production only** (dev unregisters to avoid
  stale Turbopack chunk caches)

## Secrets

Never commit `.env.local`, service-role keys, or admin passwords. Rotate
anything that may have leaked and open a private report if a secret hit git
history.
