# REAP — REA Investigation Prompts (PulseGrid pack)

Curated prompts for **[REA — Reverse Engineer Anything](https://rea.tools/)**, integrated into PulseGrid as a **research / investigation skill** surface.

## Responsible use (non-negotiable)

Only analyze software **you own** or are **explicitly authorized** to test.  
Anti-cheat, DMA, DRM, kernel, and vulnerability prompts are for **security research, interoperability, CTFs, bug bounties, and hardening your own software**.  
Bypassing protection of software you don't own, cheating in online games, or weaponizing vulnerabilities may violate law and ToS.

Every investigation must separate **confirmed facts** from **hypotheses** and **cite evidence**.

## Sources & credits

| Source | URL |
|--------|-----|
| REA tools & guides | https://rea.tools/ |
| Official prompt gallery | https://madewithrea.com/prompts |
| Intro thread (codila) | https://x.com/0xCodila/status/2109623431763292649 |
| Matthew Berman quote | https://x.com/MatthewBerman/status/2108245653843509415 |
| REAP name | https://x.com/zazencodes |

## PulseGrid paths

| Path | Role |
|------|------|
| `integrations/rea/REAP_PROMPTS.md` | Full prompt pack (paste-ready) |
| `integrations/rea/catalog.json` | Section index + tags |
| `integrations/rea/workflows.json` | Investigation workflows |
| `saas/resources/` | Skills/sources hub lists REA |
| `docs/REAP.md` | Operator guide |

## Install REA (agent)

```text
Install REA and connect it to this agent using: npx rea-agents@latest setup

First, show me the installation plan and the configuration changes for my
approval. After the install, verify the connection and list the available
tools and workflows.
```

## First-party PulseGrid investigations

Prefer REA/REAP against **this repo** (authorized):

- Trace Export JSON / WAV bounce / Web MIDI in `step-sequencer.html`
- Map SaaS access gate (`saas/access-config.js`, portal)
- Trace Studio EPB plan draft (`pulsegrid_studio_plan` localStorage)
- Native `StepCell` parity C++ ↔ Rust ↔ web

See prompts tagged `pulsegrid-first-party` in `REAP_PROMPTS.md`.
