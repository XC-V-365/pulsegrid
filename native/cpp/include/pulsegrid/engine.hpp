#pragma once
#include "types.hpp"
#include <vector>
#include <array>

namespace pulsegrid {
class VoiceEngine {
public:
  bool loadSample(TrackId track, const float* interleaved, int frames, int channels, int sampleRate);
  void clearSample(TrackId track);
  void clearKit();
  void trigger(TrackId track, uint8_t vel, double timeSec);
  void setMasterGain(float g) { masterGain_ = g; }
  void process(float* outInterleaved, int frames, int channels, double nowSec);
private:
  struct Sample {
    std::vector<float> data;
    int channels = 1;
    int sampleRate = 44100;
  };
  std::array<Sample, kTracks> kit_{};
  std::array<bool, kTracks> hasSample_{};
  float masterGain_ = 0.7f;
};
}
