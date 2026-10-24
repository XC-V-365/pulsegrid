#pragma once
#include "types.hpp"
#include <functional>

namespace pulsegrid {
class SequencerClock {
public:
  using StepCallback = std::function<void(int step, double timeSec, const Pattern& pat)>;
  void setTransport(Transport* tr) { transport_ = tr; }
  void setBanks(Banks* banks) { banks_ = banks; }
  void setCallback(StepCallback cb) { onStep_ = std::move(cb); }
  void start(double nowSec);
  void stop();
  void tick(double nowSec);
private:
  Transport* transport_ = nullptr;
  Banks* banks_ = nullptr;
  StepCallback onStep_;
  double nextNoteTime_ = 0;
  int loopsInSlot_ = 0;
  void advanceSongIfNeeded();
};
}
