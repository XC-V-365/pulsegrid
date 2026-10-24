# Server-side access enforcement (v17)

## Endpoints (Netlify Functions)

| Path | Method | Role |
|------|--------|------|
| `/api/access/session` | POST | `{ email, humanOk }` → HMAC token + role + remaining quotas |
| `/api/access/verify` | GET | `Authorization: Bearer <token>` → session + remaining |
| `/api/access/consume` | POST | `{ action, n? }` + Bearer → burn quota, re-sign token |
| `/api/access/status` | GET | public policy shape (no secrets / no email values) |

### Actions for `/consume`

`edit` · `export` · `bounce` · `midi` · `generate` / `generation`

## Env vars (Netlify → **Functions** scope)

| Key | Purpose |
|-----|---------|
| `PULSEGRID_ADMIN_EMAILS` | Comma-separated admin allowlist (owner + 12) |
| `PULSEGRID_DONOR_EMAILS` | Donors |
| `PULSEGRID_SPONSOR_EMAILS` | Sponsors |
| `PULSEGRID_SESSION_SECRET` | HMAC secret (set for production signed tokens) |
| `PULSEGRID_REQUIRE_SECRET` | `1` = refuse sessions if secret missing |
| `PULSEGRID_TRIAL_EDITS` | default 25 |
| `PULSEGRID_TRIAL_EXPORTS` | default 5 |
| `PULSEGRID_DONOR_GEN_DAYS` | default 7 |

## Client

`saas/auth/server-access.js` — `PulseGridServerAccess`

```js
await PulseGridServerAccess.createSession(email, true);
await PulseGridServerAccess.verify();
await PulseGridServerAccess.consume("export");
await PulseGridServerAccess.status();
```

Falls back gracefully when offline / pure static hosting without functions.

## Quota model

- Counters live inside the **signed JWT-like token** (`used.edits/exports/gens`).
- Each `consume` re-signs a new token; client must store the returned token (bridge does this).
- Admin: unlimited (no counter bump).
- Donor/sponsor: gen window via `genExpiresAt` + genQuota 50.
- Trial: edits/exports from env; generation denied.

## Note on replay

Token-embedded counters are fine for SaaS demo / soft limits. For hard production quotas, pair with Netlify Blobs or a DB keyed by email.
