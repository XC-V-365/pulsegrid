# Server-side access enforcement (v19)

## Endpoints (Netlify Functions)

| Path | Method | Role |
|------|--------|------|
| `/api/access/session` | POST | `{ email, humanOk, code? }` → HMAC token + role + remaining quotas |
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
| `PULSEGRID_SESSION_SECRET` | HMAC secret (set for production signed tokens; required for any elevated role) |
| `PULSEGRID_ADMIN_CODE` | Access code an admin email must send to get `admin` |
| `PULSEGRID_SPONSOR_CODE` | Access code for `sponsor` |
| `PULSEGRID_DONOR_CODE` | Access code for `donor` |
| `PULSEGRID_REQUIRE_SECRET` | `1` = refuse sessions if secret missing |
| `PULSEGRID_TRIAL_EDITS` | default 25 |
| `PULSEGRID_TRIAL_EXPORTS` | default 5 |
| `PULSEGRID_DONOR_GEN_DAYS` | default 7 |

## Client

`saas/auth/server-access.js` — `PulseGridServerAccess`

```js
await PulseGridServerAccess.createSession(email, true);           // trial
await PulseGridServerAccess.createSession(email, true, adminCode); // admin, if listed
await PulseGridServerAccess.verify();
await PulseGridServerAccess.consume("export");
await PulseGridServerAccess.status();
```

Falls back gracefully when offline / pure static hosting without functions.

## v19 elevated roles need an access code

Typing an email proves nothing, so an allowlisted email alone gets `trial`.
`admin`, `sponsor` and `donor` are granted only when **all** of these hold:

1. the email is on that role's list;
2. the request's `code` matches `PULSEGRID_<ROLE>_CODE` (compared in constant time; use a long random value, there is no rate limit yet);
3. `PULSEGRID_SESSION_SECRET` is set, because unsigned tokens can be forged.

Unsigned tokens (no secret) are accepted only for `trial` and `anonymous`.
`GET /api/access/status` reports `accessCodesConfigured` (true/false per role, never the values).
Tests: `node --test tests/access.test.mjs`.

This is still a shared-code gate. Real per-person sign-in (OAuth or an email magic link) remains future work.

## Quota model

- Counters live inside the **signed JWT-like token** (`used.edits/exports/gens`).
- Each `consume` re-signs a new token; client must store the returned token (bridge does this).
- Admin: unlimited (no counter bump).
- Donor/sponsor: gen window via `genExpiresAt` + genQuota 50.
- Trial: edits/exports from env; generation denied.

## Note on replay

Token-embedded counters are fine for SaaS demo / soft limits. For hard production quotas, pair with Netlify Blobs or a DB keyed by email.

## v18 allowlist resolution order

1. `PULSEGRID_*_EMAILS` env (Netlify Functions scope)
2. `saas/access-config.js` (if present on disk via `included_files`)
3. **bundled** `netlify/functions/_defaults.mjs` (always ships with functions)

Replace placeholder emails in both `saas/access-config.js` and `_defaults.mjs` for production, or set env.
