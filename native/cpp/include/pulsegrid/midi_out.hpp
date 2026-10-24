#pragma once
#include "types.hpp"
#include <string>

namespace pulsegrid {
class MidiOut {
public:
  virtual ~MidiOut() = default;
  virtual bool open(const std::string& portNameOrId) = 0;
  virtual void close() = 0;
  virtual void noteOn(int channel, int note, int velocity, double timeSec) = 0;
  virtual void noteOff(int channel, int note, double timeSec) = 0;
  void sendDrum(TrackId track, uint8_t vel, int channel, double timeSec) {
    noteOn(channel, midiNote(track, vel), midiVelocity(vel), timeSec);
    noteOff(channel, midiNote(track, vel), timeSec + 0.08);
  }
};
class NullMidiOut : public MidiOut {
public:
  bool open(const std::string&) override { return true; }
  void close() override {}
  void noteOn(int, int, int, double) override {}
  void noteOff(int, int, double) override {}
};
}
