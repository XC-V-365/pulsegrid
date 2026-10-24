# PulseGrid — C++ scaffold (v4)

Language-agnostic core port of the Web sequencer.

## Layout

```
include/pulsegrid/
  types.hpp      # StepCell, Pattern, Banks, Transport, GM notes
  pattern.hpp    # default/empty, JSON hooks
  clock.hpp      # look-ahead SequencerClock
  engine.hpp     # samples + synth trigger/process
  midi_out.hpp   # MidiOut abstract + NullMidiOut
src/
  main.cpp       # headless demo (~8s)
  *.cpp          # implementations
CMakeLists.txt
```

## Build

```bash
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build
./build/pulsegrid
```

## Next wiring

| Piece | Suggested lib |
|-------|----------------|
| Audio I/O | miniaudio, JUCE, PortAudio |
| Sample decode | dr_wav, libsndfile, JUCE AudioFormat |
| MIDI out | RtMidi, JUCE MidiOutput |
| JSON | nlohmann/json (v4 schema in repo root ARCHITECTURE) |
| UI | JUCE, Dear ImGui |

Probability: `if (rand01()*100 >= cell.prob) skip` on audio thread with seedable RNG.  
Song mode: already advanced in `SequencerClock::advanceSongIfNeeded`.
