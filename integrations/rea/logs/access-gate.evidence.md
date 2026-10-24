# REAP evidence log — SaaS access gate

- **Target:** Portal + sequencer gate
- **Files:** `index.html`, `saas/access-config.js`, auth helpers under `saas/`
- **Authorization:** Own software

## CONFIRM

| Claim | Evidence |
|-------|----------|
| Config plane | `saas/access-config.js` — admin emails, trial limits, license text, tiers |
| Sequencer loads config | `<script src="saas/access-config.js">` in `step-sequencer.html` |
| Runtime check | `window.PulseGridAuth` / `window.PulseGridAccess` usage near v8 SaaS block |
| Roles (design) | Admin (owner + 12 emails), trial limited, donor 7-day gen grant |
| Client-side only | **CONFIRM** for demo — not cryptographic; production needs server |

## Flow

```
Portal sign-in / human check → role in localStorage/session
→ sequencer/generators consult PulseGridAccess
→ trial counters / gen grant windows
```

## HYPOTHESIS

- Bypass trivial via DevTools (expected for static demo)
- Email list in repo may need redaction for public forks

## Hardening next

1. Server allowlist  
2. Signed session cookie  
3. Don’t ship real admin emails in public clones  

## Related

`docs/SAAS_ACCESS.md` · Admin console · REAP ethics (own product)
