# CLAUDE.md — PulseGrid for Claude Code

> Drop this as `CLAUDE.md` at repo root or paste as Claude Code project instructions.

## Project

**PulseGrid** — premium navy/rose-gold 16-step drum machine (web) + SaaS portal + native C++/Rust scaffolds + Studio EPB + agents/matrices + REAP + Composio.

Repo: https://github.com/XC-V-365/pulsegrid

## Stack

- Web: single-page `step-sequencer.html` (Web Audio, Web MIDI), static SaaS under `saas/`
- Native: C++17 headers + Rust crate under `native/`
- No mandatory build for web — `python3 -m http.server 8765`

## Commands

```bash
python3 -m http.server 8765
# optional native
cd native/rust && cargo build --release
cd native/cpp && g++ -std=c++17 -I include -O2 -o pulsegrid src/*.cpp -pthread
```

## Conventions

- Prefer patching existing modules over new frameworks.
- Keep `StepCell` and bank schema stable across web/native/exports.
- Genre seeds: `saas/styles/seeds/patterns.json`; load via `?seed=` or Seeds chips.
- Full export: `#btnExport` → v13 payload with optional `seedId` (`window.__pgExport`).
- Client-side access gate is demo-grade; note server enforcement as future work.

## Do

- Trace features with path + function evidence (REAP style).
- After pattern changes, mention Export JSON / MIDI / WAV / anti-slop.
- Use Composio tool slugs from `integrations/composio/pulsegrid_tools.json` for multi-app.

## Don’t

- Claim live Suno/Udio generation without API.
- Bypass SaaS for “everyone is admin”.
- Crack third-party software (REAP ethics).

## Priority tasks when asked “continue”

1. Quality: matrices + anti-slop packs  
2. Seeds ↔ Studio ↔ sequencer  
3. Native parity  
4. Deploy static hosting  
5. Real OAuth when secrets exist  
