//! Optional `midir` output — enable with feature `midi`
//!
//! Add to Cargo.toml:
//!   midir = { version = "0.9", optional = true }
//!   [features]
//!   midi = ["midir"]

use crate::midi::MidiOut;
use crate::pattern::{midi_note, midi_velocity, TrackId};

#[cfg(feature = "midi")]
pub struct MidirOut {
    conn: Option<midir::MidiOutputConnection>,
}

#[cfg(feature = "midi")]
impl MidirOut {
    pub fn new() -> Self {
        Self { conn: None }
    }
}

#[cfg(feature = "midi")]
impl MidiOut for MidirOut {
    fn open(&mut self, port_name: &str) -> bool {
        let out = match midir::MidiOutput::new("PulseGrid") {
            Ok(o) => o,
            Err(_) => return false,
        };
        let ports = out.ports();
        let port = ports.iter().find(|p| {
            out.port_name(p)
                .map(|n| n.contains(port_name) || port_name.is_empty())
                .unwrap_or(false)
        });
        let port = match port.or_else(|| ports.first()) {
            Some(p) => p,
            None => return false,
        };
        match out.connect(port, "pulsegrid-out") {
            Ok(c) => {
                self.conn = Some(c);
                true
            }
            Err(_) => false,
        }
    }

    fn close(&mut self) {
        self.conn = None;
    }

    fn note_on(&mut self, channel: u8, note: u8, velocity: u8, _time_sec: f64) {
        if let Some(c) = self.conn.as_mut() {
            let status = 0x90 | (channel.saturating_sub(1) & 0x0f);
            let _ = c.send(&[status, note, velocity]);
        }
    }

    fn note_off(&mut self, channel: u8, note: u8, _time_sec: f64) {
        if let Some(c) = self.conn.as_mut() {
            let status = 0x80 | (channel.saturating_sub(1) & 0x0f);
            let _ = c.send(&[status, note, 0]);
        }
    }
}

/// List output port names (feature midi).
#[cfg(feature = "midi")]
pub fn list_ports() -> Vec<String> {
    let out = match midir::MidiOutput::new("PulseGrid-list") {
        Ok(o) => o,
        Err(_) => return vec![],
    };
    out.ports()
        .iter()
        .filter_map(|p| out.port_name(p).ok())
        .collect()
}

#[cfg(not(feature = "midi"))]
pub fn list_ports() -> Vec<String> {
    vec!["build with --features midi".into()]
}

#[allow(dead_code)]
pub fn drum_bytes(track: TrackId, vel: u8, channel: u8) -> [u8; 3] {
    let ch = channel.saturating_sub(1) & 0x0f;
    [0x90 | ch, midi_note(track, vel), midi_velocity(vel)]
}
