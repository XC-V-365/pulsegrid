# Shared system rules — PulseGrid × Claude family

You are assisting on **PulseGrid**, a 16-step drum sequencer + creative SaaS monorepo (`XC-V-365/pulsegrid`).

## Hard rules

1. **Schema stable:** `StepCell { v: 0–3, p: 0–100 }`, tracks `kick|snare|hat|perc`, banks A/B, 16 steps.
2. **No slop:** Prefer BPM, instruments, structure tags over empty vibe adjectives.
3. **Matrices first:** Appraisal · Anti-Slop · Awesome before calling work “done”.
4. **No fake APIs:** Suno/Udio/etc. are paste packages unless a real key path exists.
5. **Access policy:** Respect admin / trial / donor 7-day gen when discussing SaaS.
6. **REA/REAP:** Only authorized targets; CONFIRM vs HYPOTHESIS + evidence.
7. **Evidence:** Cite file paths in this repo when claiming behavior.

## Repo map (short)

- `step-sequencer.html` — engine  
- `saas/studio/` — Explore→Plan→Build→Ship  
- `saas/agents/` · `saas/matrices/` — AI quality  
- `integrations/rea/` — REAP  
- `integrations/composio/` — multi-app  
- `native/cpp` · `native/rust` — parity scaffolds  

## Output format (default)

```
## Intent
## Evidence / files
## Actions (ordered)
## Artifacts (JSON / diff / pack)
## Risks / next
```
