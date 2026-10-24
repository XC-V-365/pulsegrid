#include "pulsegrid/pattern.hpp"
namespace pulsegrid {
Pattern emptyPattern() { return {}; }
Pattern defaultPattern() {
  Pattern p{};
  auto on = [](TrackPattern& tr, int i, uint8_t v, uint8_t pr = 100) {
    tr[static_cast<size_t>(i)] = {v, pr};
  };
  for (int i : {0, 4, 8, 12}) on(p[0], i, 3);
  for (int i : {4, 12}) on(p[1], i, 3);
  for (int i = 0; i < kSteps; i += 2) on(p[2], i, (i % 4 == 0) ? 2 : 1);
  on(p[3], 6, 2, 85); on(p[3], 14, 2, 85);
  return p;
}
Pattern& activePattern(Banks& banks, char bank) { return bank == 'B' ? banks.B : banks.A; }
const Pattern& activePattern(const Banks& banks, char bank) { return bank == 'B' ? banks.B : banks.A; }
bool loadBanksFromJson(const std::string&, Banks&, Transport&) { return false; }
std::string saveBanksToJson(const Banks&, const Transport& tr) {
  return std::string("{\"version\":4,\"app\":\"PulseGrid\",\"bpm\":") + std::to_string(tr.bpm) + "}";
}
}
