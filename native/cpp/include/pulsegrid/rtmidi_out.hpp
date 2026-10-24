#pragma once
#include "midi_out.hpp"
// Optional: #include <RtMidi.h>
// Link: -lrtmidi
// apt: librtmidi-dev

namespace pulsegrid {

// Skeleton — fill when RtMidi is linked
class RtMidiOutAdapter : public MidiOut {
public:
  bool open(const std::string& portNameOrId) override {
    (void)portNameOrId;
    // midiOut_ = std::make_unique<RtMidiOut>();
    // midiOut_->openPort(index);
    return false; // not linked in scaffold
  }
  void close() override {}
  void noteOn(int channel, int note, int velocity, double) override {
    (void)channel; (void)note; (void)velocity;
    // std::vector<unsigned char> m = { (unsigned char)(0x90|(channel-1)&0x0f), note, velocity };
    // midiOut_->sendMessage(&m);
  }
  void noteOff(int channel, int note, double) override {
    (void)channel; (void)note;
  }
};

} // namespace pulsegrid
