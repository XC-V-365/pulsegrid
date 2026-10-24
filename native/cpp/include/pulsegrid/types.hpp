#pragma once
#include <array>
#include <cstdint>
#include <string>
#include <algorithm>

namespace pulsegrid {

constexpr int kSteps = 16;
constexpr int kTracks = 4;
constexpr int kSongSlots = 8;

enum class TrackId : uint8_t { Kick = 0, Snare, Hat, Perc };

struct StepCell {
  uint8_t vel = 0;
  uint8_t prob = 100;
};

using TrackPattern = std::array<StepCell, kSteps>;
using Pattern = std::array<TrackPattern, kTracks>;

struct Banks {
  Pattern A{};
  Pattern B{};
};

struct Transport {
  float bpm = 120.f;
  float swing = 0.f;
  float volume = 0.7f;
  bool playing = false;
  int step = 0;
  char activeBank = 'A';
  bool songMode = false;
  int songIndex = 0;
  std::array<char, kSongSlots> songChain{{'A','A','B','A','A','A','B','B'}};
};

inline int midiNote(TrackId t, uint8_t vel) {
  switch (t) {
    case TrackId::Kick:  return 36;
    case TrackId::Snare: return 38;
    case TrackId::Hat:   return vel >= 3 ? 46 : 42;
    case TrackId::Perc:  return 39;
  }
  return 36;
}

inline int midiVelocity(uint8_t vel) {
  return std::min(127, 40 + static_cast<int>(vel) * 28);
}

inline double secondsPerStep(float bpm) {
  return 60.0 / static_cast<double>(bpm) / 4.0;
}

} // namespace pulsegrid
