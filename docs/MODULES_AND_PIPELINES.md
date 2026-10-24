# PulseGrid v7 — Modules & pipelines

## Module graph

```
Editor ──▶ PatternStore ──▶ History
                │
     SongDirector · SequencerClock · Settings
                │
     SampleKit · VoiceEngine · MidiOut
                │
            MasterFX + Analyser
                │
     Matrix/Binary · I/O Hub · Connections
```

## Module responsibilities

| Module | Responsibility | QOL |
|--------|----------------|-----|
| PatternStore | A/B grids, vel/prob | Shift, thicken, random, copy |
| Editor | Paint, modes, mute | G/V/P, paint-drag setting |
| History | Undo/redo snapshots | Depth, Ctrl+Z |
| SequencerClock | Look-ahead, swing | Metro, timing settings |
| SongDirector | Bank sequence | 8-slot chain |
| SampleKit | Decode + map files | Drag-drop heuristics |
| VoiceEngine | Synth + buffers | Prefer-samples |
| MidiOut | Port/channel/clock | Default channel |
| MasterFX | Bus chain | FX Labs panel |
| Visualizers | Wave + spectrogram | Viz-idle setting |
| Matrix/Binary | Masks, CSV, pgbin | Copy/export |
| I/O Hub | All formats | Ctrl+S |
| Connections | AI/social paste packs | Clipboard |
| Settings | Prefs + persistence | Autosave badge |

## Pipelines

| ID | Name | Steps |
|----|------|-------|
| P1 | Sketch → bounce | Gate→Vel→Prob → kit → FX → WAV |
| P2 | MIDI to DAW | Grid → .mid → ch10 drums |
| P3 | AI song bed | BPM pattern → Suno/Udio paste |
| P4 | Social clip | Record/bounce → TikTok pack |
| P5 | Agent collab | Copilot/Composio → GitHub/Notion |
| P6 | Native parity | JSON/pgbin → C++/Rust |
| P7 | Live MIDI kit | MIDI out + clock → hardware |

## Storage

Key: **`localStorage.pulsegrid_v7`** — `{ settings, project, savedAt }`.
