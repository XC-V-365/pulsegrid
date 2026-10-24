cmake_minimum_required(VERSION 3.16)
project(PulseGrid VERSION 4.0 LANGUAGES CXX)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(pulsegrid
  src/main.cpp
  src/pattern.cpp
  src/clock.cpp
  src/engine.cpp
  src/midi_out.cpp
)
target_include_directories(pulsegrid PRIVATE include)

# Optional: link miniaudio / RtMidi when available
# find_package(RtMidi) ...
# target_link_libraries(pulsegrid PRIVATE RtMidi::rtmidi)

install(TARGETS pulsegrid RUNTIME DESTINATION bin)
