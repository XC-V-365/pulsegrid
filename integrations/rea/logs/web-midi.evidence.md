# REAP evidence log — Web MIDI out + clock

- **Target:** PulseGrid first-party (`step-sequencer.html`)
- **Authorization:** Own software
- **Started:** 2026-10-24 · continued v14.1

## CONFIRM

| Claim | Evidence |
|-------|----------|
| Enable path | `navigator.requestMIDIAccess({ sysex: false })` near MIDI enable UI |
| Note send | `sendMidi(track, vel, time)` — GM-ish drum notes, velocity from step vel |
| Channel | UI `midiCh` / default drum channel 10 pattern |
| Clock toggle | `midiClockOn`, `midiClockTick`, `btnMidiClock`, `setInterval` while playing |
| MIDI-only mute | Connection/MIDI panel pattern (audio can mute while MIDI continues — verify in UI flag) |

## Flow

```
Enable MIDI → refresh ports → select output
Play → scheduleNote → sendMidi (if output)
Optional: MIDI Clock start/stop with transport
```

## HYPOTHESIS

- Safari support incomplete (Web MIDI) — need Chromium for reliable ports
- Clock resolution tied to `setInterval` not audio clock — may drift vs look-ahead scheduler

## Next experiment

- Enable MIDI → play techno seed → confirm note-on 36/38/42 on ch10  
- Toggle clock → count 24 ppqn-ish ticks vs BPM  

## Related

Export JSON evidence · Access gate evidence · REAP §17
