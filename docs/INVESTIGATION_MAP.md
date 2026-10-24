# PulseGrid investigation map (first-party RE notes)

*Generated as session continue — evidence = paths in this monorepo.*

## Main parts

| Part | Entry | Evidence |
|------|-------|----------|
| Portal / auth | `index.html`, `saas/access-config.js` | Role chips, human check, trial |
| Sequencer | `step-sequencer.html` | 16-step grid, kit, MIDI, FX, I/O |
| Studio EPB | `saas/studio/index.html` | Explore/Plan/Build/Ship |
| Canvas | `saas/canvas/index.html` | Node graph JSON |
| Agents / LLM | `saas/agents/` | registry, master-music |
| Matrices | `saas/matrices/engines.js` | appraisal, anti-slop, awesome |
| Resources | `saas/resources/` | skills.json, sources.json |
| REAP | `integrations/rea/` | prompts + workflows |
| Native | `native/cpp`, `native/rust` | StepCell parity scaffolds |
| Command Center | `saas/dashboard/index.html` | Tabs + artifact links |

## Entry points worth tracing first

1. **Export JSON** — sequencer I/O (pattern banks shape)  
2. **Access gate** — who can generate  
3. **Master Music localInfer** — matrices → critique text  

## Data flow (high level)

```
Genre (styles) → Studio plan (localStorage)
     → Sequencer pattern (banks A/B, StepCell)
     → Audio/MIDI/FX OR Export packs
     → Matrices (quality) → Agents/LLM
     → Ship (GitHub / Grok connected)
```

## Open questions

- Wire live REA CLI when available in agent env  
- Optional CDN load of Tone.js behind feature flag  
- Server-side enforce access-config (currently client-side demo)
