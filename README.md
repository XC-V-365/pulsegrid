# PulseGrid v5

**16-step drum sequencer** — velocity, probability, A/B banks, song chain, sample kit drop-in, Web MIDI (+ clock), premium navy / rose-gold UI.

## Connections

| Service | Integration |
|---------|-------------|
| [Suno](https://suno.com) | Paste Custom Mode package from the app |
| [Shoom AI](https://apps.apple.com/app/id6499126850) | Genre/mood/title prompt package |
| [Faves.fm](https://faves.fm) | Human share card for friends |
| [Composio](https://composio.dev) | Agent tools → GitHub, Notion, 1000+ apps |
| Web MIDI | Notes + optional MIDI clock |

## Quick start (web)

Open `step-sequencer.html` in Chrome/Edge/Firefox → **Play** → **Connect → Suno**.

## Native

```bash
# C++
cd native/cpp && g++ -std=c++17 -I include -O2 -o pulsegrid src/*.cpp -pthread

# Rust
cd native/rust && cargo build --release
# Optional: cargo build --features full   # cpal + midir
```

## Layout

- `step-sequencer.html` — full web app
- `integrations/` — Suno / Shoom / Faves / Composio
- `native/cpp` · `native/rust` — port scaffolds
- `PulseGrid-ARCHITECTURE.md` — data model & 1D→12D map

## Default pattern JSON

See `pulsegrid-default-pattern.json` (import via app **Import**).

## License

MIT — build-ready concept for C++ / Rust / any language.
