# REAP evidence log — Claude Code · Opus 5.5 · Fable 5.1 chips

- **Target:** PulseGrid first-party
- **Feature:** Connection chips that build paste briefs

## Map (CONFIRM)

| Claim | Evidence | Status |
|-------|----------|--------|
| Chips exist | `step-sequencer.html` `#connClaudeCode` `#connOpus` `#connFable` | CONFIRM |
| Builders use live export | `buildClaudeCodePackage` / `buildOpus55Package` / `buildFable51Package` via `pgStats()` → `__pgExport` | CONFIRM |
| Docs on disk | `integrations/claude/*.md`, root `CLAUDE.md` | CONFIRM |
| Composio meta includes claude lanes | `buildComposioBundle` + `integrations/composio/` | CONFIRM |

## Call flow

```
chip click → pgStats() → markdown brief → showExport + clipboard
```

## Side effects

- Clipboard write; no network publish from chip alone  
