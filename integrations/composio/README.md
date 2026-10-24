# PulseGrid × Composio

**Composio** routes agent tools to 1000+ apps (GitHub, Notion, Gmail, Slack, …).  
PulseGrid emits a **bundle JSON** the agent can execute after accounts are connected in the Composio dashboard.

## Honest scope

- PulseGrid does **not** embed your Composio API key in the static web app.  
- Flow: **Export Composio bundle** → paste into Claude Code / Opus / Grok with Composio tools enabled → publish.

## Files

| File | Role |
|------|------|
| `pulsegrid_tools.json` | Tool slug catalog |
| `agent_session.example.ts` | Example OpenAI + Composio session |
| `CLAUDE_COMPOSIO.md` | Claude-oriented operator guide |
| `bundle.schema.json` | Shape of sequencer export bundle |

## Claude lanes

| Lane | Composio use |
|------|----------------|
| **Claude Code** | Implement tool wrappers, fix schemas, CI publish scripts |
| **Opus 5.5** | Design multi-step agent graphs, idempotent publish |
| **Fable 5.1** | Write Notion/social copy; Code/Opus executes tools |

## Quick start

1. Connect GitHub (and optional Notion) in [composio.dev](https://composio.dev)  
2. PulseGrid → **Composio** chip → copy bundle  
3. In Claude Code:

```text
You have Composio tools. Here is a PulseGrid bundle:
<paste>
Create a private gist with the pattern JSON and a short README (Fable tone, no slop).
```
