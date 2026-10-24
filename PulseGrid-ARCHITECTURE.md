# PulseGrid — v5 Architecture

Premium 16-step drum sequencer + **creative connections**.

## Deliverables

| Path | Role |
|------|------|
| `step-sequencer.html` | **v5** app: samples, MIDI, clock, song, **Suno / Shoom / Faves / Composio** |
| `integrations/` | Hub docs, export templates, Composio tools |
| `integrations/composio/` | Agent tool JSON + TypeScript example |
| `native/cpp/` | C++17 scaffold |
| `native/rust/` | Rust scaffold |
| `PulseGrid-ARCHITECTURE.md` | This file |

## Connections

| Service | How it works |
|---------|----------------|
| **Suno** | UI builds Custom Mode TITLE + STYLE + instrumental LYRICS → copy → [suno.com](https://suno.com) |
| **Shoom AI** | Genre / mood / description / title package for mobile AI song + video app |
| **Faves.fm** | Human share card for [faves.fm](https://faves.fm) friend recommendations |
| **Composio** | `pulsegrid_tools.json` + agent session → GitHub Gist, Notion, Drive, BeatAPI, 1000+ apps |
| **Grok connected** | GitHub, Notion, Drive, Gmail, Vercel, Buffer, Canva, Figma, … (paste export, ask Grok to publish) |
| **Web MIDI** | Note out + optional **MIDI clock** (0xF8 / start 0xFA / stop 0xFC) |
| **Kit pack** | JSON pack: pattern + sample filenames (buffers local) |

## 1D → 12D

| Dim | Feature | Status |
|-----|---------|--------|
| 1–10 | Grid → song chain | ✅ |
| 7 | Sample kit + kit pack export | ✅ |
| 9 | MIDI notes + clock | ✅ |
| 11 | Plugin / host | scaffold |
| 12 | Collab publish (Composio / Grok) | ✅ export paths |

## Composio tool slugs

`PULSEGRID_EXPORT_PATTERN` · `PULSEGRID_EXPORT_SUNO` · `PULSEGRID_EXPORT_SHOOM` · `PULSEGRID_EXPORT_FAVES` · `PULSEGRID_PUSH_GITHUB_GIST` · `PULSEGRID_PUSH_NOTION` · `PULSEGRID_MIDI_MAP`

See `integrations/composio/README.md`.

## API honesty

Suno, Shoom, and Faves.fm do **not** offer a documented public generation API for embedding. PulseGrid ships **paste-ready packages** and agent bundles. Live OAuth publish goes through **Composio** or **Grok connected tools**.

## Build native

```bash
cd native/cpp && g++ -std=c++17 -I include -O2 -o pulsegrid src/*.cpp -pthread
cd native/rust && cargo build --release
```
