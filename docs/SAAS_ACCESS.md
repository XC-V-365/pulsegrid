# PulseGrid SaaS access (v8)

## Roles

| Role | Who | Access |
|------|-----|--------|
| **admin** | Owner + up to **12** emails in `saas/access-config.js` (or Admin UI) | Unlimited · edit licence · edit admin list |
| **sponsor** / **donor** | Listed or demo-activated after donation | Full-ish creative tools + **7-day generation grant** |
| **trial** | Everyone else after sign-in | **Very limited**: few edits, near-zero exports, almost no generation |
| **anonymous** | Not signed in | Portal only |

## Policy (product)

1. **Stop all** full access **except** owner + 12 admin emails.  
2. **Free trial** for everyone else — very limited.  
3. **7-day generation** only if **donor or sponsor** (or admin).  
4. **Human check** required at login (checkbox or math; swap for Turnstile in prod).  
5. **OAuth**: Google, GitHub, Microsoft, Apple, Discord, email magic link (demo client; wire env client IDs for prod).  
6. **Licence**: “all licences” clause — **admin can change text inside the product**.  
7. **Sessions**: pull from all known localStorage keys + file import.  
8. **Music generators**: Suno/Udio/local seeds, gated by generation policy.

## Edit admin emails

1. Sign in as an address already on the admin list (bootstrap: set `owner@example.com` to your email in `access-config.js` first).  
2. Open **Admin** → paste your 12 emails → Save.  
3. Or edit `PulseGridAccess.adminEmails` in `saas/access-config.js`.

## Production hard-stop

Client gates are for UX. Enforce the same rules on a **server** (JWT + email allowlist + Stripe webhooks for donor/sponsor). Never trust the browser alone for billing or admin.
