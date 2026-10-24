//! midir MIDI out — enable: cargo run --features midi

use crate::midi::MidiOut;

pub struct MidirOut {
    #[cfg(feature = "midi")]
    conn: Option<midir::MidiOutputConnection>,
}

impl Default for MidirOut {
    fn default() -> Self {
        Self::new()
    }
}

impl MidirOut {
    pub fn new() -> Self {
        Self {
            #[cfg(feature = "midi")]
            conn: None,
        }
    }
    pub fn is_open(&self) -> bool {
        #[cfg(feature = "midi")]
        {
            self.conn.is_some()
        }
        #[cfg(not(feature = "midi"))]
        {
            false
        }
    }
}

impl MidiOut for MidirOut {
    fn open(&mut self, port_name: &str) -> bool {
        #[cfg(feature = "midi")]
        {
            let out = match midir::MidiOutput::new("PulseGrid") {
                Ok(o) => o,
                Err(e) => {
                    eprintln!("midir: {e}");
                    return false;
                }
            };
            let ports = out.ports();
            if ports.is_empty() {
                return false;
            }
            let port = ports
                .iter()
                .find(|p| {
                    out.port_name(p)
                        .map(|n| {
                            port_name.is_empty()
                                || n.to_lowercase().contains(&port_name.to_lowercase())
                        })
                        .unwrap_or(false)
                })
                .or_else(|| ports.first());
            let Some(port) = port else {
                return false;
            };
            match out.connect(port, "pulsegrid-out") {
                Ok(c) => {
                    self.conn = Some(c);
                    true
                }
                Err(e) => {
                    eprintln!("midir connect: {e}");
                    false
                }
            }
        }
        #[cfg(not(feature = "midi"))]
        {
            let _ = port_name;
            false
        }
    }

    fn close(&mut self) {
        #[cfg(feature = "midi")]
        {
            self.conn = None;
        }
    }

    fn note_on(&mut self, channel: u8, note: u8, velocity: u8, _time_sec: f64) {
        #[cfg(feature = "midi")]
        if let Some(c) = self.conn.as_mut() {
            let ch = channel.saturating_sub(1) & 0x0f;
            let _ = c.send(&[0x90 | ch, note.min(127), velocity.min(127)]);
        }
        #[cfg(not(feature = "midi"))]
        {
            let _ = (channel, note, velocity);
        }
    }

    fn note_off(&mut self, channel: u8, note: u8, _time_sec: f64) {
        #[cfg(feature = "midi")]
        if let Some(c) = self.conn.as_mut() {
            let ch = channel.saturating_sub(1) & 0x0f;
            let _ = c.send(&[0x80 | ch, note.min(127), 0]);
        }
        #[cfg(not(feature = "midi"))]
        {
            let _ = (channel, note);
        }
    }
}

pub fn list_ports() -> Vec<String> {
    #[cfg(feature = "midi")]
    {
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
    {
        vec!["(enable --features midi)".into()]
    }
}
