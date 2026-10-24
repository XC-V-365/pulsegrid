# Composio for Claude Code / Opus 5.5 / Fable 5.1

## Operator system blurb

```text
You may call Composio-connected tools. Never invent OAuth tokens.
Prefer idempotent actions. After publish, return URLs only.
PulseGrid bundle fields: bpm, swing, seedId, banks, matrices, packages, tool_slugs.
```

## Suggested tool mapping

| Goal | Typical Composio / connected action |
|------|-------------------------------------|
| Backup pattern | GitHub create gist / commit file |
| Share writeup | Notion page create |
| Email note | Gmail send (user-approved) |
| Schedule reminder | Google Calendar event |
| Social | Buffer (human approve copy from Fable first) |

## Multi-model pipeline

1. **Fable 5.1** — anti-slop description + title  
2. **Opus 5.5** — validate JSON + choose tools  
3. **Claude Code** — run Composio calls / fix failures  
4. Log URL into `integrations/rea/logs/` or session vault note  

## Bundle minimum

```json
{
  "app": "PulseGrid",
  "version": 13,
  "bpm": 120,
  "seedId": "phonk",
  "banks": {},
  "packages": { "suno": "...", "fable": "..." },
  "tool_slugs": ["PULSEGRID_EXPORT_GIST", "PULSEGRID_EXPORT_NOTION"]
}
```
