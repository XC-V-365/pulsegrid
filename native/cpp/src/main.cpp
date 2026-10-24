#include "pulsegrid/types.hpp"
#include "pulsegrid/pattern.hpp"
#include "pulsegrid/clock.hpp"
#include "pulsegrid/engine.hpp"
#include "pulsegrid/midi_out.hpp"
#include <atomic>
#include <chrono>
#include <cstdio>
#include <thread>
using namespace pulsegrid;
int main() {
  Banks banks; banks.A = defaultPattern(); banks.B = emptyPattern();
  Transport tr; VoiceEngine engine; NullMidiOut midi; SequencerClock clock;
  clock.setTransport(&tr); clock.setBanks(&banks);
  clock.setCallback([&](int step, double timeSec, const Pattern& pat) {
    for (int ti = 0; ti < kTracks; ++ti) {
      const auto& cell = pat[static_cast<size_t>(ti)][static_cast<size_t>(step)];
      if (cell.vel == 0) continue;
      TrackId id = static_cast<TrackId>(ti);
      engine.trigger(id, cell.vel, timeSec);
      midi.sendDrum(id, cell.vel, 10, timeSec);
    }
    std::printf("step %2d bank %c\n", step + 1, tr.activeBank);
  });
  std::printf("PulseGrid C++ scaffold — look-ahead clock demo (~8s)\n");
  clock.start(0.0);
  auto t0 = std::chrono::steady_clock::now();
  for (;;) {
    double now = std::chrono::duration<double>(std::chrono::steady_clock::now() - t0).count();
    if (now > 8.0) break;
    clock.tick(now);
    std::this_thread::sleep_for(std::chrono::milliseconds(5));
  }
  clock.stop();
  std::printf("done.\n");
  return 0;
}
