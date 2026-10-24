# REAP evidence log — Sample kit drop-in

- **Target:** `step-sequencer.html` first-party
- **Authorization:** Own software

## CONFIRM

| Claim | Evidence |
|-------|----------|
| Load per track | kit slots + file picker / drag-drop |
| Decode | Web Audio `decodeAudioData` via `loadSampleFile` |
| Name guess | `guessTrackFromName` — kick/bd, snare/sd, hat/hh, perc/tom/clap… |
| Fallback | Empty buffer → synth voice (`playKick` etc.) |
| Export | `sampleNames` in full v13 export — buffers not embedded |

## Flow

```
Drop files / Load → guess track → AudioBuffer map → playSample on step
Clear kit → synth fallback · header SYNTH ↔ SAMPLES
```

## Next

- Kit ZIP pack path under Connections  
- Hash samples for cache keys (not implemented)
