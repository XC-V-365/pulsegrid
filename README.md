# PulseGrid v16 — REA approved · Netlify · server access · native cpal/midir

# PulseGrid v15 — Claude pipeline · more REAP · deploy guide

 — Claude Code · Opus 5.5 · Fable 5.1 · Composio

# PulseGrid v13 — REAP · REA Investigation

 — Resources · Skills · Sources

 — Studio · EPB · Canvas · Plugins · Genres

**Explore → Plan → Build → Ship** creative music platform: sequencer, SaaS access, agents, matrices, node canvas, open-source plugins, genres/styles, widgets, workflows.

## Start

```bash
python3 -m http.server 8765
# http://localhost:8765/index.html
# http://localhost:8765/saas/studio/index.html
```

1. Portal sign-in (`saas/access-config.js` admin emails)  
2. **Studio EPB** — explore genre → plan workflow → build  
3. Sequencer / Agents / Matrices / Canvas  

## Map

| Area | Path |
|------|------|
| **Studio EPB** | `saas/studio/` |
| **Canvas (nodes)** | `saas/canvas/` |
| **Workflows** | `saas/workflows/` |
| **Plugins (OSS)** | `saas/plugins/` |
| **Widgets** | `saas/widgets/` |
| **Modules** | `saas/modules/` |
| **Styles · Genres** | `saas/styles/` |
| Command Center | `saas/dashboard/` |
| Agents · Master Music | `saas/agents/` |
| Matrices | `saas/matrices/` |
| Sequencer | `step-sequencer.html` |
| Native | `native/cpp` · `native/rust` |

## Docs

- `docs/STUDIO_EPB.md`
- `docs/AGENTS_AND_MATRICES.md`
- `docs/FUNCTION_REFERENCE.md`
- `docs/SAAS_ACCESS.md`
- `docs/DASHBOARDS.md`

## License

MIT default for scaffold; admin-editable clause; review plugin upstream licenses in `saas/plugins/registry.json`.


## Resources · Skills (v12)

| Path | Role |
|------|------|
| `saas/resources/index.html` | Hub UI |
| `saas/resources/skills.json` | All skills (Grok + project + tools) |
| `saas/resources/sources.json` | Docs, OSS, standards, templates |
| `integrations/sources/` | Research source cards |
| `docs/RESOURCES_AND_SKILLS.md` | Guide |


## REAP · REA (v13)

Authorized reverse-engineering prompt pack for [REA](https://rea.tools/).

- Hub: `integrations/rea/index.html`
- Prompts: `integrations/rea/REAP_PROMPTS.md`
- Docs: `docs/REAP.md` · `docs/SESSION_REVISION_v13.md`


## v13.2
- Full Export + `seedId` · expanded genre seeds · REA `SETUP_PLAN.md` (awaiting approval)


## Claude × Composio (v14)

| Path | Role |
|------|------|
| `integrations/claude/` | SYSTEM_RULES, CLAUDE_CODE, OPUS_5_5, FABLE_5_1 |
| `integrations/composio/` | Tools, schema, Claude operator guide |
| Sequencer chips | Claude Code · Opus 5.5 · Fable 5.1 · Composio |


## v14.1 continue
REAP MIDI + access evidence · Tone optional lab · generators Claude links


## v15
- `saas/claude/index.html` multi-lane pipeline
- REAP logs: matrices, claude, studio, tone
- `docs/DEPLOY.md`


## v16

- REA setup approved (Node 22+ needed on your machine for full doctor)
- Netlify site: `pulsegrid-xc-v365` · functions for `/api/access/*`
- Native Rust: engine + cpal/midir features (default build OK; full needs ALSA)
- Docs: `docs/SERVER_ACCESS.md`, `integrations/rea/SETUP_REPORT.md`

## v17 (2026-10-24)

- **REA:** plan-only until you reply `APPROVE REA SETUP` (see `integrations/rea/SETUP_PLAN.md`)
- **Server access:** `/api/access/session|verify|consume|status` with HMAC quotas
- **Native:** cpal/midir filled (`--list-audio`, `--beep`, `--play`, MIDI clock helpers); Linux needs `pkg-config libasound2-dev` for `--features full`
- **Live:** https://pulsegrid-xc-v365.netlify.app
