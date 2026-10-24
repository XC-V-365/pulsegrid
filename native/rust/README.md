# PulseGrid Rust

```bash
cargo build --release
cargo run --release

# optional (needs system ALSA on Linux: pkg-config libasound2-dev)
cargo build --release --features audio
cargo build --release --features midi
cargo build --release --features full
cargo run --release --features audio -- --beep
cargo run --release --features midi -- --list-midi
cargo run --release --features midi -- --midi
```

## Modules

| Module | Role |
|--------|------|
| `pattern` | StepCell, Banks, Transport |
| `clock` | SequencerClock |
| `engine` | VoiceEngine synth for cpal |
| `audio_cpal` | cpal output stream (`feature = audio`) |
| `midi` / `midi_midir` | MidiOut trait + midir (`feature = midi`) |
