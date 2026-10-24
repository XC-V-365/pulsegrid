//! PulseGrid core — pattern, clock, engine, midi (v5)
//! Optional: `audio` (cpal), `midi` (midir)

pub mod pattern;
pub mod clock;
pub mod engine;
pub mod midi;
pub mod audio_cpal;
pub mod midi_midir;

pub use pattern::{
    active_pattern, active_pattern_mut, Banks, Pattern, StepCell, TrackId, Transport, STEPS,
    TRACKS,
};
pub use clock::SequencerClock;
pub use engine::VoiceEngine;
pub use midi::{MidiOut, NullMidiOut};
