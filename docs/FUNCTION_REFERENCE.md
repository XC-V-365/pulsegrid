# PulseGrid v7 — Function & functionality reference

In-depth descriptions of runtime functions (web app). Names match `step-sequencer.html` / `window.PulseGrid`.

## Core data

### StepCell `{ v, p }`
- **`v` (velocity)** — `0` = off; `1–3` soft → loud. Drives synth gain, sample amplitude, and MIDI velocity (`v * 42`, clamped 1–127).
- **`p` (probability)** — `0–100`. On schedule, if `random()*100 >= p` the hit is skipped (humanize / ghost notes).

### Pattern
Four tracks (`kick`, `snare`, `hat`, `perc`), each **16** `StepCell`s.

### banks `{ A, B }`
Two independent patterns. **Song chain** selects bank per 16-step loop.

---

## Transport & clock

| Function | Functionality |
|----------|----------------|
| **ensureAudio()** | Creates AudioContext, master gain, compressor, analyser; resumes on user gesture. Idempotent. |
| **start()** | Arms transport; resets step; optional song slot 0; starts look-ahead scheduler. |
| **stop()** | Clears timer & playhead; MIDI all-notes-off on active channel. |
| **secondsPerStep()** | `60 / BPM / 4` — duration of one 16th note. |
| **swingOffset(step)** | Delays odd 16ths by `swing% × 0.75 × stepDur` for groove. |
| **scheduler()** | While `nextNoteTime < now + scheduleAhead`, advances via `nextStep()`. |
| **nextStep()** | Song advance · schedule audio+MIDI · UI playhead. |
| **scheduleNote(step, time)** | Mute → probability → sample or synth → MIDI. |
| **Metronome** | Click on master; accent every 4 steps. Toggle **Metro** or key `M`. |

---

## Pattern editor

| Function | Functionality |
|----------|----------------|
| **setStep(track, step, cell)** | Writes model, syncs CSS (`on`, `vel-1..3`, prob), records undo. |
| **syncGrid / syncCell** | DOM reflects pattern state. |
| **Gate / Vel / Prob modes** | Toggle · cycle velocity · cycle probability. Keys `G` `V` `P`. |
| **Paint drag** | Pointer paint across cells with same payload. |
| **selectBank(A\|B)** | Switch active bank. Keys `A` `B`. |
| **shiftPattern(dir)** | Rotate rows left/right. Keys `[` `]`. |
| **Thicken** | Probabilistically fill off-beats after on-beats. |
| **Random / Clear / Copy** | Density random; wipe bank (confirm optional); A↔B copy. |

---

## Sample kit

| Function | Functionality |
|----------|----------------|
| **loadSampleForTrack(id, file)** | decodeAudioData → `{ buffer, name, duration }`. |
| **assignFilesToTracks(files)** | Name heuristics then sequential empty-slot fill. |
| **playSample(id, time, vel)** | BufferSource + envelope into master. |
| **Synth voices** | Procedural kick/snare/hat/perc when no sample. |

---

## MIDI

| Function | Functionality |
|----------|----------------|
| **initMidi()** | requestMIDIAccess; list outputs; statechange. |
| **sendMidiNote(...)** | Timestamped note-on/off. |
| **GM map** | 36 kick · 38 snare · 42/46 hat · 39 perc. |
| **MIDI clock** | 0xF8 pulses; start 0xFA; stop 0xFC. |

---

## FX Labs

**buildFxChain()** once:  
`master → filter → waveshaper → dry/delay/reverb mix → compressor → limiter → analyser → out`

| Module | Functionality |
|--------|----------------|
| Compressor | Threshold / ratio bus glue |
| Filter | Low-pass freq + Q |
| Saturation | Waveshaper drive |
| Delay | Time, feedback, wet |
| Reverb | Noise IR, wet/dry |
| Limiter | Soft ceiling |

**applyFxFromUi()** maps panel → AudioParams. Serialized under JSON `fx`.

---

## Matrix · binary · I/O

| Function | Functionality |
|----------|----------------|
| **trackMask(id)** | 16-bit mask (MSB = step 1) |
| **velMatrix / probMatrix** | 4×16 numeric views |
| **encodePgbin / decodePgbin** | Magic PG06 binary (144 bytes) |
| **encodeMidiSmf** | SMF drum track, 480 PPQ |
| **bounceWav(bars)** | Offline render → WAV download |
| **audioBufferToWav** | 16-bit stereo RIFF encoder |
| **Import any** | JSON · pgbin · CSV · audio · MIDI light |

---

## History · settings

| Function | Functionality |
|----------|----------------|
| **pushHistory(label)** | Snapshot banks+BPM+swing; cap depth; drop redo tail |
| **undo / redo** | Walk stack; re-normalize patterns |
| **saveLocal / loadLocal** | `localStorage.pulsegrid_v7` |
| **Settings** | Autosave, restore, undo depth, metro, timing, confirm clear, paint, spark, default mode, compact, contrast, step nums, viz idle, prefer samples, MIDI ch, volume recall |

---

## Connections

Paste-ready packages (no fake APIs): **Suno, Udio, Shoom, Faves, Composio, Copilot, TikTok**.

---

## window.PulseGrid API

```js
play / stop / isPlaying / getPattern / setPattern
exportAll / undo / redo / saveLocal / loadLocal
shiftPattern / bounceWav / downloadMidi / encodePgbin / buildFxChain
settings
```
