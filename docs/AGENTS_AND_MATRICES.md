# Agents, bots, LLMs & matrices (v10)

## Agents / bots

| ID | Kind | Role |
|----|------|------|
| conductor | agent | Pipeline orchestration |
| groove-smith | agent | Groove / vel / prob |
| anti-slop | bot | Cliché & empty-copy rejection |
| appraiser | agent | Matrix scoring |
| export-runner | bot | Paste packages |
| native-bridge | bot | C++/Rust parity |
| session-vault-bot | bot | Session pull |
| master-music-llm | llm | Custom music specialist layer |

Registry: `saas/agents/registry.js` · UI: `saas/agents/index.html`

## Master Music LLM

- Constitution: `saas/agents/master-music/constitution.md`
- Router: `saas/agents/master-music/router.js` → `buildMessages()` for hosted LLM, `localInfer()` offline
- Not a trained weight dump — a **controllable profile + tools + matrices**

## Matrices

| Matrix | Purpose |
|--------|---------|
| **Appraisal** | Craft quality 6 axes × 0–5 |
| **Anti-Slop** | Detect generic AI / empty hype (higher = worse) |
| **Awesome** | Weighted excellence; threshold → FEATURE |

Engine: `saas/matrices/engines.js` · UI: `saas/matrices/index.html`

## Combined verdict

- `FEATURE` — clean + appraisal ≥60% + awesome threshold  
- `SHIP` — clean + appraisal ≥60%  
- `REVISE` — otherwise  
