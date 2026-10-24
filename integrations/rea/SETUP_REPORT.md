# REA setup report (v17 — plan only)

**User request:** item 1 — APPROVE REA SETUP — **npx install plan only until you approve**  
**Date:** 2026-10-24  
**Action this turn:** **No `npx` install.** Plan remains on disk; wait for explicit approve phrase.

## Gate

| Phrase | Meaning |
|--------|---------|
| `APPROVE REA SETUP` | Agent may run `npx rea-agents@latest setup` where Node 22+ works |
| `APPROVE REA SETUP LOCAL ONLY` | Agent only prints commands for you |
| `REJECT` | Leave plan; never install |

## Preconditions (from SETUP_PLAN.md)

1. Node.js **^22.19 / ^24.11 / ≥26** (REA 6.7+)
2. npm registry network
3. Authorized targets only (see `README.md` ethics)
4. You accept REA vendor license/telemetry

## Agent host status

| Check | Result |
|-------|--------|
| Node | **20.20.2** — below REA engine requirement |
| `npm view rea-agents` | Available when network works (was 6.7.0) |
| Full agent integration | Needs local Node 22+ |

## Commands (copy after approve)

```bash
node -v   # must be 22.19+
npm -v
npm view rea-agents version
npx rea-agents@latest setup --yes --all-detected
npx rea-agents@latest doctor
```

## PulseGrid without REA engines

Static REAP pack + evidence logs still work:

- `integrations/rea/REAP_PROMPTS.md`
- `integrations/rea/logs/*.evidence.md`
- Hub: `integrations/rea/index.html`
