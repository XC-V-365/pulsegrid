#include "pulsegrid/engine.hpp"
#include <algorithm>
namespace pulsegrid {
bool VoiceEngine::loadSample(TrackId track, const float* interleaved, int frames, int channels, int sampleRate) {
  const size_t ti = static_cast<size_t>(track);
  auto& s = kit_[ti];
  s.channels = std::max(1, channels);
  s.sampleRate = sampleRate;
  s.data.assign(interleaved, interleaved + frames * s.channels);
  hasSample_[ti] = true;
  return true;
}
void VoiceEngine::clearSample(TrackId track) {
  const size_t ti = static_cast<size_t>(track);
  kit_[ti] = {}; hasSample_[ti] = false;
}
void VoiceEngine::clearKit() {
  for (int i = 0; i < kTracks; ++i) clearSample(static_cast<TrackId>(i));
}
void VoiceEngine::trigger(TrackId, uint8_t, double) {}
void VoiceEngine::process(float* outInterleaved, int frames, int channels, double) {
  const int n = frames * channels;
  for (int i = 0; i < n; ++i) outInterleaved[i] = 0.f;
}
}
