#pragma once
#include "types.hpp"
#include <string>

namespace pulsegrid {
Pattern defaultPattern();
Pattern emptyPattern();
Pattern& activePattern(Banks& banks, char bank);
const Pattern& activePattern(const Banks& banks, char bank);
bool loadBanksFromJson(const std::string& json, Banks& out, Transport& tr);
std::string saveBanksToJson(const Banks& banks, const Transport& tr);
}
