# PulseGrid — Rust scaffold (v4)

## Layout

```
src/
  lib.rs       # re-exports
  pattern.rs   # StepCell, Banks, Transport, GM helpers
  clock.rs     # look-ahead SequencerClock + song advance
  engine.rs    # VoiceEngine sample/synth stub
  midi.rs      # MidiOut trait + NullMidiOut
  main.rs      # headless demo
Cargo.toml
```

## Run

```bash
cargo run --release
```

## Next crates

| Need | Crate |
|------|--------|
| Audio out | `cpal` |
| DSP / samples | `dasp`, `symphonia` (decode) |
| MIDI | `midir` |
| JSON v4 | `serde` + `serde_json` |
| UI | `egui` / `eframe` |
| RT queue | `rtrb` |

Same data model and look-ahead rules as Web + C++ (`PulseGrid-ARCHITECTURE.md`).
