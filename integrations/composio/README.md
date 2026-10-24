# PulseGrid × Composio

Bridge the sequencer to **1000+ apps** (GitHub, Notion, Drive, Gmail, Slack, Buffer, BeatAPI, …) via [Composio](https://composio.dev).

## Files

| File | Purpose |
|------|---------|
| `pulsegrid_tools.json` | Custom tool slugs + delegate map for agents |
| `agent_session.example.ts` | OpenAI + Composio publish flow |
| `../exports/` | Runtime paste packages (Suno / Shoom / Faves) |

## Setup

1. Create API key at [platform.composio.dev](https://platform.composio.dev)
2. Connect **GitHub**, **Notion**, optional **Google Drive**, **BeatAPI**
3. `npm i @composio/core @composio/openai openai`
4. Run `agent_session.example.ts` with `COMPOSIO_API_KEY`

## Current Grok-connected services (this workspace)

Usable **now** via Grok connected tools (no Composio required for these):

- GitHub · Notion · Google Drive · Gmail · Outlook · Google Calendar  
- Vercel · Netlify · Buffer · Canva · Figma · Gamma · Automations  

Agent flow: **Export JSON from PulseGrid UI** → ask Grok to create a GitHub gist / Notion page / Drive file.

## Suno / Shoom / Faves

These products **do not expose a stable public generation API** for third-party sequencers:

| Service | Integration mode |
|---------|------------------|
| **Suno** | Paste Custom Mode package from UI → [suno.com](https://suno.com) |
| **Shoom** | Paste genre/mood/title package → mobile Shoom app |
| **Faves.fm** | Copy share card → post on [faves.fm](https://faves.fm) with friends |

Composio **BeatAPI** can cover other AI music/video pipelines when connected.
