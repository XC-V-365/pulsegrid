use crate::pattern::{midi_note, midi_velocity, TrackId};

pub trait MidiOut: Send {
    fn open(&mut self, port: &str) -> bool;
    fn close(&mut self);
    fn note_on(&mut self, channel: u8, note: u8, velocity: u8, time_sec: f64);
    fn note_off(&mut self, channel: u8, note: u8, time_sec: f64);

    fn send_drum(&mut self, track: TrackId, vel: u8, channel: u8, time_sec: f64) {
        let n = midi_note(track, vel);
        let v = midi_velocity(vel);
        self.note_on(channel, n, v, time_sec);
        self.note_off(channel, n, time_sec + 0.08);
    }
}

pub struct NullMidiOut;

impl MidiOut for NullMidiOut {
    fn open(&mut self, _: &str) -> bool {
        true
    }
    fn close(&mut self) {}
    fn note_on(&mut self, _: u8, _: u8, _: u8, _: f64) {}
    fn note_off(&mut self, _: u8, _: u8, _: f64) {}
}

// Production: impl MidiOut for midir::MidiOutputConnection wrapper
