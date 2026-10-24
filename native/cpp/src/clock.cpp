#include "pulsegrid/clock.hpp"
#include "pulsegrid/pattern.hpp"
namespace pulsegrid {
void SequencerClock::start(double nowSec) {
  if (!transport_) return;
  transport_->playing = true;
  transport_->step = 0;
  loopsInSlot_ = 0;
  nextNoteTime_ = nowSec + 0.05;
  if (transport_->songMode) {
    transport_->songIndex = 0;
    transport_->activeBank = transport_->songChain[0];
  }
}
void SequencerClock::stop() { if (transport_) transport_->playing = false; }
void SequencerClock::advanceSongIfNeeded() {
  if (!transport_ || !transport_->songMode) return;
  if (transport_->step == 0) {
    if (loopsInSlot_ > 0) {
      transport_->songIndex = (transport_->songIndex + 1) % kSongSlots;
      transport_->activeBank = transport_->songChain[static_cast<size_t>(transport_->songIndex)];
    }
    ++loopsInSlot_;
  }
}
void SequencerClock::tick(double nowSec) {
  if (!transport_ || !banks_ || !transport_->playing) return;
  while (nextNoteTime_ < nowSec + 0.1) {
    advanceSongIfNeeded();
    const int step = transport_->step;
    double t = nextNoteTime_;
    if (step % 2 == 1) t += transport_->swing * 0.75 * secondsPerStep(transport_->bpm);
    const Pattern& pat = activePattern(*banks_, transport_->activeBank);
    if (onStep_) onStep_(step, t, pat);
    transport_->step = (step + 1) % kSteps;
    nextNoteTime_ += secondsPerStep(transport_->bpm);
  }
}
}
