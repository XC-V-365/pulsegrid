# PulseGrid — v7 Architecture

**QOL · Settings · History · Modules · Pipelines · Full audio · Universal I/O · Connections**

## Docs map

| Doc | Contents |
|-----|----------|
| **This file** | System overview & status |
| `docs/FUNCTION_REFERENCE.md` | In-depth function/functionality descriptions |
| `docs/MODULES_AND_PIPELINES.md` | Module graph, pipelines P1–P7, settings |
| `integrations/` | Per-service paste workflows |
| `native/` | C++ / Rust scaffolds |

## v7 QOL feature list

- Undo / redo (Ctrl+Z / Ctrl+Shift+Z) with depth setting  
- Autosave + restore (`pulsegrid_v7`)  
- Settings panel (transport, editing, display, audio/MIDI)  
- Help panel (shortcuts + module map)  
- Pipelines panel (8-step creative workflows)  
- Metronome (M)  
- Shift pattern « » (`[` `]`)  
- Thicken pattern  
- Confirm clear  
- Compact + high-contrast modes  
- Autosave indicator badge  

## Still included from v4–v6

Sample kit · Web MIDI + clock · FX Labs · Matrix/binary · WAV bounce · MIDI SMF ·  
JSON/CSV/.pgbin import-export · Suno · Udio · Shoom · Faves · Composio · Copilot · TikTok  

## App entry

Open **`step-sequencer.html`** (Chrome/Edge recommended for Web MIDI).

## Native

```bash
cd native/rust && cargo build --release --features full
cd native/cpp && cmake . && cmake --build .
```

Shared model: `StepCell { vel, prob }`, banks A/B, song chain, GM drum map.
