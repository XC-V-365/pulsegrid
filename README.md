# PulseGrid v8 — SaaS access · generators · QOL

Premium 16-step drum platform with **access control**, **music generators**, **session vault**, and full sequencer (FX, MIDI, matrix, AI paste packs).

## Command Center

**`saas/dashboard/index.html`** — Overview · Artifacts catalog · Grok integrations hub · Creator + Admin dashboards · Pipelines · Health.

Grok-connected services map: `integrations/grok/CONNECTED_SERVICES.json`  
Artifact catalog: `saas/artifacts/catalog.json`

## Start here

1. Open **`index.html`** (Portal) — OAuth/email + human check  
2. Put **your email** first in `saas/access-config.js` → `adminEmails`  
3. Sign in → full admin for owner + 12 emails  
4. Everyone else: **very limited free trial**  
5. **7-day generation** only for **donators & sponsors** (demo buttons on portal)

```bash
python3 -m http.server 8765
# http://localhost:8765/index.html
```

## Access policy

| Who | Access |
|-----|--------|
| Owner + 12 admin emails | Full (admin) |
| Donors / sponsors | Generation grant **7 days** |
| Everyone else | Free trial — very limited |
| Bots | Human check required |

Licence clause covers **all licences** and can be **changed inside Admin** by admins.

## App map

| Path | Purpose |
|------|---------|
| `index.html` | Portal · OAuth · trial · donate · session scan |
| `step-sequencer.html` | Full sequencer (gated features) |
| `saas/admin/` | Admin list + editable licence |
| `saas/generators/` | Suno/Udio/local music packages |
| `saas/sessions/` | Pull old sessions from everywhere |
| `saas/access-config.js` | **Edit emails, trial limits, licence default** |
| `docs/SAAS_ACCESS.md` | Policy detail |
| `docs/FUNCTION_REFERENCE.md` | Sequencer functions |
| `docs/MODULES_AND_PIPELINES.md` | Modules & pipelines |

## Production note

Browser gates are UX. Enforce allowlists, trials, and Stripe/GitHub Sponsors webhooks on a **server** before real billing.
