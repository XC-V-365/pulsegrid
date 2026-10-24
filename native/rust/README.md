# PulseGrid Rust (cpal + midir)

```bash
# default (no system audio/MIDI deps)
cargo build --release
cargo run --release

# Linux system packages for full features
#   sudo apt install pkg-config libasound2-dev
cargo build --release --features audio
cargo build --release --features midi
cargo build --release --features full

cargo run --release --features audio -- --list-audio
cargo run --release --features audio -- --beep
cargo run --release --features midi -- --list-midi
cargo run --release --features full -- --play --bpm 128 --bars 4
cargo run --release --features full -- --midi --midi-port "IAC" --play
```

## Modules

| Module | Role |
|--------|------|
| `pattern` | StepCell, Banks, Transport, GM notes |
| `clock` | SequencerClock (look-ahead + swing) |
| `engine` | Soft-synth VoiceEngine for cpal |
| `audio_cpal` | cpal output stream + device list (`feature = audio`) |
| `midi` | MidiOut trait + NullMidiOut |
| `midi_midir` | midir ports, note on/off, clock/start/stop, all-notes-off (`feature = midi`) |

## Features

| Feature | Crate | Needs |
|---------|-------|-------|
| `audio` | cpal 0.15 | ALSA (Linux): pkg-config, libasound2-dev |
| `midi` | midir 0.9 | ALSA on Linux |
| `full` | both | both |
