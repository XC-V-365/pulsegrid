# REA setup report (approved)

**Approval:** user requested item 1 — APPROVE REA SETUP  
**Date:** 2026-10-24  
**Package:** `rea-agents@6.7.0` via `npx`

## What ran

| Step | Result |
|------|--------|
| `npm view rea-agents version` | 6.7.0 |
| `npx rea-agents@latest setup --help` | OK — options include `--yes`, `--dry-run`, `--all-detected` |
| `npx rea-agents@latest setup --dry-run --yes` | `status: needs_human` (Node engine) |
| `npx rea-agents@latest doctor` | `healthy: false` |

## Blocker

REA 6.7 requires **Node.js ^22.19 / ^24.11 / >=26**. This agent host has **Node 20.20.2**.

## Your machine (to finish)

```bash
# install Node 22+
nvm install 22 && nvm use 22
npx rea-agents@latest setup --yes --all-detected
npx rea-agents@latest doctor
```

Optional analysis engines (only if you own them): Ghidra, IDA MCP, JADX, Hopper, Kuna — see doctor remediations.

## PulseGrid first-party without REA engines

Use `integrations/rea/REAP_PROMPTS.md` §17 + evidence logs under `integrations/rea/logs/` — static RE still works.
