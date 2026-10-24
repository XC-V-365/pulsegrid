# PulseGrid — v6 Architecture

**Full audio · FX Labs · Matrices · Binary · Universal I/O · AI/social connections**

## Deliverables

| Path | Role |
|------|------|
| `step-sequencer.html` | **v6** complete web app |
| `integrations/` | Suno · Udio · Shoom · Faves · Composio · Copilot · TikTok · FX |
| `native/cpp` · `native/rust` | Port scaffolds (+ cpal/midir/RtMidi hooks) |
| `PulseGrid-ARCHITECTURE.md` | This map |

## Full audio support

- Synth + sample kit (drop WAV/MP3/OGG)
- Master bus: compressor · filter · saturation · delay · reverb · limiter
- Offline **WAV bounce** (2 bars default)
- Live Web Audio analyser (waveform + spectrogram)
- Web MIDI notes + clock

## Matrices & binary

| Form | Description |
|------|-------------|
| Velocity matrix | 4×16 cells 0–3 |
| Probability matrix | 4×16 cells 0–100 |
| Binary masks | 16-bit per track (MSB = step 1) |
| `.pgbin` | Magic `PG06` + bpm/swing + masks + vel/prob bytes |
| CSV / ASCII grid | Spreadsheet / text interchange |
| SysEx-style hex | Educational dump (F0…F7) |

## Import / export matrix

| Format | Export | Import |
|--------|--------|--------|
| JSON v6 | ✅ | ✅ |
| MIDI SMF (.mid) | ✅ | light |
| WAV bounce | ✅ | as sample kit |
| .pgbin | ✅ | ✅ |
| CSV matrix | ✅ | ✅ |
| ASCII / TXT | ✅ | manual |
| Ableton note list | ✅ copy | — |
| SysEx hex | ✅ copy | — |
| Sample audio | kit | ✅ drop |

## Connections

Suno · **Udio** · Shoom · Faves · Composio · **Copilot** · **TikTok** · FX Labs · Web MIDI · Kit pack

## JSON v6 shape

```json
{
  "version": 6,
  "bpm": 120,
  "banks": { "A": {}, "B": {} },
  "matrices": { "velocity": [], "probability": [], "binaryMasks": {} },
  "fx": { "compressor": {}, "filter": {}, "saturation": {}, "delay": {}, "reverb": {}, "limiter": {} },
  "connections": ["suno","udio","copilot","tiktok","fxlabs", "..."]
}
```

## Native

Same `StepCell { vel, prob }` model. Rust: `--features full` for cpal+midir. C++: `rtmidi_out.hpp` skeleton.
