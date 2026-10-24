# PulseGrid v7

Premium **16-step drum sequencer** with full audio FX, universal I/O, AI/social connections, and deep QOL.

## Open the app

```bash
# static server recommended (Web MIDI)
python3 -m http.server 8765
# → http://localhost:8765/step-sequencer.html
```

## Highlights

- **Transport** — BPM, swing, A/B banks, song chain, metronome  
- **Editor** — Gate / Vel / Prob, paint, mute, shift, thicken, undo/redo  
- **Audio** — Synth + sample kit, **FX Labs** bus, WAV bounce  
- **MIDI** — Web MIDI out, clock, SMF export  
- **Matrix / binary** — masks, CSV, `.pgbin`  
- **I/O Hub** — JSON · MIDI · WAV · binary · CSV · TXT · Ableton notes  
- **Connections** — Suno · Udio · Shoom · Faves · Composio · Copilot · TikTok  
- **QOL** — Settings, autosave, shortcuts, pipelines panel  

## Docs

| File | Description |
|------|-------------|
| [docs/FUNCTION_REFERENCE.md](docs/FUNCTION_REFERENCE.md) | In-depth function & functionality reference |
| [docs/MODULES_AND_PIPELINES.md](docs/MODULES_AND_PIPELINES.md) | Module graph + pipelines P1–P7 |
| [PulseGrid-ARCHITECTURE.md](PulseGrid-ARCHITECTURE.md) | System overview |
| [integrations/](integrations/) | Per-service workflows |

## Native

```bash
cd native/rust && cargo build --release
cd native/cpp && make   # or cmake
```

## License

MIT — build-ready concept for web / C++ / Rust.
