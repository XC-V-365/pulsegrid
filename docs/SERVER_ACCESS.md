# Server-side access enforcement (v16)

## Endpoints (Netlify Functions)

| Path | Method | Role |
|------|--------|------|
| `/api/access/session` | POST | `{ email, humanOk }` → token + role + limits |
| `/api/access/verify` | GET | `Authorization: Bearer <token>` |

## Env vars (Netlify → Functions scope)

| Key | Purpose |
|-----|---------|
| `PULSEGRID_ADMIN_EMAILS` | Comma-separated admin allowlist |
| `PULSEGRID_DONOR_EMAILS` | Donors |
| `PULSEGRID_SPONSOR_EMAILS` | Sponsors |
| `PULSEGRID_SESSION_SECRET` | HMAC secret (set for signed tokens) |
| `PULSEGRID_TRIAL_EDITS` | default 25 |
| `PULSEGRID_TRIAL_EXPORTS` | default 5 |
| `PULSEGRID_DONOR_GEN_DAYS` | default 7 |

## Client

`saas/auth/server-access.js` — `PulseGridServerAccess.createSession` / `verify`

Falls back gracefully when offline / pure static hosting without functions.
