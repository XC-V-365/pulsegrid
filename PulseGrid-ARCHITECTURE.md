# PulseGrid v10 Architecture

## New layer: Agents · LLMs · Matrices

```
Pattern / Package
       │
       ▼
┌──────────────┐     ┌─────────────────────┐
│  Matrices    │────▶│  Master Music LLM   │
│ Appraisal    │     │  constitution+router│
│ Anti-Slop    │     └──────────┬──────────┘
│ Awesome      │                │
└──────────────┘                ▼
                     Agents / Bots (Conductor, GrooveSmith,
                     AntiSlop, Appraiser, ExportRunner, …)
```

## Prior layers

Portal/SaaS access · Sequencer · Generators · Sessions · Command Center · Grok integrations · Native C++/Rust

## Key paths

- `saas/agents/registry.js`
- `saas/agents/master-music/`
- `saas/matrices/engines.js`
- `docs/AGENTS_AND_MATRICES.md`
